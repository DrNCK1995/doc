import type { NutritionBandId } from "./types";

export const FEEDING_TIPS: Record<NutritionBandId, string[]> = {
  "0-6m": [
    "Exclusive breastfeeding for the first 6 months — no water, honey, or other milk unless medically advised.",
    "Feed on demand, usually 8–12 times in 24 hours. Watch swallows, wet nappies (6+ / day), and contentment after feeds.",
    "If formula is used, prepare exactly as labelled; do not over-dilute.",
    "Vitamin D 400 IU daily is usually advised. Continue until complementary feeding is established.",
    "Burp after feeds. Seek care for poor suck, fewer wet nappies, or persistent vomiting.",
  ],
  "6-12m": [
    "Continue breast milk or formula; start complementary foods at 6 months.",
    "Begin with thick porridge / mashed foods (not thin watery dal water). Offer 2–3 meals, then 3 meals + 1–2 snacks by 9–12 months.",
    "Add ghee or oil, mashed dal, vegetables, fruit, egg yolk, and later soft fish or chicken.",
    "No added salt or sugar in the first year. Avoid honey under 12 months.",
    "Offer water in a cup with meals. Finger foods from 8–9 months if sitting well.",
  ],
  "1-2y": [
    "Move to family foods: 3 meals + 2 snacks. Keep textures soft but not purely mashed.",
    "Limit animal milk to about 300–500 ml/day so solids are not crowded out.",
    "Include a cereal + pulse combination daily (rice-dal, roti-dal, ragi-dal) plus vegetable and fruit.",
    "Continue breastfeeding if desired. Avoid bottles; use an open cup.",
    "Do not force-feed. Offer the same food the family eats, with less spice.",
  ],
  preschool: [
    "3 meals + 1–2 planned snacks. A protein food at each meal (dal, curd, egg, paneer, fish, chicken).",
    "Colour on the plate: green vegetable, another vegetable or salad, and a fruit daily.",
    "Milk 300–400 ml/day is enough. Excess milk reduces appetite for meals.",
    "Keep junk food and sugary drinks as rare treats, not daily.",
    "Involve the child in choosing fruit or helping wash vegetables.",
  ],
  school: [
    "Never skip breakfast. Pack a tiffin with cereal, protein, and a fruit.",
    "Aim for 5 food groups most days: grain, pulse, vegetable, fruit, milk/curd.",
    "Water as the main drink. Limit packaged snacks and sweetened beverages.",
    "Iron-rich foods (ragi, green leafy vegetables, meat, jaggery in small amounts with meals) matter for school-age children.",
    "Sit for family meals without screens when possible.",
  ],
  adolescent: [
    "Needs rise sharply in puberty — do not skip meals. Include extra snacks around sports.",
    "Iron (especially for menstruating girls) and calcium (milk, curd, ragi, sesame) are priorities.",
    "Protein at every meal. Limit replacing meals with tea, coffee, or packaged noodles.",
    "Keep sugary drinks and fried snacks occasional. Sleep and regular meals support growth.",
    "If appetite is poor or there is rapid weight gain/loss, review with a paediatrician.",
  ],
};

export const VEG_MEALS: Record<NutritionBandId, string[]> = {
  "0-6m": [
    "Breast milk on demand (or infant formula if advised).",
    "No complementary solids in this module.",
  ],
  "6-12m": [
    "Breakfast: ragi porridge cooked in milk or water, mashed banana.",
    "Lunch: rice + moong dal khichdi with mashed carrot and ½ tsp ghee.",
    "Snack: steamed apple or mashed papaya; curd.",
    "Dinner: soft idli mashed with dal / sambar (less spice) or again khichdi.",
  ],
  "1-2y": [
    "Breakfast: idli or dosa with sambar; or vegetable upma with ghee.",
    "Lunch: rice, dal, palak / mixed vegetable, curd, a few pieces of fruit.",
    "Snack: paneer bits, roasted makhana, or banana with curd.",
    "Dinner: roti softened in dal, or curd rice with mashed vegetable.",
  ],
  preschool: [
    "Breakfast: vegetable omelette-style besan chilla, or pongal with sambar.",
    "Lunch: rice / millet, dal tadka, beans or carrot poriyal, curd, salad cucumber.",
    "Snack: fruit + a handful of roasted chana; or vegetable sandwich.",
    "Dinner: roti + paneer bhurji or dal + mixed vegetable.",
  ],
  school: [
    "Breakfast: vegetable upma / poha / idli + chutney + a glass of milk.",
    "Tiffin: roti-paneer roll or lemon rice with dal, plus fruit.",
    "Lunch: rice, sambar, poriyal, curd, salad.",
    "Dinner: millet roti, dal, sabzi; curd. Dessert fruit, not sweets daily.",
  ],
  adolescent: [
    "Breakfast: oats or ragi malt, eggs replaced with paneer bhurji / chilla, fruit.",
    "Lunch: rice or millet, two vegetables, dal, curd, salad, nuts.",
    "Snack: peanut chikki in small amount, buttermilk, sprouta sundal.",
    "Dinner: roti, dal, sabzi, curd. Add sesame / ragi for calcium.",
  ],
};

export const NON_VEG_MEALS: Record<NutritionBandId, string[]> = {
  "0-6m": [
    "Breast milk on demand (or infant formula if advised).",
    "No complementary solids or animal foods in this module.",
  ],
  "6-12m": [
    "Breakfast: ragi or rice porridge; mashed banana.",
    "Lunch: rice-dal khichdi with ½ tsp ghee; mashed boiled egg yolk (from ~7–8 months if family eats egg).",
    "Snack: fruit; later soft boneless fish mash mixed with rice (well cooked).",
    "Dinner: khichdi or idli with dal; chicken broth mixed into rice if desired.",
  ],
  "1-2y": [
    "Breakfast: egg (boiled or scrambled, less spice) with idli / bread.",
    "Lunch: rice, dal, vegetable, a small piece of fish or chicken (deboned, well cooked), curd.",
    "Snack: fruit; boiled egg; curd.",
    "Dinner: roti or rice with dal and vegetable; egg or leftover fish in small amount.",
  ],
  preschool: [
    "Breakfast: egg dosa or boiled egg with idli / chapati.",
    "Lunch: rice, sambar, vegetable, fish curry (less chilli) or chicken, curd.",
    "Snack: fruit + milk; or egg sandwich.",
    "Dinner: roti, dal, sabzi; egg or small fish portion 3–4 times a week.",
  ],
  school: [
    "Breakfast: egg and vegetable sandwich, or idli with egg curry (mild).",
    "Tiffin: chicken/egg rice or fish fry (home) with salad and fruit.",
    "Lunch: rice, dal, vegetable, fish or chicken, curd.",
    "Dinner: roti, dal, sabzi; egg or leftover meat. Keep fried items occasional.",
  ],
  adolescent: [
    "Breakfast: 1–2 eggs, millet porridge or bread, fruit, milk.",
    "Lunch: rice/roti, dal, two vegetables, fish or chicken, curd.",
    "Snack: buttermilk, boiled egg, roasted chana.",
    "Dinner: roti, vegetable, dal; fish / chicken / egg several times a week for iron and protein.",
  ],
};
