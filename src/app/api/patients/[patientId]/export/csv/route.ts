import { NextRequest, NextResponse } from "next/server";
import {
  getAccess,
  parentCannotAccessOtherMobile,
  requireAccess,
} from "@/lib/auth/access";
import { getByPatientId } from "@/lib/services/patient-service";
import { buildVisitsCsv } from "@/lib/services/export-service";
import { jsonError } from "@/lib/services/http";

type RouteContext = { params: Promise<{ patientId: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const access = await getAccess(req);
  const denied = requireAccess(access);
  if (denied) return denied;

  try {
    const { patientId } = await context.params;
    const patient = await getByPatientId(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    if (parentCannotAccessOtherMobile(access!, patient.mobileNumber)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const csv = await buildVisitsCsv(patientId);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${patientId}-visits.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return jsonError(err, "Failed to generate CSV");
  }
}
