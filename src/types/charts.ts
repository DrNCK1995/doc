export type PercentileKey = "p3" | "p15" | "p50" | "p85" | "p97";

export type ChartPoint = {
  x: number;
  y: number | null;
  visitId?: string;
  visitDate?: string;
  label?: string;
};

export type PercentileCurve = {
  percentile: PercentileKey;
  points: ChartPoint[];
};

export type ChartSeries = {
  indicator: string;
  unit: string;
  xLabel: string;
  yLabel: string;
  patientPoints: ChartPoint[];
  curves: PercentileCurve[];
  referenceSource: string;
  referenceVersion: string;
};

export type ChartPayload = {
  patientId: string;
  name: string;
  sex: "MALE" | "FEMALE";
  dateOfBirth: string;
  charts: {
    WFA: ChartSeries;
    HFA: ChartSeries;
    BMI: ChartSeries;
    WFH: ChartSeries;
    HC: ChartSeries;
    velocity: ChartSeries;
  };
};
