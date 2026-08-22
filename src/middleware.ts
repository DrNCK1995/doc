import { NextRequest, NextResponse } from "next/server";
import {
  isValidAdminTokenAsync,
} from "@/lib/auth/session-shared";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/session-shared";
import {
  isValidParentSession,
  PARENT_MOBILE_COOKIE,
  PARENT_SESSION_COOKIE,
} from "@/lib/auth/parent-session";

/**
 * Protect patient APIs only. Growth pages stay public;
 * parents use user ID / mobile + password; staff / owner use clinic login.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/api/patients")) {
    return NextResponse.next();
  }

  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (await isValidAdminTokenAsync(adminToken)) {
    return NextResponse.next();
  }

  const mobile = req.cookies.get(PARENT_MOBILE_COOKIE)?.value;
  const parentToken = req.cookies.get(PARENT_SESSION_COOKIE)?.value;
  if (await isValidParentSession(mobile, parentToken)) {
    return NextResponse.next();
  }

  return NextResponse.json(
    {
      error:
        "Sign in with your parent user ID / mobile and password, or as clinic staff, to access records",
      code: "AUTH_REQUIRED",
    },
    { status: 401 },
  );
}

export const config = {
  matcher: ["/api/patients", "/api/patients/:path*"],
};
