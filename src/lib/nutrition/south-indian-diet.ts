import type { NutritionBandId } from "./types";
import { nutritionBand } from "./requirements";

export type DietWeightStatus = "adequate" | "undernourished" | "overweight";

export type DietMealSlot = {
  time: string;
  veg: string;
  nonVeg?: string;
};

export type SouthIndianDietChart = {
  bandId: NutritionBandId;
  status: DietWeightStatus;
  title: string;
  /** Rough parent-facing energy cue */
  energyCue: string;
  focus: string;
  meals: DietMealSlot[];
  enrichment: string[];
  notes: string[];
};

/**
 * Approximate Weech’s expected weight for age (kg) — education only, not WHO z-score.
 */
export function expectedWeightForAgeMonths(ageMonths: number): number {
  const years = ageMonths / 12;
  if (ageMonths <= 0) return 3.2;
  if (ageMonths <= 3) return 3.2 + ageMonths * 0.8;
  if (ageMonths <= 12) return (ageMonths + 9) / 2;
  if (years <= 6) return years * 2 + 8;
  if (years <= 12) return (years * 7 - 5) / 2;
  return 32 + (years - 10) * 3.5;
}

/** Map current weight vs expected → chart variant. */
export function dietStatusFromWeight(
  ageMonths: number,
  weightKg: number | null | undefined,
): DietWeightStatus {
  if (weightKg == null || !(weightKg > 0)) return "adequate";
  const expected = expectedWeightForAgeMonths(ageMonths);
  if (!(expected > 0)) return "adequate";
  const pct = (weightKg / expected) * 100;
  if (pct < 80) return "undernourished";
  if (pct > 120) return "overweight";
  return "adequate";
}

const BAND_LABEL: Record<NutritionBandId, string> = {
  "0-6m": "0–6 months",
  "6-12m": "6–12 months",
  "1-2y": "1–2 years",
  preschool: "Preschool (2–5 y)",
  school: "School age (5–12 y)",
  adolescent: "Adolescents (12–18 y)",
};

function chart(
  bandId: NutritionBandId,
  status: DietWeightStatus,
  parts: Omit<SouthIndianDietChart, "bandId" | "status" | "title"> & {
    titleSuffix?: string;
  },
): SouthIndianDietChart {
  const statusWord =
    status === "undernourished"
      ? "catch-up / undernutrition"
      : status === "overweight"
        ? "weight-aware"
        : "balanced growth";
  return {
    bandId,
    status,
    title: `${BAND_LABEL[bandId]} · South Indian ${statusWord}${parts.titleSuffix ? ` · ${parts.titleSuffix}` : ""}`,
    energyCue: parts.energyCue,
    focus: parts.focus,
    meals: parts.meals,
    enrichment: parts.enrichment,
    notes: parts.notes,
  };
}

