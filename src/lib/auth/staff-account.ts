import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export const STAFF_EMAIL = "staff@clinic.local";

/** Ensure a changeable staff account exists (seeded from ADMIN_PASSWORD when missing). */
export async function ensureStaffUser() {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: STAFF_EMAIL }, { role: "STAFF" }] },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return existing;

  const initial =
    process.env.ADMIN_PASSWORD || process.env.STAFF_INITIAL_PASSWORD || "admin123";
  return prisma.user.create({
    data: {
      email: STAFF_EMAIL,
      name: "Clinic staff",
      role: "STAFF",
      passwordHash: hashPassword(initial),
    },
  });
}

export async function verifyStaffPassword(password: string): Promise<boolean> {
  const user = await ensureStaffUser();
  return verifyPassword(password, user.passwordHash);
}

export async function changeStaffPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await ensureStaffUser();
  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return { ok: false, error: "Current password is incorrect" };
  }
  if (newPassword.length < 1) {
    return { ok: false, error: "Enter a new password" };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(newPassword) },
  });
  return { ok: true };
}
