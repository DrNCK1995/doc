import { NextRequest, NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";
import { findParentAccount } from "@/lib/auth/parent-account";

export async function GET(req: NextRequest) {
  const access = await getAccess(req);
  if (!access) {
    return NextResponse.json({ authenticated: false });
  }
  if (access.role === "staff") {
    return NextResponse.json({
      authenticated: true,
      role: access.kind === "owner" ? "admin" : "staff",
      kind: access.kind,
      canChangePassword: access.kind === "staff",
    });
  }

  const account = await findParentAccount(access.mobile);
  return NextResponse.json({
    authenticated: true,
    role: "parent",
    mobile: access.mobile,
    userId: account?.userId,
  });
}
