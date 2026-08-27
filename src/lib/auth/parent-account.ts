import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  isValidMobile,
  normalizeMobile,
} from "@/lib/auth/parent-session";

export function normalizeUserId(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "");
}

/** Any unique login id they choose (no spaces); mobile digits also allowed. */
export function isValidUserId(userId: string): boolean {
  return userId.length >= 1 && userId.length <= 64 && !/\s/.test(userId);
}

export async function findParentAccount(login: string) {
  const trimmed = login.trim();
  const mobile = normalizeMobile(trimmed);
  if (isValidMobile(mobile)) {
    const byMobile = await prisma.parentAccount.findUnique({ where: { mobile } });
    if (byMobile) return byMobile;
  }
  const userId = normalizeUserId(trimmed);
  if (userId) {
    return prisma.parentAccount.findUnique({ where: { userId } });
  }
  return null;
}

export async function verifyParentLogin(login: string, password: string) {
  const account = await findParentAccount(login);
  if (!account) return null;
  if (!verifyPassword(password, account.passwordHash)) return null;
  return account;
}

export async function createParentAccount(input: {
  userId?: string;
  mobile: string;
  password: string;
  name?: string;
}) {
  const mobile = normalizeMobile(input.mobile);
  if (!isValidMobile(mobile)) {
    throw Object.assign(new Error("Enter a valid 10-digit mobile number"), {
      status: 400,
    });
  }
  if (!input.password || input.password.length < 1) {
    throw Object.assign(new Error("Enter a password"), { status: 400 });
  }

  let userId = input.userId ? normalizeUserId(input.userId) : mobile;
  if (!userId) userId = mobile;
  if (!isValidUserId(userId)) {
    throw Object.assign(
      new Error("Login ID must be 1–64 characters with no spaces"),
      { status: 400 },
    );
  }

  const existingMobile = await prisma.parentAccount.findUnique({ where: { mobile } });
  if (existingMobile) {
    throw Object.assign(new Error("An account already exists for this mobile"), {
      status: 409,
    });
  }
  const existingUser = await prisma.parentAccount.findUnique({ where: { userId } });
  if (existingUser) {
    throw Object.assign(new Error("That user ID is already taken"), { status: 409 });
  }

  return prisma.parentAccount.create({
    data: {
      userId,
      mobile,
      passwordHash: hashPassword(input.password),
      name: input.name?.trim() || null,
    },
  });
}
