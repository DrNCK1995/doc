"use client";

import * as React from "react";
import { addVisitSchema } from "@/lib/validations/visit";
import { parseApiError } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type FollowUpFormProps = {
  patientId: string;
  onSuccess?: () => void;
};

function toOptionalNumber(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function FollowUpForm({ patientId, onSuccess }: FollowUpFormProps) {
  const [visitDate, setVisitDate] = React.useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [weightKg, setWeightKg] = React.useState("");
  const [heightCm, setHeightCm] = React.useState("");
  const [headCircumferenceCm, setHeadCircumferenceCm] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [doctorAdvice, setDoctorAdvice] = React.useState("");
  const [vaccinationStatus, setVaccinationStatus] = React.useState("");
  const [nextVisitDue, setNextVisitDue] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      visitDate,
      weightKg: toOptionalNumber(weightKg),
      heightCm: toOptionalNumber(heightCm),
      headCircumferenceCm: toOptionalNumber(headCircumferenceCm),
      notes: notes.trim() || null,
      doctorAdvice: doctorAdvice.trim() || null,
      vaccinationStatus: vaccinationStatus.trim() || null,
      nextVisitDue: nextVisitDue || null,
    };

    const parsed = addVisitSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      toast({
        variant: "destructive",
        title: "Check follow-up details",
        description: parsed.error.issues[0]?.message ?? "Validation failed",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/patients/${encodeURIComponent(patientId)}/visits`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      if (!res.ok) throw new Error(await parseApiError(res));
      toast({
        title: "Follow-up saved",
        description: "Growth interpretation updated from the values you entered.",
      });
      setWeightKg("");
      setHeightCm("");
      setHeadCircumferenceCm("");
      setNotes("");
      setDoctorAdvice("");
      setVaccinationStatus("");
      setNextVisitDue("");
      onSuccess?.();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not save visit",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Fields are optional — enter only what you measured. We interpret
        whatever is filled (weight-for-age, height-for-age, BMI, head
        circumference).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="visitDate" className="mb-1.5 block">
            Visit date
          </Label>
          <Input
            id="visitDate"
            type="date"
            value={visitDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />
          {fieldErrors.visitDate ? (
            <p className="mt-1 text-xs text-destructive">
              {fieldErrors.visitDate}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="nextVisitDue" className="mb-1.5 block">
            Next visit due (optional)
          </Label>
          <Input
            id="nextVisitDue"
            type="date"
            value={nextVisitDue}
            onChange={(e) => setNextVisitDue(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fu-weight" className="mb-1.5 block">
            Weight (kg) — optional
          </Label>
          <Input
            id="fu-weight"
            type="number"
            step="0.01"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          {fieldErrors.weightKg ? (
            <p className="mt-1 text-xs text-destructive">
              {fieldErrors.weightKg}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="fu-height" className="mb-1.5 block">
            Height (cm) — optional
          </Label>
          <Input
            id="fu-height"
            type="number"
            step="0.1"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
          {fieldErrors.heightCm ? (
            <p className="mt-1 text-xs text-destructive">
              {fieldErrors.heightCm}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="fu-hc" className="mb-1.5 block">
            Head circumference (cm) — optional
          </Label>
          <Input
            id="fu-hc"
            type="number"
            step="0.1"
            value={headCircumferenceCm}
            onChange={(e) => setHeadCircumferenceCm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fu-vax" className="mb-1.5 block">
            Vaccination status
          </Label>
          <Input
            id="fu-vax"
            value={vaccinationStatus}
            onChange={(e) => setVaccinationStatus(e.target.value)}
            placeholder="e.g. Age-appropriate, up to date"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="fu-notes" className="mb-1.5 block">
            Notes
          </Label>
          <Input
            id="fu-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="fu-advice" className="mb-1.5 block">
            Doctor advice
          </Label>
          <Input
            id="fu-advice"
            value={doctorAdvice}
            onChange={(e) => setDoctorAdvice(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Save & interpret"}
      </Button>
    </form>
  );
}
