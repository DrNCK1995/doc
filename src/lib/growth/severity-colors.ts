import type { SeverityColor } from "@/lib/growth/types";

/** Print / canvas RGB for clinical severity (Green / Orange / Red). */
export const SEVERITY_RGB: Record<
  "green" | "orange" | "red" | "yellow",
  [number, number, number]
> = {
  green: [26, 122, 76],
  yellow: [201, 148, 0],
  orange: [192, 86, 0],
  red: [180, 35, 24],
};

export const SEVERITY_HEX: Record<"green" | "orange" | "red" | "yellow", string> =
  {
    green: "#1a7a4c",
    yellow: "#c99400",
    orange: "#c05600",
    red: "#b42318",
  };

/** Soft fills for chart percentile bands. */
export const ZONE_FILL = {
  green: "rgba(26, 122, 76, 0.18)",
  orange: "rgba(192, 86, 0, 0.16)",
  red: "rgba(180, 35, 24, 0.12)",
} as const;

/**
 * Map a Z-score to Green / Orange / Red for chart dots and PDF.
 * |Z| < 2 → green, 2–3 → orange, ≥ 3 → red.
 */
export function severityFromZ(z: number | null | undefined): SeverityColor {
  if (z == null || !Number.isFinite(z)) return "green";
  const a = Math.abs(z);
  if (a >= 3) return "red";
  if (a >= 2) return "orange";
  if (a >= 1) return "yellow";
  return "green";
}

/** Collapse yellow into orange when only Green/Orange/Red are desired. */
export function toTrafficLight(
  color: SeverityColor | null | undefined,
): "green" | "orange" | "red" {
  if (color === "red") return "red";
  if (color === "orange" || color === "yellow") return "orange";
  return "green";
}

export function severityFromStatus(
  status?: string | null,
  flags?: string[] | null,
): "green" | "orange" | "red" {
  const hay = `${status ?? ""} ${(flags ?? []).join(" ")}`.toUpperCase();
  if (/SEVERE|CRITICAL/.test(hay)) return "red";
  if (
    /WASTING|STUNTING|UNDERWEIGHT|OBESITY|OVERWEIGHT|MICROCEPHALY|MACROCEPHALY|SHORT|TALL/.test(
      hay,
    )
  ) {
    return "orange";
  }
  return "green";
}
