import { prisma } from "@/lib/db/prisma";
import { assessGrowth, computeBmi } from "@/lib/growth/calculator";
import { getReferenceLoader } from "@/lib/growth/reference-loader";
import type {
  AssessGrowthInput,
  GrowthAssessment,
  PreviousVisitSnapshot,
  ReferenceDataProvider,
} from "@/lib/growth/types";
import type { ReferenceSource } from "@prisma/client";

let provider: ReferenceDataProvider | null = null;

/** Shared LMS provider: JSON files first, Prisma fallback. */
export function getGrowthProvider(): ReferenceDataProvider {
  if (!provider) {
    provider = getReferenceLoader({ prisma, preferDatabase: false });
  }
  return provider;
}

export async function runGrowthAssessment(
  input: AssessGrowthInput,
): Promise<GrowthAssessment> {
  return assessGrowth(getGrowthProvider(), input);
}

export function mapAssessmentToMeasurement(assessment: GrowthAssessment) {
  const flags = assessment.classification.labels.filter(
    (f) => f !== "NORMAL",
  );
  const hasAnthropometry = Boolean(
    assessment.weightForAge ||
      assessment.heightForAge ||
      assessment.bmiForAge ||
      assessment.weightForHeight ||
      assessment.headCircumferenceForAge,
  );

  return {
    referenceSource: assessment.reference.source as ReferenceSource,
    referenceVersion: assessment.reference.version,
    weightForAgeZ: assessment.weightForAge?.z ?? null,
    weightForAgePercentile: assessment.weightForAge?.percentile ?? null,
    heightForAgeZ: assessment.heightForAge?.z ?? null,
    heightForAgePercentile: assessment.heightForAge?.percentile ?? null,
    bmiForAgeZ: assessment.bmiForAge?.z ?? null,
    bmiForAgePercentile: assessment.bmiForAge?.percentile ?? null,
    weightForHeightZ: assessment.weightForHeight?.z ?? null,
    weightForHeightPercentile: assessment.weightForHeight?.percentile ?? null,
    hcForAgeZ: assessment.headCircumferenceForAge?.z ?? null,
    hcForAgePercentile: assessment.headCircumferenceForAge?.percentile ?? null,
    nutritionalStatus: hasAnthropometry
      ? assessment.classification.primaryStatus
      : "Partial entry",
    clinicalFlags: hasAnthropometry
      ? flags.length
        ? flags
        : (["NORMAL"] as string[])
      : (["PARTIAL"] as string[]),
    growthVelocityKgPerMonth:
      assessment.velocity?.weightKgPerMonth ?? null,
    expectedWeightKg: assessment.expectedWeightKg,
    expectedHeightCm: assessment.expectedHeightCm,
  };
}

export { computeBmi };
export type { PreviousVisitSnapshot };
