import { CLINIC_NAME, DOCTOR_NAME } from "@/lib/constants";
import {
  formatDisplayDate,
  VISIT_TYPE_LABELS,
  type VisitTypeKey,
} from "@/lib/consult/config";

export type AppointmentMailPayload = {
  confirmationCode: string;
  parentName: string;
  parentEmail: string;
  parentMobile: string;
  childName: string;
  childAgeNote?: string | null;
  visitType: VisitTypeKey;
  appointmentDate: Date;
  slotLabel: string;
  amountInr: number;
  reason?: string | null;
};

function visitLabel(type: VisitTypeKey) {
  return VISIT_TYPE_LABELS[type] ?? type;
}

function whenLine(p: AppointmentMailPayload) {
  return `${formatDisplayDate(p.appointmentDate)} · ${p.slotLabel}`;
}

function detailsBlock(p: AppointmentMailPayload) {
  return [
    `Confirmation: ${p.confirmationCode}`,
    `When: ${whenLine(p)}`,
    `Visit: ${visitLabel(p.visitType)}`,
    `Child: ${p.childName}${p.childAgeNote ? ` (${p.childAgeNote})` : ""}`,
    `Parent: ${p.parentName}`,
    `Mobile: ${p.parentMobile}`,
    `Email: ${p.parentEmail}`,
    `Fee paid: ₹${p.amountInr}`,
    `Clinic: ${CLINIC_NAME}`,
    `Doctor: ${DOCTOR_NAME}`,
    p.reason ? `Reason: ${p.reason}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  text: string;
}): Promise<{ ok: boolean; id?: string; skipped?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Dr Care for Kids <onboarding@resend.dev>";
  const to = Array.isArray(params.to) ? params.to : [params.to];

  if (!apiKey) {
    console.info("[email:skipped — set RESEND_API_KEY]", {
      to,
      subject: params.subject,
      text: params.text,
    });
    return { ok: true, skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: params.subject,
      text: params.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email:failed]", res.status, body);
    return { ok: false };
  }

  const data = (await res.json()) as { id?: string };
  return { ok: true, id: data.id };
}

export function doctorNotifyEmail(): string | null {
  return process.env.DOCTOR_NOTIFY_EMAIL?.trim() || null;
}

export async function sendBookingConfirmationEmails(
  p: AppointmentMailPayload,
): Promise<void> {
  const when = whenLine(p);
  const details = detailsBlock(p);

  await sendEmail({
    to: p.parentEmail,
    subject: `Appointment confirmed — ${p.confirmationCode} · ${when}`,
    text: [
      `Dear ${p.parentName},`,
      "",
      `Your appointment with ${DOCTOR_NAME} is confirmed.`,
      "",
      details,
      "",
      "Please arrive 10 minutes early with your child’s previous reports if any.",
      "For changes, reply to this email or call the clinic.",
      "",
      "— Dr Care for Kids",
    ].join("\n"),
  });

  const doctorTo = doctorNotifyEmail();
  if (doctorTo) {
    await sendEmail({
      to: doctorTo,
      subject: `New booking ${p.confirmationCode} · ${when} · ${p.childName}`,
      text: [
        "New paid appointment recorded.",
        "",
        details,
        "",
        "— Dr Care for Kids booking system",
      ].join("\n"),
    });
  } else {
    console.info("[doctor-notify:skipped — set DOCTOR_NOTIFY_EMAIL]", details);
  }
}

export async function sendAppointmentReminders(
  p: AppointmentMailPayload,
): Promise<{ parent: boolean; doctor: boolean }> {
  const when = whenLine(p);
  const details = detailsBlock(p);

  const parent = await sendEmail({
    to: p.parentEmail,
    subject: `Reminder: appointment — ${when}`,
    text: [
      `Dear ${p.parentName},`,
      "",
      `Friendly reminder for ${p.childName}'s visit with ${DOCTOR_NAME}.`,
      "",
      details,
      "",
      "See you at the clinic.",
      "",
      "— Dr Care for Kids",
    ].join("\n"),
  });

  let doctorOk = false;
  const doctorTo = doctorNotifyEmail();
  if (doctorTo) {
    const doctor = await sendEmail({
      to: doctorTo,
      subject: `Reminder: ${p.slotLabel} · ${p.childName} · ${p.confirmationCode}`,
      text: ["Upcoming appointment reminder.", "", details].join("\n"),
    });
    doctorOk = doctor.ok;
  }

  return { parent: parent.ok, doctor: doctorOk };
}
