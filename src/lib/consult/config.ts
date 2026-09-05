/** Clinic consult booking configuration. */

/** Instagram followers (@dr.careforkids) pay the discounted fee. */
export const CONSULT_FEE_FOLLOWER_INR = 300;
export const CONSULT_FEE_NON_FOLLOWER_INR = 500;
/** Default / non-follower fee (used in copy when a single amount is shown). */
export const CONSULT_FEE_INR = CONSULT_FEE_NON_FOLLOWER_INR;
export const CONSULT_FEE_PAISE = CONSULT_FEE_INR * 100;

export const CONSULT_PAYMENT_LINK = "https://razorpay.me/@drcareforkids";

export function consultFeeInr(instagramFollower: boolean): number {
  return instagramFollower
    ? CONSULT_FEE_FOLLOWER_INR
    : CONSULT_FEE_NON_FOLLOWER_INR;
}

export function consultFeePaise(instagramFollower: boolean): number {
  return consultFeeInr(instagramFollower) * 100;
}

export const SLOT_HOLD_MINUTES = 15;
export const BOOKING_HORIZON_DAYS = 14;

/** Closed on Sundays (0). */
export const CLOSED_WEEKDAYS = new Set([0]);

/** 24h start times offered each open day. */
export const SLOT_STARTS_24H = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
] as const;

export const VISIT_TYPE_LABELS = {
  CONSULTATION: "General paediatric consult",
  FOLLOW_UP: "Follow-up visit",
  VACCINATION: "Vaccination visit",
  NEWBORN: "Newborn / baby check",
  GROWTH: "Growth & development review",
} as const;

export type VisitTypeKey = keyof typeof VISIT_TYPE_LABELS;

export const VISIT_TYPE_KEYS = Object.keys(VISIT_TYPE_LABELS) as VisitTypeKey[];

export function formatSlotLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const suffix = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Next N open clinic dates (skip closed weekdays), starting tomorrow. */
export function upcomingOpenDates(count = BOOKING_HORIZON_DAYS): Date[] {
  const out: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; out.length < count && i < 60; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (CLOSED_WEEKDAYS.has(d.getDay())) continue;
    out.push(d);
  }
  return out;
}

export function generateConfirmationCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DC-";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
