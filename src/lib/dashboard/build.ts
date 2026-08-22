import { calculateAllDoses } from "@/lib/dosage/calculate";
import { assessNutrition } from "@/lib/nutrition/assess";
import { getScreeningSet, scoreScreening, totalAgeMonths } from "@/lib/screening/score";
import { buildModuleRows } from "./modules";
import type { ChildHealthDashboard, DashboardRequest } from "./types";

export function buildChildHealthDashboard(
  request: DashboardRequest,
): ChildHealthDashboard {
  const { nutrition: input, includeNutrition, includeDevelopment } = request;
  const ageMonths = totalAgeMonths(input.years, input.months);
  const nutritionResult = assessNutrition(input);
  const screeningResult = includeDevelopment
    ? scoreScreening(
        getScreeningSet(ageMonths, {
          lang: request.screeningLang,
          includeAdhd: request.includeAdhd,
          includeAutism: request.includeAutism,
        }),
        request.screeningAnswers,
        request.screeningLang,
      )
    : null;

  const illnesses = [...request.illnesses];
  if (
    includeNutrition &&
    input.constipation !== "none" &&
    !illnesses.includes("constipation")
  ) {
    illnesses.push("constipation");
  }
  if (
    (nutritionResult.growthLabel.includes("undernutrition") ||
      nutritionResult.growthLabel.includes("Low BMI")) &&
    !illnesses.includes("malnutrition")
  ) {
    illnesses.push("malnutrition");
  }

  const sexLabel =
    input.sex === "male" ? "Male" : input.sex === "female" ? "Female" : "Not specified";

  const checks = {
    ...request.checks,
    illnessEpisodes: Math.max(request.checks.illnessEpisodes, illnesses.length),
  };

  return {
    childName: request.name.trim() || "Child",
    sexLabel,
    generatedAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    weightKg: input.weightKg,
    ageMonths,
    includeNutrition,
    includeDevelopment,
    nutrition: nutritionResult,
    screening: screeningResult,
    illnesses,
    doses: calculateAllDoses(input.weightKg, ageMonths),
    checks,
    modules: buildModuleRows({
      nutritionLabel: nutritionResult.growthLabel,
      nutritionGaps: includeNutrition ? nutritionResult.gaps.length : 0,
      includeNutrition,
      includeDevelopment,
      developmentOk: screeningResult?.verdict === "NORMAL_DEVELOPMENT",
      developmentNeeds: screeningResult?.verdict === "NEEDS_DEVELOPMENT_ASSESSMENT",
      adhd: screeningResult?.adhd.requireAssessment ?? false,
      autism: screeningResult?.autism.requireAssessment ?? false,
      checks,
      illnessCount: illnesses.length,
    }),
  };
}
