import { NextResponse } from "next/server";
import { dispatchDueReminders } from "@/lib/consult/booking";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await dispatchDueReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/appointment-reminders]", err);
    return NextResponse.json({ error: "Reminder run failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
