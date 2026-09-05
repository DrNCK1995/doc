import { z } from "zod";
import {
  assertPlausibleMeasurements,
  measurementBounds,
} from "@/lib/validations/patient";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const visitDateSchema = z
  .string()
  .or(z.date())
  .transform((v) => (v instanceof Date ? v : new Date(v)))
  .refine((d) => !Number.isNaN(d.getTime()), { message: "Invalid visit date" })
  .refine((d) => d <= todayStart(), {
    message: "Visit date cannot be in the future",
  });

const optionalDate = z
  .string()
  .or(z.date())
  .optional()
  .nullable()
  .transform((v) => {
    if (v == null || v === "") return null;
    return v instanceof Date ? v : new Date(v);
  })
  .refine((d) => d == null || !Number.isNaN(d.getTime()), {
    message: "Invalid date",
  });

export const addVisitSchema = z
  .object({
    visitDate: visitDateSchema,
    weightKg: measurementBounds.optionalWeightKg,
    heightCm: measurementBounds.optionalHeightCm,
    headCircumferenceCm: measurementBounds.headCircumferenceCm,
    notes: z.string().trim().max(2000).optional().nullable(),
    doctorAdvice: z.string().trim().max(2000).optional().nullable(),
    vaccinationStatus: z.string().trim().max(500).optional().nullable(),
    nextVisitDue: optionalDate,
  })
  .superRefine((data, ctx) => {
    const hasMeasure =
      data.weightKg != null ||
      data.heightCm != null ||
      data.headCircumferenceCm != null ||
      Boolean(data.notes?.trim()) ||
      Boolean(data.doctorAdvice?.trim()) ||
      Boolean(data.vaccinationStatus?.trim()) ||
      data.nextVisitDue != null;

    if (!hasMeasure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter at least one measurement or note for this visit",
        path: ["weightKg"],
      });
    }

    const check = assertPlausibleMeasurements({
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      headCircumferenceCm: data.headCircumferenceCm,
    });
    if (!check.ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: check.message,
        path: ["weightKg"],
      });
    }
  });

export type AddVisitInput = z.infer<typeof addVisitSchema>;
