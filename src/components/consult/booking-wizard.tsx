"use client";

import * as React from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONSULT_FEE_INR,
  VISIT_TYPE_KEYS,
  VISIT_TYPE_LABELS,
  type VisitTypeKey,
} from "@/lib/consult/config";

type DaySlots = {
  dateKey: string;
  label: string;
  slots: { start: string; label: string; available: boolean }[];
};

type AppointmentSummary = {
  confirmationCode: string;
  status: string;
  dateLabel: string;
  slotLabel: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  amountInr: number;
  visitType: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (resp: unknown) => void) => void;
    };
  }
}

const STEPS = ["Visit", "Slot", "Details", "Pay", "Done"] as const;

export function ConsultBookingWizard() {
  const [step, setStep] = React.useState(0);
  const [days, setDays] = React.useState<DaySlots[]>([]);
  const [feeInr, setFeeInr] = React.useState(CONSULT_FEE_INR);
  const [razorpayReady, setRazorpayReady] = React.useState(false);
  const [loadingSlots, setLoadingSlots] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState<AppointmentSummary | null>(
    null,
  );
  const [demoMessage, setDemoMessage] = React.useState<string | null>(null);

  const [visitType, setVisitType] =
    React.useState<VisitTypeKey>("CONSULTATION");
  const [dateKey, setDateKey] = React.useState("");
  const [slotStart, setSlotStart] = React.useState("");
  const [parentName, setParentName] = React.useState("");
  const [parentEmail, setParentEmail] = React.useState("");
  const [parentMobile, setParentMobile] = React.useState("");
  const [childName, setChildName] = React.useState("");
  const [childAgeNote, setChildAgeNote] = React.useState("");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch("/api/appointments/slots");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load slots");
        if (cancelled) return;
        setDays(data.days ?? []);
        setFeeInr(data.feeInr ?? CONSULT_FEE_INR);
        setRazorpayReady(Boolean(data.razorpayReady));
        if (data.days?.[0]?.dateKey) setDateKey(data.days[0].dateKey);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load slots");
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDay = days.find((d) => d.dateKey === dateKey);
  const selectedSlotLabel =
    selectedDay?.slots.find((s) => s.start === slotStart)?.label ?? slotStart;

  async function startPayment() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitType,
          dateKey,
          slotStart,
          parentName,
          parentEmail,
          parentMobile,
          childName,
          childAgeNote: childAgeNote || undefined,
          reason: reason || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      if (data.mode === "demo") {
        setConfirmed(data.appointment);
        setDemoMessage(data.message ?? null);
        setStep(4);
        return;
      }

      if (!data.order?.id || !data.keyId) {
        throw new Error("Payment order was not created");
      }

      await openRazorpayCheckout({
        keyId: data.keyId,
        orderId: data.order.id,
        amount: data.order.amount,
        currency: data.order.currency,
        confirmationCode: data.appointment.confirmationCode,
        parentName,
        parentEmail,
        parentMobile,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  function openRazorpayCheckout(opts: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    confirmationCode: string;
    parentName: string;
    parentEmail: string;
    parentMobile: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(
          new Error("Razorpay checkout failed to load — refresh and retry"),
        );
        return;
      }

      const rzp = new window.Razorpay({
        key: opts.keyId,
        amount: opts.amount,
        currency: opts.currency,
        name: "Dr Care for Kids",
        description: `Consult fee · ${opts.confirmationCode}`,
        order_id: opts.orderId,
        prefill: {
          name: opts.parentName,
          email: opts.parentEmail,
          contact: opts.parentMobile,
        },
        theme: { color: "#1b7a9e" },
        handler: async (response: unknown) => {
          const r = response as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          };
          try {
            const verifyRes = await fetch("/api/appointments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                confirmationCode: opts.confirmationCode,
                razorpayOrderId: r.razorpay_order_id,
                razorpayPaymentId: r.razorpay_payment_id,
                razorpaySignature: r.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verify failed");
            }
            setConfirmed(verifyData.appointment);
            setDemoMessage(null);
            setStep(4);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
      });

      rzp.on("payment.failed", (resp: unknown) => {
        const detail =
          resp && typeof resp === "object" && "error" in resp
            ? String(
                (resp as { error?: { description?: string } }).error
                  ?.description ?? "Payment failed",
              )
            : "Payment failed";
        reject(new Error(detail));
      });

      rzp.open();
    });
  }

  function canContinueFromDetails() {
    return (
      parentName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim()) &&
      /^[6-9]\d{9}$/.test(parentMobile.trim()) &&
      childName.trim().length >= 1 &&
      Boolean(dateKey) &&
      Boolean(slotStart)
    );
  }

  return (
    <div className="mt-10 space-y-6">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Consultation fee:{" "}
        <span className="font-medium text-foreground">₹{feeInr}</span>
        {!razorpayReady ? (
          <span className="ml-2 text-xs">
            (demo confirm until Razorpay keys are added)
          </span>
        ) : null}
      </p>

      {error ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {step === 0 ? (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Type of visit</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {VISIT_TYPE_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setVisitType(key)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  visitType === key
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border/80 bg-card hover:border-primary/40"
                }`}
              >
                {VISIT_TYPE_LABELS[key]}
              </button>
            ))}
          </div>
          <Button type="button" className="rounded-full" onClick={() => setStep(1)}>
            Continue
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Pick a slot</h2>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground">Loading availability…</p>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d) => (
                  <button
                    key={d.dateKey}
                    type="button"
                    onClick={() => {
                      setDateKey(d.dateKey);
                      setSlotStart("");
                    }}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-sm ${
                      dateKey === d.dateKey
                        ? "border-primary bg-primary/10 font-medium"
                        : "border-border/80"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(selectedDay?.slots ?? []).map((s) => (
                  <button
                    key={s.start}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setSlotStart(s.start)}
                    className={`rounded-xl border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                      slotStart === s.start
                        ? "border-primary bg-primary/10 font-medium"
                        : "border-border/80"
                    }`}
                  >
                    {s.label}
                    {!s.available ? " · taken" : ""}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setStep(0)}
            >
              Back
            </Button>
            <Button
              type="button"
              className="rounded-full"
              disabled={!dateKey || !slotStart}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">
            Parent & child details
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedDay?.label} · {selectedSlotLabel} ·{" "}
            {VISIT_TYPE_LABELS[visitType]}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parent-name">Parent name</Label>
              <Input
                id="parent-name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent-mobile">Mobile (10 digit)</Label>
              <Input
                id="parent-mobile"
                inputMode="numeric"
                value={parentMobile}
                onChange={(e) =>
                  setParentMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="parent-email">
                Email (confirmation & reminders)
              </Label>
              <Input
                id="parent-email"
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-name">Child name</Label>
              <Input
                id="child-name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-age">Child age (optional)</Label>
              <Input
                id="child-age"
                placeholder="e.g. 18 months"
                value={childAgeNote}
                onChange={(e) => setChildAgeNote(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="reason">Reason for visit (optional)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              className="rounded-full"
              disabled={!canContinueFromDetails()}
              onClick={() => setStep(3)}
            >
              Review & pay
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Pay & confirm</h2>
          <ul className="space-y-1 rounded-2xl border border-border/80 bg-card p-4 text-sm">
            <li>
              <span className="text-muted-foreground">When:</span>{" "}
              {selectedDay?.label} · {selectedSlotLabel}
            </li>
            <li>
              <span className="text-muted-foreground">Visit:</span>{" "}
              {VISIT_TYPE_LABELS[visitType]}
            </li>
            <li>
              <span className="text-muted-foreground">Child:</span> {childName}
              {childAgeNote ? ` (${childAgeNote})` : ""}
            </li>
            <li>
              <span className="text-muted-foreground">Parent:</span> {parentName}{" "}
              · {parentMobile}
            </li>
            <li>
              <span className="text-muted-foreground">Email:</span> {parentEmail}
            </li>
            <li>
              <span className="text-muted-foreground">Fee:</span> ₹{feeInr}
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            After payment you and the doctor both get a confirmation email.
            Reminder emails go out the day before / morning of the visit.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setStep(2)}
              disabled={submitting}
            >
              Back
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => void startPayment()}
              disabled={submitting}
            >
              {submitting
                ? "Please wait…"
                : razorpayReady
                  ? `Pay ₹${feeInr} with Razorpay`
                  : `Confirm booking (demo) · ₹${feeInr}`}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 4 && confirmed ? (
        <div className="space-y-4 rounded-3xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Appointment confirmed
          </h2>
          <p className="text-sm text-muted-foreground">
            Confirmation code{" "}
            <span className="font-mono font-semibold text-foreground">
              {confirmed.confirmationCode}
            </span>
          </p>
          <ul className="space-y-1 text-sm">
            <li>
              {confirmed.dateLabel} · {confirmed.slotLabel}
            </li>
            <li>
              {confirmed.childName} with {confirmed.parentName}
            </li>
            <li>Receipt email: {confirmed.parentEmail}</li>
            <li>Paid: ₹{confirmed.amountInr}</li>
          </ul>
          {demoMessage ? (
            <p className="text-xs text-muted-foreground">{demoMessage}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Confirmation sent to you and the clinic. Reminders will follow
              before the visit.
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setStep(0);
              setConfirmed(null);
              setDemoMessage(null);
              setSlotStart("");
              setReason("");
            }}
          >
            Book another
          </Button>
        </div>
      ) : null}
    </div>
  );
}
