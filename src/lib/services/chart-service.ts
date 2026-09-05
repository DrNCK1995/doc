import type { GrowthIndicator, ReferenceSource, Sex } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { derivedPercentiles } from "@/lib/growth/lms";
import {
  severityFromStatus,
  severityFromZ,
  toTrafficLight,
} from "@/lib/growth/severity-colors";
import { selectReference } from "@/lib/growth/reference-selector";
import type { GrowthIndicator as GrowthIndicatorType } from "@/lib/growth/types";
import { getGrowthProvider } from "@/lib/services/growth";
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

/**
 * Load P3–P97 curves from the same LMS provider used for Z-scores
 * (JSON files first). Prisma LMS tables are often empty on Vercel,
 * which previously left charts with a patient point and no centiles.
 */
async function loadPercentileCurves(
  source: ReferenceSource,
  version: string,
  indicator: GrowthIndicator,
  sex: Sex,
): Promise<{ curves: PercentileCurve[]; versionLabel: string }> {
  const keys: PercentileKey[] = ["p3", "p15", "p50", "p85", "p97"];
  try {
    const points = await getGrowthProvider().getLmsPoints(
      source,
      version,
      indicator as GrowthIndicatorType,
      sex,
    );

    if (!points.length) {
      return { curves: emptyCurves(), versionLabel: version };
    }

    const curves: PercentileCurve[] = keys.map((key) => ({
      percentile: key,
      points: points
        .map((p) => {
          const published = p[key];
          const y =
            published != null && Number.isFinite(published)
              ? published
              : derivedPercentiles(p)[key];
          return Number.isFinite(y) ? { x: p.xValue, y } : null;
        })
        .filter((pt): pt is { x: number; y: number } => pt != null),
    }));

    return { curves, versionLabel: version };
  } catch (err) {
    console.error("loadPercentileCurves", source, version, indicator, sex, err);
    return { curves: emptyCurves(), versionLabel: version };
  }
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

  const wfaPoints: ChartPoint[] = record.visits
    .filter((v) => v.weightKg != null)
    .map((v) =>
      pointWithZ(
        v.ageTotalMonths,
        v.weightKg,
        v,
        v.measurements[0]?.weightForAgeZ,
      ),
    );

  const hfaPoints: ChartPoint[] = record.visits
    .filter((v) => v.heightCm != null)
    .map((v) =>
      pointWithZ(
        v.ageTotalMonths,
        v.heightCm,
        v,
        v.measurements[0]?.heightForAgeZ,
      ),
    );

  const bmiPoints: ChartPoint[] = record.visits
    .filter((v) => v.bmi != null)
    .map((v) =>
      pointWithZ(v.ageTotalMonths, v.bmi, v, v.measurements[0]?.bmiForAgeZ),
    );

  const wfhPoints: ChartPoint[] = record.visits
    .filter((v) => v.heightCm != null && v.weightKg != null)
    .map((v) =>
      pointWithZ(
        v.heightCm!,
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
      (b.weightKg != null && a.weightKg != null
        ? (b.weightKg - a.weightKg) / months
        : null);
    if (vel == null || !Number.isFinite(vel)) continue;
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
