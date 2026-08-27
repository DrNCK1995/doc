import { NextRequest, NextResponse } from "next/server";
import {
  adminLoginId,
  adminPassword,
} from "@/lib/auth/admin-credentials";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  isValidAdminTokenAsync,
  mintAdminSessionToken,
} from "@/lib/auth/session-shared";

export type ClinicSessionKind = "admin";

export { ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE };

function passwordsEqual(a: string, b: string): boolean {
  try {
    if (a.length !== b.length) return false;
    let out = 0;
    for (let i = 0; i < a.length; i += 1) {
      out |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return out === 0;
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(
  loginId: string,
  password: string,
): boolean {
  const expectedId = adminLoginId();
  const expectedPw = adminPassword();
  return (
    passwordsEqual(loginId.trim().toLowerCase(), expectedId.toLowerCase()) &&
    passwordsEqual(password, expectedPw)
  );
}

export async function mintClinicSessionToken(): Promise<string> {
  const token = await mintAdminSessionToken(adminPassword());
  if (!token) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }
  return token;
}

export async function resolveClinicSession(
  token: string | undefined,
): Promise<ClinicSessionKind | null> {
  if (!token) return null;
  if (await isValidAdminTokenAsync(token, adminPassword())) {
    return "admin";
  }
  return null;
}

export async function isValidAdminToken(
  token: string | undefined,
): Promise<boolean> {
  return isValidAdminTokenAsync(token, adminPassword());
}

/** Alias used by Edge middleware. */
export { isValidAdminTokenAsync };

export function setClinicSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export function clearClinicSessionCookie(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function unauthorizedJson(message = "Sign in required") {
  return NextResponse.json(
    { error: message, code: "AUTH_REQUIRED" },
    { status: 401 },
  );
}

export async function requireAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const kind = await resolveClinicSession(token);
  if (!kind) return null;
  return kind;
}
