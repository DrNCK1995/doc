import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { updatePatientSchema } from "@/lib/validations/patient";
import {
  getByPatientId,
  updatePatient,
} from "@/lib/services/patient-service";
import { jsonError } from "@/lib/services/http";

type RouteContext = { params: Promise<{ patientId: string }> };

function clientIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
    const patient = await getByPatientId(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json({ patient });
  } catch (err) {
    return jsonError(err, "Failed to fetch patient");
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
    const body = await req.json();
    const parsed = updatePatientSchema.parse(body);
    const patient = await updatePatient(patientId, parsed, {
      ipAddress: clientIp(req),
    });
    return NextResponse.json({ patient });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 },
      );
    }
    return jsonError(err, "Failed to update patient");
  }
}
