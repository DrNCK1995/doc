/** Clinic admin identity — set in env (never hardcode secrets in commits for production). */
export const DEFAULT_ADMIN_LOGIN_ID = "drcare-admin";
export const DEFAULT_ADMIN_PASSWORD = "NCK@CareKids2026";

export const ADMIN_SESSION_PAYLOAD = "admin-session-v2";

export function adminLoginId(): string {
  return (
    process.env.ADMIN_LOGIN_ID?.trim() ||
    process.env.ADMIN_USERNAME?.trim() ||
    DEFAULT_ADMIN_LOGIN_ID
  );
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}
