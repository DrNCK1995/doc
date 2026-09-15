"use client";

import * as React from "react";
import { Printer } from "lucide-react";
import { GrowthCharts } from "@/components/growth/growth-charts";
import { PrintCtaLinks } from "@/components/growth/print-cta-links";
import { StatusBadge } from "@/components/growth/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  formatAge,
  formatMeasure,
  formatPercentile,
  formatZScore,
} from "@/lib/utils/format";
import type { ChartPayload } from "@/types/charts";
import type { SeverityColor } from "@/lib/growth/types";

type CheckResult = {
  stored: false;
  message: string;
  age: {
    years: number;
    months: number;
    days: number;
    totalMonths: number;
  };
  visitDate: string;
  measures: {
    weightKg: number | null;
    heightCm: number | null;
    headCm: number | null;
    bmi: number | null;
  };
  assessment: {
    reference: { source: string; version: string };
    classification: {
      primaryStatus: string;
      severityColor: SeverityColor;
      notes?: string[];
    };
    expectedWeightKg: number | null;
    expectedHeightCm: number | null;
    weightForAge: { z: number; percentile: number } | null;
    heightForAge: { z: number; percentile: number } | null;
    bmiForAge: { z: number; percentile: number } | null;
    weightForHeight: { z: number; percentile: number } | null;
    headCircumferenceForAge: { z: number; percentile: number } | null;
  };
  charts: ChartPayload;
};

