import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getAccess,
  parentCannotAccessOtherMobile,
  requireAccess,
} from "@/lib/auth/access";
import { addVisitSchema } from "@/lib/validations/visit";
import { getByPatientId } from "@/lib/services/patient-service";
import { addVisit, getAlerts, listVisits } from "@/lib/services/visit-service";
import { jsonError } from "@/lib/services/http";

type RouteContext = { params: Promise<{ patientId: string }> };

function clientIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

async function assertCanAccessPatient(
  req: NextRequest,
  humanPatientId: string,
) {
  const access = await getAccess(req);
  const denied = requireAccess(access);
  if (denied) return { denied, access: null, patient: null };

  const patient = await getByPatientId(humanPatientId);
  if (!patient) {
    return {
      denied: NextResponse.json({ error: "Patient not found" }, { status: 404 }),
      access,
      patient: null,
    };
  }
  if (parentCannotAccessOtherMobile(access!, patient.mobileNumber)) {
    return {
      denied: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      access,
      patient: null,
    };
  }
  return { denied: null, access, patient };
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
    const gate = await assertCanAccessPatient(req, patientId);
    if (gate.denied) return gate.denied;

    const includeAlerts = req.nextUrl.searchParams.get("alerts") === "1";
    const visits = await listVisits(patientId);
    const payload: {
      visits: typeof visits;
      alerts?: Awaited<ReturnType<typeof getAlerts>>;
    } = { visits };
    if (includeAlerts) {
      payload.alerts = await getAlerts(patientId);
    }
    return NextResponse.json(payload);
  } catch (err) {
    return jsonError(err, "Failed to list visits");
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { patientId } = await context.params;
    const gate = await assertCanAccessPatient(req, patientId);
    if (gate.denied) return gate.denied;

    const body = await req.json();
    const parsed = addVisitSchema.parse(body);
    const visit = await addVisit(patientId, parsed, {
      ipAddress: clientIp(req),
    });
    return NextResponse.json({ visit }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 },
      );
    }
    return jsonError(err, "Failed to add visit");
  }
}
