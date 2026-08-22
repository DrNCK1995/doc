import { NextRequest, NextResponse } from "next/server";
import {
  getAccess,
  parentCannotAccessOtherMobile,
  requireAccess,
} from "@/lib/auth/access";
import { getByPatientId } from "@/lib/services/patient-service";
import { buildChartPayload } from "@/lib/services/chart-service";
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
    const charts = await buildChartPayload(patientId);
    return NextResponse.json(charts);
  } catch (err) {
    return jsonError(err, "Failed to build chart payload");
  }
}
