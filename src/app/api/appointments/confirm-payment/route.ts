import { NextResponse } from "next/server";
import { z } from "zod";
import { confirmPaidViaPaymentLink } from "@/lib/consult/booking";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  confirmationCode: z.string().trim().min(4).max(20),
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

    const result = await confirmPaidViaPaymentLink(parsed.data.confirmationCode);
    return NextResponse.json(result);
  } catch (err) {
    const status =
      err && typeof err === "object" && "status" in err
        ? Number((err as { status: number }).status)
        : 500;
    const message =
      err instanceof Error ? err.message : "Could not confirm payment";
    if (status >= 500) console.error("[appointments/confirm-payment]", err);
    return NextResponse.json({ error: message }, { status });
  }
}
