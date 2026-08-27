import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  clearClinicSessionCookie,
  mintClinicSessionToken,
  resolveClinicSession,
  setClinicSessionCookie,
  verifyAdminCredentials,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth/admin-session";
import { writeAuditLog } from "@/lib/services/audit";

const bodySchema = z.object({
  loginId: z.string().min(1),
  password: z.string().min(1),
});

function clientIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

export async function GET(req: NextRequest) {
  const kind = await resolveClinicSession(
    req.cookies.get(ADMIN_COOKIE_NAME)?.value,
  );
  if (!kind) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    role: "admin",
    kind: "admin",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = bodySchema.parse(await req.json());

    if (!verifyAdminCredentials(body.loginId, body.password)) {
      await writeAuditLog({
        action: "ADMIN_LOGIN_FAILED",
        entityType: "Auth",
        ipAddress: clientIp(req),
      });
      return NextResponse.json(
        { error: "Invalid admin login ID or password" },
        { status: 401 },
      );
    }

    const token = await mintClinicSessionToken();
    const res = NextResponse.json({
      ok: true,
      role: "admin",
      kind: "admin",
    });
    setClinicSessionCookie(res, token);
    await writeAuditLog({
      action: "ADMIN_LOGIN",
      entityType: "Auth",
      ipAddress: clientIp(req),
    });
    return res;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("POST /api/auth/admin", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });
    clearClinicSessionCookie(res);
    await writeAuditLog({
      action: "ADMIN_LOGOUT",
      entityType: "Auth",
      ipAddress: clientIp(req),
    });
    return res;
  } catch (err) {
    console.error("DELETE /api/auth/admin", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
