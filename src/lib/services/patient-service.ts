import type {
  GrowthMeasurement,
  Patient,
  Prisma,
  Visit,
} from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { calculateAge } from "@/lib/growth/age";
import type { CreatePatientInput, UpdatePatientInput } from "@/lib/validations/patient";
import { generatePatientId } from "@/lib/services/patient-id";
import { writeAuditLog } from "@/lib/services/audit";
import {
  computeBmi,
  mapAssessmentToMeasurement,
  runGrowthAssessment,
} from "@/lib/services/growth";
import { sanitizeMeasurement, sanitizeVisit } from "@/lib/services/sanitize";

export type PublicPatient = Omit<Patient, "id"> & {
  /** Present only when explicitly requested for admin tooling */
  internalId?: string;
};

export type PublicVisit = Omit<Visit, "patientId"> & {
  patientId: string;
  measurements: Array<Omit<GrowthMeasurement, "patientId">>;
};

export type PatientWithLatest = PublicPatient & {
  latestVisit?: PublicVisit | null;
  visitCount?: number;
};

function toPublicVisit(
  visit: Visit & { measurements: GrowthMeasurement[] },
  humanPatientId: string,
): PublicVisit {
  const base = sanitizeVisit(visit, humanPatientId);
  return {
    ...base,
    measurements: visit.measurements.map(sanitizeMeasurement),
  };
}

function toPublicPatient(
  patient: Patient,
  opts?: { includeInternalId?: boolean },
): PublicPatient {
  const { id, ...rest } = patient;
  if (opts?.includeInternalId) {
    return { ...rest, internalId: id };
  }
  return rest;
}

