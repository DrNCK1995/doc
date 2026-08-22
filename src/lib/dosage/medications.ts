import type { Medication } from "./types";

export const OTC_MEDICATIONS: Medication[] = [
  {
    id: "paracetamol",
    name: "Paracetamol (acetaminophen)",
    use: "Fever and pain",
    kind: "mg_per_kg",
    mgPerKg: 15,
    maxMgPerDose: 1000,
    maxMgPerKgPerDay: 60,
    frequency: "Every 6 hours if needed (max 4 doses / 24 hours)",
    minAgeMonths: 3,
    formulations: [
      { id: "pcm-drops-100", label: "Drops 100 mg / ml", amount: 100, volumeMl: 1, roundStep: 0.2, unit: "ml" },
      { id: "pcm-120", label: "Syrup 120 mg / 5 ml", amount: 120, volumeMl: 5, roundStep: 0.5, unit: "ml" },
      { id: "pcm-125", label: "Syrup 125 mg / 5 ml", amount: 125, volumeMl: 5, roundStep: 0.5, unit: "ml" },
      { id: "pcm-250", label: "Syrup 250 mg / 5 ml", amount: 250, volumeMl: 5, roundStep: 0.5, unit: "ml" },
    ],
    notes: [
      "Match the strength printed on your bottle before measuring.",
      "Do not combine with other paracetamol cold/cough syrups.",
      "Use the dropper or measuring cup that comes with the bottle.",
    ],
    avoid: [
      "Fever under 3 months — same-day clinic, do not dose at home from this calculator.",
      "Known liver disease, or if the child already had a dose in the last 6 hours.",
    ],
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    use: "Fever and pain (from 6 months)",
    kind: "mg_per_kg",
    mgPerKg: 10,
    maxMgPerDose: 400,
    maxMgPerKgPerDay: 40,
    frequency: "Every 8 hours if needed (max 3 doses / 24 hours)",
    minAgeMonths: 6,
    formulations: [
      { id: "ibu-drops", label: "Drops 50 mg / 1.25 ml", amount: 50, volumeMl: 1.25, roundStep: 0.25, unit: "ml" },
      { id: "ibu-100", label: "Syrup 100 mg / 5 ml", amount: 100, volumeMl: 5, roundStep: 0.5, unit: "ml" },
    ],
    notes: [
      "Give after food if possible. Prefer paracetamol first in many children.",
      "Offer extra fluids. Stop and see a doctor if there is vomiting, rash, or tummy pain.",
    ],
    avoid: [
      "Under 6 months, dehydration, chickenpox, asthma flare, kidney disease, or on a doctor’s advice to avoid NSAIDs.",
    ],
  },
  {
    id: "cetirizine",
    name: "Cetirizine",
    use: "Allergic runny nose / itch (from 6 months)",
    kind: "mg_age",
    frequency: "Once or twice daily as below",
    minAgeMonths: 6,
    ageBands: [
      { minMonths: 6, maxMonths: 12, dose: 2.5 },
      { minMonths: 12, maxMonths: 24, dose: 2.5 },
      { minMonths: 24, maxMonths: 72, dose: 5 },
      { minMonths: 72, maxMonths: 217, dose: 10 },
    ],
    formulations: [
      { id: "cet-5", label: "Syrup 5 mg / 5 ml", amount: 5, volumeMl: 5, roundStep: 0.5, unit: "ml" },
    ],
    notes: [
      "6–12 months: 2.5 mg once daily. 1–2 years: 2.5 mg once or twice daily if advised.",
      "2–6 years: 5 mg once daily. 6 years and above: 10 mg once daily.",
    ],
    avoid: [
      "Under 6 months, or if the child is unusually sleepy / irritable after a dose.",
    ],
  },
  {
    id: "zinc",
    name: "Zinc (for diarrhoea)",
    use: "With ORS during acute diarrhoea, 14 days",
    kind: "mg_age",
    frequency: "Once daily for 14 days",
    minAgeMonths: 2,
    ageBands: [
      { minMonths: 2, maxMonths: 6, dose: 10 },
      { minMonths: 6, maxMonths: 217, dose: 20 },
    ],
    formulations: [
      { id: "zn-10", label: "Syrup 10 mg / 5 ml", amount: 10, volumeMl: 5, roundStep: 0.5, unit: "ml" },
      { id: "zn-20", label: "Syrup 20 mg / 5 ml", amount: 20, volumeMl: 5, roundStep: 0.5, unit: "ml" },
    ],
    notes: [
      "WHO/IAP: 10 mg daily under 6 months; 20 mg daily from 6 months, for 14 days.",
      "Continue feeding and ORS. This is not an antibiotic.",
    ],
    avoid: ["Bloody diarrhoea, high fever, or lethargy — see a doctor the same day."],
  },
  {
    id: "lactulose",
    name: "Lactulose",
    use: "Constipation",
    kind: "ml_per_kg_day",
    mlPerKgPerDay: 1,
    frequency: "Total daily volume, split into 1–2 doses",
    minAgeMonths: 6,
    formulations: [
      { id: "lac-syrup", label: "Syrup (typical 3.35 g / 5 ml)", amount: 1, volumeMl: 1, roundStep: 0.5, unit: "ml" },
    ],
    notes: [
      "About 1 ml/kg/day (example: 10 kg → 10 ml/day, e.g. 5 ml morning and 5 ml night).",
      "Offer water and fibre foods. Effect may take 24–48 hours.",
    ],
    avoid: [
      "A swollen painful belly, vomiting, or blood in stool — do not treat at home.",
    ],
  },
  {
    id: "vitamind",
    name: "Vitamin D3",
    use: "Daily supplement in infancy (and as advised later)",
    kind: "iu_daily",
    frequency: "Once daily",
    minAgeMonths: 0,
    ageBands: [{ minMonths: 0, maxMonths: 217, dose: 400 }],
    formulations: [
      { id: "d-400-ml", label: "Drops 400 IU / ml", amount: 400, volumeMl: 1, roundStep: 0.2, unit: "ml" },
      { id: "d-400-05", label: "Drops 400 IU / 0.5 ml", amount: 400, volumeMl: 0.5, roundStep: 0.1, unit: "ml" },
      { id: "d-800", label: "Drops 800 IU / ml", amount: 800, volumeMl: 1, roundStep: 0.2, unit: "ml" },
    ],
    notes: [
      "Routine infant dose is 400 IU daily unless your paediatrician advises otherwise.",
      "Check whether your bottle is 400 IU per ml or per 0.5 ml.",
    ],
    avoid: ["Do not give extra high-dose sachets unless prescribed."],
  },
  {
    id: "ors",
    name: "ORS (oral rehydration solution)",
    use: "Diarrhoea / vomiting — replace fluid",
    kind: "ors",
    frequency: "After each loose stool, in small sips",
    minAgeMonths: 0,
    formulations: [
      { id: "ors-who", label: "WHO ORS packet in 1 litre clean water", amount: 1, volumeMl: 1000, roundStep: 10, unit: "ml" },
    ],
    notes: [
      "Mix the full packet in 1 litre. Do not boil after mixing. Use within 24 hours.",
      "Continue breast milk. Do not dilute ORS further or add extra sugar/salt.",
    ],
    avoid: [
      "No urine for 6–8 hours, very sleepy, sunken eyes, blood in stool, or a baby under 6 months with diarrhoea — clinic the same day.",
    ],
  },
];
