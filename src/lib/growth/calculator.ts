import {
  computeZScoreResult,
  interpolateLms,
} from "./lms";
import { interpretGrowth } from "./interpretation";
import {
  selectReference,
  supportsHeadCircumference,
  supportsWeightForHeight,
} from "./reference-selector";
import type {
  AssessGrowthInput,
  GrowthAssessment,
  GrowthIndicator,
  GrowthVelocity,
  LmsPoint,
  PreviousVisitSnapshot,
  ReferenceDataProvider,
  Sex,
  ZScoreResult,
} from "./types";

/** BMI = weight(kg) / (height(m))^2 */
export function computeBmi(weightKg: number, heightCm: number): number {
  if (!(weightKg > 0) || !(heightCm > 0)) return Number.NaN;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

function buildZResult(
  indicator: GrowthIndicator,
  value: number,
  points: LmsPoint[],
  xValue: number
): ZScoreResult | null {
  const params = interpolateLms(points, xValue);
  if (!params) return null;
  const scored = computeZScoreResult(value, params);
  if (!Number.isFinite(scored.z)) return null;
  return {
    ...scored,
    indicator,
    value,
    expected: params.M,
    L: params.L,
    M: params.M,
    S: params.S,
  };
}

function monthsBetween(
  previous: PreviousVisitSnapshot,
  currentAgeMonths: number
): number {
  if (
    Number.isFinite(previous.ageMonths) &&
    Number.isFinite(currentAgeMonths)
  ) {
    const d = currentAgeMonths - previous.ageMonths;
    if (d > 0) return d;
  }
  return Number.NaN;
}

export function computeGrowthVelocity(
  previous: PreviousVisitSnapshot,
  current: { ageMonths: number; weightKg: number; heightCm: number }
): GrowthVelocity {
  const intervalMonths = monthsBetween(previous, current.ageMonths);
  const notes: string[] = [];

  if (!Number.isFinite(intervalMonths) || intervalMonths <= 0) {
    return {
      weightKgPerMonth: null,
      heightCmPerMonth: null,
      intervalMonths: 0,
      notes: ["Previous visit age must be earlier than current visit."],
    };
  }

  const weightKgPerMonth =
    (current.weightKg - previous.weightKg) / intervalMonths;
  const heightCmPerMonth =
    (current.heightCm - previous.heightCm) / intervalMonths;

  // Rough clinical heuristics (not WHO formal velocity standards)
  if (weightKgPerMonth < 0) {
    notes.push("Weight loss since previous visit.");
  } else if (weightKgPerMonth < 0.05 && current.ageMonths < 24) {
    notes.push("Low weight velocity for infancy/toddler age.");
  }

  if (heightCmPerMonth < 0) {
    notes.push("Apparent height decrease — verify measurement technique.");
  } else if (heightCmPerMonth < 0.3 && current.ageMonths < 24) {
    notes.push("Low linear growth velocity.");
  }

  if (
    previous.weightForAgeZ != null &&
    Number.isFinite(previous.weightForAgeZ) &&
    weightKgPerMonth < 0
  ) {
    notes.push("Possible growth faltering (weight).");
  }

  return {
    weightKgPerMonth,
    heightCmPerMonth,
    intervalMonths,
    notes,
  };
}

export class GrowthCalculator {
  constructor(private readonly provider: ReferenceDataProvider) {}

  async assessGrowth(input: AssessGrowthInput): Promise<GrowthAssessment> {
    const { sex, ageMonths, weightKg, heightCm } = input;
    const headCm = input.headCm ?? null;

    if (!(ageMonths >= 0) || !Number.isFinite(ageMonths)) {
      throw new Error("ageMonths must be a non-negative finite number");
    }
    if (!(weightKg > 0) || !(heightCm > 0)) {
      throw new Error("weightKg and heightCm must be positive");
    }

    const reference = selectReference(ageMonths, input.forceSource);
    const bmi = computeBmi(weightKg, heightCm);

    const load = (indicator: GrowthIndicator) =>
      Promise.resolve(
        this.provider.getLmsPoints(
          reference.source,
          reference.version,
          indicator,
          sex
        )
      );

    const [wfaPts, hfaPts, bmiPts] = await Promise.all([
      load("WEIGHT_FOR_AGE"),
      load("HEIGHT_FOR_AGE"),
      load("BMI_FOR_AGE"),
    ]);

    const weightForAge = buildZResult(
      "WEIGHT_FOR_AGE",
      weightKg,
      wfaPts,
      ageMonths
    );
    const heightForAge = buildZResult(
      "HEIGHT_FOR_AGE",
      heightCm,
      hfaPts,
      ageMonths
    );
    const bmiForAge = Number.isFinite(bmi)
      ? buildZResult("BMI_FOR_AGE", bmi, bmiPts, ageMonths)
      : null;

    let weightForHeight: ZScoreResult | null = null;
    if (supportsWeightForHeight(reference.source, ageMonths)) {
      const wfhPts = await load("WEIGHT_FOR_HEIGHT");
      weightForHeight = buildZResult(
        "WEIGHT_FOR_HEIGHT",
        weightKg,
        wfhPts,
        heightCm
      );
    }

    let headCircumferenceForAge: ZScoreResult | null = null;
    if (
      headCm != null &&
      headCm > 0 &&
      supportsHeadCircumference(reference.source, ageMonths)
    ) {
      const hcPts = await load("HEAD_CIRCUMFERENCE_FOR_AGE");
      headCircumferenceForAge = buildZResult(
        "HEAD_CIRCUMFERENCE_FOR_AGE",
        headCm,
        hcPts,
        ageMonths
      );
    }

    const classification = interpretGrowth({
      source: reference.source,
      ageMonths,
      weightForAge,
      heightForAge,
      bmiForAge,
      weightForHeight,
      headCircumferenceForAge,
    });

    const velocity = input.previousVisit
      ? computeGrowthVelocity(input.previousVisit, {
          ageMonths,
          weightKg,
          heightCm,
        })
      : null;

    return {
      reference,
      bmi,
      weightForAge,
      heightForAge,
      bmiForAge,
      weightForHeight,
      headCircumferenceForAge,
      classification,
      expectedWeightKg: weightForAge?.expected ?? null,
      expectedHeightCm: heightForAge?.expected ?? null,
      velocity,
    };
  }
}

/** Functional helper wrapping GrowthCalculator. */
export async function assessGrowth(
  provider: ReferenceDataProvider,
  input: AssessGrowthInput
): Promise<GrowthAssessment> {
  return new GrowthCalculator(provider).assessGrowth(input);
}

export type { Sex, AssessGrowthInput, GrowthAssessment, ReferenceDataProvider };
