"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { calculateAge } from "@/lib/growth/age";
import { formatAge } from "@/lib/utils/format";
import { createPatientSchema } from "@/lib/validations/patient";
import { parseApiError } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useGrowthAuth } from "@/components/growth/access-gate";

type FormState = {
  name: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "";
  birthWeightKg: string;
  weightKg: string;
  heightCm: string;
  headCircumferenceCm: string;
  mobileNumber: string;
  parentName: string;
  email: string;
  address: string;
};

const initial: FormState = {
  name: "",
  dateOfBirth: "",
  sex: "",
  birthWeightKg: "",
  weightKg: "",
  heightCm: "",
  headCircumferenceCm: "",
  mobileNumber: "",
  parentName: "",
  email: "",
  address: "",
};

function optionalNumber(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function requiredNumber(value: string): number {
  return Number(value.trim());
}

export function RegisterForm() {
  const router = useRouter();
  const { auth } = useGrowthAuth();
  const parentMobile =
    auth?.authenticated && auth.role === "parent" ? auth.mobile : null;
  const [form, setForm] = React.useState<FormState>(initial);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!parentMobile) return;
    setForm((prev) =>
      prev.mobileNumber === parentMobile
        ? prev
        : { ...prev, mobileNumber: parentMobile },
    );
  }, [parentMobile]);

  const liveAge = React.useMemo(() => {
    if (!form.dateOfBirth) return null;
    try {
      return calculateAge(form.dateOfBirth);
    } catch {
      return null;
    }
  }, [form.dateOfBirth]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      name: form.name,
      dateOfBirth: form.dateOfBirth,
      sex: form.sex || undefined,
      birthWeightKg: optionalNumber(form.birthWeightKg),
      weightKg: requiredNumber(form.weightKg),
      heightCm: requiredNumber(form.heightCm),
      headCircumferenceCm: optionalNumber(form.headCircumferenceCm),
      mobileNumber: parentMobile ?? form.mobileNumber,
      parentName: form.parentName,
      email: form.email.trim() || undefined,
      address: form.address.trim() || null,
    };

    const parsed = createPatientSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      toast({
        variant: "destructive",
        title: "Please fix the form",
        description: parsed.error.issues[0]?.message ?? "Validation failed",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      const data = (await res.json()) as { patient: { patientId: string } };
      toast({
        title: "Child registered",
        description: `Patient ID ${data.patient.patientId}`,
      });
      router.push(`/growth/patients/${encodeURIComponent(data.patient.patientId)}`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Child name"
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Child full name"
            required
          />
        </Field>

        <Field label="Date of birth" error={fieldErrors.dateOfBirth} htmlFor="dob">
          <Input
            id="dob"
            type="date"
            value={form.dateOfBirth}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setField("dateOfBirth", e.target.value)}
            required
          />
          {liveAge ? (
            <p className="mt-1.5 text-xs text-accent">
              Age: {formatAge(liveAge)} ({liveAge.years}y {liveAge.months}m{" "}
              {liveAge.days}d)
            </p>
          ) : null}
        </Field>

        <Field label="Sex" error={fieldErrors.sex} htmlFor="sex">
          <Select
            value={form.sex || undefined}
            onValueChange={(v) => setField("sex", v as "MALE" | "FEMALE")}
          >
            <SelectTrigger id="sex">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Birth weight (kg, optional)"
          error={fieldErrors.birthWeightKg}
          htmlFor="birthWeight"
        >
          <Input
            id="birthWeight"
            type="number"
            step="0.01"
            min="0.5"
            max="8"
            value={form.birthWeightKg}
            onChange={(e) => setField("birthWeightKg", e.target.value)}
            placeholder="e.g. 2.80"
          />
        </Field>

        <Field
          label="Current weight (kg)"
          error={fieldErrors.weightKg}
          htmlFor="weight"
        >
          <Input
            id="weight"
            type="number"
            step="0.01"
            min="0.5"
            max="200"
            value={form.weightKg}
            onChange={(e) => setField("weightKg", e.target.value)}
            required
          />
        </Field>

        <Field
          label="Height / length (cm)"
          error={fieldErrors.heightCm}
          htmlFor="height"
        >
          <Input
            id="height"
            type="number"
            step="0.1"
            min="20"
            max="250"
            value={form.heightCm}
            onChange={(e) => setField("heightCm", e.target.value)}
            required
          />
        </Field>

        <Field
          label="Head circumference (cm, optional)"
          error={fieldErrors.headCircumferenceCm}
          htmlFor="hc"
        >
          <Input
            id="hc"
            type="number"
            step="0.1"
            min="20"
            max="70"
            value={form.headCircumferenceCm}
            onChange={(e) => setField("headCircumferenceCm", e.target.value)}
          />
        </Field>

        <Field
          label="Parent / guardian name"
          error={fieldErrors.parentName}
          htmlFor="parent"
        >
          <Input
            id="parent"
            value={form.parentName}
            onChange={(e) => setField("parentName", e.target.value)}
            required
          />
        </Field>

        <Field
          label="Mobile number"
          error={fieldErrors.mobileNumber}
          htmlFor="mobile"
        >
          <Input
            id="mobile"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            value={form.mobileNumber}
            onChange={(e) =>
              setField("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="10-digit Indian mobile"
            required
            disabled={Boolean(parentMobile)}
            readOnly={Boolean(parentMobile)}
          />
          {parentMobile ? (
            <p className="text-xs text-muted-foreground">
              Locked to your OTP-verified mobile.
            </p>
          ) : null}
        </Field>

        <Field label="Email (optional)" error={fieldErrors.email} htmlFor="email">
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </Field>

        <Field
          label="Address (optional)"
          error={fieldErrors.address}
          htmlFor="address"
          className="sm:col-span-2"
        >
          <Input
            id="address"
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Registering…" : "Register child"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 block">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
