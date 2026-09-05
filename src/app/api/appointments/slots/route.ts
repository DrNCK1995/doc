import { NextResponse } from "next/server";
import { listAvailableSlots } from "@/lib/consult/booking";
import {
  CONSULT_FEE_FOLLOWER_INR,
  CONSULT_FEE_NON_FOLLOWER_INR,
  CONSULT_PAYMENT_LINK,
} from "@/lib/consult/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const days = await listAvailableSlots();
    return NextResponse.json({
      feeFollowerInr: CONSULT_FEE_FOLLOWER_INR,
      feeNonFollowerInr: CONSULT_FEE_NON_FOLLOWER_INR,
      paymentUrl: CONSULT_PAYMENT_LINK,
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
