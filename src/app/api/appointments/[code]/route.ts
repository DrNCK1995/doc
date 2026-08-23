import { NextResponse } from "next/server";
import { getAppointmentByCode } from "@/lib/consult/booking";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { code } = await params;
    const appointment = await getAppointmentByCode(code);
    if (!appointment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ appointment });
  } catch (err) {
    console.error("[appointments/code]", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
