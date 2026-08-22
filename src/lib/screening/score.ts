import type {
  Answer,
  DomainResult,
  MilestoneDomain,
  ScreeningLang,
  ScreeningOptions,
  ScreeningQuestion,
  ScreeningResult,
  ScreeningSet,
} from "./types";
import { pickText } from "./types";
import {
  ADHD_ITEMS,
  AUTISM_CHILD,
  AUTISM_TODDLER,
  DOMAIN_LABELS,
  MILESTONES,
  RED_FLAGS,
} from "./questions";
import {
  bandLabelForActivities,
  buildActivityGroups,
  buildConsultDoctorAdvice,
} from "./activities";

const DOMAINS: MilestoneDomain[] = [
  "gross_motor",
  "fine_motor",
  "language",
  "social",
  "cognitive",
];

const MILESTONE_WINDOW_MONTHS = 8;

const UI = {
  ageMonths: {
    en: (n: number) => `${n} month${n === 1 ? "" : "s"}`,
    te: (n: number) => `${n} నెల${n === 1 ? "" : "లు"}`,
  },
  ageYears: {
    en: (n: number) => `${n} year${n === 1 ? "" : "s"}`,
    te: (n: number) => `${n} సంవత్సరం${n === 1 ? "" : "లు"}`,
  },
  ageBoth: {
    en: (y: number, m: number) => `${y}y ${m}m`,
    te: (y: number, m: number) => `${y}సం ${m}నె`,
  },
  bands: {
    en: ["0–6 months", "6–12 months", "1–2 years", "Preschool", "School age", "Adolescent"],
    te: ["0–6 నెలలు", "6–12 నెలలు", "1–2 సంవత్సరాలు", "ప్రీస్కూల్", "పాఠశాల వయసు", "కౌమారం"],
  },
  needs: {
    en: "Needs development assessment",
    te: "వికాస అంచనా అవసరం",
  },
  normal: {
    en: "Normal development",
    te: "సాధారణ వికాసం",
  },
  lostSkills: {
    en: "Loss of previously acquired skills needs prompt clinical review.",
    te: "ముందు ఉన్న నైపుణ్యాలు పోవడం వెంటనే వైద్య సమీక్ష అవసరం.",
  },
  reviewDomain: {
    en: (label: string) => `${label}: review recommended.`,
    te: (label: string) => `${label}: సమీక్ష సిఫారసు.`,
  },
  adhdAssess: {
    en: "Require assessment for ADHD.",
    te: "ADHD కోసం అంచనా అవసరం.",
  },
  autismAssess: {
    en: "Require assessment for autism.",
    te: "ఆటిజం కోసం అంచనా అవసరం.",
  },
  ok: {
    en: "Milestones look age-appropriate on this screen.",
    te: "ఈ స్క్రీన్‌లో మైలురాళ్లు వయసుకు తగినట్టు కనిపిస్తున్నాయి.",
  },
} as const;

export function totalAgeMonths(years: number, months: number): number {
  const y = Number.isFinite(years) ? Math.max(0, Math.floor(years)) : 0;
  const m = Number.isFinite(months) ? Math.min(11, Math.max(0, Math.floor(months))) : 0;
  return y * 12 + m;
}

export function formatAgeMonths(
  ageMonths: number,
  lang: ScreeningLang = "en",
): string {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  if (years === 0) return UI.ageMonths[lang](months);
  if (months === 0) return UI.ageYears[lang](years);
  return UI.ageBoth[lang](years, months);
}

export function bandLabel(ageMonths: number, lang: ScreeningLang = "en"): string {
  const bands = UI.bands[lang];
  if (ageMonths < 6) return bands[0];
  if (ageMonths < 12) return bands[1];
  if (ageMonths < 24) return bands[2];
  if (ageMonths < 60) return bands[3];
  if (ageMonths < 144) return bands[4];
  return bands[5];
}

function latestMilestonesForDomain(
  domain: MilestoneDomain,
  ageMonths: number,
  count: number,
): ScreeningQuestion[] {
  return MILESTONES.filter(
    (q) => q.domain === domain && q.expectedByMonths <= ageMonths,
  )
    .sort((a, b) => b.expectedByMonths - a.expectedByMonths)
    .slice(0, count);
}

