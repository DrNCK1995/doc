import type { AgeBreakdown } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
/** Average Gregorian month length used for fractional LMS age. */
const DAYS_PER_MONTH = 30.4375;

function toUtcDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function parseDate(input: Date | string): Date {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      throw new Error("Invalid date");
    }
    return input;
  }
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date string: ${input}`);
  }
  return parsed;
}

/**
 * Calendar age between DOB and an assessment date.
 * Never returns negative components — if onDate < dob, all zeros.
 */
export function calculateAge(
  dob: Date | string,
  onDate: Date | string = new Date()
): AgeBreakdown {
  const birth = toUtcDateOnly(parseDate(dob));
  const on = toUtcDateOnly(parseDate(onDate));

  if (on.getTime() < birth.getTime()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalDays: 0,
      ageMonthsExact: 0,
    };
  }

  let years = on.getUTCFullYear() - birth.getUTCFullYear();
  let months = on.getUTCMonth() - birth.getUTCMonth();
  let days = on.getUTCDate() - birth.getUTCDate();

  if (days < 0) {
    // Borrow days from previous month
    const prevMonth = new Date(Date.UTC(on.getUTCFullYear(), on.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const totalDays = Math.floor((on.getTime() - birth.getTime()) / MS_PER_DAY);
  const totalMonths = years * 12 + months;
  const ageMonthsExact = totalDays / DAYS_PER_MONTH;

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalMonths: Math.max(0, totalMonths),
    totalDays: Math.max(0, totalDays),
    ageMonthsExact: Math.max(0, ageMonthsExact),
  };
}

/** Convert exact day count to fractional months for LMS lookup. */
export function daysToMonths(totalDays: number): number {
  return Math.max(0, totalDays) / DAYS_PER_MONTH;
}

export { DAYS_PER_MONTH };
