import type { AgeBreakdown } from "@/lib/growth/types";

/**
 * Format calendar age for display, e.g. "2y 3m 5d" or "11m 12d".
 */
export function formatAge(
  age: Pick<AgeBreakdown, "years" | "months" | "days"> | null | undefined,
  options?: { includeDays?: boolean }
): string {
  if (!age) return "—";
  const includeDays = options?.includeDays !== false;
  const parts: string[] = [];
  if (age.years > 0) parts.push(`${age.years}y`);
  if (age.months > 0 || age.years > 0) parts.push(`${age.months}m`);
  if (includeDays) parts.push(`${age.days}d`);
  if (parts.length === 0) return includeDays ? "0d" : "0m";
  return parts.join(" ");
}

/**
 * Format patient ID for display (keeps full immutable ID; soft wraps via
 * zero-width space after the timestamp segment when present).
 * Expected pattern: ARJYYYYMMDDHHmm-NNN
 */
export function formatPatientId(patientId: string | null | undefined): string {
  if (!patientId) return "—";
  const trimmed = patientId.trim();
  // Insert a thin visual break before the sequence suffix when hyphenated
  const m = /^([A-Z]{2,4}\d{12})-(\d+)$/i.exec(trimmed);
  if (m) return `${m[1]}-${m[2]}`;
  return trimmed;
}

/** Round a number for clinical display (default 2 dp). */
export function formatMeasure(
  value: number | null | undefined,
  digits = 2,
  unit?: string
): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const n = value.toFixed(digits);
  return unit ? `${n} ${unit}` : n;
}

/** Format Z-score with sign, e.g. "+0.42" / "−1.80". */
export function formatZScore(
  z: number | null | undefined,
  digits = 2
): string {
  if (z == null || !Number.isFinite(z)) return "—";
  const abs = Math.abs(z).toFixed(digits);
  if (z > 0) return `+${abs}`;
  if (z < 0) return `−${abs}`;
  return Number(0).toFixed(digits);
}

/** Format percentile 0–100. */
export function formatPercentile(
  p: number | null | undefined,
  digits = 1
): string {
  if (p == null || !Number.isFinite(p)) return "—";
  return `${p.toFixed(digits)}%`;
}
