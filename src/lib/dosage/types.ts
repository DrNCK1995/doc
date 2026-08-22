export type Formulation = {
  id: string;
  label: string;
  /** Amount of drug in the labelled volume (mg, IU, or ml of product). */
  amount: number;
  /** Labelled volume in ml (1 for drops mg/ml). */
  volumeMl: number;
  roundStep: number;
  unit: "ml" | "drops";
};

export type AgeBand = {
  minMonths: number;
  maxMonths: number;
  /** Dose in mg, IU, or ml depending on medication.kind */
  dose: number;
};

export type Medication = {
  id: string;
  name: string;
  use: string;
  kind: "mg_per_kg" | "mg_age" | "ml_per_kg_day" | "iu_daily" | "ors";
  mgPerKg?: number;
  mlPerKgPerDay?: number;
  maxMgPerDose?: number;
  maxMgPerKgPerDay?: number;
  frequency: string;
  minAgeMonths: number;
  maxAgeMonths?: number;
  ageBands?: AgeBand[];
  formulations: Formulation[];
  notes: string[];
  avoid: string[];
};

export type FormulationDose = {
  id: string;
  label: string;
  display: string;
  ml: number | null;
};

export type DoseResult = {
  medicationId: string;
  name: string;
  use: string;
  eligible: boolean;
  reason?: string;
  amountLabel?: string;
  frequency: string;
  formulations: FormulationDose[];
  notes: string[];
  avoid: string[];
};
