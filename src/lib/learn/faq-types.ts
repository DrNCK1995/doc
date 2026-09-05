import type { Bilingual } from "./types";

export type FaqItem = {
  q: Bilingual;
  a: Bilingual;
};

export type FaqKind = "common-problem" | "faq";

/** Sub-groups used for chips under Common Problems / FAQs. */
export type FaqGroupId =
  | "gut"
  | "breath-skin"
  | "infection"
  | "seizure-neuro"
  | "behaviour-dev"
  | "safety"
  | "special"
  | "feeding"
  | "sleep-screens"
  | "vaccines"
  | "growth-endo"
  | "school-teens"
  | "home-env";

export type FaqSection = {
  id: string;
  kind: FaqKind;
  group: FaqGroupId;
  emoji: string;
  title: Bilingual;
  intro: Bilingual;
  items: FaqItem[];
};

export const FAQ_GROUP_LABELS: Record<FaqGroupId, Bilingual> = {
  gut: { en: "Tummy & digestion", te: "కడుపు & జీర్ణం" },
  "breath-skin": { en: "Breathing & skin", te: "ఊపిరి & చర్మం" },
  infection: { en: "Fever & infections", te: "జ్వరం & ఇన్ఫెక్షన్లు" },
  "seizure-neuro": { en: "Seizures & nerves", te: "మూర్ఛ & నరాలు" },
  "behaviour-dev": { en: "Behaviour & development", te: "ప్రవర్తన & వికాసం" },
  safety: { en: "Safety & first aid", te: "భద్రత & ప్రథమ చికిత్స" },
  special: { en: "Special conditions", te: "ప్రత్యేక పరిస్థితులు" },
  feeding: { en: "Feeding & nutrition", te: "ఆహారం & పోషణ" },
  "sleep-screens": { en: "Sleep & screens", te: "నిద్ర & స్క్రీన్లు" },
  vaccines: { en: "Vaccines & prevention", te: "టీకాలు & నివారణ" },
  "growth-endo": { en: "Growth & hormones", te: "వృద్ధి & హార్మోన్లు" },
  "school-teens": { en: "School & teens", te: "స్కూల్ & యువత" },
  "home-env": { en: "Home & environment", te: "ఇల్లు & పరిసరాలు" },
};

export const FAQ_KIND_LABELS: Record<FaqKind, Bilingual> = {
  "common-problem": {
    en: "Common problems",
    te: "సాధారణ సమస్యలు",
  },
  faq: {
    en: "Parent FAQs",
    te: "తల్లిదండ్రుల ప్రశ్నోత్తరాలు",
  },
};
