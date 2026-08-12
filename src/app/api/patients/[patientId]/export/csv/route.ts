import { NextRequest, NextResponse } from "next/server";
import { buildVisitsCsv } from "@/lib/services/export-service";
import { jsonError } from "@/lib/services/http";

type RouteContext = { params: Promise<{ patientId: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
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
