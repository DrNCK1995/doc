import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildChartPayload } from "@/lib/services/chart-service";
import { jsonError } from "@/lib/services/http";

type RouteContext = { params: Promise<{ patientId: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
    const charts = await buildChartPayload(patientId);
    return NextResponse.json(charts);
  } catch (err) {
    return jsonError(err, "Failed to build chart payload");
  }
}
