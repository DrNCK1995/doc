import type { GrowthIndicator, ReferenceSource, Sex } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  severityFromStatus,
  severityFromZ,
  toTrafficLight,
} from "@/lib/growth/severity-colors";
import { selectReference } from "@/lib/growth/reference-selector";
import type {
  ChartPayload,
  ChartPoint,
  ChartSeries,
  PercentileCurve,
  PercentileKey,
} from "@/types/charts";

export type {
  ChartPayload,
  ChartPoint,
  ChartSeries,
  PercentileCurve,
  PercentileKey,
} from "@/types/charts";

const INDICATOR_MAP: Record<
  string,
  { indicator: GrowthIndicator; unit: string; yLabel: string; xLabel: string }
> = {
  WFA: {
    indicator: "WEIGHT_FOR_AGE",
    unit: "kg",
    yLabel: "Weight (kg)",
    xLabel: "Age (months)",
  },
  HFA: {
    indicator: "HEIGHT_FOR_AGE",
    unit: "cm",
    yLabel: "Height (cm)",
    xLabel: "Age (months)",
  },
  BMI: {
    indicator: "BMI_FOR_AGE",
    unit: "kg/m²",
    yLabel: "BMI",
    xLabel: "Age (months)",
  },
  WFH: {
    indicator: "WEIGHT_FOR_HEIGHT",
    unit: "kg",
    yLabel: "Weight (kg)",
    xLabel: "Height (cm)",
  },
  HC: {
    indicator: "HEAD_CIRCUMFERENCE_FOR_AGE",
    unit: "cm",
    yLabel: "Head circumference (cm)",
    xLabel: "Age (months)",
  },
};

async function loadPercentileCurves(
  source: ReferenceSource,
  version: string,
  indicator: GrowthIndicator,
  sex: Sex,
): Promise<{ curves: PercentileCurve[]; versionLabel: string }> {
  const ref = await prisma.growthReferenceVersion.findUnique({
    where: { source_version: { source, version } },
  });

  if (!ref) {
    // Fallback: any active version for source
    const fallback = await prisma.growthReferenceVersion.findFirst({
      where: { source, isActive: true },
      orderBy: { importedAt: "desc" },
    });
    if (!fallback) {
      return { curves: emptyCurves(), versionLabel: version };
    }
    return loadPercentileCurves(source, fallback.version, indicator, sex);
  }

  const points = await prisma.lmsDataPoint.findMany({
    where: {
      versionId: ref.id,
      indicator,
      sex,
    },
    orderBy: { xValue: "asc" },
  });

  const keys: PercentileKey[] = ["p3", "p15", "p50", "p85", "p97"];
  const curves: PercentileCurve[] = keys.map((key) => ({
    percentile: key,
    points: points
      .filter((p) => p[key] != null)
      .map((p) => ({ x: p.xValue, y: p[key] as number })),
  }));

  return { curves, versionLabel: ref.version };
}

function emptyCurves(): PercentileCurve[] {
  return (["p3", "p15", "p50", "p85", "p97"] as PercentileKey[]).map((p) => ({
    percentile: p,
    points: [],
  }));
}

function resolveReference(ageMonths: number): {
  source: ReferenceSource;
  version: string;
} {
  const selected = selectReference(ageMonths);
  return { source: selected.source, version: selected.version };
}

