import type {
  ReferenceSelection,
  ReferenceSource,
  ReferenceVersion,
} from "./types";

/** WHO Child Growth Standards, 2006 (0–60 months). */
export const WHO_2006_VERSION: ReferenceVersion = "WHO-2006";

/** Indian Academy of Pediatrics revised growth charts, 2015 (5–18 years). */
export const IAP_2015_VERSION: ReferenceVersion = "IAP-2015";

export const WHO_AGE_MAX_MONTHS = 60;
export const IAP_AGE_MIN_MONTHS = 60;
export const IAP_AGE_MAX_MONTHS = 216; // 18 years

/**
 * Auto-select growth reference by age.
 *
 * - age < 60 months → WHO / WHO-2006
 * - age ≥ 60 months → IAP / IAP-2015
 *
 * CDC charts are never used in this application.
 */
export function selectReference(
  ageMonths: number,
  forceSource?: ReferenceSource
): ReferenceSelection {
  if (!Number.isFinite(ageMonths) || ageMonths < 0) {
    return {
      source: "WHO",
      version: WHO_2006_VERSION,
      reason: "Invalid/negative age — defaulting to WHO-2006.",
    };
  }

  if (forceSource === "WHO") {
    return {
      source: "WHO",
      version: WHO_2006_VERSION,
      reason: "Forced WHO (WHO Child Growth Standards 2006).",
    };
  }

  if (forceSource === "IAP") {
    return {
      source: "IAP",
      version: IAP_2015_VERSION,
      reason: "Forced IAP (IAP Growth Charts 2015).",
    };
  }

  if (ageMonths < WHO_AGE_MAX_MONTHS) {
    return {
      source: "WHO",
      version: WHO_2006_VERSION,
      reason: `Age ${ageMonths.toFixed(1)} mo < 60 — WHO Child Growth Standards 2006.`,
    };
  }

  return {
    source: "IAP",
    version: IAP_2015_VERSION,
    reason: `Age ${ageMonths.toFixed(1)} mo ≥ 60 — IAP Growth Charts 2015.`,
  };
}

/** True when WHO WEIGHT_FOR_HEIGHT is applicable (typically <60 months). */
export function supportsWeightForHeight(
  source: ReferenceSource,
  ageMonths: number
): boolean {
  return source === "WHO" && ageMonths < WHO_AGE_MAX_MONTHS;
}

/** Head circumference WHO standards are typically published to 36 months. */
export function supportsHeadCircumference(
  source: ReferenceSource,
  ageMonths: number
): boolean {
  if (source === "WHO") return ageMonths <= 36;
  return false;
}

export function describeReferenceVersions(): {
  who: string;
  iap: string;
  cdc: string;
} {
  return {
    who: "WHO-2006 — WHO Child Growth Standards (0–60 months)",
    iap: "IAP-2015 — Indian Academy of Pediatrics revised charts (5–18 years)",
    cdc: "CDC — not used by this application",
  };
}
