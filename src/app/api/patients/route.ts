import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createPatientSchema } from "@/lib/validations/patient";
import {
  createPatient,
  searchPatients,
} from "@/lib/services/patient-service";

function clientIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const patients = await searchPatients({
      q: searchParams.get("q") ?? undefined,
      patientId: searchParams.get("patientId") ?? undefined,
      name: searchParams.get("name") ?? undefined,
      mobile: searchParams.get("mobile") ?? undefined,
      dob: searchParams.get("dob") ?? undefined,
    });
    return NextResponse.json({ patients });
  } catch (err) {
    console.error("GET /api/patients", err);
    return NextResponse.json(
      { error: "Failed to search patients" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createPatientSchema.parse(body);
    const patient = await createPatient(parsed, { ipAddress: clientIp(req) });
    return NextResponse.json({ patient }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("POST /api/patients", err);
    const message = err instanceof Error ? err.message : "";
    const dbDown =
      message.includes("Can't reach database server") ||
      message.includes("P1001") ||
      (err as { code?: string })?.code === "P1001";
    return NextResponse.json(
      {
        error: dbDown
          ? "Database is not connected on the server. Set DATABASE_URL to a cloud Postgres (e.g. Neon) in Vercel project settings, then redeploy."
          : "Failed to create patient",
      },
      { status: dbDown ? 503 : 500 },
    );
  }
}
