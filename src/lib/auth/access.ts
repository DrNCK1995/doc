import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  resolveClinicSession,
  unauthorizedJson,
  type ClinicSessionKind,
} from "@/lib/auth/admin-session";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/session-shared";
import {
  isValidParentSession,
  normalizeMobile,
  PARENT_MOBILE_COOKIE,
  PARENT_SESSION_COOKIE,
} from "@/lib/auth/parent-session";

export type AccessContext =
  | { role: "staff"; kind: ClinicSessionKind }
  | { role: "parent"; mobile: string; userId?: string };

export async function getAccess(req: NextRequest): Promise<AccessContext | null> {
  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const clinic = await resolveClinicSession(adminToken);
  if (clinic) {
    return { role: "staff", kind: clinic };
  }

  const mobile = req.cookies.get(PARENT_MOBILE_COOKIE)?.value;
  const parentToken = req.cookies.get(PARENT_SESSION_COOKIE)?.value;
  if (await isValidParentSession(mobile, parentToken)) {
    return { role: "parent", mobile: mobile! };
  }

  return null;
}

export function requireAccess(access: AccessContext | null): NextResponse | null {
  if (!access) return unauthorizedJson();
  return null;
}

export function parentCannotAccessOtherMobile(
  access: AccessContext,
  patientMobile: string,
): boolean {
  if (access.role !== "parent") return false;
  return normalizeMobile(patientMobile) !== access.mobile;
}
