"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  Download,
  FileText,
  Printer,
} from "lucide-react";
import { GrowthCharts } from "@/components/growth/growth-charts";
import { FollowUpForm } from "@/components/growth/follow-up-form";
import { PatientSummary } from "@/components/growth/patient-summary";
import { StatusBadge } from "@/components/growth/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharts } from "@/hooks/use-charts";
import { usePatient } from "@/hooks/use-patient";
import {
  formatMeasure,
  formatPercentile,
  formatZScore,
} from "@/lib/utils/format";
import { inferSeverityColor } from "@/types/api";
import { toast } from "@/components/ui/use-toast";

export default function PatientDashboardPage() {
  const params = useParams<{ patientId: string }>();
  const patientId = decodeURIComponent(params.patientId);
  const { patient, visits, alerts, loading, error, refresh } =
    usePatient(patientId);
  const {
    charts,
    loading: chartsLoading,
    error: chartsError,
    refresh: refreshCharts,
  } = useCharts(patientId);

  async function refreshAll() {
    await Promise.all([refresh(), refreshCharts()]);
  }

  function openExport(kind: "pdf" | "csv") {
    const url = `/api/patients/${encodeURIComponent(patientId)}/export/${kind}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast({
      title: kind === "pdf" ? "Opening PDF" : "Downloading CSV",
      description: "Export started from the clinic API.",
    });
  }

  if (loading && !patient) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient not found</CardTitle>
          <CardDescription>{error ?? "Unknown patient ID"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/growth/search">Back to search</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const measurement = patient.latestVisit?.measurements?.[0];
  const zScores = [
    {
      label: "Weight-for-age",
      z: measurement?.weightForAgeZ,
      p: measurement?.weightForAgePercentile,
    },
    {
      label: "Height-for-age",
      z: measurement?.heightForAgeZ,
      p: measurement?.heightForAgePercentile,
    },
    {
      label: "BMI-for-age",
      z: measurement?.bmiForAgeZ,
      p: measurement?.bmiForAgePercentile,
    },
    {
      label: "Weight-for-height",
      z: measurement?.weightForHeightZ,
      p: measurement?.weightForHeightPercentile,
    },
    {
      label: "HC-for-age",
      z: measurement?.hcForAgeZ,
      p: measurement?.hcForAgePercentile,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">{patient.name}</h1>
          <p className="text-sm text-muted-foreground">
            Patient dashboard ·{" "}
            {measurement?.referenceSource ?? "—"}{" "}
            {measurement?.referenceVersion ?? ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/growth/patients/${encodeURIComponent(patientId)}/print`}>
              <Printer className="h-4 w-4" />
              Print view
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => openExport("pdf")}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => openExport("csv")}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      <PatientSummary patient={patient} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {zScores.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-xl font-semibold">
                {formatZScore(item.z)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPercentile(item.p)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length > 0 ? (
        <Card className="border-[color-mix(in_oklab,var(--status-orange)_35%,var(--border))]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-[var(--status-orange)]" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={`${alert.type}-${i}`}
                className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm"
              >
                <p>{alert.message}</p>
                <StatusBadge
                  label={alert.severity}
                  color={
                    alert.severity === "critical"
                      ? "red"
                      : alert.severity === "warning"
                        ? "orange"
                        : "yellow"
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="charts">
        <TabsList className="no-print">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="follow-up">Add Follow-up</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="charts">
          {chartsLoading && !charts ? (
            <p className="text-sm text-muted-foreground">Loading charts…</p>
          ) : chartsError ? (
            <p className="text-sm text-destructive">{chartsError}</p>
          ) : charts ? (
            <GrowthCharts payload={charts} />
          ) : (
            <p className="text-sm text-muted-foreground">No chart data.</p>
          )}
        </TabsContent>

        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Visit history</CardTitle>
              <CardDescription>
                Longitudinal measurements — past visits are never overwritten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <p className="text-sm text-muted-foreground">No visits yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-border text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-3 font-medium">Date</th>
                        <th className="py-2 pr-3 font-medium">Age</th>
                        <th className="py-2 pr-3 font-medium">Wt</th>
                        <th className="py-2 pr-3 font-medium">Ht</th>
                        <th className="py-2 pr-3 font-medium">BMI</th>
                        <th className="py-2 pr-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((v) => {
                        const m = v.measurements?.[0];
                        return (
                          <tr key={v.id} className="border-b border-border/70">
                            <td className="py-2.5 pr-3">
                              {new Date(v.visitDate).toLocaleDateString("en-IN")}
                            </td>
                            <td className="py-2.5 pr-3">
                              {v.ageYears}y {v.ageMonths}m {v.ageDays}d
                            </td>
                            <td className="py-2.5 pr-3">
                              {formatMeasure(v.weightKg, 2, "kg")}
                            </td>
                            <td className="py-2.5 pr-3">
                              {formatMeasure(v.heightCm, 1, "cm")}
                            </td>
                            <td className="py-2.5 pr-3">
                              {formatMeasure(v.bmi, 1)}
                            </td>
                            <td className="py-2.5 pr-3">
                              <StatusBadge
                                label={m?.nutritionalStatus ?? "—"}
                                color={
                                  m
                                    ? inferSeverityColor(
                                        m.nutritionalStatus,
                                        m.clinicalFlags,
                                      )
                                    : "yellow"
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Add follow-up visit</CardTitle>
              <CardDescription>
                New anthropometry creates a new visit snapshot and recalculates
                growth metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FollowUpForm patientId={patientId} onSuccess={refreshAll} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Vaccinations</CardTitle>
              <CardDescription>
                Simple status from the latest visit notes. Full schedule tracking
                can be expanded later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Latest status: </span>
                {patient.latestVisit?.vaccinationStatus || "Not recorded"}
              </p>
              <ul className="space-y-2">
                {visits
                  .filter((v) => v.vaccinationStatus)
                  .slice(0, 8)
                  .map((v) => (
                    <li
                      key={v.id}
                      className="rounded-lg border border-border px-3 py-2"
                    >
                      <span className="font-medium">
                        {new Date(v.visitDate).toLocaleDateString("en-IN")}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {v.vaccinationStatus}
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Export</CardTitle>
              <CardDescription>
                Download clinic PDF report or CSV visit history from the API.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={() => openExport("pdf")}>
                <FileText className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="secondary" onClick={() => openExport("csv")}>
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
              <Button asChild variant="outline">
                <Link
                  href={`/growth/patients/${encodeURIComponent(patientId)}/print`}
                >
                  <Printer className="h-4 w-4" />
                  Open print report
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
