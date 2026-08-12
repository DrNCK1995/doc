import type { GrowthMeasurement, Visit } from "@prisma/client";

type VisitRow = Visit & { measurements?: GrowthMeasurement[] };

/**
 * Visit.patientId in Prisma is the internal Patient UUID FK.
 * Never return that as `patientId` — replace with the human-readable ID.
 */
export function sanitizeVisit<T extends VisitRow>(
  visit: T,
  humanPatientId: string,
): Omit<T, "patientId"> & { patientId: string } {
  return {
    ...visit,
    patientId: humanPatientId,
  };
}

export function sanitizeVisits<T extends VisitRow>(
  visits: T[],
  humanPatientId: string,
): Array<Omit<T, "patientId"> & { patientId: string }> {
  return visits.map((v) => sanitizeVisit(v, humanPatientId));
}

/** GrowthMeasurement.patientId is also the internal UUID — strip it. */
export function sanitizeMeasurement(
  m: GrowthMeasurement,
): Omit<GrowthMeasurement, "patientId"> {
  const { patientId: _, ...rest } = m;
  void _;
  return rest;
}
