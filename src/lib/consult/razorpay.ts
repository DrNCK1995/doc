import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { CONSULT_FEE_PAISE } from "@/lib/consult/config";

export function razorpayConfigured(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID?.trim() &&
      process.env.RAZORPAY_KEY_SECRET?.trim() &&
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim(),
  );
}

export function getRazorpayPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || null;
}

function getClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are not configured");
  }
  return new Razorpay({ key_id, key_secret });
}

export async function createConsultOrder(params: {
  receipt: string;
  amountPaise?: number;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const client = getClient();
  const order = await client.orders.create({
    amount: params.amountPaise ?? CONSULT_FEE_PAISE,
    currency: "INR",
    receipt: params.receipt.slice(0, 40),
    notes: params.notes,
  });
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) return false;
  const body = `${params.orderId}|${params.paymentId}`;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(params.signature, "utf8"),
    );
  } catch {
    return false;
  }
}
