import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "@/lib/consult/booking";
import { VISIT_TYPE_KEYS } from "@/lib/consult/config";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  visitType: z.enum(VISIT_TYPE_KEYS as [string, ...string[]]),
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotStart: z.string().regex(/^\d{2}:\d{2}$/),
  parentName: z.string().trim().min(2).max(120),
  parentEmail: z.string().trim().email().max(160),
  parentMobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  childName: z.string().trim().min(1).max(120),
  childAgeNote: z.string().trim().max(80).optional(),
  reason: z.string().trim().max(500).optional(),
});

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

    const result = await createBooking({
      ...parsed.data,
      visitType: parsed.data.visitType as Parameters<
        typeof createBooking
      >[0]["visitType"],
    });
    return NextResponse.json(result);
  } catch (err) {
    const status =
      err && typeof err === "object" && "status" in err
        ? Number((err as { status: number }).status)
        : 500;
    const message = err instanceof Error ? err.message : "Booking failed";
    if (status >= 500) console.error("[appointments]", err);
    return NextResponse.json({ error: message }, { status });
  }
}
