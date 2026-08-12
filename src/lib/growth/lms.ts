import type { LmsParams, LmsPoint } from "./types";

const L_NEAR_ZERO = 1e-7;
export const Z_CLAMP = 3;

/**
 * Official LMS (Box-Cox) Z-score.
 * If L ≈ 0:  ln(x/M) / S
 * Else:      (((x/M)^L) - 1) / (L * S)
 */
export function zScore(x: number, L: number, M: number, S: number): number {
  if (!(x > 0) || !(M > 0) || !(S > 0) || !Number.isFinite(L)) {
    return Number.NaN;
  }

  if (Math.abs(L) < L_NEAR_ZERO) {
    return Math.log(x / M) / S;
  }

  return (Math.pow(x / M, L) - 1) / (L * S);
}

export function zScoreFromParams(x: number, params: LmsParams): number {
  return zScore(x, params.L, params.M, params.S);
}

/** Clamp Z to ±3 for classification display; raw Z is kept separately by callers. */
export function clampZ(z: number, limit: number = Z_CLAMP): number {
  if (!Number.isFinite(z)) return z;
  return Math.max(-limit, Math.min(limit, z));
}

/** Standard normal PDF φ(z). */
export function normalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

/**
 * Abramowitz & Stegun 26.2.17 approximation of the standard normal CDF Φ(z).
 * Absolute error typically < 7.5e-8.
 */
export function normalCdf(z: number): number {
  if (!Number.isFinite(z)) return Number.NaN;
  if (z > 8) return 1;
  if (z < -8) return 0;

  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.3989423 * Math.exp((-absZ * absZ) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  const cdf = sign === 1 ? 1 - p : p;
  return Math.min(1, Math.max(0, cdf));
}

/** Percentile (0–100) from Z via normal CDF. */
export function percentileFromZ(z: number): number {
  if (!Number.isFinite(z)) return Number.NaN;
  return normalCdf(z) * 100;
}

/**
 * Inverse LMS: measurement for a given Z.
 * x = M * (1 + L*S*Z)^(1/L)   when L ≠ 0
 * x = M * exp(S*Z)             when L ≈ 0
 */
export function valueFromZ(z: number, L: number, M: number, S: number): number {
  if (!Number.isFinite(z) || !(M > 0) || !(S > 0) || !Number.isFinite(L)) {
    return Number.NaN;
  }

  if (Math.abs(L) < L_NEAR_ZERO) {
    return M * Math.exp(S * z);
  }

  const inner = 1 + L * S * z;
  if (inner <= 0) {
    // Outside the support of the Box-Cox transform
    return Number.NaN;
  }
  return M * Math.pow(inner, 1 / L);
}

export function valueFromZParams(z: number, params: LmsParams): number {
  return valueFromZ(z, params.L, params.M, params.S);
}

/**
 * Approximate inverse normal CDF (Acklam / Beasley-Springer style rational approx).
 * Sufficient for chart percentile → Z conversion.
 */
export function zFromPercentile(percentile: number): number {
  if (!Number.isFinite(percentile)) return Number.NaN;
  const p = percentile / 100;
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  // Coefficients for Acklam's approximation
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577459334652e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];

  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  q = p - 0.5;
  const r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

/** Measurement corresponding to a percentile under LMS. */
export function valueFromPercentile(
  percentile: number,
  L: number,
  M: number,
  S: number
): number {
  return valueFromZ(zFromPercentile(percentile), L, M, S);
}

export function valueFromPercentileParams(
  percentile: number,
  params: LmsParams
): number {
  return valueFromPercentile(percentile, params.L, params.M, params.S);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linearly interpolate LMS between two adjacent reference points by xValue
 * (age months or height cm). Points must be sorted ascending by xValue.
 */
export function interpolateLms(
  points: readonly LmsPoint[],
  xValue: number
): LmsParams | null {
  if (!points.length || !Number.isFinite(xValue)) return null;

  if (points.length === 1) {
    const p = points[0]!;
    return { L: p.L, M: p.M, S: p.S };
  }

  // Exact hit
  for (const p of points) {
    if (Math.abs(p.xValue - xValue) < 1e-9) {
      return { L: p.L, M: p.M, S: p.S };
    }
  }

  // Below / above range → clamp to nearest endpoint (WHO practice for edge ages)
  if (xValue <= points[0]!.xValue) {
    const p = points[0]!;
    return { L: p.L, M: p.M, S: p.S };
  }
  const last = points[points.length - 1]!;
  if (xValue >= last.xValue) {
    return { L: last.L, M: last.M, S: last.S };
  }

  // Binary search for bracket
  let lo = 0;
  let hi = points.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid]!.xValue <= xValue) lo = mid;
    else hi = mid;
  }

  const a = points[lo]!;
  const b = points[hi]!;
  const span = b.xValue - a.xValue;
  const t = span === 0 ? 0 : (xValue - a.xValue) / span;

  return {
    L: lerp(a.L, b.L, t),
    M: lerp(a.M, b.M, t),
    S: lerp(a.S, b.S, t),
  };
}

/** Convenience: Z + percentile + clamp metadata for a measurement. */
export function computeZScoreResult(
  x: number,
  params: LmsParams
): { z: number; zClamped: number; percentile: number; isExtreme: boolean } {
  const z = zScoreFromParams(x, params);
  const zClamped = clampZ(z);
  return {
    z,
    zClamped,
    percentile: percentileFromZ(z),
    isExtreme: Number.isFinite(z) && Math.abs(z) > Z_CLAMP,
  };
}

/** Standard chart percentile set derived from LMS. */
export function derivedPercentiles(params: LmsParams): {
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
} {
  return {
    p3: valueFromPercentileParams(3, params),
    p15: valueFromPercentileParams(15, params),
    p50: valueFromPercentileParams(50, params),
    p85: valueFromPercentileParams(85, params),
    p97: valueFromPercentileParams(97, params),
  };
}
