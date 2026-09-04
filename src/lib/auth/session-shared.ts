import {
  ADMIN_SESSION_PAYLOAD,
  adminPassword as configuredAdminPassword,
} from "@/lib/auth/admin-credentials";

export const ADMIN_COOKIE_NAME = "admin_session";
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

export async function mintAdminSessionToken(
  password?: string,
): Promise<string | null> {
  const secret = (password ?? configuredAdminPassword()).trim();
  if (!secret) return null;
  const hex = await hmacSha256Hex(secret, ADMIN_SESSION_PAYLOAD);
  return `admin.${hex}`;
}

export async function isValidAdminTokenAsync(
  token: string | undefined,
  password?: string,
): Promise<boolean> {
  if (!token) return false;
  const expected = await mintAdminSessionToken(password);
  if (!expected) return false;
  return safeEqualHex(token, expected);
}
