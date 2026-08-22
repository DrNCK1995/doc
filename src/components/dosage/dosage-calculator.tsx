"use client";

import * as React from "react";
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
import { ScreeningDisclaimer } from "@/components/tools/disclaimer";
import { DoseResultsList } from "@/components/dosage/dose-results-list";
import {
  calculateAllDoses,
  calculateMedicationDose,
} from "@/lib/dosage/calculate";
import { OTC_MEDICATIONS } from "@/lib/dosage/medications";
import type { DoseResult } from "@/lib/dosage/types";
import { totalAgeMonths } from "@/lib/screening/score";

export function DosageCalculator({
  initialWeightKg,
  initialYears,
  initialMonths,
}: {
  initialWeightKg?: number;
  initialYears?: number;
  initialMonths?: number;
}) {
  const [weightKg, setWeightKg] = React.useState(String(initialWeightKg || ""));
  const [years, setYears] = React.useState(String(initialYears ?? 1));
  const [months, setMonths] = React.useState(String(initialMonths ?? 0));
  const [medId, setMedId] = React.useState("all");
  const [results, setResults] = React.useState<DoseResult[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const w = Number(weightKg);
    const age = totalAgeMonths(Number(years) || 0, Number(months) || 0);
    if (!(w > 0) || w > 120) {
      setError("Enter a realistic weight in kg.");
      setResults(null);
      return;
    }
    setError(null);
    if (medId === "all") {
      setResults(calculateAllDoses(w, age));
      return;
    }
    const med = OTC_MEDICATIONS.find((m) => m.id === medId);
    if (!med) return;
    setResults([calculateMedicationDose(med, w, age)]);
  }

  return (
    <div className="space-y-8">
      <ScreeningDisclaimer />
      <p className="text-sm text-muted-foreground">
        Doses are educational (IAP/WHO-style). Always match the strength on your
        bottle. This is not a prescription.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="dose-weight">Weight (kg)</Label>
            <Input
              id="dose-weight"
              type="number"
              min={1}
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dose-years">Age — years</Label>
            <Input
              id="dose-years"
              type="number"
              min={0}
              max={18}
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dose-months">Additional months</Label>
            <Input
              id="dose-months"
              type="number"
              min={0}
              max={11}
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Medicine</Label>
            <Select value={medId} onValueChange={setMedId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All common OTC</SelectItem>
                {OTC_MEDICATIONS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {error ? <p className="text-sm text-[var(--status-red)]">{error}</p> : null}
        <Button type="submit" size="lg">
          Calculate dose in ml
        </Button>
      </form>

      {results ? <DoseResultsList results={results} /> : null}
    </div>
  );
}
