import { z } from "zod";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const dateNotFuture = z
  .string()
  .or(z.date())
  .transform((v) => (v instanceof Date ? v : new Date(v)))
  .refine((d) => !Number.isNaN(d.getTime()), { message: "Invalid date" })
  .refine((d) => d <= todayStart(), {
    message: "Date of birth cannot be in the future",
  });

const indianMobile = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit Indian number");

const optionalEmail = z
  .preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.string().trim().email("Invalid email").optional(),
  );

const optionalPositiveNumber = (opts: {
  min: number;
  max: number;
  label: string;
}) =>
  z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) return null;
      if (typeof v === "string" && v.trim() === "") return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : v;
    },
    z
      .number()
      .min(opts.min, `${opts.label} must be at least ${opts.min}`)
      .max(opts.max, `${opts.label} must be at most ${opts.max}`)
      .nullable()
      .optional(),
  );

/** Shared anthropometric bounds used at registration and visits. */
export const measurementBounds = {
  /** Required at registration; optional on follow-up visits. */
  weightKg: z
    .number({ invalid_type_error: "Weight is required" })
    .min(0.5, "Weight must be at least 0.5 kg")
    .max(200, "Weight must be at most 200 kg"),
  heightCm: z
    .number({ invalid_type_error: "Height is required" })
    .min(20, "Height must be at least 20 cm")
    .max(250, "Height must be at most 250 cm"),
  /** Optional at follow-up — fill only what you measured. */
  optionalWeightKg: optionalPositiveNumber({
    min: 0.5,
    max: 200,
    label: "Weight",
  }),
  optionalHeightCm: optionalPositiveNumber({
    min: 20,
    max: 250,
    label: "Height",
  }),
  headCircumferenceCm: optionalPositiveNumber({
    min: 20,
    max: 70,
    label: "Head circumference",
  }),
  birthWeightKg: z
    .number()
    .min(0.5, "Birth weight must be at least 0.5 kg")
    .max(8, "Birth weight must be at most 8 kg")
    .optional()
    .nullable(),
};

function assertPlausibleMeasurements(data: {
  weightKg?: number | null;
  heightCm?: number | null;
  headCircumferenceCm?: number | null;
  birthWeightKg?: number | null;
  dateOfBirth?: Date;
}) {
  const weight = data.weightKg ?? null;
  const height = data.heightCm ?? null;

  if (weight != null && height != null) {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    if (bmi < 5 || bmi > 60) {
      return {
        ok: false as const,
        message:
          "Weight and height combination yields an impossible BMI (outside 5–60)",
      };
    }
  }

  if (
    data.headCircumferenceCm != null &&
    height != null &&
    data.headCircumferenceCm > height
  ) {
    return {
      ok: false as const,
      message: "Head circumference cannot exceed height",
    };
  }

  if (
    data.birthWeightKg != null &&
    weight != null &&
    weight + 0.001 < data.birthWeightKg &&
    data.dateOfBirth
  ) {
    const ageDays =
      (Date.now() - data.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 14) {
      return {
        ok: false as const,
        message: "Current weight cannot be less than birth weight after 2 weeks",
      };
    }
  }

  return { ok: true as const };
}

export const createPatientSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    dateOfBirth: dateNotFuture,
    sex: z.enum(["MALE", "FEMALE"]),
    birthWeightKg: measurementBounds.birthWeightKg,
    weightKg: measurementBounds.weightKg,
    heightCm: measurementBounds.heightCm,
    headCircumferenceCm: measurementBounds.headCircumferenceCm,
    mobileNumber: indianMobile,
    parentName: z.string().trim().min(1, "Parent name is required").max(120),
    email: optionalEmail,
    address: z.string().trim().max(500).optional().nullable(),
    notes: z.string().trim().max(2000).optional().nullable(),
    doctorAdvice: z.string().trim().max(2000).optional().nullable(),
    vaccinationStatus: z.string().trim().max(500).optional().nullable(),
    nextVisitDue: z
      .string()
      .or(z.date())
      .optional()
      .nullable()
      .transform((v) => {
        if (v == null || v === "") return null;
        return v instanceof Date ? v : new Date(v);
      })
      .refine((d) => d == null || !Number.isNaN(d.getTime()), {
        message: "Invalid next visit date",
      }),
  })
  .superRefine((data, ctx) => {
    const check = assertPlausibleMeasurements(data);
    if (!check.ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: check.message,
        path: ["weightKg"],
      });
    }
  });

export const updatePatientSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    dateOfBirth: dateNotFuture.optional(),
    sex: z.enum(["MALE", "FEMALE"]).optional(),
    birthWeightKg: measurementBounds.birthWeightKg,
    mobileNumber: indianMobile.optional(),
    parentName: z.string().trim().min(1).max(120).optional(),
    email: optionalEmail,
    address: z.string().trim().max(500).optional().nullable(),
    photoUrl: z.string().url().optional().nullable(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.birthWeightKg != null &&
      (data.birthWeightKg < 0.5 || data.birthWeightKg > 8)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Birth weight must be between 0.5 and 8 kg",
        path: ["birthWeightKg"],
      });
    }
  });

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

export { assertPlausibleMeasurements };
