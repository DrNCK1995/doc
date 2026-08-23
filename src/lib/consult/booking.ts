import type { Appointment, AppointmentVisitType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  CONSULT_FEE_INR,
  CONSULT_FEE_PAISE,
  formatDisplayDate,
  formatSlotLabel,
  generateConfirmationCode,
  parseDateKey,
  SLOT_HOLD_MINUTES,
  SLOT_STARTS_24H,
  toDateKey,
  upcomingOpenDates,
  type VisitTypeKey,
} from "@/lib/consult/config";
import {
  sendAppointmentReminders,
  sendBookingConfirmationEmails,
  type AppointmentMailPayload,
} from "@/lib/consult/notify";
import {
  createConsultOrder,
  getRazorpayPublicKey,
  razorpayConfigured,
  verifyPaymentSignature,
} from "@/lib/consult/razorpay";

function toMailPayload(a: Appointment): AppointmentMailPayload {
  return {
    confirmationCode: a.confirmationCode,
    parentName: a.parentName,
    parentEmail: a.parentEmail,
    parentMobile: a.parentMobile,
    childName: a.childName,
    childAgeNote: a.childAgeNote,
    visitType: a.visitType as VisitTypeKey,
    appointmentDate: a.appointmentDate,
    slotLabel: a.slotLabel,
    amountInr: Math.round(a.amountPaise / 100),
    reason: a.reason,
  };
}

export function serializeAppointment(a: Appointment) {
  return {
    id: a.id,
    confirmationCode: a.confirmationCode,
    status: a.status,
    visitType: a.visitType,
    dateKey: toDateKey(a.appointmentDate),
    dateLabel: formatDisplayDate(a.appointmentDate),
    slotStart: a.slotStart,
    slotLabel: a.slotLabel,
    parentName: a.parentName,
    parentEmail: a.parentEmail,
    parentMobile: a.parentMobile,
    childName: a.childName,
    childAgeNote: a.childAgeNote,
    reason: a.reason,
    amountInr: Math.round(a.amountPaise / 100),
    paidAt: a.paidAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
  };
}

export type SerializedAppointment = ReturnType<typeof serializeAppointment>;

export async function expireStalePaymentHolds(): Promise<number> {
  const result = await prisma.appointment.updateMany({
    where: {
      status: "PENDING_PAYMENT",
      paymentExpiresAt: { lt: new Date() },
    },
    data: { status: "CANCELLED" },
  });
  return result.count;
}

function isSlotHeld(row: {
  status: string;
  paymentExpiresAt: Date | null;
}): boolean {
  if (row.status === "CONFIRMED" || row.status === "COMPLETED") return true;
  if (row.status === "PENDING_PAYMENT") {
    if (!row.paymentExpiresAt) return true;
    return row.paymentExpiresAt.getTime() > Date.now();
  }
  return false;
}

export async function listAvailableSlots() {
  await expireStalePaymentHolds();
  const dates = upcomingOpenDates();
  const from = dates[0];
  const to = dates[dates.length - 1];
  if (!from || !to) return [];

  const existing = await prisma.appointment.findMany({
    where: {
      appointmentDate: { gte: from, lte: to },
      status: { in: ["PENDING_PAYMENT", "CONFIRMED", "COMPLETED"] },
    },
    select: {
      appointmentDate: true,
      slotStart: true,
      status: true,
      paymentExpiresAt: true,
    },
  });

  const taken = new Set<string>();
  for (const row of existing) {
    if (!isSlotHeld(row)) continue;
    taken.add(`${toDateKey(row.appointmentDate)}|${row.slotStart}`);
  }

  return dates.map((date) => {
    const dateKey = toDateKey(date);
    return {
      dateKey,
      label: formatDisplayDate(date),
      slots: SLOT_STARTS_24H.map((start) => ({
        start,
        label: formatSlotLabel(start),
        available: !taken.has(`${dateKey}|${start}`),
      })),
    };
  });
}

export type CreateBookingInput = {
  visitType: VisitTypeKey;
  dateKey: string;
  slotStart: string;
  parentName: string;
  parentEmail: string;
  parentMobile: string;
  childName: string;
  childAgeNote?: string;
  reason?: string;
};

