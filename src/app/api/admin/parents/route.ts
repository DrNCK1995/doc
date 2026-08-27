import { NextRequest, NextResponse } from "next/server";
import { getAccess, requireAdmin } from "@/lib/auth/access";
import { prisma } from "@/lib/db/prisma";
import { normalizeMobile } from "@/lib/auth/parent-session";

/** Admin-only: list all parent accounts and linked patients by mobile. */
export async function GET(req: NextRequest) {
  const access = await getAccess(req);
  const denied = requireAdmin(access);
  if (denied) return denied;

  try {
    const accounts = await prisma.parentAccount.findMany({
      orderBy: { createdAt: "desc" },
    });

    const mobiles = accounts.map((a) => a.mobile);
    const patients =
      mobiles.length === 0
        ? []
        : await prisma.patient.findMany({
            where: { mobileNumber: { in: mobiles } },
            select: {
              patientId: true,
              name: true,
              dateOfBirth: true,
              sex: true,
              mobileNumber: true,
              parentName: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          });

    const byMobile = new Map<string, typeof patients>();
    for (const p of patients) {
      const key = normalizeMobile(p.mobileNumber);
      const list = byMobile.get(key) ?? [];
      list.push(p);
      byMobile.set(key, list);
    }

    return NextResponse.json({
      parents: accounts.map((a) => ({
        id: a.id,
        userId: a.userId,
        mobile: a.mobile,
        name: a.name,
        createdAt: a.createdAt,
        patients: byMobile.get(a.mobile) ?? [],
      })),
      totalParents: accounts.length,
      totalPatients: patients.length,
    });
  } catch (err) {
    console.error("GET /api/admin/parents", err);
    return NextResponse.json(
      { error: "Failed to load parent accounts" },
      { status: 500 },
    );
  }
}
