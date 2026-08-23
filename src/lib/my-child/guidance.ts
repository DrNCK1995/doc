/** Age-banded parent guidance for the My Child companion view. */

export type GuidanceItem = {
  emoji: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

export type AgeBandId = "newborn" | "infant" | "sitter" | "toddler" | "preschool";

export function monthsFromDob(dob: string): number | null {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return months;
}

export function formatAgeLabel(dob: string): string {
  const months = monthsFromDob(dob);
  if (months == null) return "";
  if (months < 0) return "due date pending";
  if (months < 1) return "newborn";
  if (months < 24) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}y ${rem}m`;
}

export function ageBandFromMonths(months: number): AgeBandId {
  if (months < 1) return "newborn";
  if (months < 6) return "infant";
  if (months < 12) return "sitter";
  if (months < 36) return "toddler";
  return "preschool";
}

const BAND_COPY: Record<
  AgeBandId,
  { label: string; focus: string; items: GuidanceItem[] }
> = {
  newborn: {
    label: "Newborn (0–28 days)",
    focus: "Feeding, warmth, safe sleep, and jaundice watch.",
    items: [
      {
        emoji: "🍼",
        title: "Feeding rhythm",
        body: "Feed on demand — often 8–12 times in 24 hours. Wet nappies and a settled baby after feeds matter more than the clock.",
        href: "/learn",
        cta: "Open Baby Basics",
      },
      {
        emoji: "😴",
        title: "Safe sleep",
        body: "Back to sleep, firm flat surface, no loose bedding or pillows. Room-share, don’t bed-share.",
        href: "/learn",
        cta: "Sleep tips",
      },
      {
        emoji: "🚨",
        title: "When to call urgently",
        body: "Poor feeding, unusual sleepiness, fever, fast breathing, or deepening jaundice — seek care now.",
        href: "/worry#newborn",
        cta: "Newborn warning signs",
      },
      {
        emoji: "💉",
        title: "Free vaccine reminder",
        body: "Birth vaccines and the early schedule — enrol once for free due-date reminders.",
        href: "/vaccination",
        cta: "Vaccine Buddy",
      },
    ],
  },
  infant: {
    label: "Infant (1–6 months)",
    focus: "Vaccines, tummy time, growth checks, and fever confidence.",
    items: [
      {
        emoji: "💉",
        title: "Vaccine Buddy + free reminder",
        body: "This age has several due shots. Set a free vaccine reminder so you never miss a date.",
        href: "/vaccination",
        cta: "Free Vaccine reminder",
      },
      {
        emoji: "📈",
        title: "Growth check",
        body: "Weight and length rise quickly now. Register once to plot Grow Right charts over time.",
        href: "/growth/register",
        cta: "Register for Grow Right",
      },
      {
        emoji: "🌡️",
        title: "Fever at this age",
        body: "Any fever in a baby under 3 months needs prompt medical review. Over 3 months, watch activity and fluids.",
        href: "/worry#fever",
        cta: "Fever Guide",
      },
      {
        emoji: "🧠",
        title: "Milestones",
        body: "Social smile, head control, and tracking faces — use Milestone Check if you’re unsure.",
        href: "/screening",
        cta: "Milestone Check",
      },
    ],
  },
  sitter: {
    label: "6–12 months",
    focus: "Solids, vaccines, crawling, and choking safety.",
    items: [
      {
        emoji: "🥣",
        title: "Starting solids",
        body: "Around 6 months, offer iron-rich complementary foods while continuing milk feeds.",
        href: "/nutrition",
        cta: "Food for Growth",
      },
      {
        emoji: "💉",
        title: "Free vaccine reminder",
        body: "Catch-up and booster windows are easy to miss — keep Vaccine Buddy reminders on.",
        href: "/vaccination",
        cta: "Vaccine Buddy",
      },
      {
        emoji: "📈",
        title: "Growth & BMI",
        body: "Plot weight and length after each visit so trends stay clear.",
        href: "/growth",
        cta: "Open Grow Right",
      },
      {
        emoji: "🦷",
        title: "Teething comfort",
        body: "Drooling and chewing are common. Avoid amber necklaces; cool teething rings are safer.",
        href: "/learn",
        cta: "Parenting Hub",
      },
    ],
  },
  toddler: {
    label: "1–3 years",
    focus: "Speech, picky eating, vaccines, and safety.",
    items: [
      {
        emoji: "🗣️",
        title: "Speech & play",
        body: "Words, pointing, and pretend play grow fast. Ask about hearing or speech delay early.",
        href: "/screening",
        cta: "Milestone Check",
      },
      {
        emoji: "🍎",
        title: "Picky eating",
        body: "Offer variety without pressure. Keep meal times calm and consistent.",
        href: "/nutrition",
        cta: "Food for Growth",
      },
      {
        emoji: "💉",
        title: "Free vaccine reminder",
        body: "Boosters and annual flu timing — enrol for free due-date emails.",
        href: "/vaccination",
        cta: "Free Vaccine reminder",
      },
      {
        emoji: "💊",
        title: "Dose Check",
        body: "Use weight-based dosing for fever medicines — never guess from age alone.",
        href: "/dosage",
        cta: "Open Dose Check",
      },
    ],
  },
  preschool: {
    label: "3–5 years",
    focus: "School readiness, behaviour, nutrition, and boosters.",
    items: [
      {
        emoji: "🎒",
        title: "School readiness",
        body: "Independence, toilet skills, and listening in a group — gentle practice helps.",
        href: "/learn",
        cta: "Parenting Hub",
      },
      {
        emoji: "📈",
        title: "Growth yearly",
        body: "Height and weight once or twice a year catch silent faltering early.",
        href: "/growth",
        cta: "Grow Right",
      },
      {
        emoji: "💉",
        title: "Free vaccine reminder",
        body: "Preschool boosters and catch-up — keep reminders active.",
        href: "/vaccination",
        cta: "Vaccine Buddy",
      },
      {
        emoji: "🚨",
        title: "When Should I Worry?",
        body: "Breathing trouble, dehydration, or unusual sleepiness still need urgent care.",
        href: "/worry",
        cta: "Warning signs",
      },
    ],
  },
};

export function guidanceForDob(dob: string) {
  const months = monthsFromDob(dob) ?? 0;
  const band = ageBandFromMonths(Math.max(0, months));
  return { months: Math.max(0, months), band, ...BAND_COPY[band] };
}
