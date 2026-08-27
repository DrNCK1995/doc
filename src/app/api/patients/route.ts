import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getAccess,
  parentCannotAccessOtherMobile,
  requireAccess,
} from "@/lib/auth/access";
import { normalizeMobile } from "@/lib/auth/parent-session";
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
  const access = await getAccess(req);
  const denied = requireAccess(access);
  if (denied) return denied;

  try {
    const { searchParams } = req.nextUrl;

    if (access!.role === "parent") {
      const patients = await searchPatients({
        mobile: access!.mobile,
        patientId: searchParams.get("patientId") ?? undefined,
        name: searchParams.get("name") ?? undefined,
        dob: searchParams.get("dob") ?? undefined,
        q: searchParams.get("q") ?? undefined,
        limit: 50,
      });
      // Extra safety: only exact normalized mobile match
      const mine = patients.filter(
        (p) => normalizeMobile(p.mobileNumber) === access!.mobile,
      );
      return NextResponse.json({ patients: mine, role: "parent" });
    }

    const patients = await searchPatients({
      q: searchParams.get("q") ?? undefined,
      patientId: searchParams.get("patientId") ?? undefined,
      name: searchParams.get("name") ?? undefined,
      mobile: searchParams.get("mobile") ?? undefined,
      dob: searchParams.get("dob") ?? undefined,
    });
    return NextResponse.json({ patients, role: "staff" });
  } catch (err) {
    console.error("GET /api/patients", err);
    return NextResponse.json(
      { error: "Failed to search patients" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const access = await getAccess(req);
  const denied = requireAccess(access);
  if (denied) return denied;

  try {
    const body = await req.json();
    const parsed = createPatientSchema.parse(body);

    if (access!.role === "parent") {
      parsed.mobileNumber = access!.mobile;
    } else if (parentCannotAccessOtherMobile(access!, parsed.mobileNumber)) {
      // unreachable for staff; kept for clarity
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 },
    );
  }
}
