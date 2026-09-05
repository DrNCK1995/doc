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

/** BMI = weight(kg) / (height(m))^2 — null when either measure is missing. */
export function computeBmi(
  weightKg: number | null | undefined,
  heightCm: number | null | undefined,
): number | null {
  if (!(weightKg != null && weightKg > 0) || !(heightCm != null && heightCm > 0)) {
    return null;
  }
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  return Number.isFinite(bmi) ? bmi : null;
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
  current: {
    ageMonths: number;
    weightKg: number | null;
    heightCm: number | null;
  }
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
    previous.weightKg != null && current.weightKg != null
      ? (current.weightKg - previous.weightKg) / intervalMonths
      : null;
  const heightCmPerMonth =
    previous.heightCm != null && current.heightCm != null
      ? (current.heightCm - previous.heightCm) / intervalMonths
      : null;

  if (weightKgPerMonth != null) {
    if (weightKgPerMonth < 0) {
      notes.push("Weight loss since previous visit.");
    } else if (weightKgPerMonth < 0.05 && current.ageMonths < 24) {
      notes.push("Low weight velocity for infancy/toddler age.");
    }
  }

  if (heightCmPerMonth != null) {
    if (heightCmPerMonth < 0) {
      notes.push("Apparent height decrease — verify measurement technique.");
    } else if (heightCmPerMonth < 0.3 && current.ageMonths < 24) {
      notes.push("Low linear growth velocity.");
    }
  }

  if (
    previous.weightForAgeZ != null &&
    Number.isFinite(previous.weightForAgeZ) &&
    weightKgPerMonth != null &&
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
    const { sex, ageMonths } = input;
    const weightKg =
      input.weightKg != null && input.weightKg > 0 ? input.weightKg : null;
    const heightCm =
      input.heightCm != null && input.heightCm > 0 ? input.heightCm : null;
    const headCm =
      input.headCm != null && input.headCm > 0 ? input.headCm : null;

    if (!(ageMonths >= 0) || !Number.isFinite(ageMonths)) {
      throw new Error("ageMonths must be a non-negative finite number");
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
      weightKg != null ? load("WEIGHT_FOR_AGE") : Promise.resolve([] as LmsPoint[]),
      heightCm != null ? load("HEIGHT_FOR_AGE") : Promise.resolve([] as LmsPoint[]),
      bmi != null ? load("BMI_FOR_AGE") : Promise.resolve([] as LmsPoint[]),
    ]);

    const weightForAge =
      weightKg != null
        ? buildZResult("WEIGHT_FOR_AGE", weightKg, wfaPts, ageMonths)
        : null;
    const heightForAge =
      heightCm != null
        ? buildZResult("HEIGHT_FOR_AGE", heightCm, hfaPts, ageMonths)
        : null;
    const bmiForAge =
      bmi != null
        ? buildZResult("BMI_FOR_AGE", bmi, bmiPts, ageMonths)
        : null;

    let weightForHeight: ZScoreResult | null = null;
    if (
      weightKg != null &&
      heightCm != null &&
      supportsWeightForHeight(reference.source, ageMonths)
    ) {
      const wfhPts = await load("WEIGHT_FOR_HEIGHT");
      weightForHeight = buildZResult(
        "WEIGHT_FOR_HEIGHT",
        weightKg,
        wfhPts,
        heightCm
      );
    }

    let headCircumferenceForAge: ZScoreResult | null = null;
    if (headCm != null && supportsHeadCircumference(reference.source, ageMonths)) {
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
