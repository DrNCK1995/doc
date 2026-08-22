import type { FoodGroupId, NutritionBandId } from "./types";

export const FOOD_GROUP_OPTIONS: { id: FoodGroupId; label: string }[] = [
  { id: "cereals", label: "Cereals / millets (rice, ragi, wheat, oats)" },
  { id: "pulses", label: "Pulses / dals" },
  { id: "vegetables", label: "Vegetables" },
  { id: "fruits", label: "Fruits" },
  { id: "dairy", label: "Curd / paneer / cheese (besides milk drinks)" },
  { id: "egg", label: "Egg" },
  { id: "flesh", label: "Fish / chicken / meat" },
  { id: "fats", label: "Ghee / oil / nuts butter" },
  { id: "nuts", label: "Nuts / seeds (age-safe)" },
];

export const NUTRITION_BANDS: {
  id: NutritionBandId;
  label: string;
  minMonths: number;
  maxMonths: number;
}[] = [
  { id: "0-6m", label: "0–6 months", minMonths: 0, maxMonths: 6 },
  { id: "6-12m", label: "6–12 months", minMonths: 6, maxMonths: 12 },
  { id: "1-2y", label: "1–2 years", minMonths: 12, maxMonths: 24 },
  { id: "preschool", label: "Preschool (2–5 years)", minMonths: 24, maxMonths: 60 },
  { id: "school", label: "School age (5–12 years)", minMonths: 60, maxMonths: 144 },
  { id: "adolescent", label: "Adolescents (12–18 years)", minMonths: 144, maxMonths: 217 },
];

export function nutritionBand(ageMonths: number): (typeof NUTRITION_BANDS)[number] {
  const clamped = Math.min(216, Math.max(0, ageMonths));
  return (
    NUTRITION_BANDS.find((b) => clamped >= b.minMonths && clamped < b.maxMonths) ??
    NUTRITION_BANDS[NUTRITION_BANDS.length - 1]
  );
}

/** Approximate ICMR-NIN 2020 energy (kcal) and protein (g) for parent education. */
export function recommendedIntake(
  ageMonths: number,
  sex: "male" | "female" | "unspecified",
  weightKg: number,
): { kcal: number; proteinG: number } {
  if (ageMonths < 6) {
    const w = weightKg > 0 ? weightKg : 5.5;
    return { kcal: Math.round(w * 100), proteinG: Math.round(w * 1.4) };
  }
  if (ageMonths < 12) {
    const w = weightKg > 0 ? weightKg : 8;
    return { kcal: Math.round(w * 85), proteinG: Math.round(w * 1.6) };
  }
  if (ageMonths < 24) return { kcal: 1050, proteinG: 13 };
  if (ageMonths < 36) return { kcal: 1110, proteinG: 13 };
  if (ageMonths < 72) return { kcal: 1360, proteinG: 16 };
  if (ageMonths < 108) return { kcal: 1700, proteinG: 23 };
  if (ageMonths < 144) {
    return sex === "female"
      ? { kcal: 2010, proteinG: 31 }
      : { kcal: 2230, proteinG: 33 };
  }
  if (ageMonths < 180) {
    return sex === "female"
      ? { kcal: 2330, proteinG: 43 }
      : { kcal: 2750, proteinG: 45 };
  }
  return sex === "female"
    ? { kcal: 2500, proteinG: 46 }
    : { kcal: 3320, proteinG: 55 };
}

/** Weech’s formulae (Indian teaching) for expected weight/height. */
export function expectedAnthropometry(ageMonths: number): {
  weightKg: number;
  heightCm: number;
} {
  const years = ageMonths / 12;
  let weightKg: number;
  if (ageMonths <= 0) weightKg = 3.2;
  else if (ageMonths <= 3) weightKg = 3.2 + ageMonths * 0.8;
  else if (ageMonths <= 12) weightKg = (ageMonths + 9) / 2;
  else if (years <= 6) weightKg = years * 2 + 8;
  else if (years <= 12) weightKg = (years * 7 - 5) / 2;
  else weightKg = sexNeutralAdolescentWeight(years);

  let heightCm: number;
  if (ageMonths <= 0) heightCm = 50;
  else if (ageMonths < 12) heightCm = 50 + ageMonths * 2.1;
  else if (ageMonths < 24) heightCm = 75 + ((ageMonths - 12) / 12) * 12;
  else if (years <= 12) heightCm = years * 6 + 77;
  else heightCm = 150 + (years - 12) * 4;

  return {
    weightKg: Math.round(weightKg * 10) / 10,
    heightCm: Math.round(heightCm),
  };
}

function sexNeutralAdolescentWeight(years: number): number {
  return 32 + (years - 10) * 3.5;
}
