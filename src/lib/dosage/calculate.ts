import { OTC_MEDICATIONS } from "./medications";
import type { DoseResult, Formulation, FormulationDose, Medication } from "./types";

function roundTo(value: number, step: number): number {
  if (!(value > 0) || !(step > 0)) return 0;
  return Math.round(value / step) * step;
}

function formatMl(ml: number, step: number): string {
  const rounded = roundTo(ml, step);
  const digits = step < 0.5 ? 1 : step < 1 ? 1 : 0;
  const shown = Number(rounded.toFixed(digits));
  return `${shown} ml`;
}

function mlForAmount(doseAmount: number, form: Formulation): number {
  return (doseAmount / form.amount) * form.volumeMl;
}

function ageBandDose(med: Medication, ageMonths: number): number | null {
  const band = med.ageBands?.find(
    (b) => ageMonths >= b.minMonths && ageMonths < b.maxMonths,
  );
  return band ? band.dose : null;
}

function formulationLine(form: Formulation, doseAmount: number): FormulationDose {
  const ml = mlForAmount(doseAmount, form);
  return {
    id: form.id,
    label: form.label,
    ml: roundTo(ml, form.roundStep),
    display: formatMl(ml, form.roundStep),
  };
}

export function calculateMedicationDose(
  med: Medication,
  weightKg: number,
  ageMonths: number,
): DoseResult {
  const base = {
    medicationId: med.id,
    name: med.name,
    use: med.use,
    frequency: med.frequency,
    notes: med.notes,
    avoid: med.avoid,
  };

  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    return { ...base, eligible: false, reason: "Enter a valid weight.", formulations: [] };
  }
  if (ageMonths < med.minAgeMonths) {
    return {
      ...base,
      eligible: false,
      reason: `Not for children younger than ${
        med.minAgeMonths === 0 ? "newborn (use only if a doctor advises)" : `${med.minAgeMonths} months`
      }.`,
      formulations: [],
    };
  }
  if (med.maxAgeMonths != null && ageMonths >= med.maxAgeMonths) {
    return { ...base, eligible: false, reason: "Use an age-appropriate adult plan as advised.", formulations: [] };
  }

  if (med.kind === "ors") {
    let perStool = 100;
    if (ageMonths < 24) perStool = 75;
    else if (ageMonths < 120) perStool = 150;
    else perStool = 200;
    return {
      ...base,
      eligible: true,
      amountLabel: `About ${perStool} ml after each loose stool`,
      frequency: med.frequency,
      formulations: [
        {
          id: "ors-who",
          label: "WHO ORS (1 packet in 1 litre)",
          ml: perStool,
          display: `${perStool} ml per stool (small sips)`,
        },
      ],
    };
  }

  if (med.kind === "ml_per_kg_day") {
    const mlDay = (med.mlPerKgPerDay ?? 1) * weightKg;
    const perDose = mlDay / 2;
    return {
      ...base,
      eligible: true,
      amountLabel: `${roundTo(mlDay, 0.5).toFixed(1)} ml per day total`,
      formulations: [
        {
          id: med.formulations[0]?.id ?? "lac",
          label: med.formulations[0]?.label ?? "Syrup",
          ml: roundTo(perDose, 0.5),
          display: `${formatMl(perDose, 0.5)} twice daily (or ${formatMl(mlDay, 0.5)} once)`,
        },
      ],
    };
  }

  if (med.kind === "iu_daily") {
    const iu = ageBandDose(med, ageMonths) ?? 400;
    return {
      ...base,
      eligible: true,
      amountLabel: `${iu} IU once daily`,
      formulations: med.formulations.map((form) => formulationLine(form, iu)),
    };
  }

  if (med.kind === "mg_age") {
    const mg = ageBandDose(med, ageMonths);
    if (mg == null) {
      return { ...base, eligible: false, reason: "No dose band for this age.", formulations: [] };
    }
    const twice =
      med.id === "cetirizine" && ageMonths >= 12 && ageMonths < 24
        ? "2.5 mg once daily (or twice daily only if the doctor says so)"
        : med.frequency;
    return {
      ...base,
      eligible: true,
      amountLabel: `${mg} mg per dose`,
      frequency: twice,
      formulations: med.formulations.map((form) => formulationLine(form, mg)),
    };
  }

  // mg_per_kg
  const mgPerKg = med.mgPerKg ?? 0;
  let mg = mgPerKg * weightKg;
  if (med.maxMgPerDose != null) mg = Math.min(mg, med.maxMgPerDose);
  const maxDay =
    med.maxMgPerKgPerDay != null ? med.maxMgPerKgPerDay * weightKg : undefined;

  return {
    ...base,
    eligible: true,
    amountLabel: `${Math.round(mg)} mg per dose${
      maxDay ? ` (max ~${Math.round(maxDay)} mg in 24 hours)` : ""
    }`,
    formulations: med.formulations.map((form) => formulationLine(form, mg)),
  };
}

export function calculateAllDoses(weightKg: number, ageMonths: number): DoseResult[] {
  return OTC_MEDICATIONS.map((med) => calculateMedicationDose(med, weightKg, ageMonths));
}

export function getMedication(id: string): Medication | undefined {
  return OTC_MEDICATIONS.find((m) => m.id === id);
}
