import { NextRequest, NextResponse } from "next/server";
import {
  isValidAdminTokenAsync,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth/session-shared";
import { adminPassword } from "@/lib/auth/admin-credentials";
import {
  isValidParentSession,
  PARENT_MOBILE_COOKIE,
  PARENT_SESSION_COOKIE,
} from "@/lib/auth/parent-session";

/**
 * Protect personal growth data:
 * - /my-child, /growth (except /growth/login)
 * - /admin/*
 * - /api/patients/*
 * Everything else stays open (tools, learn, consult, home, etc.).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedPage =
    pathname === "/my-child" ||
    pathname.startsWith("/my-child/") ||
    (pathname.startsWith("/growth") && !pathname.startsWith("/growth/login")) ||
    pathname.startsWith("/admin");

  const isProtectedApi =
    pathname.startsWith("/api/patients") ||
    pathname.startsWith("/api/admin");

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (await isValidAdminTokenAsync(adminToken, adminPassword())) {
    return NextResponse.next();
  }

  const mobile = req.cookies.get(PARENT_MOBILE_COOKIE)?.value;
  const parentToken = req.cookies.get(PARENT_SESSION_COOKIE)?.value;
  if (await isValidParentSession(mobile, parentToken)) {
    // Parents cannot open the admin area or admin APIs
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/growth";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json(
      {
        error:
          "Sign in with your login ID / mobile and password, or as admin, to access records",
        code: "AUTH_REQUIRED",
      },
      { status: 401 },
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/growth/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/my-child",
    "/my-child/:path*",
    "/growth",
    "/growth/:path*",
    "/admin",
    "/admin/:path*",
    "/api/patients",
    "/api/patients/:path*",
    "/api/admin",
    "/api/admin/:path*",
  ],
};
