import {
  hmacSha256Hex,
  safeEqualHex,
} from "@/lib/auth/session-shared";

export const PARENT_MOBILE_COOKIE = "parent_mobile";
export const PARENT_SESSION_COOKIE = "parent_session";
export const PARENT_SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

/** Normalize Indian mobiles to last 10 digits when possible. */
export function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

export function isValidMobile(mobile: string): boolean {
  return /^\d{10}$/.test(mobile);
}

function parentSecret(): string {
  return (
    process.env.PARENT_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-parent-secret"
  );
}

export async function parentSessionToken(mobile: string): Promise<string> {
  return hmacSha256Hex(parentSecret(), `parent-v1:${mobile}`);
}

export async function isValidParentSession(
  mobile: string | undefined,
  token: string | undefined,
): Promise<boolean> {
  if (!mobile || !token || !isValidMobile(mobile)) return false;
  const expected = await parentSessionToken(mobile);
  return safeEqualHex(token, expected);
}
