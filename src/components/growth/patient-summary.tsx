"use client";

import * as React from "react";
import QRCode from "qrcode";
import { calculateAge } from "@/lib/growth/age";
import {
  formatAge,
  formatMeasure,
  formatPatientId,
} from "@/lib/utils/format";
import type { ApiPatient } from "@/types/api";
import { inferSeverityColor } from "@/types/api";
import { StatusBadge } from "@/components/growth/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type PatientSummaryProps = {
  patient: ApiPatient;
  showQr?: boolean;
  /** Compact QR for print corner placement. */
  qrSize?: "default" | "compact";
  className?: string;
};

export function PatientSummary({
  patient,
  showQr = true,
  qrSize = "default",
  className,
}: PatientSummaryProps) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);
  const age = calculateAge(patient.dateOfBirth);
  const latest = patient.latestVisit;
  const measurement = latest?.measurements?.[0];
  const color = inferSeverityColor(
    measurement?.nutritionalStatus,
    measurement?.clinicalFlags,
  );
  const compact = qrSize === "compact";
  const px = compact ? 64 : 160;

  React.useEffect(() => {
    if (!showQr) return;
    let cancelled = false;
    void QRCode.toDataURL(patient.patientId, {
      width: px,
      margin: 1,
      color: { dark: "#0B4F6C", light: "#FFFFFF" },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [patient.patientId, showQr, px]);

  return (
    <Card className={className}>
      <CardContent
        className={cn(
          "grid gap-6 p-6",
          showQr && !compact ? "md:grid-cols-[1fr_auto]" : undefined,
        )}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Patient ID
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tracking-tight">
              {formatPatientId(patient.patientId)}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryItem label="Name" value={patient.name} />
            <SummaryItem
              label="Sex"
              value={patient.sex === "MALE" ? "Male" : "Female"}
            />
            <SummaryItem label="Age" value={formatAge(age)} />
            <SummaryItem
              label="Date of birth"
              value={new Date(patient.dateOfBirth).toLocaleDateString("en-IN")}
            />
            <SummaryItem label="Parent" value={patient.parentName} />
            <SummaryItem label="Mobile" value={patient.mobileNumber} />
            <SummaryItem
              label="Last visit"
              value={
                latest
                  ? new Date(latest.visitDate).toLocaleDateString("en-IN")
                  : "—"
              }
            />
            <SummaryItem
              label="Visits"
              value={String(patient.visitCount ?? "—")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Nutrition</span>
            <StatusBadge
              label={measurement?.nutritionalStatus ?? "No assessment"}
              color={measurement ? color : "yellow"}
            />
          </div>

          {latest ? (
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-secondary/50 p-3 text-sm sm:grid-cols-4">
              <Metric
                label="Weight"
                value={formatMeasure(latest.weightKg, 2, "kg")}
              />
              <Metric
                label="Height"
                value={formatMeasure(latest.heightCm, 1, "cm")}
              />
              <Metric label="BMI" value={formatMeasure(latest.bmi, 1)} />
              <Metric
                label="HC"
                value={formatMeasure(latest.headCircumferenceCm, 1, "cm")}
              />
            </div>
          ) : null}
        </div>

        {showQr && !compact ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-secondary/30 p-4">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR code for ${patient.patientId}`}
                className="h-36 w-36 rounded-md bg-white p-1"
              />
            ) : (
              <div className="h-36 w-36 animate-pulse rounded-md bg-muted" />
            )}
            <p className="text-center text-xs text-muted-foreground">
              Scan to retrieve ID
            </p>
          </div>
        ) : null}

        {showQr && compact ? (
          <div className="pointer-events-none absolute right-4 top-4 print:right-6 print:top-6">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR code for ${patient.patientId}`}
                className="h-14 w-14 rounded border border-border bg-white p-0.5"
              />
            ) : (
              <div className="h-14 w-14 animate-pulse rounded bg-muted" />
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

/** Standalone compact QR for print header corner. */
export function PatientQrMark({
  patientId,
  className,
}: {
  patientId: string;
  className?: string;
}) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(patientId, {
      width: 64,
      margin: 1,
      color: { dark: "#0B4F6C", light: "#FFFFFF" },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  return (
    <div className={cn("shrink-0", className)}>
      {qrDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrDataUrl}
          alt={`QR code for ${patientId}`}
          className="h-14 w-14 rounded border border-border bg-white p-0.5"
        />
      ) : (
        <div className="h-14 w-14 animate-pulse rounded bg-muted" />
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
