import type { ConditionId } from "@/lib/nutrition/condition-advice";
import type { NutritionInput, NutritionResult } from "@/lib/nutrition/types";
import type {
  Answer,
  ScreeningLang,
  ScreeningResult,
} from "@/lib/screening/types";
import type { DoseResult } from "@/lib/dosage/types";

export type ScreenStatus = "ok" | "not_screened" | "concern";
export type DentalStatus = "ok" | "due" | "not_screened";
export type LabsStatus = "none" | "done" | "pending";

export type HealthChecks = {
  vision: ScreenStatus;
  hearing: ScreenStatus;
  dental: DentalStatus;
  labs: LabsStatus;
  vaccinesDue: number;
  illnessEpisodes: number;
  nextVisit: string;
};

export type DashboardRequest = {
  name: string;
  /** Diet details for the nutrition module. Growth still uses weight/height. */
  includeNutrition: boolean;
  /** Milestone / red-flag screening questions. */
  includeDevelopment: boolean;
  /** Optional ADHD items when age-eligible. */
  includeAdhd: boolean;
  /** Optional autism items when age-eligible. */
  includeAutism: boolean;
  /** Parent language for development questions and results. */
  screeningLang: ScreeningLang;
  nutrition: NutritionInput;
  screeningAnswers: Record<string, Answer>;
  illnesses: ConditionId[];
  checks: HealthChecks;
};

export type ModuleTone = "ok" | "watch" | "due" | "empty" | "info";

export type DashboardModuleRow = {
  id: string;
  label: string;
  href: string;
  tone: ModuleTone;
  statusText: string;
  showDot: boolean;
  accent: string;
};

export type ChildHealthDashboard = {
  childName: string;
  sexLabel: string;
  generatedAt: string;
  weightKg: number;
  ageMonths: number;
  includeNutrition: boolean;
  includeDevelopment: boolean;
  /** Always computed from age/weight/height for growth; diet gaps used only if includeNutrition. */
  nutrition: NutritionResult;
  screening: ScreeningResult | null;
  illnesses: ConditionId[];
  doses: DoseResult[];
  checks: HealthChecks;
  modules: DashboardModuleRow[];
};
