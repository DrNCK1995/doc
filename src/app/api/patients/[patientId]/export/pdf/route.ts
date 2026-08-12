import { NextRequest, NextResponse } from "next/server";
import { buildPatientPdf } from "@/lib/services/export-service";
import { jsonError } from "@/lib/services/http";

type RouteContext = { params: Promise<{ patientId: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
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
