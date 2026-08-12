import type {
  ClinicalFlag,
  NutritionalClassification,
  ReferenceSource,
  SeverityColor,
  ZScoreResult,
} from "./types";

export interface InterpretationInput {
  source: ReferenceSource;
  ageMonths: number;
  weightForAge?: ZScoreResult | null;
  heightForAge?: ZScoreResult | null;
  bmiForAge?: ZScoreResult | null;
  /** Prefer WHZ for <5y when available; BMIZ otherwise. */
  weightForHeight?: ZScoreResult | null;
  headCircumferenceForAge?: ZScoreResult | null;
}

function severityRank(color: SeverityColor): number {
  switch (color) {
    case "green":
      return 0;
    case "yellow":
      return 1;
    case "orange":
      return 2;
    case "red":
      return 3;
  }
}

function worse(a: SeverityColor, b: SeverityColor): SeverityColor {
  return severityRank(a) >= severityRank(b) ? a : b;
}

function labelText(flag: ClinicalFlag): string {
  switch (flag) {
    case "NORMAL":
      return "Normal";
    case "UNDERWEIGHT":
      return "Underweight";
    case "SEVERE_UNDERWEIGHT":
      return "Severe Underweight";
    case "STUNTING":
      return "Stunting";
    case "SEVERE_STUNTING":
      return "Severe Stunting";
    case "WASTING":
      return "Wasting";
    case "SEVERE_WASTING":
      return "Severe Wasting";
    case "OVERWEIGHT":
      return "Overweight";
    case "OBESITY":
      return "Obesity";
    case "SEVERE_OBESITY":
      return "Severe Obesity";
    case "SHORT_STATURE":
      return "Short Stature";
    case "TALL_STATURE":
      return "Tall Stature";
    case "MICROCEPHALY":
      return "Microcephaly";
    case "MACROCEPHALY":
      return "Macrocephaly";
  }
}

const PRIMARY_ORDER: ClinicalFlag[] = [
  "SEVERE_WASTING",
  "SEVERE_UNDERWEIGHT",
  "SEVERE_STUNTING",
  "SEVERE_OBESITY",
  "WASTING",
  "UNDERWEIGHT",
  "STUNTING",
  "OBESITY",
  "SHORT_STATURE",
  "MICROCEPHALY",
  "OVERWEIGHT",
  "TALL_STATURE",
  "MACROCEPHALY",
  "NORMAL",
];

/**
 * WHO / IAP clinical interpretation with severity color coding.
 *
 * - Underweight / Severe Underweight: WAZ < −2 / < −3
 * - Stunting / Severe Stunting: HAZ < −2 / < −3 (WHO / <5y)
 * - Wasting / Severe Wasting: WHZ (preferred) or BMIZ < −2 / < −3 for <5y
 * - Overweight / Obesity / Severe Obesity: WHZ/BMIZ above +2 / +3 (WHO);
 *   IAP school-age uses BMIZ > +1 / +2 / +3 for overweight / obesity / severe
 * - Short stature / Tall stature: IAP / older HAZ < −2 / > +2
 *
 * Extreme |Z| > 3 is noted; classification uses clinical cut-offs on raw Z.
 * Callers may display clamped Z (±3) separately.
 */
export function interpretGrowth(
  input: InterpretationInput
): NutritionalClassification {
  const labels: ClinicalFlag[] = [];
  const notes: string[] = [];
  let severityColor: SeverityColor = "green";

  const waz = input.weightForAge?.z;
  const haz = input.heightForAge?.z;
  const bmiz = input.bmiForAge?.z;
  const whz = input.weightForHeight?.z;
  const hcz = input.headCircumferenceForAge?.z;

  const under5 = input.ageMonths < 60;
  const useWhoRules = input.source === "WHO" || under5;
  const wastingZ = under5 ? (whz ?? bmiz) : bmiz;

  // Weight-for-age
  if (waz != null && Number.isFinite(waz)) {
    if (waz < -3) {
      labels.push("SEVERE_UNDERWEIGHT");
      severityColor = worse(severityColor, "red");
      if (input.weightForAge?.isExtreme) {
        notes.push("WAZ extreme (< −3); display Z may be clamped to ±3.");
      }
    } else if (waz < -2) {
      labels.push("UNDERWEIGHT");
      severityColor = worse(severityColor, "orange");
    }
  }

  // Length / height-for-age
  if (haz != null && Number.isFinite(haz)) {
    if (useWhoRules) {
      if (haz < -3) {
        labels.push("SEVERE_STUNTING");
        severityColor = worse(severityColor, "red");
      } else if (haz < -2) {
        labels.push("STUNTING");
        severityColor = worse(severityColor, "orange");
      }
    } else {
      if (haz < -2) {
        labels.push("SHORT_STATURE");
        severityColor = worse(severityColor, haz < -3 ? "red" : "orange");
        if (haz < -3) notes.push("HAZ < −3: severe short stature.");
      } else if (haz > 2) {
        labels.push("TALL_STATURE");
        severityColor = worse(severityColor, haz > 3 ? "orange" : "yellow");
      }
    }
  }

  // Wasting / adiposity
  if (wastingZ != null && Number.isFinite(wastingZ)) {
    if (wastingZ < -3) {
      labels.push("SEVERE_WASTING");
      severityColor = worse(severityColor, "red");
    } else if (wastingZ < -2) {
      labels.push("WASTING");
      severityColor = worse(severityColor, "orange");
    }

    if (useWhoRules) {
      // WHO: >+2 overweight, >+3 obesity
      if (wastingZ > 3) {
        labels.push("OBESITY");
        severityColor = worse(severityColor, "orange");
      } else if (wastingZ > 2) {
        labels.push("OVERWEIGHT");
        severityColor = worse(severityColor, "yellow");
      }
    } else {
      // IAP older children: BMIZ >+1 overweight, >+2 obesity, >+3 severe
      if (wastingZ > 3) {
        labels.push("SEVERE_OBESITY");
        severityColor = worse(severityColor, "red");
      } else if (wastingZ > 2) {
        labels.push("OBESITY");
        severityColor = worse(severityColor, "orange");
      } else if (wastingZ > 1) {
        labels.push("OVERWEIGHT");
        severityColor = worse(severityColor, "yellow");
      }
    }
  }

  // Head circumference
  if (hcz != null && Number.isFinite(hcz)) {
    if (hcz < -2) {
      labels.push("MICROCEPHALY");
      severityColor = worse(severityColor, hcz < -3 ? "red" : "orange");
    } else if (hcz > 2) {
      labels.push("MACROCEPHALY");
      severityColor = worse(severityColor, hcz > 3 ? "orange" : "yellow");
    }
  }

  const unique: ClinicalFlag[] = [];
  for (const l of labels) {
    if (!unique.includes(l)) unique.push(l);
  }

  if (unique.length === 0) {
    unique.push("NORMAL");
    severityColor = "green";
  }

  let primary: ClinicalFlag = "NORMAL";
  for (const candidate of PRIMARY_ORDER) {
    if (unique.includes(candidate)) {
      primary = candidate;
      break;
    }
  }

  return {
    labels: unique,
    primaryStatus: labelText(primary),
    severityColor,
    notes: notes.length ? notes : undefined,
  };
}
