"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NUTRITION_BANDS, nutritionBand } from "@/lib/nutrition/requirements";
import type { NutritionBandId } from "@/lib/nutrition/types";
import {
  DIET_STATUS_LABELS,
  dietStatusFromWeight,
  expectedWeightForAgeMonths,
  getDietChart,
  type DietWeightStatus,
} from "@/lib/nutrition/south-indian-diet";

export function SouthIndianDietChartPanel({
  initialBandId,
  initialWeightKg,
  initialStatus,
}: {
  initialBandId?: NutritionBandId;
  initialWeightKg?: number;
  initialStatus?: DietWeightStatus;
} = {}) {
  const [bandId, setBandId] = React.useState<NutritionBandId>(
    initialBandId ?? "1-2y",
  );
  const [weightKg, setWeightKg] = React.useState(
    initialWeightKg && initialWeightKg > 0 ? String(initialWeightKg) : "",
  );
  const [status, setStatus] = React.useState<DietWeightStatus>(
    initialStatus ?? "adequate",
  );
  const [pref, setPref] = React.useState<"veg" | "nonveg">("veg");

  React.useEffect(() => {
    if (initialBandId) setBandId(initialBandId);
  }, [initialBandId]);

  React.useEffect(() => {
    if (initialWeightKg && initialWeightKg > 0) {
      setWeightKg(String(initialWeightKg));
    }
  }, [initialWeightKg]);

  React.useEffect(() => {
    if (initialStatus) setStatus(initialStatus);
  }, [initialStatus]);

  const bandMeta = NUTRITION_BANDS.find((b) => b.id === bandId)!;
  const midMonths = Math.floor((bandMeta.minMonths + bandMeta.maxMonths) / 2);
  const expectedKg = expectedWeightForAgeMonths(midMonths);
  const parsedWeight = Number(weightKg);
  const autoStatus =
    weightKg.trim() && parsedWeight > 0
      ? dietStatusFromWeight(midMonths, parsedWeight)
      : null;

  const chart = getDietChart(bandId, status);

  function applyWeight() {
    if (!(parsedWeight > 0)) return;
    setStatus(dietStatusFromWeight(midMonths, parsedWeight));
  }

  return (
    <section
      id="south-indian-diet"
      className="scroll-mt-24 space-y-6 rounded-3xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Model diet chart
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          South Indian style — by age &amp; weight
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Sample day plans using idli, dosa, ragi, rice–sambar, curd rice, sundal,
          and home non-veg options. Choose age, then balanced / catch-up
          (malnutrition) / portion-aware plates. Education only — not a
          prescription for severe malnutrition.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Age group</p>
        <div className="flex flex-wrap gap-2">
          {NUTRITION_BANDS.map((b) => (
            <Button
              key={b.id}
              type="button"
              size="sm"
              variant={bandId === b.id ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setBandId(b.id)}
            >
              {b.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="diet-weight">
            Current weight (kg) — optional, auto-picks chart type
          </Label>
          <Input
            id="diet-weight"
            type="number"
            step="0.1"
            min="1"
            placeholder={`Typical for this age ~${expectedKg} kg`}
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="h-11 rounded-xl"
          />
          {autoStatus ? (
            <p className="text-xs text-muted-foreground">
              From weight vs expected (~{expectedKg} kg at mid-band):{" "}
              <span className="font-medium text-foreground">
                {DIET_STATUS_LABELS[autoStatus]}
              </span>
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          className="rounded-full"
          variant="secondary"
          onClick={applyWeight}
          disabled={!(parsedWeight > 0)}
        >
          Apply weight
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Nutrition focus</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DIET_STATUS_LABELS) as DietWeightStatus[]).map((key) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={status === key ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setStatus(key)}
            >
              {DIET_STATUS_LABELS[key]}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={pref === "veg" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setPref("veg")}
        >
          Vegetarian plate
        </Button>
        <Button
          type="button"
          size="sm"
          variant={pref === "nonveg" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setPref("nonveg")}
        >
          Non-vegetarian plate
        </Button>
      </div>

      <div
        className={`rounded-2xl border p-5 ${
          status === "undernourished"
            ? "border-amber-500/40 bg-amber-500/5"
            : status === "overweight"
              ? "border-sky-500/30 bg-sky-500/5"
              : "border-border/80 bg-background/60"
        }`}
      >
        <h3 className="font-display text-xl font-semibold">{chart.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{chart.focus}</p>
        <p className="mt-2 text-xs font-medium text-accent">{chart.energyCue}</p>

        <ul className="mt-5 space-y-3">
          {chart.meals.map((meal) => (
            <li
              key={meal.time}
              className="rounded-xl border border-border/60 bg-card/80 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {meal.time}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {pref === "nonveg" && meal.nonVeg ? meal.nonVeg : meal.veg}
              </p>
            </li>
          ))}
        </ul>

        {chart.enrichment.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-semibold">
              {status === "undernourished"
                ? "Catch-up / malnutrition tips"
                : "Enrichment tips"}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {chart.enrichment.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
          {chart.notes.map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Derive chart hints from nutrition assessment growth label. */
export function statusFromGrowthLabel(label: string): DietWeightStatus {
  const l = label.toLowerCase();
  if (
    l.includes("severe") ||
    l.includes("moderate") ||
    l.includes("mild") ||
    l.includes("under") ||
    l.includes("low bmi") ||
    l.includes("wasting") ||
    l.includes("undernutrition")
  ) {
    return "undernourished";
  }
  if (l.includes("overweight") || l.includes("obes")) return "overweight";
  return "adequate";
}

export function bandIdFromAgeMonths(ageMonths: number): NutritionBandId {
  return nutritionBand(ageMonths).id;
}
