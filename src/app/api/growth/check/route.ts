import { z } from "zod";
import { NextResponse } from "next/server";
import { calculateAge } from "@/lib/growth/age";
import { buildSnapshotChartPayload } from "@/lib/services/chart-service";
import { computeBmi, runGrowthAssessment } from "@/lib/services/growth";

export const dynamic = "force-dynamic";

const bodySchema = z
  .object({
    name: z.string().trim().max(120).optional(),
    sex: z.enum(["MALE", "FEMALE"]),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    visitDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    weightKg: z.number().positive().max(200).nullable().optional(),
    heightCm: z.number().positive().max(250).nullable().optional(),
    headCircumferenceCm: z.number().positive().max(80).nullable().optional(),
  })
  .refine(
    (v) =>
      (v.weightKg != null && v.weightKg > 0) ||
      (v.heightCm != null && v.heightCm > 0) ||
      (v.headCircumferenceCm != null && v.headCircumferenceCm > 0),
    { message: "Enter at least one of weight, height, or head circumference" },
  );

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const visitDate = data.visitDate ?? new Date().toISOString().slice(0, 10);
    if (data.dateOfBirth > visitDate) {
      return NextResponse.json(
        { error: "Date of birth cannot be after the check date" },
        { status: 400 },
      );
    }

    const age = calculateAge(data.dateOfBirth, visitDate);
    const weightKg = data.weightKg ?? null;
    const heightCm = data.heightCm ?? null;
    const headCm = data.headCircumferenceCm ?? null;
    const bmi = computeBmi(weightKg, heightCm);

    const assessment = await runGrowthAssessment({
      sex: data.sex,
      ageMonths: age.ageMonthsExact,
      weightKg,
      heightCm,
      headCm,
    });

    const charts = await buildSnapshotChartPayload({
      name: data.name,
      sex: data.sex,
      dateOfBirth: data.dateOfBirth,
      visitDate,
      ageMonths: age.totalMonths,
      weightKg,
      heightCm,
      headCm,
      bmi,
      weightForAgeZ: assessment.weightForAge?.z ?? null,
      heightForAgeZ: assessment.heightForAge?.z ?? null,
      bmiForAgeZ: assessment.bmiForAge?.z ?? null,
      weightForHeightZ: assessment.weightForHeight?.z ?? null,
      hcForAgeZ: assessment.headCircumferenceForAge?.z ?? null,
    });

    return NextResponse.json({
      stored: false,
      message: "One-time check only — nothing was saved on the server.",
      age: {
        years: age.years,
        months: age.months,
        days: age.days,
        totalMonths: age.totalMonths,
        ageMonthsExact: age.ageMonthsExact,
      },
      visitDate,
      measures: { weightKg, heightCm, headCm, bmi },
      assessment: {
        reference: assessment.reference,
        classification: assessment.classification,
        expectedWeightKg: assessment.expectedWeightKg,
        expectedHeightCm: assessment.expectedHeightCm,
        weightForAge: assessment.weightForAge,
        heightForAge: assessment.heightForAge,
        bmiForAge: assessment.bmiForAge,
        weightForHeight: assessment.weightForHeight,
        headCircumferenceForAge: assessment.headCircumferenceForAge,
      },
      charts,
    });
  } catch (err) {
    console.error("[growth/check]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not assess growth" },
      { status: 500 },
    );
  }
}
