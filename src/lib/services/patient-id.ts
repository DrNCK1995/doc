import { prisma } from "@/lib/db/prisma";

/**
 * Immutable human-readable patient IDs.
 * Format: `${PREFIX}${YYYYMMDDHHmm}-${seq}` e.g. ARJ202608121430-001
 * Sequence resets per minute bucket via PatientIdSequence (transactional).
 */
export function getPatientIdPrefix(): string {
  return (process.env.PATIENT_ID_PREFIX || "ARJ").toUpperCase();
}

export function formatMinuteBucket(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}${m}${d}${hh}${mm}`;
}

export async function generatePatientId(
  at: Date = new Date(),
): Promise<string> {
  const prefix = getPatientIdPrefix();
  const bucketKey = formatMinuteBucket(at);

  const sequence = await prisma.$transaction(async (tx) => {
    const existing = await tx.patientIdSequence.findUnique({
      where: { id: "global" },
    });

    if (!existing) {
      await tx.patientIdSequence.create({
        data: { id: "global", bucketKey, sequence: 1 },
      });
      return 1;
    }

    if (existing.bucketKey === bucketKey) {
      const updated = await tx.patientIdSequence.update({
        where: { id: "global" },
        data: { sequence: { increment: 1 } },
      });
      return updated.sequence;
    }

    const reset = await tx.patientIdSequence.update({
      where: { id: "global" },
      data: { bucketKey, sequence: 1 },
    });
    return reset.sequence;
  });

  const seq = String(sequence).padStart(3, "0");
  return `${prefix}${bucketKey}-${seq}`;
}