export async function buildChartPayload(
  humanPatientId: string,
): Promise<ChartPayload> {
  const patient = await prisma.patient.findUnique({
    where: { patientId: humanPatientId },
    include: {
      visits: {
        orderBy: [{ visitDate: "asc" }, { createdAt: "asc" }],
        include: { measurements: true },
      },
    },
  });

  if (!patient) {
    throw Object.assign(new Error("Patient not found"), { status: 404 });
  }

  const record = patient;
  const sex = record.sex;
  const latestAge =
    record.visits[record.visits.length - 1]?.ageTotalMonths ?? 0;
  const { source, version } = resolveReference(latestAge);

  async function seriesFor(
    key: keyof typeof INDICATOR_MAP,
    patientPoints: ChartPoint[],
  ): Promise<ChartSeries> {
    const meta = INDICATOR_MAP[key]!;
    const { curves, versionLabel } = await loadPercentileCurves(
      source,
      version,
      meta.indicator,
      sex,
    );
    return {
      indicator: key,
      unit: meta.unit,
      xLabel: meta.xLabel,
      yLabel: meta.yLabel,
      patientPoints,
      curves,
      referenceSource: source,
      referenceVersion: versionLabel,
    };
  }

  type VisitRow = (typeof record.visits)[number];

  function pointWithZ(
    x: number,
    y: number | null,
    visit: VisitRow,
    z: number | null | undefined,
  ): ChartPoint {
    const m = visit.measurements[0];
    const fromZ = z != null ? toTrafficLight(severityFromZ(z)) : null;
    const fromStatus = severityFromStatus(
      m?.nutritionalStatus,
      m?.clinicalFlags,
    );
    return {
      x,
      y,
      visitId: visit.id,
      visitDate: visit.visitDate.toISOString().slice(0, 10),
      zScore: z ?? null,
      severityColor: fromZ ?? fromStatus,
    };
  }

  const wfaPoints: ChartPoint[] = record.visits.map((v) =>
    pointWithZ(v.ageTotalMonths, v.weightKg, v, v.measurements[0]?.weightForAgeZ),
  );

  const hfaPoints: ChartPoint[] = record.visits.map((v) =>
    pointWithZ(v.ageTotalMonths, v.heightCm, v, v.measurements[0]?.heightForAgeZ),
  );

  const bmiPoints: ChartPoint[] = record.visits.map((v) =>
    pointWithZ(v.ageTotalMonths, v.bmi, v, v.measurements[0]?.bmiForAgeZ),
  );

  const wfhPoints: ChartPoint[] = record.visits.map((v) =>
    pointWithZ(
      v.heightCm,
      v.weightKg,
      v,
      v.measurements[0]?.weightForHeightZ ?? v.measurements[0]?.bmiForAgeZ,
    ),
  );

  const hcPoints: ChartPoint[] = record.visits
    .filter((v) => v.headCircumferenceCm != null)
    .map((v) =>
      pointWithZ(
        v.ageTotalMonths,
        v.headCircumferenceCm!,
        v,
        v.measurements[0]?.hcForAgeZ,
      ),
    );

  const velocityPoints: ChartPoint[] = [];
  for (let i = 1; i < record.visits.length; i++) {
    const a = record.visits[i - 1]!;
    const b = record.visits[i]!;
    const months = b.ageTotalMonths - a.ageTotalMonths;
    if (months <= 0) continue;
    const vel =
      b.measurements[0]?.growthVelocityKgPerMonth ??
      (b.weightKg - a.weightKg) / months;
    const wazDelta =
      (b.measurements[0]?.weightForAgeZ ?? 0) -
      (a.measurements[0]?.weightForAgeZ ?? 0);
    const color =
      wazDelta <= -1 ? "red" : wazDelta < -0.5 ? "orange" : "green";
    velocityPoints.push({
      x: b.ageTotalMonths,
      y: vel,
      visitId: b.id,
      visitDate: b.visitDate.toISOString().slice(0, 10),
      label: "kg/month",
      zScore: wazDelta,
      severityColor: color,
    });
  }

  const [WFA, HFA, BMI, WFH, HC] = await Promise.all([
    seriesFor("WFA", wfaPoints),
    seriesFor("HFA", hfaPoints),
    seriesFor("BMI", bmiPoints),
    seriesFor("WFH", wfhPoints),
    seriesFor("HC", hcPoints),
  ]);

  const velocity: ChartSeries = {
    indicator: "velocity",
    unit: "kg/month",
    xLabel: "Age (months)",
    yLabel: "Weight velocity (kg/month)",
    patientPoints: velocityPoints,
    curves: emptyCurves(),
    referenceSource: source,
    referenceVersion: version,
  };

  return {
    patientId: record.patientId,
    name: record.name,
    sex: record.sex,
    dateOfBirth: record.dateOfBirth.toISOString().slice(0, 10),
    charts: { WFA, HFA, BMI, WFH, HC, velocity },
  };
}
