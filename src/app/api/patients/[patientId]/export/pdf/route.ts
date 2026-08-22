import { NextRequest, NextResponse } from "next/server";
import {
  getAccess,
  parentCannotAccessOtherMobile,
  requireAccess,
} from "@/lib/auth/access";
import { getByPatientId } from "@/lib/services/patient-service";
import { buildPatientPdf } from "@/lib/services/export-service";
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
    const pdf = await buildPatientPdf(patientId);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${patientId}-growth-report.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return jsonError(err, "Failed to generate PDF");
  }
}
