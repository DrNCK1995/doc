import { NextRequest, NextResponse } from "next/server";
import {
  PARENT_MOBILE_COOKIE,
  PARENT_SESSION_COOKIE,
} from "@/lib/auth/parent-session";
import { writeAuditLog } from "@/lib/services/audit";

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const clear = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
  res.cookies.set(PARENT_MOBILE_COOKIE, "", clear);
  res.cookies.set(PARENT_SESSION_COOKIE, "", clear);

  await writeAuditLog({
    action: "PARENT_LOGOUT",
    entityType: "Auth",
    ipAddress:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
  });

  return res;
}
