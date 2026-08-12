"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GrowthCharts } from "@/components/growth/growth-charts";
import { PatientSummary } from "@/components/growth/patient-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCharts } from "@/hooks/use-charts";
import { usePatient } from "@/hooks/use-patient";
import {
  formatMeasure,
  formatPercentile,
  formatZScore,
} from "@/lib/utils/format";

export default function PatientPrintPage() {
  const params = useParams<{ patientId: string }>();
  const patientId = decodeURIComponent(params.patientId);
  const { patient, visits, loading, error } = usePatient(patientId);
  const { charts, loading: chartsLoading } = useCharts(patientId);

  React.useEffect(() => {
    if (!loading && !chartsLoading && patient) {
      const t = window.setTimeout(() => window.print(), 600);
      return () => window.clearTimeout(t);
    }
  }, [loading, chartsLoading, patient]);

  if (loading || !patient) {
    return (
      <p className="text-sm text-muted-foreground">
        {error ?? "Preparing print report…"}
      </p>
    );
  }

  const m = patient.latestVisit?.measurements?.[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-background print:max-w-none print:bg-white">
      <div className="no-print flex items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/growth/patients/${encodeURIComponent(patientId)}`}>
            Back to dashboard
          </Link>
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <header className="border-b border-border pb-4">
        <p className="font-display text-2xl font-semibold text-primary">
          Dr. Chaitanya Krishna
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold">
          Pediatric Growth Report
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generated {new Date().toLocaleString("en-IN")}
        </p>
      </header>

      <PatientSummary patient={patient} showQr />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Latest assessment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <PrintMetric label="WFA Z" value={formatZScore(m?.weightForAgeZ)} />
          <PrintMetric
            label="WFA %ile"
            value={formatPercentile(m?.weightForAgePercentile)}
          />
          <PrintMetric label="HFA Z" value={formatZScore(m?.heightForAgeZ)} />
          <PrintMetric
            label="HFA %ile"
            value={formatPercentile(m?.heightForAgePercentile)}
          />
          <PrintMetric label="BMI Z" value={formatZScore(m?.bmiForAgeZ)} />
          <PrintMetric
            label="Status"
            value={m?.nutritionalStatus ?? "—"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Visit history</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2">Date</th>
                <th className="py-2">Weight</th>
                <th className="py-2">Height</th>
                <th className="py-2">BMI</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={v.id} className="border-b border-border/60">
                  <td className="py-2">
                    {new Date(v.visitDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-2">
                    {formatMeasure(v.weightKg, 2, "kg")}
                  </td>
                  <td className="py-2">
                    {formatMeasure(v.heightCm, 1, "cm")}
                  </td>
                  <td className="py-2">{formatMeasure(v.bmi, 1)}</td>
                  <td className="py-2">
                    {v.measurements?.[0]?.nutritionalStatus ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {charts ? (
        <div className="print-break">
          <h2 className="mb-4 font-display text-2xl font-semibold">
            Growth charts
          </h2>
          <GrowthCharts payload={charts} />
        </div>
      ) : null}
    </div>
  );
}

function PrintMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
