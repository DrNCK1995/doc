import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/services/audit";

const COOKIE_NAME = "admin_session";
const bodySchema = z.object({
  password: z.string().min(1),
});

function expectedToken(adminPassword: string): string {
  return createHmac("sha256", adminPassword).update("admin-session-v1").digest("hex");
}

function passwordsEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // still run a compare to reduce timing leaks on length
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin auth is not configured" },
        { status: 503 },
      );
    }

    const body = bodySchema.parse(await req.json());
    if (!passwordsEqual(body.password, adminPassword)) {
      await writeAuditLog({
        action: "ADMIN_LOGIN_FAILED",
        entityType: "Auth",
        ipAddress:
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
      });
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = expectedToken(adminPassword);
    const res = NextResponse.json({ ok: true, role: "ADMIN" });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    await writeAuditLog({
      action: "ADMIN_LOGIN",
      entityType: "Auth",
      ipAddress:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
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
    res.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    await writeAuditLog({
      action: "ADMIN_LOGOUT",
      entityType: "Auth",
      ipAddress:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    });
    return res;
  } catch (err) {
    console.error("DELETE /api/auth/admin", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
