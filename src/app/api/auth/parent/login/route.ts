import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyParentLogin } from "@/lib/auth/parent-account";
import {
  PARENT_MOBILE_COOKIE,
  PARENT_SESSION_COOKIE,
  PARENT_SESSION_MAX_AGE,
  parentSessionToken,
} from "@/lib/auth/parent-session";
import { writeAuditLog } from "@/lib/services/audit";

const bodySchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = bodySchema.parse(await req.json());
    const account = await verifyParentLogin(body.login, body.password);
    if (!account) {
      return NextResponse.json(
        { error: "Invalid user ID / mobile or password" },
        { status: 401 },
      );
    }

    const token = await parentSessionToken(account.mobile);
    const res = NextResponse.json({
      ok: true,
      role: "parent",
      userId: account.userId,
      mobile: account.mobile,
    });
    const cookie = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: PARENT_SESSION_MAX_AGE,
    };
    res.cookies.set(PARENT_MOBILE_COOKIE, account.mobile, cookie);
    res.cookies.set(PARENT_SESSION_COOKIE, token, cookie);

    await writeAuditLog({
      action: "PARENT_LOGIN",
      entityType: "Auth",
      entityId: account.userId,
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
    console.error("POST /api/auth/parent/login", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