export async function createBooking(input: CreateBookingInput) {
  await expireStalePaymentHolds();

  if (!(SLOT_STARTS_24H as readonly string[]).includes(input.slotStart)) {
    throw Object.assign(new Error("Invalid time slot"), { status: 400 });
  }

  const appointmentDate = parseDateKey(input.dateKey);
  const openKeys = new Set(upcomingOpenDates().map(toDateKey));
  if (!openKeys.has(input.dateKey)) {
    throw Object.assign(new Error("Date is not available for booking"), {
      status: 400,
    });
  }

  const held = await prisma.appointment.findFirst({
    where: {
      appointmentDate,
      slotStart: input.slotStart,
      status: { in: ["PENDING_PAYMENT", "CONFIRMED", "COMPLETED"] },
    },
  });
  if (held && isSlotHeld(held)) {
    throw Object.assign(new Error("That slot was just taken — pick another"), {
      status: 409,
    });
  }

  const confirmationCode = generateConfirmationCode();
  const paymentExpiresAt = new Date(Date.now() + SLOT_HOLD_MINUTES * 60_000);
  const slotLabel = formatSlotLabel(input.slotStart);

  const appointment = await prisma.appointment.create({
    data: {
      confirmationCode,
      status: "PENDING_PAYMENT",
      visitType: input.visitType as AppointmentVisitType,
      appointmentDate,
      slotStart: input.slotStart,
      slotLabel,
      parentName: input.parentName.trim(),
      parentEmail: input.parentEmail.trim().toLowerCase(),
      parentMobile: input.parentMobile.trim(),
      childName: input.childName.trim(),
      childAgeNote: input.childAgeNote?.trim() || null,
      reason: input.reason?.trim() || null,
      amountPaise: CONSULT_FEE_PAISE,
      paymentExpiresAt,
    },
  });

  if (!razorpayConfigured()) {
    const confirmed = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: "CONFIRMED",
        paidAt: new Date(),
        paymentExpiresAt: null,
        confirmationSentAt: new Date(),
      },
    });
    await sendBookingConfirmationEmails(toMailPayload(confirmed));
    return {
      mode: "demo" as const,
      appointment: serializeAppointment(confirmed),
      message:
        "Razorpay keys not set — booking confirmed in demo mode. Add RAZORPAY_* env vars for live payments.",
      feeInr: CONSULT_FEE_INR,
    };
  }

  const order = await createConsultOrder({
    receipt: confirmationCode,
    notes: {
      appointmentId: appointment.id,
      confirmationCode,
    },
  });

  const updated = await prisma.appointment.update({
    where: { id: appointment.id },
    data: { razorpayOrderId: order.id },
  });

  return {
    mode: "razorpay" as const,
    appointment: serializeAppointment(updated),
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
    keyId: getRazorpayPublicKey(),
    feeInr: CONSULT_FEE_INR,
  };
}

export async function verifyAndConfirmPayment(input: {
  confirmationCode: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const appointment = await prisma.appointment.findUnique({
    where: { confirmationCode: input.confirmationCode },
  });
  if (!appointment) {
    throw Object.assign(new Error("Appointment not found"), { status: 404 });
  }
  if (appointment.status === "CONFIRMED") {
    return { appointment: serializeAppointment(appointment), already: true };
  }
  if (appointment.status !== "PENDING_PAYMENT") {
    throw Object.assign(new Error("Appointment is not awaiting payment"), {
      status: 400,
    });
  }
  if (
    appointment.razorpayOrderId &&
    appointment.razorpayOrderId !== input.razorpayOrderId
  ) {
    throw Object.assign(new Error("Order mismatch"), { status: 400 });
  }

  const ok = verifyPaymentSignature({
    orderId: input.razorpayOrderId,
    paymentId: input.razorpayPaymentId,
    signature: input.razorpaySignature,
  });
  if (!ok) {
    throw Object.assign(new Error("Payment verification failed"), {
      status: 400,
    });
  }

  const confirmed = await prisma.appointment.update({
    where: { id: appointment.id },
    data: {
      status: "CONFIRMED",
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
      paidAt: new Date(),
      paymentExpiresAt: null,
      confirmationSentAt: new Date(),
    },
  });

  await sendBookingConfirmationEmails(toMailPayload(confirmed));

  return { appointment: serializeAppointment(confirmed), already: false };
}

export async function getAppointmentByCode(code: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { confirmationCode: code.toUpperCase() },
  });
  if (!appointment) return null;
  return serializeAppointment(appointment);
}

export async function listAppointmentsForDoctor(params?: {
  from?: Date;
  to?: Date;
}) {
  await expireStalePaymentHolds();
  const from = params?.from ?? new Date(new Date().setHours(0, 0, 0, 0));
  const to = params?.to ?? new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000);

  const rows = await prisma.appointment.findMany({
    where: {
      appointmentDate: { gte: from, lte: to },
      status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW", "PENDING_PAYMENT"] },
    },
    orderBy: [{ appointmentDate: "asc" }, { slotStart: "asc" }],
  });
  return rows.map(serializeAppointment);
}

export async function dispatchDueReminders() {
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const endTomorrow = new Date(startToday);
  endTomorrow.setDate(startToday.getDate() + 2);

  const due = await prisma.appointment.findMany({
    where: {
      status: "CONFIRMED",
      appointmentDate: { gte: startToday, lt: endTomorrow },
      OR: [{ parentReminderSentAt: null }, { doctorReminderSentAt: null }],
    },
  });

  let parentCount = 0;
  let doctorCount = 0;

  for (const row of due) {
    const apptDay = new Date(row.appointmentDate);
    apptDay.setHours(0, 0, 0, 0);
    const daysUntil = Math.round(
      (apptDay.getTime() - startToday.getTime()) / 86_400_000,
    );
    if (daysUntil !== 0 && daysUntil !== 1) continue;

    const result = await sendAppointmentReminders(toMailPayload(row));
    const data: {
      parentReminderSentAt?: Date;
      doctorReminderSentAt?: Date;
    } = {};
    if (result.parent && !row.parentReminderSentAt) {
      data.parentReminderSentAt = new Date();
      parentCount += 1;
    }
    if (result.doctor && !row.doctorReminderSentAt) {
      data.doctorReminderSentAt = new Date();
      doctorCount += 1;
    }
    if (Object.keys(data).length) {
      await prisma.appointment.update({ where: { id: row.id }, data });
    }
  }

  return { parentCount, doctorCount, scanned: due.length };
}
