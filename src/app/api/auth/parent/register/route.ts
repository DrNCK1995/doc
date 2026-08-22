import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createParentAccount } from "@/lib/auth/parent-account";
import {
  PARENT_MOBILE_COOKIE,
  PARENT_SESSION_COOKIE,
  PARENT_SESSION_MAX_AGE,
  parentSessionToken,
} from "@/lib/auth/parent-session";
import { writeAuditLog } from "@/lib/services/audit";

const bodySchema = z.object({
  userId: z.string().optional(),
  mobile: z.string().min(8),
  password: z.string().min(1),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = bodySchema.parse(await req.json());
    const account = await createParentAccount(body);

    const token = await parentSessionToken(account.mobile);
    const res = NextResponse.json(
      {
        ok: true,
        role: "parent",
        userId: account.userId,
        mobile: account.mobile,
      },
      { status: 201 },
    );
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
      action: "PARENT_REGISTER",
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
    const status = (err as { status?: number })?.status ?? 500;
    const message =
      err instanceof Error ? err.message : "Could not create account";
    if (status >= 500) console.error("POST /api/auth/parent/register", err);
    return NextResponse.json({ error: message }, { status });
  }
}
