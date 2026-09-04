/**
 * Clinic admin identity for My Child / Grow Right.
 * Kept in code so production is not blocked by an old ADMIN_PASSWORD on Vercel.
 */
export const DEFAULT_ADMIN_LOGIN_ID = "DrNCK1995";
export const DEFAULT_ADMIN_PASSWORD = "CARE@kids2026";

export const ADMIN_SESSION_PAYLOAD = "admin-session-v2";

export function adminLoginId(): string {
  return DEFAULT_ADMIN_LOGIN_ID;
}

export function adminPassword(): string {
  return DEFAULT_ADMIN_PASSWORD;
}
