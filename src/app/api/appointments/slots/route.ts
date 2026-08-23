import { NextResponse } from "next/server";
import { listAvailableSlots } from "@/lib/consult/booking";
import { CONSULT_FEE_INR } from "@/lib/consult/config";
import { razorpayConfigured } from "@/lib/consult/razorpay";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const days = await listAvailableSlots();
    return NextResponse.json({
      feeInr: CONSULT_FEE_INR,
      razorpayReady: razorpayConfigured(),
      days,
    });
  } catch (err) {
    console.error("[appointments/slots]", err);
    return NextResponse.json(
      { error: "Could not load slots" },
      { status: 500 },
    );
  }
}
