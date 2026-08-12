import type { SeverityColor } from "@/lib/growth/types";

export type ApiPatient = {
  patientId: string;
  name: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE";
  birthWeightKg?: number | null;
  parentName: string;
  mobileNumber: string;
  email?: string | null;
  address?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  visitCount?: number;
  latestVisit?: ApiVisit | null;
};

export type ApiMeasurement = {
  id: string;
  visitId: string;
  referenceSource: string;
  referenceVersion: string;
  weightForAgeZ?: number | null;
  weightForAgePercentile?: number | null;
  heightForAgeZ?: number | null;
  heightForAgePercentile?: number | null;
  bmiForAgeZ?: number | null;
  bmiForAgePercentile?: number | null;
  weightForHeightZ?: number | null;
  weightForHeightPercentile?: number | null;
  hcForAgeZ?: number | null;
  hcForAgePercentile?: number | null;
  nutritionalStatus: string;
  clinicalFlags: string[];
  growthVelocityKgPerMonth?: number | null;
  expectedWeightKg?: number | null;
  expectedHeightCm?: number | null;
  createdAt: string;
};

export type ApiVisit = {
  id: string;
  patientId: string;
  visitDate: string;
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  ageTotalMonths: number;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm?: number | null;
  bmi: number;
  notes?: string | null;
  doctorAdvice?: string | null;
  vaccinationStatus?: string | null;
  nextVisitDue?: string | null;
  createdAt: string;
  updatedAt: string;
  measurements: ApiMeasurement[];
};

export type ApiAlert = {
  type: string;
  severity: "info" | "warning" | "critical";
  message: string;
  patientId: string;
  visitId?: string;
  metadata?: Record<string, unknown>;
};

export function inferSeverityColor(
  status?: string | null,
  flags?: string[] | null,
): SeverityColor {
  const hay = `${status ?? ""} ${(flags ?? []).join(" ")}`.toUpperCase();
  if (/SEVERE|CRITICAL/.test(hay)) return "red";
  if (/WASTING|STUNTING|UNDERWEIGHT|OBESITY|MICROCEPHALY|MACROCEPHALY/.test(hay))
    return "orange";
  if (/OVERWEIGHT|SHORT|TALL|CAUTION|MILD/.test(hay)) return "yellow";
  if (!status || /NORMAL|HEALTHY|ADEQUATE/.test(hay)) return "green";
  return "yellow";
}

export async function parseApiError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as {
      error?: string;
      details?: { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
    };
    if (data.details?.fieldErrors) {
      const first = Object.values(data.details.fieldErrors).flat()[0];
      if (first) return first;
    }
    if (data.details?.formErrors?.[0]) return data.details.formErrors[0];
    if (data.error) return data.error;
  } catch {
    /* ignore */
  }
  return `Request failed (${res.status})`;
}
