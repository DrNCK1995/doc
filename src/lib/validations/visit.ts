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
    weightKg: measurementBounds.weightKg,
    heightCm: measurementBounds.heightCm,
    headCircumferenceCm: measurementBounds.headCircumferenceCm,
    notes: z.string().trim().max(2000).optional().nullable(),
    doctorAdvice: z.string().trim().max(2000).optional().nullable(),
    vaccinationStatus: z.string().trim().max(500).optional().nullable(),
    nextVisitDue: optionalDate,
  })
  .superRefine((data, ctx) => {
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