export function getScreeningSet(
  ageMonths: number,
  options: ScreeningOptions = {},
): ScreeningSet {
  const clamped = Math.min(216, Math.max(0, ageMonths));
  const lang = options.lang ?? "en";
  const selected: ScreeningQuestion[] = [];

  for (const domain of DOMAINS) {
    const inWindow = MILESTONES.filter(
      (q) =>
        q.domain === domain &&
        q.expectedByMonths <= clamped &&
        clamped - q.expectedByMonths <= MILESTONE_WINDOW_MONTHS,
    );
    let picked = inWindow.length >= 2 ? inWindow : latestMilestonesForDomain(domain, clamped, 2);
    if (picked.length === 0) {
      picked = MILESTONES.filter((q) => q.domain === domain)
        .sort((a, b) => a.expectedByMonths - b.expectedByMonths)
        .slice(0, 2);
    }
    for (const q of picked) {
      if (!selected.find((s) => s.id === q.id)) selected.push(q);
    }
  }

  const redFlags = RED_FLAGS.filter((q) => q.expectedByMonths <= clamped);
  const adhdAvailable = clamped >= 48 ? ADHD_ITEMS : [];
  const autismAvailable =
    clamped >= 48 ? AUTISM_CHILD : clamped >= 16 ? AUTISM_TODDLER : [];

  return {
    ageMonths: clamped,
    ageLabel: formatAgeMonths(clamped, lang),
    bandLabel: bandLabel(clamped, lang),
    milestones: selected,
    redFlags,
    adhdAvailable,
    autismAvailable,
    adhd: options.includeAdhd ? adhdAvailable : [],
    autism: options.includeAutism ? autismAvailable : [],
  };
}

function isConcern(q: ScreeningQuestion, answer: Answer | undefined): boolean {
  if (!answer) return false;
  return answer === q.concernIf;
}

export function scoreScreening(
  set: ScreeningSet,
  answers: Record<string, Answer>,
  lang: ScreeningLang = "en",
): ScreeningResult {
  const domainResults: DomainResult[] = DOMAINS.map((domain) => {
    const missed = set.milestones
      .filter(
        (q) =>
          q.domain === domain &&
          set.ageMonths >= q.expectedByMonths &&
          isConcern(q, answers[q.id]),
      )
      .map((q) => pickText(q.text, lang));
    const redFlags = set.redFlags
      .filter((q) => q.domain === domain && isConcern(q, answers[q.id]))
      .map((q) => pickText(q.text, lang));
    const status: DomainResult["status"] =
      missed.length >= 2 || redFlags.length > 0 ? "red_flag" : "typical";
    return {
      domain,
      label: pickText(DOMAIN_LABELS[domain], lang),
      status,
      missed,
      redFlags,
    };
  });

  const globalRedFlags = set.redFlags
    .filter((q) => !q.domain && isConcern(q, answers[q.id]))
    .map((q) => pickText(q.text, lang));

  const lostSkills = Boolean(
    set.redFlags.some((q) => q.id === "rf-loss" && isConcern(q, answers[q.id])),
  );

  const delayedDomains = domainResults.filter((d) => d.status === "red_flag").length;
  const anyRedFlag =
    domainResults.some((d) => d.redFlags.length > 0) || globalRedFlags.length > 0;

  const needsAssessment = lostSkills || anyRedFlag || delayedDomains >= 1;

  const adhdScore = set.adhd.filter((q) => isConcern(q, answers[q.id])).length;
  const inattention = set.adhd
    .slice(0, 5)
    .filter((q) => isConcern(q, answers[q.id])).length;
  const hyper = set.adhd
    .slice(5, 10)
    .filter((q) => isConcern(q, answers[q.id])).length;
  const requireAdhd =
    set.adhd.length > 0 && (adhdScore >= 6 || (inattention >= 4 && hyper >= 3));

  const autismScore = set.autism.filter((q) => isConcern(q, answers[q.id])).length;
  const requireAutism = set.autism.length > 0 && autismScore >= 3;

  const highlights: string[] = [];
  if (lostSkills) highlights.push(UI.lostSkills[lang]);
  for (const line of globalRedFlags) highlights.push(line);
  for (const d of domainResults) {
    if (d.status === "red_flag") {
      highlights.push(UI.reviewDomain[lang](d.label));
    }
  }
  if (requireAdhd) highlights.push(UI.adhdAssess[lang]);
  if (requireAutism) highlights.push(UI.autismAssess[lang]);
  if (!needsAssessment && !requireAdhd && !requireAutism) {
    highlights.push(UI.ok[lang]);
  }

  const base = {
    lang,
    ageMonths: set.ageMonths,
    ageLabel: formatAgeMonths(set.ageMonths, lang),
    verdict: needsAssessment
      ? ("NEEDS_DEVELOPMENT_ASSESSMENT" as const)
      : ("NORMAL_DEVELOPMENT" as const),
    verdictLabel: needsAssessment ? UI.needs[lang] : UI.normal[lang],
    domainResults,
    adhd: {
      applicable: set.adhd.length > 0,
      requireAssessment: requireAdhd,
      score: adhdScore,
      total: set.adhd.length,
    },
    autism: {
      applicable: set.autism.length > 0,
      requireAssessment: requireAutism,
      score: autismScore,
      total: set.autism.length,
    },
    highlights,
  };

  const groups = buildActivityGroups(base);

  return {
    ...base,
    consultDoctor: buildConsultDoctorAdvice(base),
    activities: {
      ageBandLabel: bandLabelForActivities(set.ageMonths, lang),
      groups,
    },
  };
}

export function unansweredIds(
  set: ScreeningSet,
  answers: Record<string, Answer>,
): string[] {
  const all = [...set.milestones, ...set.redFlags, ...set.adhd, ...set.autism];
  return all.filter((q) => answers[q.id] !== "yes" && answers[q.id] !== "no").map((q) => q.id);
}