function toOptionalNumber(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function OneShotGrowthCheck() {
  const [name, setName] = React.useState("");
  const [sex, setSex] = React.useState<"MALE" | "FEMALE">("MALE");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [visitDate, setVisitDate] = React.useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [weightKg, setWeightKg] = React.useState("");
  const [heightCm, setHeightCm] = React.useState("");
  const [headCm, setHeadCm] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<CheckResult | null>(null);
  const printRef = React.useRef<HTMLDivElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    const w = toOptionalNumber(weightKg);
    const h = toOptionalNumber(heightCm);
    const hc = toOptionalNumber(headCm);
    if (
      (w != null && Number.isNaN(w)) ||
      (h != null && Number.isNaN(h)) ||
      (hc != null && Number.isNaN(hc))
    ) {
      toast({
        variant: "destructive",
        title: "Check numbers",
        description: "Use valid numbers for measurements.",
      });
      return;
    }
    if (w == null && h == null && hc == null) {
      toast({
        variant: "destructive",
        title: "Add a measurement",
        description: "Enter weight, height, or head circumference.",
      });
      return;
    }
    if (!dateOfBirth) {
      toast({
        variant: "destructive",
        title: "Date of birth needed",
        description: "We need DOB to place the point on the chart.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/growth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          sex,
          dateOfBirth,
          visitDate: visitDate || undefined,
          weightKg: w,
          heightCm: h,
          headCircumferenceCm: hc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check growth");
      setResult(data as CheckResult);
      toast({
        title: "Chart ready",
        description: "Nothing was stored. You can print or download below.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Check failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-8">
      <Card className="no-print">
        <CardHeader>
          <CardTitle className="text-xl">Enter today’s measures</CardTitle>
          <CardDescription>
            Optional name for the printout only. Nothing is saved to your
            account or our database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="qc-name" className="mb-1.5 block">
                  Child name (optional)
                </Label>
                <Input
                  id="qc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="For the printout"
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Sex</Label>
                <div className="flex gap-2">
                  {(
                    [
                      ["MALE", "Boy"],
                      ["FEMALE", "Girl"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSex(value)}
                      className={`h-11 flex-1 rounded-xl border text-sm ${
                        sex === value
                          ? "border-primary bg-primary/10 font-medium"
                          : "border-border/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="qc-dob" className="mb-1.5 block">
                  Date of birth
                </Label>
                <Input
                  id="qc-dob"
                  type="date"
                  value={dateOfBirth}
                  max={visitDate || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="qc-visit" className="mb-1.5 block">
                  Check date
                </Label>
                <Input
                  id="qc-visit"
                  type="date"
                  value={visitDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="qc-wt" className="mb-1.5 block">
                  Weight (kg)
                </Label>
                <Input
                  id="qc-wt"
                  inputMode="decimal"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 12.4"
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="qc-ht" className="mb-1.5 block">
                  Height / length (cm)
                </Label>
                <Input
                  id="qc-ht"
                  inputMode="decimal"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="e.g. 85"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="qc-hc" className="mb-1.5 block">
                  Head circumference (cm) — optional
                </Label>
                <Input
                  id="qc-hc"
                  inputMode="decimal"
                  value={headCm}
                  onChange={(e) => setHeadCm(e.target.value)}
                  placeholder="Usually under 5 years"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="rounded-full"
              disabled={submitting}
            >
              {submitting ? "Checking…" : "Check & show chart"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result ? (
        <div ref={printRef} className="space-y-6">
          <div className="no-print flex flex-wrap gap-2">
            <Button
              type="button"
              className="rounded-full"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print / save as PDF
            </Button>
            <p className="self-center text-xs text-muted-foreground">
              Use your browser print dialog → Save as PDF. Data stays only on
              this page until you leave.
            </p>
          </div>

          <header className="border-b border-border pb-4">
            <p className="font-display text-2xl font-semibold text-primary">
              Dr Care for Kids
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold">
              One-time growth chart
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.charts.name} ·{" "}
              {result.charts.sex === "MALE" ? "Boy" : "Girl"} · DOB{" "}
              {result.charts.dateOfBirth} · Checked {result.visitDate}
            </p>
            <p className="mt-2 text-xs font-medium text-accent">
              {result.message}
            </p>
          </header>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              label={result.assessment.classification.primaryStatus}
              color={result.assessment.classification.severityColor}
            />
            <span className="text-sm text-muted-foreground">
              Age {formatAge(result.age)} ·{" "}
              {result.assessment.reference.source}{" "}
              {result.assessment.reference.version}
            </span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Measures & Z-scores</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Metric
                label="Weight"
                value={formatMeasure(result.measures.weightKg, 2, "kg")}
              />
              <Metric
                label="Height"
                value={formatMeasure(result.measures.heightCm, 1, "cm")}
              />
              <Metric
                label="BMI"
                value={formatMeasure(result.measures.bmi, 1)}
              />
              <Metric
                label="Head circumference"
                value={formatMeasure(result.measures.headCm, 1, "cm")}
              />
              <Metric
                label="WFA"
                value={`${formatZScore(result.assessment.weightForAge?.z)} · ${formatPercentile(result.assessment.weightForAge?.percentile)}`}
              />
              <Metric
                label="HFA"
                value={`${formatZScore(result.assessment.heightForAge?.z)} · ${formatPercentile(result.assessment.heightForAge?.percentile)}`}
              />
              <Metric
                label="BMI-for-age"
                value={`${formatZScore(result.assessment.bmiForAge?.z)} · ${formatPercentile(result.assessment.bmiForAge?.percentile)}`}
              />
              <Metric
                label="Expected weight (median)"
                value={formatMeasure(
                  result.assessment.expectedWeightKg,
                  2,
                  "kg",
                )}
              />
              <Metric
                label="Expected height (median)"
                value={formatMeasure(
                  result.assessment.expectedHeightCm,
                  1,
                  "cm",
                )}
              />
            </CardContent>
          </Card>

          {(result.assessment.classification.notes?.length ?? 0) > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {result.assessment.classification.notes!.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}

          <GrowthCharts payload={result.charts} />

          <PrintCtaLinks />

          <p className="text-xs text-muted-foreground">
            Parent education only — not a diagnosis. Discuss results with your
            paediatrician.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
    </div>
  );
}
