"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INSTAGRAM_URL } from "@/lib/constants";
import {
  CONSULT_FEE_FOLLOWER_INR,
  CONSULT_FEE_NON_FOLLOWER_INR,
  CONSULT_PAYMENT_LINK,
  consultFeeInr,
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

const STEPS = ["Visit", "Slot", "Details", "Pay", "Done"] as const;

export function ConsultBookingWizard() {
  const [step, setStep] = React.useState(0);
  const [days, setDays] = React.useState<DaySlots[]>([]);
  const [paymentUrl, setPaymentUrl] = React.useState(CONSULT_PAYMENT_LINK);
  const [loadingSlots, setLoadingSlots] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState<AppointmentSummary | null>(
    null,
  );
  const [pendingCode, setPendingCode] = React.useState<string | null>(null);
  const [awaitingPayment, setAwaitingPayment] = React.useState(false);

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
  const [instagramFollower, setInstagramFollower] = React.useState<
    boolean | null
  >(null);

  const feeInr =
    instagramFollower === null
      ? CONSULT_FEE_NON_FOLLOWER_INR
      : consultFeeInr(instagramFollower);

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
        if (typeof data.paymentUrl === "string" && data.paymentUrl) {
          setPaymentUrl(data.paymentUrl);
        }
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
    if (instagramFollower === null) {
      setError("Please say whether you follow on Instagram");
      return;
    }
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
          instagramFollower,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      const code = data.appointment?.confirmationCode as string | undefined;
      if (!code) throw new Error("Booking created without a confirmation code");

      setPendingCode(code);
      setAwaitingPayment(true);
      const url =
        typeof data.paymentUrl === "string" && data.paymentUrl
          ? data.paymentUrl
          : paymentUrl;
      setPaymentUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmPaymentDone() {
    if (!pendingCode) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationCode: pendingCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not confirm payment");
      setConfirmed(data.appointment);
      setAwaitingPayment(false);
      setPendingCode(null);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not confirm payment");
    } finally {
      setSubmitting(false);
    }
  }

  function canContinueFromDetails() {
    return (
      parentName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim()) &&
      /^[6-9]\d{9}$/.test(parentMobile.trim()) &&
      childName.trim().length >= 1 &&
      Boolean(dateKey) &&
      Boolean(slotStart) &&
      instagramFollower !== null
    );
  }

  return (
    <div className="mt-10 space-y-6">
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
        <span className="font-medium text-foreground">
          ₹{CONSULT_FEE_FOLLOWER_INR}
        </span>{" "}
        only for my followers, otherwise{" "}
        <span className="font-medium text-foreground">
          ₹{CONSULT_FEE_NON_FOLLOWER_INR}
        </span>
        {instagramFollower !== null ? (
          <>
            {" "}
            — your fee:{" "}
            <span className="font-medium text-foreground">₹{feeInr}</span>
          </>
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
            <div className="space-y-2 sm:col-span-2">
              <Label>Do you follow Dr Care for Kids on Instagram?</Label>
              <p className="text-xs text-muted-foreground">
                Followers pay ₹{CONSULT_FEE_FOLLOWER_INR}. Others pay ₹
                {CONSULT_FEE_NON_FOLLOWER_INR}.{" "}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Open Instagram
                </a>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setInstagramFollower(true)}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    instagramFollower === true
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border/80"
                  }`}
                >
                  Yes — ₹{CONSULT_FEE_FOLLOWER_INR}
                </button>
                <button
                  type="button"
                  onClick={() => setInstagramFollower(false)}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    instagramFollower === false
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border/80"
                  }`}
                >
                  No — ₹{CONSULT_FEE_NON_FOLLOWER_INR}
                </button>
              </div>
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
              <span className="text-muted-foreground">Instagram follower:</span>{" "}
              {instagramFollower ? "Yes" : "No"}
            </li>
            <li>
              <span className="text-muted-foreground">Fee:</span> ₹{feeInr}
            </li>
          </ul>

          {awaitingPayment && pendingCode ? (
            <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
              <p>
                Slot held. Pay exactly{" "}
                <span className="font-semibold">₹{feeInr}</span> at{" "}
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  razorpay.me/@drcareforkids
                </a>
                .
              </p>
              <p className="text-xs text-muted-foreground">
                Confirmation code:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {pendingCode}
                </span>
                . Mention this in the payment notes if asked.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    window.open(paymentUrl, "_blank", "noopener,noreferrer")
                  }
                >
                  Open payment link
                </Button>
                <Button
                  type="button"
                  className="rounded-full"
                  onClick={() => void confirmPaymentDone()}
                  disabled={submitting}
                >
                  {submitting ? "Confirming…" : `I paid ₹${feeInr}`}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                You will be taken to Razorpay to pay ₹{feeInr}. After paying,
                return here and confirm so we can email you and the clinic.
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
                  disabled={submitting || instagramFollower === null}
                >
                  {submitting
                    ? "Please wait…"
                    : `Pay ₹${feeInr} via Razorpay`}
                </Button>
              </div>
            </>
          )}
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
          <p className="text-xs text-muted-foreground">
            Confirmation sent to you and the clinic. Reminders will follow
            before the visit.
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setStep(0);
              setConfirmed(null);
              setSlotStart("");
              setReason("");
              setInstagramFollower(null);
              setAwaitingPayment(false);
              setPendingCode(null);
            }}
          >
            Book another
          </Button>
        </div>
      ) : null}
    </div>
  );
}