export async function createPatient(
  input: CreatePatientInput,
  opts?: { ipAddress?: string; userId?: string },
): Promise<PatientWithLatest> {
  const patientId = await generatePatientId();
  const visitDate = new Date();
  visitDate.setHours(0, 0, 0, 0);

  const age = calculateAge(input.dateOfBirth, visitDate);
  const bmi = computeBmi(input.weightKg, input.heightCm);

  const assessment = await runGrowthAssessment({
    sex: input.sex,
    ageMonths: age.ageMonthsExact,
    weightKg: input.weightKg,
    heightCm: input.heightCm,
    headCm: input.headCircumferenceCm ?? undefined,
  });

  const measurementData = mapAssessmentToMeasurement(assessment);

  const created = await prisma.$transaction(async (tx) => {
    const patient = await tx.patient.create({
      data: {
        patientId,
        name: input.name,
        dateOfBirth: input.dateOfBirth,
        sex: input.sex,
        birthWeightKg: input.birthWeightKg ?? null,
        parentName: input.parentName,
        mobileNumber: input.mobileNumber,
        email: input.email ?? null,
        address: input.address ?? null,
      },
    });

    const visit = await tx.visit.create({
      data: {
        patientId: patient.id,
        visitDate,
        ageYears: age.years,
        ageMonths: age.months,
        ageDays: age.days,
        ageTotalMonths: age.ageMonthsExact,
        weightKg: input.weightKg,
        heightCm: input.heightCm,
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

    return {
      patient,
      visit: { ...visit, measurements: [measurement] },
    };
  });

  await writeAuditLog({
    action: "PATIENT_CREATE",
    entityType: "Patient",
    entityId: created.patient.patientId,
    userId: opts?.userId,
    ipAddress: opts?.ipAddress,
    metadata: { patientId: created.patient.patientId },
  });

  return {
    ...toPublicPatient(created.patient),
    latestVisit: toPublicVisit(created.visit, created.patient.patientId),
    visitCount: 1,
  };
}

export async function updatePatient(
  humanPatientId: string,
  input: UpdatePatientInput,
  opts?: { ipAddress?: string; userId?: string },
): Promise<PublicPatient> {
  const existing = await prisma.patient.findUnique({
    where: { patientId: humanPatientId },
  });
  if (!existing) {
    throw Object.assign(new Error("Patient not found"), { status: 404 });
  }

  const updated = await prisma.patient.update({
    where: { patientId: humanPatientId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.dateOfBirth !== undefined
        ? { dateOfBirth: input.dateOfBirth }
        : {}),
      ...(input.sex !== undefined ? { sex: input.sex } : {}),
      ...(input.birthWeightKg !== undefined
        ? { birthWeightKg: input.birthWeightKg }
        : {}),
      ...(input.parentName !== undefined ? { parentName: input.parentName } : {}),
      ...(input.mobileNumber !== undefined
        ? { mobileNumber: input.mobileNumber }
        : {}),
      ...(input.email !== undefined ? { email: input.email ?? null } : {}),
      ...(input.address !== undefined ? { address: input.address } : {}),
      ...(input.photoUrl !== undefined ? { photoUrl: input.photoUrl } : {}),
    },
  });

  await writeAuditLog({
    action: "PATIENT_UPDATE",
    entityType: "Patient",
    entityId: updated.patientId,
    userId: opts?.userId,
    ipAddress: opts?.ipAddress,
    metadata: { fields: Object.keys(input) },
  });

  return toPublicPatient(updated);
}

export async function getByPatientId(
  humanPatientId: string,
): Promise<PatientWithLatest | null> {
  const patient = await prisma.patient.findUnique({
    where: { patientId: humanPatientId },
    include: {
      visits: {
        orderBy: { visitDate: "desc" },
        take: 1,
        include: { measurements: true },
      },
      _count: { select: { visits: true } },
    },
  });
  if (!patient) return null;

  const { visits, _count, ...rest } = patient;
  return {
    ...toPublicPatient(rest),
    latestVisit: visits[0]
      ? toPublicVisit(visits[0], rest.patientId)
      : null,
    visitCount: _count.visits,
  };
}

/** Internal lookup by UUID — do not expose UUID as patientId in API responses. */
export async function getByUuid(
  uuid: string,
): Promise<(Omit<Patient, "id"> & { internalId: string }) | null> {
  const patient = await prisma.patient.findUnique({ where: { id: uuid } });
  if (!patient) return null;
  const { id, ...rest } = patient;
  return { ...rest, internalId: id };
}

export type SearchPatientsQuery = {
  q?: string;
  patientId?: string;
  name?: string;
  mobile?: string;
  dob?: string;
  limit?: number;
};

export async function searchPatients(
  query: SearchPatientsQuery,
): Promise<PatientWithLatest[]> {
  const limit = Math.min(Math.max(query.limit ?? 50, 1), 100);
  const and: Prisma.PatientWhereInput[] = [];

  if (query.patientId?.trim()) {
    and.push({
      patientId: {
        contains: query.patientId.trim(),
        mode: "insensitive",
      },
    });
  }
  if (query.name?.trim()) {
    and.push({
      name: { contains: query.name.trim(), mode: "insensitive" },
    });
  }
  if (query.mobile?.trim()) {
    and.push({
      mobileNumber: { contains: query.mobile.trim() },
    });
  }
  if (query.dob?.trim()) {
    const dob = new Date(query.dob);
    if (!Number.isNaN(dob.getTime())) {
      and.push({ dateOfBirth: dob });
    }
  }
  if (query.q?.trim()) {
    const q = query.q.trim();
    and.push({
      OR: [
        { patientId: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { mobileNumber: { contains: q } },
        { parentName: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  const patients = await prisma.patient.findMany({
    where: and.length ? { AND: and } : undefined,
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      visits: {
        orderBy: { visitDate: "desc" },
        take: 1,
        include: { measurements: true },
      },
      _count: { select: { visits: true } },
    },
  });

  return patients.map((p) => {
    const { visits, _count, ...rest } = p;
    return {
      ...toPublicPatient(rest),
      latestVisit: visits[0]
        ? toPublicVisit(visits[0], rest.patientId)
        : null,
      visitCount: _count.visits,
    };
  });
}
