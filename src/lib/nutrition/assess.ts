import type { NutritionGap, NutritionInput, NutritionResult } from "./types";
import {
  expectedAnthropometry,
  nutritionBand,
  recommendedIntake,
} from "./requirements";
import { FEEDING_TIPS, NON_VEG_MEALS, VEG_MEALS } from "./recommendations";

export function totalAgeMonths(years: number, months: number): number {
  const y = Number.isFinite(years) ? Math.max(0, Math.floor(years)) : 0;
  const m = Number.isFinite(months) ? Math.min(11, Math.max(0, Math.floor(months))) : 0;
  return y * 12 + m;
}

export function formatAgeMonths(ageMonths: number): string {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  if (years === 0) return `${months} month${months === 1 ? "" : "s"}`;
  if (months === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}y ${months}m`;
}

function growthInterpretation(
  ageMonths: number,
  weightKg: number,
  heightCm: number,
  expectedWeightKg: number,
  expectedHeightCm: number,
): { label: string; detail: string; bmi: number | null; wPct: number | null; hPct: number | null } {
  const wPct = expectedWeightKg > 0 && weightKg > 0 ? (weightKg / expectedWeightKg) * 100 : null;
  const hPct = expectedHeightCm > 0 && heightCm > 0 ? (heightCm / expectedHeightCm) * 100 : null;
  const bmi =
    weightKg > 0 && heightCm > 0 ? weightKg / (heightCm / 100) ** 2 : null;

  let label = "Growth looks broadly appropriate for age";
  let detail =
    "This uses Weech’s expected weight/height (a teaching estimate). Confirm on WHO/IAP charts in Growth Monitor.";

  if (wPct != null) {
    if (wPct < 60) {
      label = "Possible severe undernutrition — needs clinical review";
      detail =
        "Weight is well below expected for age. Please see a paediatrician promptly and plot WHO/IAP charts.";
    } else if (wPct < 75) {
      label = "Possible moderate undernutrition";
      detail =
        "Weight is below expected for age. A clinic visit and growth-chart review are recommended.";
    } else if (wPct < 90) {
      label = "Possible mild undernutrition / faltering";
      detail =
        "Weight is a little below expected. Improve diet density and follow growth in the clinic.";
    } else if (wPct > 120 && bmi != null && bmi >= 18 && ageMonths >= 24) {
      label = "Possible overweight — review diet and activity";
      detail =
        "Weight is above expected for age. Reduce sugary drinks and fried snacks; keep meals regular.";
    }
  }

  if (bmi != null && ageMonths >= 24) {
    if (bmi < 13.5 && (wPct == null || wPct >= 90)) {
      label = "Low BMI for age — review feeding";
      detail = "Body-mass index is on the thin side. Plot on IAP/WHO BMI charts at the clinic.";
    } else if (ageMonths < 144 && bmi >= 22) {
      label = "BMI suggests possible overweight";
      detail =
        "BMI is high for a child. Confirm on IAP BMI charts; look at portion size, junk food, and activity.";
    } else if (ageMonths >= 144 && bmi >= 27) {
      label = "BMI suggests possible overweight / obesity";
      detail = "Confirm on IAP BMI charts and discuss a family-based plan at the clinic.";
    }
  }

  return {
    label,
    detail,
    bmi: bmi != null ? Math.round(bmi * 10) / 10 : null,
    wPct: wPct != null ? Math.round(wPct) : null,
    hPct: hPct != null ? Math.round(hPct) : null,
  };
}

function estimateIntake(input: NutritionInput, ageMonths: number): {
  kcal: number;
  proteinG: number;
  note: string;
} {
  const band = nutritionBand(ageMonths).id;
  let kcal = 0;
  let proteinG = 0;
  const notes: string[] = [];

  if (band === "0-6m") {
    if (input.breastfeeding === "exclusive" && input.formulaMlPerDay < 100) {
      notes.push("Exclusive breastfeeding is assumed to meet energy and protein needs when feeding is going well.");
      const rec = recommendedIntake(ageMonths, input.sex, input.weightKg);
      return { kcal: rec.kcal, proteinG: rec.proteinG, note: notes.join(" ") };
    }
    kcal += input.formulaMlPerDay * 0.67;
    proteinG += input.formulaMlPerDay * 0.014;
    if (input.breastfeeding === "partial") {
      kcal += 250;
      proteinG += 3;
      notes.push("Mixed feeding: formula volume counted; breast milk estimated.");
    } else {
      notes.push("Formula energy estimated at ~67 kcal per 100 ml.");
    }
    return {
      kcal: Math.round(kcal),
      proteinG: Math.round(proteinG * 10) / 10,
      note: notes.join(" "),
    };
  }

  if (input.breastfeeding === "exclusive" || input.breastfeeding === "partial") {
    kcal += band === "6-12m" ? 350 : 200;
    proteinG += band === "6-12m" ? 5 : 3;
    notes.push("Breast milk contribution estimated.");
  }
  kcal += input.formulaMlPerDay * 0.67;
  proteinG += input.formulaMlPerDay * 0.014;
  kcal += input.milkMlPerDay * 0.65;
  proteinG += input.milkMlPerDay * 0.033;

  const mealKcal =
    band === "6-12m" ? 80 : band === "1-2y" ? 160 : band === "preschool" ? 250 : band === "school" ? 350 : 420;
  const snackKcal =
    band === "6-12m" ? 40 : band === "1-2y" ? 80 : band === "preschool" ? 100 : 150;
  kcal += input.mealsPerDay * mealKcal + input.snacksPerDay * snackKcal;
  proteinG += input.mealsPerDay * (band === "6-12m" ? 2 : 5);

  const g = new Set(input.foodGroups);
  if (g.has("pulses")) proteinG += 6;
  if (g.has("egg")) proteinG += 6;
  if (g.has("flesh")) proteinG += 10;
  if (g.has("dairy")) {
    kcal += 80;
    proteinG += 4;
  }
  if (g.has("nuts")) {
    kcal += 80;
    proteinG += 3;
  }
  if (g.has("fats")) kcal += 90;
  if (g.has("fruits")) kcal += 50;
  if (g.has("vegetables")) kcal += 40;

  if (input.junkFrequency === "daily") kcal += 180;
  else if (input.junkFrequency === "weekly") kcal += 60;
  kcal += input.sugaryDrinksPerDay * 90;

  notes.push("Solids are estimated from meal pattern and food groups — not a weighed diet diary.");

  return {
    kcal: Math.round(kcal),
    proteinG: Math.round(proteinG * 10) / 10,
    note: notes.join(" "),
  };
}

function collectGaps(input: NutritionInput, ageMonths: number): NutritionGap[] {
  const band = nutritionBand(ageMonths).id;
  const gaps: NutritionGap[] = [];
  const g = new Set(input.foodGroups);

  if (band === "0-6m") {
    if (input.breastfeeding === "none" && input.formulaMlPerDay < 500) {
      gaps.push({
        id: "low-milk",
        title: "Low milk volume",
        detail: "Formula intake looks low for age. Check feed volumes with your paediatrician.",
      });
    }
    if (input.milkMlPerDay > 50) {
      gaps.push({
        id: "animal-milk",
        title: "Animal milk in early infancy",
        detail: "Cow or buffalo milk is not recommended as the main milk before 12 months.",
      });
    }
  }

  if (band === "6-12m" && (input.complementary === "not_started" || input.complementary === "not_applicable")) {
    gaps.push({
      id: "late-cf",
      title: "Complementary feeding not started",
      detail: "After 6 months, breast milk or formula alone is not enough. Start thick mashed foods.",
    });
  }

  if (ageMonths >= 12 && input.milkMlPerDay > 600) {
    gaps.push({
      id: "excess-milk",
      title: "High milk intake",
      detail:
        "More than ~500–600 ml milk a day after the first birthday can reduce appetite for iron-rich solids.",
    });
  }

  if (ageMonths >= 8 && !g.has("pulses") && !g.has("egg") && !g.has("flesh") && !g.has("dairy")) {
    gaps.push({
      id: "protein",
      title: "Limited protein foods",
      detail: "Add dal, curd, paneer, egg, or fish/chicken according to family diet.",
    });
  }

  if (ageMonths >= 8 && !g.has("vegetables") && !g.has("fruits")) {
    gaps.push({
      id: "micro",
      title: "Few fruits and vegetables",
      detail: "Colour on the plate supports vitamins, fibre, and appetite for family foods.",
    });
  }

  if (ageMonths >= 9 && !g.has("cereals")) {
    gaps.push({
      id: "energy",
      title: "Few energy-dense cereals / millets",
      detail: "Rice, ragi, wheat, or oats should be a daily base, with ghee or oil mixed in for infants.",
    });
  }

  if (input.junkFrequency === "daily" || input.sugaryDrinksPerDay >= 2) {
    gaps.push({
      id: "junk",
      title: "Frequent junk food or sugary drinks",
      detail: "These add calories with little iron or protein and can blunt appetite for meals.",
    });
  }

  if (input.appetite === "poor") {
    gaps.push({
      id: "appetite",
      title: "Poor appetite",
      detail: "Offer small frequent meals, limit milk between meals, avoid force-feeding, and review in clinic if weight is faltering.",
    });
  }

  if (input.constipation === "frequent") {
    gaps.push({
      id: "constipation",
      title: "Frequent constipation",
      detail: "Increase fruit, vegetables, water (after 6 months), and reduce excess milk. Seek care if stools are painful or there is blood.",
    });
  }

  if (ageMonths >= 12 && input.mealsPerDay < 3) {
    gaps.push({
      id: "meals",
      title: "Few meals",
      detail: "Aim for 3 meals and 1–2 snacks once complementary feeding is established.",
    });
  }

  return gaps;
}

export function assessNutrition(input: NutritionInput): NutritionResult {
  const ageMonths = totalAgeMonths(input.years, input.months);
  const band = nutritionBand(ageMonths);
  const expected = expectedAnthropometry(ageMonths);
  const rec = recommendedIntake(ageMonths, input.sex, input.weightKg);
  const growth = growthInterpretation(
    ageMonths,
    input.weightKg,
    input.heightCm,
    expected.weightKg,
    expected.heightCm,
  );
  const intake = estimateIntake(input, ageMonths);
  const gaps = collectGaps(input, ageMonths);

  if (intake.kcal + 250 < rec.kcal && ageMonths >= 6) {
    if (!gaps.find((g) => g.id === "energy")) {
      gaps.unshift({
        id: "low-energy",
        title: "Estimated intake below energy need",
        detail: "Meal frequency or food density may be low. Add ghee/oil, extra snacks, and a protein food at meals.",
      });
    }
  }

  if (intake.proteinG + 4 < rec.proteinG && ageMonths >= 6) {
    if (!gaps.find((g) => g.id === "protein")) {
      gaps.unshift({
        id: "low-protein",
        title: "Estimated protein below need",
        detail: "Include dal, curd, egg, paneer, fish, or chicken daily.",
      });
    }
  }

  return {
    bandId: band.id,
    bandLabel: band.label,
    ageLabel: formatAgeMonths(ageMonths),
    bmi: growth.bmi,
    expectedWeightKg: expected.weightKg,
    expectedHeightCm: expected.heightCm,
    weightPercentExpected: growth.wPct,
    heightPercentExpected: growth.hPct,
    growthLabel: growth.label,
    growthDetail: growth.detail,
    recommendedKcal: rec.kcal,
    recommendedProteinG: rec.proteinG,
    estimatedKcal: intake.kcal,
    estimatedProteinG: intake.proteinG,
    intakeNote: intake.note,
    gaps,
    feedingTips: FEEDING_TIPS[band.id],
    vegMeals: VEG_MEALS[band.id],
    nonVegMeals: NON_VEG_MEALS[band.id],
  };
}
