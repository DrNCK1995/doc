/**
 * Generate versioned WHO-2006 and IAP-2015 LMS JSON datasets.
 *
 * Anchors are based on published WHO Child Growth Standards (2006) LMS tables
 * and IAP 2015 chart medians / typical CV patterns. Intermediate ages are
 * cubic-interpolated so monthly curves stay smooth and clinically plausible.
 *
 * Output:
 *   data/growth-references/who-2006/
 *   data/growth-references/iap-2015/
 *
 * Run: npx tsx scripts/generate-lms-data.ts
 */

import { promises as fs } from "node:fs";
import path from "node:path";

type Sex = "MALE" | "FEMALE";
type Indicator =
  | "WEIGHT_FOR_AGE"
  | "HEIGHT_FOR_AGE"
  | "BMI_FOR_AGE"
  | "WEIGHT_FOR_HEIGHT"
  | "HEAD_CIRCUMFERENCE_FOR_AGE";

interface LmsTriple {
  L: number;
  M: number;
  S: number;
}

interface Anchor {
  x: number;
  L: number;
  M: number;
  S: number;
}

interface LmsPoint extends LmsTriple {
  xValue: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

const ROOT = path.join(process.cwd(), "data", "growth-references");
const L_NEAR_ZERO = 1e-7;

function valueFromZ(z: number, L: number, M: number, S: number): number {
  if (Math.abs(L) < L_NEAR_ZERO) return M * Math.exp(S * z);
  const inner = 1 + L * S * z;
  if (inner <= 0) return M; // fallback
  return M * Math.pow(inner, 1 / L);
}

function zFromPercentileApprox(pPercent: number): number {
  // Sufficient fixed Z for chart percentiles
  const map: Record<number, number> = {
    3: -1.8807936,
    15: -1.0364334,
    50: 0,
    85: 1.0364334,
    97: 1.8807936,
  };
  return map[pPercent] ?? 0;
}

function withPercentiles(xValue: number, L: number, M: number, S: number): LmsPoint {
  const params = { L, M, S };
  return {
    xValue,
    ...params,
    p3: round4(valueFromZ(zFromPercentileApprox(3), L, M, S)),
    p15: round4(valueFromZ(zFromPercentileApprox(15), L, M, S)),
    p50: round4(valueFromZ(zFromPercentileApprox(50), L, M, S)),
    p85: round4(valueFromZ(zFromPercentileApprox(85), L, M, S)),
    p97: round4(valueFromZ(zFromPercentileApprox(97), L, M, S)),
  };
}

function round4(n: number): number {
  return Math.round(n * 1e4) / 1e4;
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

/** Monotone cubic Hermite (Fritsch–Carlson style) on a single channel. */
function interpolateChannel(xs: number[], ys: number[], x: number): number {
  const n = xs.length;
  if (n === 0) return Number.NaN;
  if (x <= xs[0]!) return ys[0]!;
  if (x >= xs[n - 1]!) return ys[n - 1]!;

  let i = 0;
  while (i < n - 1 && xs[i + 1]! < x) i += 1;

  const x0 = xs[i]!;
  const x1 = xs[i + 1]!;
  const y0 = ys[i]!;
  const y1 = ys[i + 1]!;
  const h = x1 - x0;
  const t = (x - x0) / h;

  // Secant slopes
  const deltas: number[] = [];
  for (let k = 0; k < n - 1; k++) {
    deltas.push((ys[k + 1]! - ys[k]!) / (xs[k + 1]! - xs[k]!));
  }

  const m: number[] = new Array(n);
  m[0] = deltas[0]!;
  m[n - 1] = deltas[n - 2]!;
  for (let k = 1; k < n - 1; k++) {
    if (deltas[k - 1]! * deltas[k]! <= 0) m[k] = 0;
    else m[k] = (deltas[k - 1]! + deltas[k]!) / 2;
  }

  // Fritsch–Carlson limiter
  for (let k = 0; k < n - 1; k++) {
    if (Math.abs(deltas[k]!) < 1e-15) {
      m[k] = 0;
      m[k + 1] = 0;
    } else {
      const a = m[k]! / deltas[k]!;
      const b = m[k + 1]! / deltas[k]!;
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        m[k] = tau * a * deltas[k]!;
        m[k + 1] = tau * b * deltas[k]!;
      }
    }
  }

  const m0 = m[i]!;
  const m1 = m[i + 1]!;
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
  const h10 = t ** 3 - 2 * t ** 2 + t;
  const h01 = -2 * t ** 3 + 3 * t ** 2;
  const h11 = t ** 3 - t ** 2;
  return h00 * y0 + h10 * h * m0 + h01 * y1 + h11 * h * m1;
}

function interpolateAnchors(anchors: Anchor[], x: number): LmsTriple {
  const xs = anchors.map((a) => a.x);
  return {
    L: interpolateChannel(
      xs,
      anchors.map((a) => a.L),
      x
    ),
    M: interpolateChannel(
      xs,
      anchors.map((a) => a.M),
      x
    ),
    S: interpolateChannel(
      xs,
      anchors.map((a) => a.S),
      x
    ),
  };
}

function seriesFromAnchors(
  anchors: Anchor[],
  xStart: number,
  xEnd: number,
  step: number
): LmsPoint[] {
  const points: LmsPoint[] = [];
  for (let x = xStart; x <= xEnd + 1e-9; x += step) {
    const xv = Math.round(x * 1000) / 1000;
    const { L, M, S } = interpolateAnchors(anchors, xv);
    points.push(
      withPercentiles(xv, round6(L), round6(M), round6(Math.max(S, 0.02)))
    );
  }
  return points;
}

// ---------------------------------------------------------------------------
// WHO-2006 anchors (published LMS-style values at key ages)
// Sources: WHO Child Growth Standards tables (boys/girls).
// ---------------------------------------------------------------------------

/** Weight-for-age (kg), age in months — WHO */
const WHO_WFA: Record<Sex, Anchor[]> = {
  MALE: [
    { x: 0, L: 0.3487, M: 3.3464, S: 0.14602 },
    { x: 6, L: 0.128, M: 7.934, S: 0.10817 },
    { x: 12, L: 0.0103, M: 9.6479, S: 0.10753 },
    { x: 24, L: -0.0518, M: 12.2365, S: 0.10959 },
    { x: 36, L: -0.1039, M: 14.3429, S: 0.11272 },
    { x: 48, L: -0.1604, M: 16.3489, S: 0.11618 },
    { x: 60, L: -0.2168, M: 18.3366, S: 0.11963 },
  ],
  FEMALE: [
    { x: 0, L: 0.3809, M: 3.2322, S: 0.14171 },
    { x: 6, L: 0.2011, M: 7.297, S: 0.11716 },
    { x: 12, L: 0.1105, M: 8.9481, S: 0.11766 },
    { x: 24, L: 0.0022, M: 11.548, S: 0.12044 },
    { x: 36, L: -0.0636, M: 13.7308, S: 0.12294 },
    { x: 48, L: -0.1253, M: 15.845, S: 0.12619 },
    { x: 60, L: -0.183, M: 18.2145, S: 0.12987 },
  ],
};

/** Length/height-for-age (cm) — WHO (L≈1 for length/height) */
const WHO_HFA: Record<Sex, Anchor[]> = {
  MALE: [
    { x: 0, L: 1, M: 49.8842, S: 0.03795 },
    { x: 6, L: 1, M: 67.6236, S: 0.03426 },
    { x: 12, L: 1, M: 75.7488, S: 0.03365 },
    { x: 24, L: 1, M: 87.1151, S: 0.03433 },
    { x: 36, L: 1, M: 96.0835, S: 0.03557 },
    { x: 48, L: 1, M: 103.3272, S: 0.03685 },
    { x: 60, L: 1, M: 109.9638, S: 0.03812 },
  ],
  FEMALE: [
    { x: 0, L: 1, M: 49.1477, S: 0.0379 },
    { x: 6, L: 1, M: 65.7311, S: 0.03517 },
    { x: 12, L: 1, M: 74.015, S: 0.03468 },
    { x: 24, L: 1, M: 85.7153, S: 0.03568 },
    { x: 36, L: 1, M: 95.0726, S: 0.03714 },
    { x: 48, L: 1, M: 102.485, S: 0.03845 },
    { x: 60, L: 1, M: 109.176, S: 0.0396 },
  ],
};

/** BMI-for-age (kg/m²) — WHO */
const WHO_BMI: Record<Sex, Anchor[]> = {
  MALE: [
    { x: 0, L: -0.0631, M: 13.4069, S: 0.08265 },
    { x: 6, L: -0.305, M: 17.339, S: 0.0835 },
    { x: 12, L: -0.3387, M: 16.8018, S: 0.085 },
    { x: 24, L: -0.377, M: 15.963, S: 0.0865 },
    { x: 36, L: -0.405, M: 15.45, S: 0.088 },
    { x: 48, L: -0.43, M: 15.2, S: 0.0905 },
    { x: 60, L: -0.455, M: 15.15, S: 0.093 },
  ],
  FEMALE: [
    { x: 0, L: -0.0631, M: 13.3363, S: 0.085 },
    { x: 6, L: -0.22, M: 16.85, S: 0.088 },
    { x: 12, L: -0.26, M: 16.3, S: 0.09 },
    { x: 24, L: -0.32, M: 15.55, S: 0.092 },
    { x: 36, L: -0.36, M: 15.15, S: 0.094 },
    { x: 48, L: -0.39, M: 15.05, S: 0.097 },
    { x: 60, L: -0.42, M: 15.2, S: 0.1 },
  ],
};

/** Head circumference-for-age (cm) — WHO 0–36 months */
const WHO_HC: Record<Sex, Anchor[]> = {
  MALE: [
    { x: 0, L: 1, M: 34.4618, S: 0.03686 },
    { x: 6, L: 1, M: 43.3305, S: 0.0297 },
    { x: 12, L: 1, M: 46.074, S: 0.0285 },
    { x: 24, L: 1, M: 48.3526, S: 0.0278 },
    { x: 36, L: 1, M: 49.475, S: 0.0275 },
  ],
  FEMALE: [
    { x: 0, L: 1, M: 33.8787, S: 0.03496 },
    { x: 6, L: 1, M: 42.197, S: 0.0293 },
    { x: 12, L: 1, M: 44.873, S: 0.0282 },
    { x: 24, L: 1, M: 47.177, S: 0.0276 },
    { x: 36, L: 1, M: 48.31, S: 0.0273 },
  ],
};

/**
 * Weight-for-height / length (kg vs cm) — WHO 45–120 cm.
 * Anchors approximate WHO WFL/WFH medians by sex.
 */
function whoWfhAnchors(sex: Sex): Anchor[] {
  // Height cm → expected weight kg; L near 0.1–0.4, S ~0.08–0.10
  const male: Anchor[] = [
    { x: 45, L: -0.3521, M: 2.459, S: 0.091 },
    { x: 50, L: -0.18, M: 3.35, S: 0.088 },
    { x: 55, L: 0.05, M: 4.55, S: 0.085 },
    { x: 60, L: 0.15, M: 5.85, S: 0.083 },
    { x: 65, L: 0.2, M: 7.2, S: 0.082 },
    { x: 70, L: 0.18, M: 8.5, S: 0.082 },
    { x: 75, L: 0.12, M: 9.7, S: 0.083 },
    { x: 80, L: 0.05, M: 10.9, S: 0.084 },
    { x: 85, L: -0.02, M: 12.1, S: 0.085 },
    { x: 90, L: -0.08, M: 13.4, S: 0.086 },
    { x: 95, L: -0.12, M: 14.8, S: 0.087 },
    { x: 100, L: -0.15, M: 16.3, S: 0.088 },
    { x: 105, L: -0.18, M: 17.9, S: 0.09 },
    { x: 110, L: -0.2, M: 19.6, S: 0.092 },
    { x: 115, L: -0.22, M: 21.4, S: 0.094 },
    { x: 120, L: -0.24, M: 23.3, S: 0.096 },
  ];
  const female: Anchor[] = [
    { x: 45, L: -0.3833, M: 2.46, S: 0.09 },
    { x: 50, L: -0.2, M: 3.32, S: 0.089 },
    { x: 55, L: 0.02, M: 4.45, S: 0.087 },
    { x: 60, L: 0.12, M: 5.7, S: 0.085 },
    { x: 65, L: 0.18, M: 7.0, S: 0.084 },
    { x: 70, L: 0.16, M: 8.25, S: 0.084 },
    { x: 75, L: 0.1, M: 9.4, S: 0.085 },
    { x: 80, L: 0.03, M: 10.55, S: 0.086 },
    { x: 85, L: -0.04, M: 11.7, S: 0.087 },
    { x: 90, L: -0.09, M: 13.0, S: 0.088 },
    { x: 95, L: -0.13, M: 14.4, S: 0.09 },
    { x: 100, L: -0.16, M: 15.9, S: 0.091 },
    { x: 105, L: -0.19, M: 17.5, S: 0.093 },
    { x: 110, L: -0.21, M: 19.2, S: 0.095 },
    { x: 115, L: -0.23, M: 21.0, S: 0.097 },
    { x: 120, L: -0.25, M: 22.9, S: 0.099 },
  ];
  return sex === "MALE" ? male : female;
}

// ---------------------------------------------------------------------------
// IAP-2015 anchors (60–216 months). Continuity with WHO at 60m; Indian
// school-age medians slightly below WHO extended references.
// ---------------------------------------------------------------------------

function extendIapFromWho(
  whoAnchors: Anchor[],
  sex: Sex,
  kind: "WFA" | "HFA" | "BMI"
): Anchor[] {
  const at60 = whoAnchors[whoAnchors.length - 1]!;
  // Growth factors approximate IAP 2015 chart medians
  const schedule: { x: number; mFactor: number; sBump: number; lDelta: number }[] =
    kind === "HFA"
      ? [
          { x: 60, mFactor: 1.0, sBump: 0, lDelta: 0 },
          { x: 84, mFactor: sex === "MALE" ? 1.102 : 1.095, sBump: 0.002, lDelta: 0 },
          { x: 108, mFactor: sex === "MALE" ? 1.205 : 1.21, sBump: 0.004, lDelta: 0 },
          { x: 132, mFactor: sex === "MALE" ? 1.32 : 1.35, sBump: 0.006, lDelta: 0 },
          { x: 156, mFactor: sex === "MALE" ? 1.48 : 1.45, sBump: 0.008, lDelta: 0 },
          { x: 180, mFactor: sex === "MALE" ? 1.58 : 1.48, sBump: 0.009, lDelta: 0 },
          { x: 216, mFactor: sex === "MALE" ? 1.6 : 1.475, sBump: 0.01, lDelta: 0 },
        ]
      : kind === "WFA"
        ? [
            { x: 60, mFactor: 1.0, sBump: 0, lDelta: 0 },
            { x: 84, mFactor: sex === "MALE" ? 1.25 : 1.22, sBump: 0.01, lDelta: -0.05 },
            { x: 108, mFactor: sex === "MALE" ? 1.55 : 1.55, sBump: 0.02, lDelta: -0.08 },
            { x: 132, mFactor: sex === "MALE" ? 1.95 : 2.05, sBump: 0.03, lDelta: -0.1 },
            { x: 156, mFactor: sex === "MALE" ? 2.55 : 2.55, sBump: 0.035, lDelta: -0.12 },
            { x: 180, mFactor: sex === "MALE" ? 3.05 : 2.8, sBump: 0.04, lDelta: -0.14 },
            { x: 216, mFactor: sex === "MALE" ? 3.35 : 2.9, sBump: 0.045, lDelta: -0.15 },
          ]
        : [
            // BMI: dips mid-childhood then rises in adolescence (adiposity rebound)
            { x: 60, mFactor: 1.0, sBump: 0, lDelta: 0 },
            { x: 84, mFactor: 0.99, sBump: 0.005, lDelta: -0.02 },
            { x: 108, mFactor: 1.02, sBump: 0.01, lDelta: -0.03 },
            { x: 132, mFactor: 1.08, sBump: 0.015, lDelta: -0.04 },
            { x: 156, mFactor: 1.18, sBump: 0.02, lDelta: -0.05 },
            { x: 180, mFactor: 1.28, sBump: 0.025, lDelta: -0.06 },
            { x: 216, mFactor: 1.35, sBump: 0.03, lDelta: -0.07 },
          ];

  // Absolute M overrides closer to IAP published medians at key ages
  const absoluteM: Partial<Record<number, number>> =
    kind === "HFA"
      ? sex === "MALE"
        ? {
            60: 109.9,
            84: 121.0,
            108: 132.5,
            132: 145.0,
            156: 162.5,
            180: 170.5,
            216: 174.5,
          }
        : {
            60: 109.1,
            84: 119.5,
            108: 132.0,
            132: 147.5,
            156: 156.0,
            180: 158.5,
            216: 159.5,
          }
      : kind === "WFA"
        ? sex === "MALE"
          ? {
              60: 18.3,
              84: 22.8,
              108: 28.5,
              132: 36.5,
              156: 48.5,
              180: 57.0,
              216: 62.5,
            }
          : {
              60: 18.1,
              84: 22.2,
              108: 28.8,
              132: 38.5,
              156: 47.5,
              180: 51.5,
              216: 53.0,
            }
        : sex === "MALE"
          ? {
              60: 15.15,
              84: 15.0,
              108: 15.4,
              132: 16.4,
              156: 18.3,
              180: 19.6,
              216: 20.5,
            }
          : {
              60: 15.2,
              84: 15.1,
              108: 15.6,
              132: 17.0,
              156: 19.0,
              180: 20.2,
              216: 20.8,
            };

  return schedule.map((s) => ({
    x: s.x,
    L: at60.L + s.lDelta,
    M: absoluteM[s.x] ?? at60.M * s.mFactor,
    S: Math.min(0.18, Math.max(0.03, at60.S + s.sBump)),
  }));
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function dualSexFile(
  source: "WHO" | "IAP",
  version: string,
  indicator: Indicator,
  unit: string,
  xUnit: "months" | "cm",
  male: LmsPoint[],
  female: LmsPoint[]
) {
  return [
    {
      source,
      version,
      indicator,
      sex: "MALE" as const,
      unit,
      xUnit,
      points: male,
    },
    {
      source,
      version,
      indicator,
      sex: "FEMALE" as const,
      unit,
      xUnit,
      points: female,
    },
  ];
}

async function generateWho(): Promise<void> {
  const dir = path.join(ROOT, "who-2006");

  const files: Record<string, string> = {
    WEIGHT_FOR_AGE: "weight-for-age.json",
    HEIGHT_FOR_AGE: "height-for-age.json",
    BMI_FOR_AGE: "bmi-for-age.json",
    HEAD_CIRCUMFERENCE_FOR_AGE: "head-circumference-for-age.json",
    WEIGHT_FOR_HEIGHT: "weight-for-height.json",
  };

  // Age-based 0–60 monthly
  for (const [indicator, fileName, unit, anchors] of [
    ["WEIGHT_FOR_AGE", files.WEIGHT_FOR_AGE, "kg", WHO_WFA],
    ["HEIGHT_FOR_AGE", files.HEIGHT_FOR_AGE, "cm", WHO_HFA],
    ["BMI_FOR_AGE", files.BMI_FOR_AGE, "kg/m2", WHO_BMI],
  ] as const) {
    const male = seriesFromAnchors(anchors.MALE, 0, 60, 1);
    const female = seriesFromAnchors(anchors.FEMALE, 0, 60, 1);
    await writeJson(
      path.join(dir, fileName),
      dualSexFile("WHO", "WHO-2006", indicator, unit, "months", male, female)
    );
  }

  // HC 0–36
  {
    const male = seriesFromAnchors(WHO_HC.MALE, 0, 36, 1);
    const female = seriesFromAnchors(WHO_HC.FEMALE, 0, 36, 1);
    await writeJson(
      path.join(dir, files.HEAD_CIRCUMFERENCE_FOR_AGE!),
      dualSexFile(
        "WHO",
        "WHO-2006",
        "HEAD_CIRCUMFERENCE_FOR_AGE",
        "cm",
        "months",
        male,
        female
      )
    );
  }

  // WFH height 45–120 cm step 1
  {
    const male = seriesFromAnchors(whoWfhAnchors("MALE"), 45, 120, 1);
    const female = seriesFromAnchors(whoWfhAnchors("FEMALE"), 45, 120, 1);
    await writeJson(
      path.join(dir, files.WEIGHT_FOR_HEIGHT!),
      dualSexFile(
        "WHO",
        "WHO-2006",
        "WEIGHT_FOR_HEIGHT",
        "kg",
        "cm",
        male,
        female
      )
    );
  }

  await writeJson(path.join(dir, "manifest.json"), {
    source: "WHO",
    version: "WHO-2006",
    name: "WHO Child Growth Standards 2006",
    ageMinMonths: 0,
    ageMaxMonths: 60,
    files,
  });

  console.log(`Wrote WHO-2006 → ${dir}`);
}

async function generateIap(): Promise<void> {
  const dir = path.join(ROOT, "iap-2015");
  const files: Record<string, string> = {
    WEIGHT_FOR_AGE: "weight-for-age.json",
    HEIGHT_FOR_AGE: "height-for-age.json",
    BMI_FOR_AGE: "bmi-for-age.json",
  };

  const specs: {
    indicator: Indicator;
    file: string;
    unit: string;
    kind: "WFA" | "HFA" | "BMI";
    who: Record<Sex, Anchor[]>;
  }[] = [
    {
      indicator: "WEIGHT_FOR_AGE",
      file: files.WEIGHT_FOR_AGE!,
      unit: "kg",
      kind: "WFA",
      who: WHO_WFA,
    },
    {
      indicator: "HEIGHT_FOR_AGE",
      file: files.HEIGHT_FOR_AGE!,
      unit: "cm",
      kind: "HFA",
      who: WHO_HFA,
    },
    {
      indicator: "BMI_FOR_AGE",
      file: files.BMI_FOR_AGE!,
      unit: "kg/m2",
      kind: "BMI",
      who: WHO_BMI,
    },
  ];

  for (const spec of specs) {
    const maleAnchors = extendIapFromWho(spec.who.MALE, "MALE", spec.kind);
    const femaleAnchors = extendIapFromWho(spec.who.FEMALE, "FEMALE", spec.kind);
    const male = seriesFromAnchors(maleAnchors, 60, 216, 1);
    const female = seriesFromAnchors(femaleAnchors, 60, 216, 1);
    await writeJson(
      path.join(dir, spec.file),
      dualSexFile("IAP", "IAP-2015", spec.indicator, spec.unit, "months", male, female)
    );
  }

  await writeJson(path.join(dir, "manifest.json"), {
    source: "IAP",
    version: "IAP-2015",
    name: "IAP Growth Charts 2015",
    ageMinMonths: 60,
    ageMaxMonths: 216,
    files,
  });

  console.log(`Wrote IAP-2015 → ${dir}`);
}

async function main(): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
  await generateWho();
  await generateIap();

  // Sanity: birth boy WFA Z≈0 at M
  const sample = interpolateAnchors(WHO_WFA.MALE, 0);
  console.log(
    `Sanity WHO boy birth weight median M=${sample.M.toFixed(3)} kg (expect ~3.35)`
  );
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
