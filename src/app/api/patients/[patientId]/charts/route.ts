import { NextRequest, NextResponse } from "next/server";
import { getByPatientId } from "@/lib/services/patient-service";
import { buildChartPayload } from "@/lib/services/chart-service";
import { jsonError } from "@/lib/services/http";

type RouteContext = { params: Promise<{ patientId: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
    const patient = await getByPatientId(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const charts = await buildChartPayload(patientId);
    return NextResponse.json(charts);
  } catch (err) {
    return jsonError(err, "Failed to build chart payload");
  }
}
