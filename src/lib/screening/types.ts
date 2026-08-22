export type ScreeningLang = "en" | "te";

export type LocalizedText = {
  en: string;
  te: string;
};

export type MilestoneDomain =
  | "gross_motor"
  | "fine_motor"
  | "language"
  | "social"
  | "cognitive";

export type Answer = "yes" | "no";

export type ScreeningQuestion = {
  id: string;
  text: LocalizedText;
  /** For milestones, the typical age the skill is expected. */
  expectedByMonths: number;
  domain?: MilestoneDomain;
  section: "milestone" | "red_flag" | "adhd" | "autism";
  /** Which answer is concerning. */
  concernIf: Answer;
};

export type DomainResult = {
  domain: MilestoneDomain;
  label: string;
  status: "typical" | "red_flag";
  missed: string[];
  redFlags: string[];
};

export type ScreeningResult = {
  lang: ScreeningLang;
  ageMonths: number;
  ageLabel: string;
  verdict: "NORMAL_DEVELOPMENT" | "NEEDS_DEVELOPMENT_ASSESSMENT";
  verdictLabel: string;
  domainResults: DomainResult[];
  adhd: {
    applicable: boolean;
    requireAssessment: boolean;
    score: number;
    total: number;
  };
  autism: {
    applicable: boolean;
    requireAssessment: boolean;
    score: number;
    total: number;
  };
  highlights: string[];
  /** Always present after scoring — stronger when delays / ADHD / autism flagged. */
  consultDoctor: {
    urgent: boolean;
    title: string;
    body: string;
    doctorLine: string;
  };
  /** Home activities for delayed domains (and ADHD/autism if flagged), age-banded. */
  activities: {
    ageBandLabel: string;
    groups: {
      focus: string;
      label: string;
      title: string;
      steps: string[];
    }[];
  };
};

export type ScreeningSet = {
  ageMonths: number;
  ageLabel: string;
  bandLabel: string;
  milestones: ScreeningQuestion[];
  redFlags: ScreeningQuestion[];
  /** Age-eligible items (before parent opt-in). */
  adhdAvailable: ScreeningQuestion[];
  autismAvailable: ScreeningQuestion[];
  /** Included in this run (after parent opt-in). */
  adhd: ScreeningQuestion[];
  autism: ScreeningQuestion[];
};

export type ScreeningOptions = {
  includeAdhd?: boolean;
  includeAutism?: boolean;
  lang?: ScreeningLang;
};

export function pickText(text: LocalizedText, lang: ScreeningLang): string {
  return lang === "te" ? text.te : text.en;
}
