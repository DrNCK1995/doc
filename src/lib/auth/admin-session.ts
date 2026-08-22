/**
 * Clinic staff / owner session helpers.
 * Owner password is fixed in code and cannot be changed via the app.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  OWNER_PASSWORD,
  OWNER_SESSION_PAYLOAD,
  STAFF_SESSION_PAYLOAD,
} from "@/lib/auth/owner-constants";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  hmacSha256Hex,
  safeEqualHex,
} from "@/lib/auth/session-shared";

export { OWNER_PASSWORD } from "@/lib/auth/owner-constants";

export {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/auth/session-shared";

export type ClinicSessionKind = "owner" | "staff";

const LEGACY_ADMIN_SESSION_PAYLOAD = "admin-session-v1";

export function staffSessionSecret(): string {
  return (
    process.env.STAFF_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-staff-session-secret"
  );
}

export function passwordsEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      timingSafeEqual(bufA, bufA);
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function isOwnerPassword(password: string): boolean {
  return passwordsEqual(password, OWNER_PASSWORD);
}

export async function mintOwnerSessionToken(): Promise<string> {
  const hex = await hmacSha256Hex(OWNER_PASSWORD, OWNER_SESSION_PAYLOAD);
  return `owner.${hex}`;
}

export async function mintStaffSessionToken(): Promise<string> {
  const hex = await hmacSha256Hex(staffSessionSecret(), STAFF_SESSION_PAYLOAD);
  return `staff.${hex}`;
}

export async function resolveClinicSession(
  token: string | undefined,
): Promise<ClinicSessionKind | null> {
  if (!token) return null;

  if (token.startsWith("owner.")) {
    const expected = await mintOwnerSessionToken();
    return safeEqualHex(token, expected) ? "owner" : null;
  }

  if (token.startsWith("staff.")) {
    const expected = await mintStaffSessionToken();
    return safeEqualHex(token, expected) ? "staff" : null;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword) {
    const legacy = createHmac("sha256", adminPassword)
      .update(LEGACY_ADMIN_SESSION_PAYLOAD)
      .digest("hex");
    if (safeEqualHex(token, legacy)) return "staff";
    const legacyAsync = await hmacSha256Hex(
      adminPassword,
      LEGACY_ADMIN_SESSION_PAYLOAD,
    );
    if (safeEqualHex(token, legacyAsync)) return "staff";
  }

  return null;
}

export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  if (token.startsWith("owner.")) {
    const hex = createHmac("sha256", OWNER_PASSWORD)
      .update(OWNER_SESSION_PAYLOAD)
      .digest("hex");
    return safeEqualHex(token.slice(6), hex);
  }
  if (token.startsWith("staff.")) {
    const hex = createHmac("sha256", staffSessionSecret())
      .update(STAFF_SESSION_PAYLOAD)
      .digest("hex");
    return safeEqualHex(token.slice(6), hex);
  }
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const legacy = createHmac("sha256", adminPassword)
    .update(LEGACY_ADMIN_SESSION_PAYLOAD)
    .digest("hex");
  return safeEqualHex(token, legacy);
}

export async function isValidAdminTokenAsync(
  token: string | undefined,
): Promise<boolean> {
  return (await resolveClinicSession(token)) != null;
}

export async function getAdminSessionFromCookies(): Promise<ClinicSessionKind | null> {
  const jar = await cookies();
  return resolveClinicSession(jar.get(ADMIN_COOKIE_NAME)?.value);
}

export function unauthorizedJson() {
  return NextResponse.json(
    {
      error:
        "Sign in with your parent user ID / mobile and password, or as clinic staff, to access records",
      code: "AUTH_REQUIRED",
    },
    { status: 401 },
  );
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidAdminToken(token)) {
    return unauthorizedJson();
  }
  return null;
}

export function setClinicSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export function clearClinicSessionCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