/** Model day charts — South Indian kitchen foods, age + nutrition status. */
export const SOUTH_INDIAN_DIET_CHARTS: SouthIndianDietChart[] = [
  // —— 0–6 m ——
  chart("0-6m", "adequate", {
    energyCue: "~100 kcal/kg/day from milk feeds",
    focus: "Exclusive breastfeeding (or formula if advised). No family foods yet.",
    meals: [
      {
        time: "All day",
        veg: "Breast milk on demand (8–12 feeds). No water, honey, or cow’s milk.",
        nonVeg: "Same — milk only. No egg or flesh foods under 6 months.",
      },
    ],
    enrichment: [
      "Vitamin D 400 IU daily as usually advised by your paediatrician.",
      "Watch wet nappies (6+/day) and weight gain at clinic visits.",
    ],
    notes: [
      "Solids start around 6 months — not earlier unless a doctor advises.",
      "This chart is education only; follow your paediatrician for medical feeding plans.",
    ],
  }),
  chart("0-6m", "undernourished", {
    energyCue: "Frequent feeds; review weight weekly with doctor",
    focus: "More frequent effective feeds + early medical review for faltering growth.",
    meals: [
      {
        time: "Day & night",
        veg: "Breastfeed every 2–3 hours, including nights. Wake a sleepy baby for feeds if advised.",
        nonVeg: "Same milk schedule. Do not add solids or animal broths under 6 months without advice.",
      },
    ],
    enrichment: [
      "Check latch / milk transfer with a clinician or lactation support.",
      "If formula is used, prepare exactly as labelled — never over-dilute to “stretch” tins.",
      "Urgent care if poor suck, fewer wet nappies, or no weight gain.",
    ],
    notes: [
      "Undernutrition under 6 months needs clinician review — not home solids as a fix.",
    ],
  }),
  chart("0-6m", "overweight", {
    energyCue: "Feed on cues; avoid bottle overfeeding",
    focus: "Responsive feeding — no solids to “settle” a chubby baby.",
    meals: [
      {
        time: "All day",
        veg: "Exclusive breast milk / formula on hunger cues. Avoid juice and cereal in the bottle.",
      },
    ],
    enrichment: ["Ask the paediatrician before changing milk volumes."],
    notes: ["Rapid weight gain still needs chart review — do not restrict milk on your own."],
  }),

  // —— 6–12 m ——
  chart("6-12m", "adequate", {
    energyCue: "~80–90 kcal/kg + breast/formula",
    focus: "Continue milk + thick complementary foods (not watery dal water).",
    meals: [
      {
        time: "Breakfast",
        veg: "Ragi / rice porridge cooked thick; mashed banana; breast/formula.",
        nonVeg: "Same porridge; later soft egg yolk mashed into porridge if family eats egg.",
      },
      {
        time: "Lunch",
        veg: "Rice–moong khichdi with mashed carrot/beans + ½–1 tsp ghee; soft idli with thin sambar.",
        nonVeg: "Khichdi + well-cooked boneless fish mash or chicken broth mixed into rice.",
      },
      {
        time: "Snack",
        veg: "Steamed apple / papaya; curd; breast feed.",
        nonVeg: "Fruit + curd; soft egg if tolerated.",
      },
      {
        time: "Dinner",
        veg: "Soft idli / khichdi / mashed curd rice with vegetable; milk feed.",
        nonVeg: "Same base; small amount of fish/chicken mash if already introduced.",
      },
    ],
    enrichment: [
      "Add ghee/oil to every solid meal for energy density.",
      "No honey, cow’s milk as main drink, or added salt/sugar under 1 year.",
    ],
    notes: ["Finger foods from ~8–9 months if sitting well. Offer water in a cup with meals."],
  }),
  chart("6-12m", "undernourished", {
    energyCue: "Catch-up: denser meals + extra ghee; 3 meals + 2 snacks",
    focus: "Energy-dense South Indian complementary foods while continuing milk feeds.",
    meals: [
      {
        time: "Breakfast",
        veg: "Thick ragi malt with milk + mashed banana + 1 tsp ghee.",
        nonVeg: "Same + egg yolk mashed in (from ~7–8 months if family eats egg).",
      },
      {
        time: "Mid-morning",
        veg: "Curd + mashed potato or ripe banana.",
        nonVeg: "Curd + banana; or soft boiled egg (quarter → half).",
      },
      {
        time: "Lunch",
        veg: "Rice–dal khichdi with vegetables + 1 tsp ghee; soft idli with dal.",
        nonVeg: "Khichdi + fish/chicken mash; add ghee.",
      },
      {
        time: "Evening",
        veg: "Milk feed + mashed papaya or steamed sweet potato.",
        nonVeg: "Same; tiny fish mash if already on non-veg.",
      },
      {
        time: "Dinner",
        veg: "Thick porridge or idli–dal; finish with breast/formula.",
        nonVeg: "Same + leftover egg/fish in small amount.",
      },
    ],
    enrichment: [
      "Never dilute foods to “make more” — keep khichdi and porridges thick.",
      "Feed every 2–3 hours while awake if appetite is poor.",
      "Plot weight on a growth chart; seek care for oedema, lethargy, or no gain.",
    ],
    notes: [
      "Medical malnutrition protocols (RUTF etc.) are doctor-supervised — this is home-kitchen support only.",
    ],
  }),
  chart("6-12m", "overweight", {
    energyCue: "Keep portions moderate; avoid biscuit–milk grazing",
    focus: "Structured meals; no fried snacks or sugary drinks.",
    meals: [
      {
        time: "Breakfast",
        veg: "Ragi porridge (less ghee) + fruit; milk feed.",
        nonVeg: "Porridge + fruit; egg white later if advised.",
      },
      {
        time: "Lunch / dinner",
        veg: "Rice–dal–vegetable with ½ tsp ghee; stop when baby turns away.",
        nonVeg: "Same with small fish/chicken; avoid fried items.",
      },
    ],
    enrichment: ["Offer water, not juice. Avoid bottle snacks of sweetened milk."],
    notes: ["Discuss growth pattern before cutting milk feeds."],
  }),

  // —— 1–2 y ——
  chart("1-2y", "adequate", {
    energyCue: "~1000–1100 kcal/day (guide)",
    focus: "Family foods: rice–sambar, idli–dosa, curd rice, millets — soft spice.",
    meals: [
      {
        time: "Breakfast",
        veg: "Idli / dosa with sambar; or vegetable upma with ghee; milk 100–150 ml.",
        nonVeg: "Egg scramble (mild) with idli; or fish stew with soft rice.",
      },
      {
        time: "Lunch",
        veg: "Rice, sambar/dal, one poriyal (beans/carrot), curd, fruit piece.",
        nonVeg: "Rice, dal, vegetable, small fish/chicken piece (deboned), curd.",
      },
      {
        time: "Snack",
        veg: "Banana + curd; roasted makhana; steamed sweet corn (age-safe).",
        nonVeg: "Boiled egg; fruit; buttermilk.",
      },
      {
        time: "Dinner",
        veg: "Roti softened in dal, or curd rice with vegetable; warm milk if needed.",
        nonVeg: "Rice/roti + dal + leftover fish/egg in small amount.",
      },
    ],
    enrichment: [
      "Limit animal milk to ~300–500 ml/day so solids are not crowded out.",
      "Cereal + pulse daily (rice–dal, ragi–dal).",
    ],
    notes: ["No force-feeding. Keep mealtimes calm, without screens."],
  }),
  chart("1-2y", "undernourished", {
    energyCue: "Catch-up: add ghee/oil; 3 meals + 2 energy snacks",
    focus: "Dense South Indian plates — khichdi with ghee, egg, banana, peanut paste (age-safe).",
    meals: [
      {
        time: "Breakfast",
        veg: "Idli/dosa + sambar + 1 tsp ghee; banana; milk.",
        nonVeg: "2 idlis + egg; banana.",
      },
      {
        time: "Mid-morning",
        veg: "Curd rice small bowl OR ragi malt with milk + jaggery pinch (if >1 y).",
        nonVeg: "Egg + fruit; or chicken soup with rice.",
      },
      {
        time: "Lunch",
        veg: "Rice + thick dal + potato/carrot poriyal + curd + 1 tsp ghee.",
        nonVeg: "Rice + fish/chicken curry (mild) + vegetable + curd + ghee.",
      },
      {
        time: "Evening",
        veg: "Paneer bits / peanut chutney smear on soft roti; fruit.",
        nonVeg: "Boiled egg; fruit; buttermilk.",
      },
      {
        time: "Dinner",
        veg: "Khichdi with ghee OR curd rice with vegetable; warm milk.",
        nonVeg: "Khichdi/rice + fish mash; milk.",
      },
    ],
    enrichment: [
      "Add oil/ghee to every cooked meal; avoid watery “dal water” as a meal.",
      "Groundnut/sesame paste mixed into food for older toddlers (not whole nuts if choking risk).",
      "Weekly weight check until catch-up; seek care for swelling of feet or extreme tiredness.",
    ],
    notes: ["Pair with the Malnutrition tips panel on this page and a clinic growth chart."],
  }),
  chart("1-2y", "overweight", {
    energyCue: "Portion awareness; milk ≤300–400 ml",
    focus: "Vegetables, dal, fruit; limit biscuits, chips, sweet drinks.",
    meals: [
      {
        time: "Breakfast",
        veg: "Idli/upma + sambar; fruit; small milk.",
        nonVeg: "Egg white + idli; fruit.",
      },
      {
        time: "Lunch / dinner",
        veg: "Rice (measured cup) + dal + two vegetables + curd; ghee ½ tsp.",
        nonVeg: "Same with grilled/steamed fish or chicken — not fried.",
      },
    ],
    enrichment: ["Snacks = fruit or roasted chana, not packed sweets."],
    notes: ["Active play daily; review BMI for age with your doctor."],
  }),

  // —— preschool ——
  chart("preschool", "adequate", {
    energyCue: "~1200–1400 kcal/day (guide)",
    focus: "Colourful South Indian thali pattern + one protein at each meal.",
    meals: [
      {
        time: "Breakfast",
        veg: "Pongal/upma/idli–sambar; milk; fruit.",
        nonVeg: "Egg dosa or egg with idli; milk; fruit.",
      },
      {
        time: "Lunch",
        veg: "Rice/millet, sambar, poriyal, curd, cucumber salad, fruit.",
        nonVeg: "Rice, rasam/sambar, fish or chicken, poriyal, curd.",
      },
      {
        time: "Snack",
        veg: "Sundal (chana/green gram); buttermilk; fruit.",
        nonVeg: "Egg sandwich (mild) or sundal; buttermilk.",
      },
      {
        time: "Dinner",
        veg: "Chapati + dal + sabzi / paneer; or vegetable khichdi with curd.",
        nonVeg: "Chapati + chicken stew or fish; dal; salad.",
      },
    ],
    enrichment: [
      "Iron-rich: ragi, greens (keerai), jaggery in small amounts with meals, egg/meat if eaten.",
      "Milk 300–400 ml/day is enough.",
    ],
    notes: ["Keep junk and sugary drinks as rare treats."],
  }),
  chart("preschool", "undernourished", {
    energyCue: "Catch-up: energy-dense thali + mid-meal snacks",
    focus: "Extra ghee, egg/fish, banana, peanut sundal, potato — frequent small meals.",
    meals: [
      {
        time: "Breakfast",
        veg: "Idli/dosa + sambar + ghee; banana milkshake (no sugar syrup).",
        nonVeg: "2 eggs (or 1 egg + idli) + fruit milk.",
      },
      {
        time: "Mid-morning",
        veg: "Peanut/chana sundal + buttermilk.",
        nonVeg: "Egg + banana; or chicken soup.",
      },
      {
        time: "Lunch",
        veg: "Rice + thick sambar + potato poriyal + curd + 1 tsp ghee.",
        nonVeg: "Rice + fish/chicken + vegetable + curd + ghee.",
      },
      {
        time: "Evening",
        veg: "Ragi malt / paneer sandwich / fruit + curd.",
        nonVeg: "Egg puff-style homemade scramble wrap; fruit.",
      },
      {
        time: "Dinner",
        veg: "Chapati + dal + paneer/vegetable + ghee drizzle.",
        nonVeg: "Chapati + chicken/fish + dal.",
      },
    ],
    enrichment: [
      "Aim for 5–6 eating occasions if appetite is poor.",
      "Treat infections promptly — illness worsens undernutrition.",
      "Clinic follow-up for weight-for-height / MUAC if advised.",
    ],
    notes: ["Not a substitute for therapeutic feeding prescribed for severe acute malnutrition."],
  }),
  chart("preschool", "overweight", {
    energyCue: "Balanced plate; bake/steam more than deep-fry",
    focus: "More vegetables and dal; fewer fried tiffin items and sweets.",
    meals: [
      {
        time: "Breakfast",
        veg: "Idli/upma + sambar; fruit; small milk.",
        nonVeg: "Egg white omelette + idli; fruit.",
      },
      {
        time: "Lunch / dinner",
        veg: "½–¾ cup rice + lots of vegetable + dal + curd.",
        nonVeg: "Same with grilled fish/chicken.",
      },
    ],
    enrichment: ["Replace evening bakery snacks with fruit or sundal."],
    notes: ["Encourage outdoor play; avoid using food as reward."],
  }),

  // —— school ——
  chart("school", "adequate", {
    energyCue: "~1600–2200 kcal/day by age/sex (guide)",
    focus: "Never skip breakfast; tiffin with cereal + protein + fruit.",
    meals: [
      {
        time: "Breakfast",
        veg: "Idli/dosa/upma/poha + chutney/sambar; milk; fruit.",
        nonVeg: "Egg + idli/bread; milk; fruit.",
      },
      {
        time: "Tiffin",
        veg: "Lemon rice / curd rice / roti–paneer roll + fruit.",
        nonVeg: "Chicken rice (mild) or egg wrap + fruit.",
      },
      {
        time: "Lunch",
        veg: "Rice or millet, sambar, two vegetables, curd, salad.",
        nonVeg: "Rice, fish/chicken, vegetable, rasam, curd.",
      },
      {
        time: "Dinner",
        veg: "Chapati + dal + sabzi; curd; fruit dessert.",
        nonVeg: "Chapati + chicken/fish + salad.",
      },
    ],
    enrichment: ["Iron & calcium: ragi, greens, sesame, curd, egg/meat if eaten."],
    notes: ["Water as main drink; limit packaged snacks."],
  }),
  chart("school", "undernourished", {
    energyCue: "Higher energy snacks around school; add nuts/ghee",
    focus: "Extra mid-meals: peanut chikki (small), banana, egg, curd rice with ghee.",
    meals: [
      {
        time: "Breakfast",
        veg: "Hearty pongal/upma with ghee + banana + milk.",
        nonVeg: "2 eggs + idli/dosa + milk.",
      },
      {
        time: "School tiffin",
        veg: "Curd rice with ghee + boiled potato; or paneer wrap + fruit.",
        nonVeg: "Egg rice / chicken sandwich + fruit.",
      },
      {
        time: "After school",
        veg: "Ragi malt or peanut sundal + buttermilk.",
        nonVeg: "Egg + banana milk.",
      },
      {
        time: "Lunch / dinner",
        veg: "Full thali with dal, vegetable, curd, ghee; second helping of rice/dal if hungry.",
        nonVeg: "Thali + fish/chicken daily if possible.",
      },
    ],
    enrichment: [
      "Treat worms / anaemia if the doctor advises — diet alone may not catch up.",
      "Keep a simple weekly weight log.",
    ],
    notes: ["Avoid replacing meals with tea and biscuits."],
  }),
  chart("school", "overweight", {
    energyCue: "Steady meals; cut sugary drinks and deep-fried tiffin",
    focus: "Measured rice, generous vegetables, daily activity.",
    meals: [
      {
        time: "Breakfast",
        veg: "Idli/upma + sambar; fruit; skim/toned milk if advised.",
        nonVeg: "Egg white + millet dosa; fruit.",
      },
      {
        time: "Lunch / dinner",
        veg: "Millet/rice (controlled) + dal + two vegetables + salad + curd.",
        nonVeg: "Same with grilled fish/chicken.",
      },
    ],
    enrichment: ["Sports or 45–60 min outdoor play most days."],
    notes: ["Family meals help — avoid solitary packaged snacking."],
  }),

  // —— adolescent ——
  chart("adolescent", "adequate", {
    energyCue: "~2200–3000+ kcal/day by sex/activity (guide)",
    focus: "Puberty needs — iron (esp. girls), calcium, protein at every meal.",
    meals: [
      {
        time: "Breakfast",
        veg: "Ragi malt/oats + paneer chilla or idli–sambar; fruit; milk.",
        nonVeg: "Eggs + dosa/bread; fruit; milk.",
      },
      {
        time: "Lunch",
        veg: "Rice/millet thali: dal, two vegetables, curd, salad, nuts.",
        nonVeg: "Thali + fish/chicken; salad; curd.",
      },
      {
        time: "Snack",
        veg: "Sundal, buttermilk, fruit, peanut chikki (small).",
        nonVeg: "Egg bhurji wrap; buttermilk; fruit.",
      },
      {
        time: "Dinner",
        veg: "Chapati + dal + sabzi + curd; sesame/ragi for calcium.",
        nonVeg: "Chapati + chicken/fish + salad.",
      },
    ],
    enrichment: [
      "Menstruating girls: green leafy vegetables, ragi, jaggery with meals, egg/meat if eaten.",
      "Do not skip breakfast around exams or sports.",
    ],
    notes: ["Limit replacing meals with tea, coffee, or packaged noodles."],
  }),
  chart("adolescent", "undernourished", {
    energyCue: "Extra snacks + calorie-dense traditional foods",
    focus: "Groundnut, ghee, egg, banana, curd rice, millet malt — never skip meals.",
    meals: [
      {
        time: "Breakfast",
        veg: "Large idli/dosa meal + banana milkshake + nuts.",
        nonVeg: "3-egg meal or egg + chicken leftover + milk.",
      },
      {
        time: "Mid-morning / post-sport",
        veg: "Peanut sundal + buttermilk + fruit.",
        nonVeg: "Egg + banana; chicken sandwich.",
      },
      {
        time: "Lunch / dinner",
        veg: "Full rice/millet thali with ghee, dal, potato, greens, curd.",
        nonVeg: "Thali + fish/chicken twice daily if possible.",
      },
      {
        time: "Bedtime",
        veg: "Warm milk with ragi malt (unsweetened or light jaggery).",
        nonVeg: "Milk + leftover egg if hungry.",
      },
    ],
    enrichment: [
      "Screen for anaemia, thyroid, and eating-pattern issues with a clinician.",
      "Sports teens need planned snacks before/after practice.",
    ],
    notes: ["Rapid unintentional weight loss needs urgent medical review."],
  }),
  chart("adolescent", "overweight", {
    energyCue: "Balanced portions; prefer millets and grilled proteins",
    focus: "Cut sugary drinks and late-night fried snacks; keep protein high.",
    meals: [
      {
        time: "Breakfast",
        veg: "Millet dosa/upma + sambar; fruit; curd.",
        nonVeg: "Egg whites + millet dosa; fruit.",
      },
      {
        time: "Lunch / dinner",
        veg: "½ plate vegetables, ¼ grain, ¼ dal/paneer; buttermilk.",
        nonVeg: "½ plate vegetables, grilled fish/chicken, small grain portion.",
      },
    ],
    enrichment: ["Walk/sport daily; sleep 8 hours supports appetite hormones."],
    notes: ["Crash diets are unsafe in growing teens — use clinic guidance."],
  }),
];

export function getDietChart(
  bandId: NutritionBandId,
  status: DietWeightStatus,
): SouthIndianDietChart {
  return (
    SOUTH_INDIAN_DIET_CHARTS.find((c) => c.bandId === bandId && c.status === status) ??
    SOUTH_INDIAN_DIET_CHARTS.find((c) => c.bandId === bandId && c.status === "adequate") ??
    SOUTH_INDIAN_DIET_CHARTS[0]
  );
}

export function resolveDietChart(opts: {
  ageMonths: number;
  weightKg?: number | null;
  statusOverride?: DietWeightStatus;
}): SouthIndianDietChart {
  const band = nutritionBand(opts.ageMonths);
  const status =
    opts.statusOverride ?? dietStatusFromWeight(opts.ageMonths, opts.weightKg);
  return getDietChart(band.id, status);
}

export const DIET_STATUS_LABELS: Record<DietWeightStatus, string> = {
  adequate: "Balanced / expected weight",
  undernourished: "Underweight / malnutrition catch-up",
  overweight: "Higher weight — portion-aware",
};
