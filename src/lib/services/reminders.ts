/**
 * Reminder architecture stub — SMS / email next-visit notifications.
 * Wire to Twilio / MSG91 / SES without changing visit creation flow.
 */
export type ReminderChannel = "SMS" | "EMAIL" | "WHATSAPP";

export type ReminderPayload = {
  patientId: string; // human-readable
  parentName: string;
  mobileNumber: string;
  email?: string | null;
  nextVisitDue: Date;
  channel: ReminderChannel;
  locale?: "en" | "hi" | "te";
};

export interface ReminderProvider {
  send(payload: ReminderPayload): Promise<{ ok: boolean; providerId?: string }>;
}

/** No-op provider for local/demo — logs intent only. */
export class ConsoleReminderProvider implements ReminderProvider {
  async send(payload: ReminderPayload) {
    console.info("[reminder:queued]", {
      patientId: payload.patientId,
      channel: payload.channel,
      due: payload.nextVisitDue.toISOString(),
    });
    return { ok: true, providerId: `local-${Date.now()}` };
  }
}

export function getReminderProvider(): ReminderProvider {
  // Swap for TwilioReminderProvider / SesEmailProvider in production.
  return new ConsoleReminderProvider();
}
