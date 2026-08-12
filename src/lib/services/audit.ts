import type { AuditLog, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type WriteAuditLogInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  userId?: string | null;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string | null;
};

export async function writeAuditLog(
  input: WriteAuditLogInput,
): Promise<AuditLog> {
  return prisma.auditLog.create({
    data: {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      userId: input.userId ?? null,
      metadata: input.metadata ?? undefined,
      ipAddress: input.ipAddress ?? null,
    },
  });
}
