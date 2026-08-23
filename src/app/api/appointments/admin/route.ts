import { NextResponse } from "next/server";
import { listAppointmentsForDoctor } from "@/lib/consult/booking";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.APPOINTMENTS_ADMIN_SECRET?.trim();
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret")?.trim();
  const url = new URL(req.url);
  const q = url.searchParams.get("key")?.trim();
  return header === secret || q === secret;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const appointments = await listAppointmentsForDoctor();
    return NextResponse.json({ appointments });
  } catch (err) {
    console.error("[appointments/admin]", err);
    return NextResponse.json({ error: "Could not load appointments" }, { status: 500 });
  }
}
