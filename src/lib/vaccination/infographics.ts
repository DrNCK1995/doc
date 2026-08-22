import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Building2,
  Droplets,
  HeartPulse,
  Hospital,
  Shield,
  ShieldCheck,
  Sparkles,
  Syringe,
} from "lucide-react";

export type InfographicStep = {
  label: string;
  detail: string;
  icon: LucideIcon;
};

export type JourneyStop = {
  age: string;
  focus: string;
  accent: string;
};

export type InfographicPanel = {
  id: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
};

/** Visual journey stops — key ages, not every visit. */
export const VAX_JOURNEY: JourneyStop[] = [
  { age: "Birth", focus: "BCG · OPV · Hep B", accent: "#34d399" },
  { age: "6–14 wk", focus: "Primary series peak", accent: "#60a5fa" },
  { age: "9–15 mo", focus: "MMR · Varicella · PCV", accent: "#fbbf24" },
  { age: "16–18 mo", focus: "First boosters", accent: "#fb7185" },
  { age: "4–6 y", focus: "School-entry boosters", accent: "#a78bfa" },
  { age: "9–18 y", focus: "HPV · Tdap · Td", accent: "#2dd4bf" },
];

export const HOW_VACCINES_WORK: InfographicStep[] = [
  {
    label: "Train",
    detail: "A tiny, safe piece of the germ teaches the immune system.",
    icon: Syringe,
  },
  {
    label: "Remember",
    detail: "Memory cells keep the lesson without causing the disease.",
    icon: Sparkles,
  },
  {
    label: "Shield",
    detail: "If the real germ arrives later, the body fights faster.",
    icon: ShieldCheck,
  },
  {
    label: "Protect others",
    detail: "High coverage also shields newborns and immunocompromised kids.",
    icon: HeartPulse,
  },
];

export const CLINIC_DAY_STEPS: InfographicStep[] = [
  {
    label: "Bring the card",
    detail: "Photo the record. Missed doses are easier to catch up early.",
    icon: Baby,
  },
  {
    label: "Ask UIP vs private",
    detail: "Confirm which shots are free today and which IAP add-ons you want.",
    icon: Building2,
  },
  {
    label: "Stay 30 minutes",
    detail: "Rare allergic reactions show early. Feed and comfort as usual after.",
    icon: Hospital,
  },
  {
    label: "Note the next date",
    detail: "Enrol for email reminders so the next visit is not forgotten.",
    icon: Droplets,
  },
];

export const UIP_VS_PRIVATE_STEPS: InfographicStep[] = [
  {
    label: "UIP core",
    detail: "Free at government centres: BCG, OPV, Hep B, Pentavalent, IPV/fIPV, rota, PCV, MR, boosters.",
    icon: Shield,
  },
  {
    label: "IAP extras",
    detail: "Usually private: varicella, Hep A, TCV, flu, MMR (mumps), Hib booster, HPV, Tdap.",
    icon: Sparkles,
  },
  {
    label: "Formulation choice",
    detail: "DTaP / hexavalent / full-dose IPV are private options covering the same core diseases.",
    icon: Syringe,
  },
  {
    label: "One plan",
    detail: "Many families mix UIP visits with private IAP add-ons — your paediatrician maps both.",
    icon: HeartPulse,
  },
];

export const VAX_INFOGRAPHIC_PANELS: InfographicPanel[] = [
  {
    id: "timeline",
    title: "Age journey",
    caption: "Protection builds from birth through the teen years — densest visits are early.",
    src: "/vaccination/vax-timeline.png",
    alt: "Illustrated timeline of a child growing from newborn to teen with vaccine markers",
  },
  {
    id: "how",
    title: "How a vaccine works",
    caption: "Train → remember → shield — without causing the full illness.",
    src: "/vaccination/vax-how-it-works.png",
    alt: "Four-panel illustration of immune training after vaccination",
  },
  {
    id: "split",
    title: "UIP and private together",
    caption: "Free government core on one side; IAP add-on vaccines on the other.",
    src: "/vaccination/vax-uip-private.png",
    alt: "Split illustration comparing government UIP vaccines and private clinic vaccines",
  },
  {
    id: "clinic",
    title: "Clinic visit",
    caption: "Calm visit, record card ready, short wait after the shot.",
    src: "/vaccination/vax-clinic-visit.png",
    alt: "Parent and infant at a calm paediatric vaccination clinic",
  },
];
