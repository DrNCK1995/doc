import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE_NAME,
  resolveClinicSession,
} from "@/lib/auth/admin-session";
import { changeStaffPassword } from "@/lib/auth/staff-account";
import { writeAuditLog } from "@/lib/services/audit";

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const kind = await resolveClinicSession(
      req.cookies.get(ADMIN_COOKIE_NAME)?.value,
    );
    if (!kind) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    if (kind === "owner") {
      return NextResponse.json(
        {
          error:
            "Owner admin password cannot be changed. Use staff login to manage the clinic staff password.",
        },
        { status: 403 },
      );
    }

    const body = bodySchema.parse(await req.json());
    const result = await changeStaffPassword(
      body.currentPassword,
      body.newPassword,
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await writeAuditLog({
      action: "STAFF_PASSWORD_CHANGED",
      entityType: "Auth",
      ipAddress:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("POST /api/auth/admin/change-password", err);
    return NextResponse.json(
      { error: "Could not change password" },
      { status: 500 },
    );
  }
}
