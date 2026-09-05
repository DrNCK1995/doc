import type { GrowthMeasurement, Visit } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { calculateAge } from "@/lib/growth/age";
import type { AddVisitInput } from "@/lib/validations/visit";
import { writeAuditLog } from "@/lib/services/audit";
import {
  computeBmi,
  mapAssessmentToMeasurement,
  runGrowthAssessment,
} from "@/lib/services/growth";
import { sanitizeMeasurement, sanitizeVisit } from "@/lib/services/sanitize";

export type VisitWithMeasurement = Omit<Visit, "patientId"> & {
  patientId: string; // human-readable
  measurements: Array<Omit<GrowthMeasurement, "patientId">>;
};

export type GrowthAlert = {
  type:
    | "FOLLOW_UP_DUE"
    | "FOLLOW_UP_MISSED"
    | "GROWTH_FALTERING"
    | "SUDDEN_WEIGHT_LOSS";
  severity: "info" | "warning" | "critical";
  message: string;
  patientId: string;
  visitId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Append a new visit. Past visits are never overwritten — measurements are
 * longitudinal snapshots.
 */
export async function addVisit(
  humanPatientId: string,
  input: AddVisitInput,
  opts?: { ipAddress?: string; userId?: string },
): Promise<VisitWithMeasurement> {
  const patient = await prisma.patient.findUnique({
    where: { patientId: humanPatientId },
  });
  if (!patient) {
    throw Object.assign(new Error("Patient not found"), { status: 404 });
  }

  if (input.visitDate < patient.dateOfBirth) {
    throw Object.assign(new Error("Visit date cannot be before date of birth"), {
      status: 400,
    });
  }

  const previous = await prisma.visit.findFirst({
    where: {
      patientId: patient.id,
      visitDate: { lte: input.visitDate },
    },
    orderBy: [{ visitDate: "desc" }, { createdAt: "desc" }],
    include: { measurements: true },
  });

  const age = calculateAge(patient.dateOfBirth, input.visitDate);
  const weightKg = input.weightKg ?? null;
  const heightCm = input.heightCm ?? null;
  const bmi = computeBmi(weightKg, heightCm);

  const assessment = await runGrowthAssessment({
    sex: patient.sex,
    ageMonths: age.ageMonthsExact,
    weightKg,
    heightCm,
    headCm: input.headCircumferenceCm ?? undefined,
    previousVisit: previous
      ? {
          visitDate: previous.visitDate,
          weightKg: previous.weightKg,
          heightCm: previous.heightCm,
          ageMonths: previous.ageTotalMonths,
          weightForAgeZ: previous.measurements[0]?.weightForAgeZ ?? null,
          heightForAgeZ: previous.measurements[0]?.heightForAgeZ ?? null,
        }
      : undefined,
  });

  const measurementData = mapAssessmentToMeasurement(assessment);

  const created = await prisma.$transaction(async (tx) => {
    const visit = await tx.visit.create({
      data: {
        patientId: patient.id,
        visitDate: input.visitDate,
        ageYears: age.years,
        ageMonths: age.months,
        ageDays: age.days,
        ageTotalMonths: age.ageMonthsExact,
        weightKg,
        heightCm,
        headCircumferenceCm: input.headCircumferenceCm ?? null,
        bmi,
        notes: input.notes ?? null,
        doctorAdvice: input.doctorAdvice ?? null,
        vaccinationStatus: input.vaccinationStatus ?? null,
        nextVisitDue: input.nextVisitDue ?? null,
      },
    });

    const measurement = await tx.growthMeasurement.create({
      data: {
        patientId: patient.id,
        visitId: visit.id,
        ...measurementData,
      },
    });

    return { ...visit, measurements: [measurement] };
  });

  await writeAuditLog({
    action: "VISIT_ADD",
    entityType: "Visit",
    entityId: created.id,
    userId: opts?.userId,
    ipAddress: opts?.ipAddress,
    metadata: {
      patientId: humanPatientId,
      visitDate: input.visitDate.toISOString(),
    },
  });

  const publicVisit = sanitizeVisit(created, humanPatientId);
  return {
    ...publicVisit,
    measurements: created.measurements.map(sanitizeMeasurement),
  };
}

export async function listVisits(
  humanPatientId: string,
): Promise<VisitWithMeasurement[]> {
  const patient = await prisma.patient.findUnique({
    where: { patientId: humanPatientId },
    select: { id: true },
  });
  if (!patient) {
    throw Object.assign(new Error("Patient not found"), { status: 404 });
  }

  const visits = await prisma.visit.findMany({
    where: { patientId: patient.id },
    orderBy: [{ visitDate: "asc" }, { createdAt: "asc" }],
    include: { measurements: true },
  });

  return visits.map((v) => {
    const publicVisit = sanitizeVisit(v, humanPatientId);
    return {
      ...publicVisit,
      measurements: v.measurements.map(sanitizeMeasurement),
    };
  });
}

export async function getAlerts(
  humanPatientId?: string,
): Promise<GrowthAlert[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const patients = await prisma.patient.findMany({
    where: humanPatientId ? { patientId: humanPatientId } : undefined,
    select: {
      id: true,
      patientId: true,
      name: true,
      visits: {
        orderBy: [{ visitDate: "asc" }, { createdAt: "asc" }],
        include: { measurements: true },
      },
    },
  });

  const alerts: GrowthAlert[] = [];

  for (const patient of patients) {
    const visits = patient.visits;
    if (!visits.length) continue;

    const latest = visits[visits.length - 1]!;

    if (latest.nextVisitDue) {
      const due = new Date(latest.nextVisitDue);
      due.setHours(0, 0, 0, 0);
      const hasLaterVisit = visits.some(
        (v) => v.visitDate > latest.nextVisitDue!,
      );

      if (!hasLaterVisit) {
        if (due.getTime() === today.getTime()) {
          alerts.push({
            type: "FOLLOW_UP_DUE",
            severity: "warning",
            message: `Follow-up due today for ${patient.name}`,
            patientId: patient.patientId,
            visitId: latest.id,
            metadata: { nextVisitDue: due.toISOString() },
          });
        } else if (due < today) {
          alerts.push({
            type: "FOLLOW_UP_MISSED",
            severity: "critical",
            message: `Missed follow-up for ${patient.name} (due ${due.toISOString().slice(0, 10)})`,
            patientId: patient.patientId,
            visitId: latest.id,
            metadata: { nextVisitDue: due.toISOString() },
          });
        } else {
          const daysUntil =
            (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          if (daysUntil <= 7) {
            alerts.push({
              type: "FOLLOW_UP_DUE",
              severity: "info",
              message: `Follow-up due in ${Math.ceil(daysUntil)} day(s) for ${patient.name}`,
              patientId: patient.patientId,
              visitId: latest.id,
              metadata: { nextVisitDue: due.toISOString() },
            });
          }
        }
      }
    }

    // Growth faltering: falling WAZ across consecutive visits
    const wazSeries = visits
      .map((v) => ({
        visitId: v.id,
        date: v.visitDate,
        waz: v.measurements[0]?.weightForAgeZ ?? null,
      }))
      .filter((x) => x.waz != null) as {
      visitId: string;
      date: Date;
      waz: number;
    }[];

    if (wazSeries.length >= 2) {
      const prev = wazSeries[wazSeries.length - 2]!;
      const curr = wazSeries[wazSeries.length - 1]!;
      if (curr.waz < prev.waz - 0.5) {
        alerts.push({
          type: "GROWTH_FALTERING",
          severity: curr.waz < prev.waz - 1 ? "critical" : "warning",
          message: `Falling weight-for-age Z-score for ${patient.name} (${prev.waz.toFixed(2)} → ${curr.waz.toFixed(2)})`,
          patientId: patient.patientId,
          visitId: curr.visitId,
          metadata: { previousWaz: prev.waz, currentWaz: curr.waz },
        });
      }
    }

    // Sudden weight loss >5% in <30 days
    for (let i = 1; i < visits.length; i++) {
      const a = visits[i - 1]!;
      const b = visits[i]!;
      const days =
        (b.visitDate.getTime() - a.visitDate.getTime()) /
        (1000 * 60 * 60 * 24);
      if (days <= 0 || days >= 30) continue;
      if (a.weightKg == null || b.weightKg == null || !(a.weightKg > 0)) continue;
      const lossPct = ((a.weightKg - b.weightKg) / a.weightKg) * 100;
      if (lossPct > 5) {
        alerts.push({
          type: "SUDDEN_WEIGHT_LOSS",
          severity: lossPct > 10 ? "critical" : "warning",
          message: `Sudden weight loss of ${lossPct.toFixed(1)}% in ${Math.round(days)} days for ${patient.name}`,
          patientId: patient.patientId,
          visitId: b.id,
          metadata: {
            previousWeightKg: a.weightKg,
            currentWeightKg: b.weightKg,
            days,
            lossPct,
          },
        });
      }
    }
  }

  return alerts;
}
