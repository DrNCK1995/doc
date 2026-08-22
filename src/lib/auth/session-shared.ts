import {
  OWNER_PASSWORD,
  OWNER_SESSION_PAYLOAD,
  STAFF_SESSION_PAYLOAD,
} from "@/lib/auth/owner-constants";

export const ADMIN_COOKIE_NAME = "admin_session";
/** @deprecated Prefer owner/staff payloads */
export const ADMIN_SESSION_PAYLOAD = "admin-session-v1";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

/** Constant-time compare that works in Node and Edge. */
export function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export async function hmacSha256Hex(
  secret: string,
  message: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedAdminTokenAsync(
  adminPassword: string,
): Promise<string> {
  return hmacSha256Hex(adminPassword, ADMIN_SESSION_PAYLOAD);
}

export async function isValidAdminTokenAsync(
  token: string | undefined,
  adminPassword = process.env.ADMIN_PASSWORD,
): Promise<boolean> {
  if (!token) return false;

  if (token.startsWith("owner.")) {
    const expected = await hmacSha256Hex(OWNER_PASSWORD, OWNER_SESSION_PAYLOAD);
    return safeEqualHex(token.slice(6), expected);
  }

  if (token.startsWith("staff.")) {
    const secret =
      process.env.STAFF_SESSION_SECRET ||
      process.env.ADMIN_PASSWORD ||
      "dev-staff-session-secret";
    const expected = await hmacSha256Hex(secret, STAFF_SESSION_PAYLOAD);
    return safeEqualHex(token.slice(6), expected);
  }

  if (!adminPassword) return false;
  const expected = await expectedAdminTokenAsync(adminPassword);
  return safeEqualHex(token, expected);
}
