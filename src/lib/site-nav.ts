/** Site IA: friendly parent-facing names mapped to existing routes. */

export const BRAND_NAME = "Dr Care for Kids";
export const BRAND_TAGLINE =
  "Preventive care. Smarter parents. Healthier kids.";
export const BRAND_HEADLINE = "Healthy Kids. Happy Parents.";
export const BRAND_SUPPORT =
  "Trusted pediatric care, guidance & smart tools for every stage of childhood.";
export const BRAND_TRUST =
  "Evidence-based guidance made simple for parents.";

export const DOCTOR_NAME = "Dr. N. Chaitanya Krishna";
export const DOCTOR_TITLE = "Consultant Paediatrician & Intensivist";

export const PRIMARY_NAV = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/learn", label: "Learn" },
  { href: "/consult", label: "Consult" },
  { href: "/my-child", label: "My Child", emphasize: true },
] as const;

export type ToolCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  href: string;
};

/** Homepage “What do you need today?” */
export const NEED_TODAY: ToolCard[] = [
  {
    id: "vaccine-buddy",
    emoji: "💉",
    title: "Vaccine Buddy",
    description: "Never miss a vaccine — free vaccine reminder.",
    href: "/vaccination",
  },
  {
    id: "grow-right",
    emoji: "📈",
    title: "Grow Right",
    description: "Track your child's growth.",
    href: "/growth",
  },
  {
    id: "fever-guide",
    emoji: "🌡️",
    title: "Fever Guide",
    description: "Know what to do.",
    href: "/worry#fever",
  },
  {
    id: "dose-check",
    emoji: "💊",
    title: "Dose Check",
    description: "Check weight-based doses.",
    href: "/dosage",
  },
  {
    id: "guides-faqs",
    emoji: "📚",
    title: "Guides & FAQs",
    description: "Age guides, common problems & parent FAQs.",
    href: "/learn",
  },
  {
    id: "worry",
    emoji: "🚨",
    title: "When Should I Worry?",
    description: "Know the warning signs.",
    href: "/worry",
  },
];

/** Smart Tools section */
export const SMART_TOOLS: ToolCard[] = [
  {
    id: "vaccine-buddy",
    emoji: "💉",
    title: "Vaccine Buddy",
    description: "Vaccines on time — plus a free vaccine reminder.",
    href: "/vaccination",
  },
  {
    id: "grow-right",
    emoji: "📈",
    title: "Grow Right",
    description: "Track height, weight & BMI.",
    href: "/growth",
  },
  {
    id: "fever-guide",
    emoji: "🌡️",
    title: "Fever Guide",
    description: "Know when fever needs medical attention.",
    href: "/worry#fever",
  },
  {
    id: "dose-check",
    emoji: "💊",
    title: "Dose Check",
    description: "Weight-based medicine guidance.",
    href: "/dosage",
  },
  {
    id: "milestone-check",
    emoji: "🧠",
    title: "Milestone Check",
    description: "Track developmental milestones.",
    href: "/screening",
  },
  {
    id: "guides-faqs",
    emoji: "📚",
    title: "Guides & FAQs",
    description: "Age guides, common problems & parent FAQs.",
    href: "/learn",
  },
];

export const JOURNEY_STEPS = [
  { label: "Vaccines", href: "/vaccination" },
  { label: "Growth", href: "/growth" },
  { label: "Development", href: "/screening" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Prevention", href: "/worry" },
] as const;

export const CARE_SERVICES = [
  {
    emoji: "🩺",
    title: "Everyday Care",
    body: "Fever, cough, infections & common childhood illnesses.",
  },
  {
    emoji: "👶",
    title: "Baby Care",
    body: "Newborn & infant care.",
  },
  {
    emoji: "🧠",
    title: "Growth & Development",
    body: "Milestones, growth & development.",
  },
  {
    emoji: "💉",
    title: "Vaccines",
    body: "Immunization planning & reminders.",
  },
  {
    emoji: "🚑",
    title: "Critical Care",
    body: "Advanced pediatric & neonatal care.",
  },
] as const;

export const WORRY_CARDS = [
  {
    id: "fever",
    emoji: "🌡️",
    title: "Fever",
    body: "When fever needs medical review.",
    href: "/worry#fever",
  },
  {
    id: "breathing",
    emoji: "😮‍💨",
    title: "Breathing",
    body: "Warning signs of respiratory distress.",
    href: "/worry#breathing",
  },
  {
    id: "vomiting",
    emoji: "🤢",
    title: "Vomiting",
    body: "When vomiting becomes concerning.",
    href: "/worry#vomiting",
  },
  {
    id: "diarrhea",
    emoji: "💧",
    title: "Diarrhea",
    body: "Signs of dehydration.",
    href: "/worry#diarrhea",
  },
  {
    id: "newborn",
    emoji: "👶",
    title: "Newborn",
    body: "Newborn danger signs.",
    href: "/worry#newborn",
  },
] as const;

export const ASK_DOCTOR = [
  {
    emoji: "🌡️",
    topic: "Fever",
    question: "Does every fever need antibiotics?",
    href: "/learn",
  },
  {
    emoji: "💉",
    topic: "Vaccines",
    question: "Which vaccines are due at 6 months?",
    href: "/vaccination",
  },
  {
    emoji: "🥣",
    topic: "Nutrition",
    question: "When should my baby start solids?",
    href: "/nutrition",
  },
  {
    emoji: "😴",
    topic: "Sleep",
    question: "Why is my baby waking up every 2 hours?",
    href: "/learn",
  },
] as const;

/** Tools-area nav with friendly labels */
export const TOOLS_NAV = [
  { href: "/tools", label: "All tools" },
  { href: "/vaccination", label: "Vaccine Buddy" },
  { href: "/growth", label: "Grow Right" },
  { href: "/screening", label: "Milestone Check" },
  { href: "/nutrition", label: "Food for Growth" },
  { href: "/dosage", label: "Dose Check" },
  { href: "/learn", label: "Guides & FAQs" },
  { href: "/dashboard", label: "My Child's Health" },
  { href: "/worry", label: "When Should I Worry?" },
] as const;
