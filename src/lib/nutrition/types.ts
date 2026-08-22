export type NutritionBandId =
  | "0-6m"
  | "6-12m"
  | "1-2y"
  | "preschool"
  | "school"
  | "adolescent";

export type FoodGroupId =
  | "cereals"
  | "pulses"
  | "vegetables"
  | "fruits"
  | "dairy"
  | "egg"
  | "flesh"
  | "fats"
  | "nuts";

export type NutritionInput = {
  years: number;
  months: number;
  sex: "male" | "female" | "unspecified";
  weightKg: number;
  heightCm: number;
  breastfeeding: "exclusive" | "partial" | "none";
  formulaMlPerDay: number;
  complementary:
    | "not_started"
    | "purees"
    | "mashed"
    | "family_foods"
    | "not_applicable";
  mealsPerDay: number;
  snacksPerDay: number;
  foodGroups: FoodGroupId[];
  milkMlPerDay: number;
  junkFrequency: "rarely" | "weekly" | "daily";
  sugaryDrinksPerDay: number;
  appetite: "good" | "variable" | "poor";
  constipation: "none" | "occasional" | "frequent";
};

export type NutritionGap = {
  id: string;
  title: string;
  detail: string;
};

export type NutritionResult = {
  bandId: NutritionBandId;
  bandLabel: string;
  ageLabel: string;
  bmi: number | null;
  expectedWeightKg: number;
  expectedHeightCm: number;
  weightPercentExpected: number | null;
  heightPercentExpected: number | null;
  growthLabel: string;
  growthDetail: string;
  recommendedKcal: number;
  recommendedProteinG: number;
  estimatedKcal: number;
  estimatedProteinG: number;
  intakeNote: string;
  gaps: NutritionGap[];
  feedingTips: string[];
  vegMeals: string[];
  nonVegMeals: string[];
};
