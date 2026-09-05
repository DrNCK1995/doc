/** Sex as used by growth references (aligned with Prisma Sex enum). */
export type Sex = "MALE" | "FEMALE";

/** Anthropometric indicator for LMS lookup. */
export type GrowthIndicator =
  | "WEIGHT_FOR_AGE"
  | "HEIGHT_FOR_AGE"
  | "BMI_FOR_AGE"
  | "WEIGHT_FOR_HEIGHT"
  | "HEAD_CIRCUMFERENCE_FOR_AGE";

/**
 * Reference chart family.
 * CDC is intentionally excluded — this app uses WHO (<5y) and IAP (≥5y) only.
 */
export type ReferenceSource = "WHO" | "IAP";

/** Published dataset versions used by this engine. */
export type ReferenceVersion = "WHO-2006" | "IAP-2015";

/** LMS Box-Cox parameters for a single x-value (age months or height cm). */
export interface LmsParams {
  L: number;
  M: number;
  S: number;
}

/** One LMS data point on a reference curve. */
export interface LmsPoint extends LmsParams {
  /** Age in months, or height in cm when indicator is WEIGHT_FOR_HEIGHT. */
  xValue: number;
  /** Derived / published chart percentiles (measurement units). */
  p3?: number;
  p15?: number;
  p50?: number;
  p85?: number;
  p97?: number;
}

export interface ZScoreResult {
  /** Raw LMS Z-score (unclamped). */
  z: number;
  /** Z clamped to ±3 for classification display notes. */
  zClamped: number;
  /** Percentile 0–100 derived from raw Z via normal CDF. */
  percentile: number;
  /** Whether raw |Z| exceeded 3. */
  isExtreme: boolean;
  indicator: GrowthIndicator;
  /** Measurement used (kg, cm, or kg/m²). */
  value: number;
  /** Expected median (M) at this age/height. */
  expected: number;
  L: number;
  M: number;
  S: number;
}

export type SeverityColor = "green" | "yellow" | "orange" | "red";

export type ClinicalFlag =
  | "NORMAL"
  | "UNDERWEIGHT"
  | "SEVERE_UNDERWEIGHT"
  | "STUNTING"
  | "SEVERE_STUNTING"
  | "WASTING"
  | "SEVERE_WASTING"
  | "OVERWEIGHT"
  | "OBESITY"
  | "SEVERE_OBESITY"
  | "SHORT_STATURE"
  | "TALL_STATURE"
  | "MICROCEPHALY"
  | "MACROCEPHALY";

export interface NutritionalClassification {
  labels: ClinicalFlag[];
  /** Human-readable primary status for UI / storage. */
  primaryStatus: string;
  severityColor: SeverityColor;
  notes?: string[];
}

export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  /** Total completed months (years*12 + months), floored calendar style. */
  totalMonths: number;
  /** Exact age in days (non-negative). */
  totalDays: number;
  /** Fractional months for LMS interpolation (days/30.4375). */
  ageMonthsExact: number;
}

export interface ChartSeriesPoint {
  x: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

export interface ReferenceSelection {
  source: ReferenceSource;
  version: ReferenceVersion;
  reason: string;
}

export interface GrowthReferenceManifest {
  source: ReferenceSource;
  version: string;
  name: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  files: Partial<Record<GrowthIndicator, string>>;
}

export interface PreviousVisitSnapshot {
  visitDate: Date | string;
  ageMonths: number;
  weightKg: number | null;
  heightCm: number | null;
  weightForAgeZ?: number | null;
  heightForAgeZ?: number | null;
}

export interface AssessGrowthInput {
  sex: Sex;
  /** Exact or integer age in months (prefer fractional for LMS). */
  ageMonths: number;
  weightKg?: number | null;
  heightCm?: number | null;
  headCm?: number | null;
  previousVisit?: PreviousVisitSnapshot | null;
  /** Override auto source selection (still never CDC). */
  forceSource?: ReferenceSource;
}

export interface GrowthVelocity {
  weightKgPerMonth: number | null;
  heightCmPerMonth: number | null;
  intervalMonths: number;
  /** Rough clinical flags for faltering / catch-up. */
  notes: string[];
}

export interface GrowthAssessment {
  reference: ReferenceSelection;
  bmi: number | null;
  weightForAge: ZScoreResult | null;
  heightForAge: ZScoreResult | null;
  bmiForAge: ZScoreResult | null;
  weightForHeight: ZScoreResult | null;
  headCircumferenceForAge: ZScoreResult | null;
  classification: NutritionalClassification;
  expectedWeightKg: number | null;
  expectedHeightCm: number | null;
  velocity: GrowthVelocity | null;
}

/** Provider abstraction for LMS points (JSON files or Prisma). */
export interface ReferenceDataProvider {
  getLmsPoints(
    source: ReferenceSource,
    version: string,
    indicator: GrowthIndicator,
    sex: Sex
  ): Promise<LmsPoint[]> | LmsPoint[];
}

export interface LmsFilePayload {
  source: ReferenceSource;
  version: string;
  indicator: GrowthIndicator;
  sex: Sex;
  unit: string;
  xUnit: "months" | "cm";
  points: LmsPoint[];
}
