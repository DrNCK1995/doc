"use client";

import * as React from "react";
import Link from "next/link";
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
import { StatusBadge } from "@/components/growth/status-badge";
import { ScreeningDisclaimer } from "@/components/tools/disclaimer";
import { assessNutrition, formatAgeMonths, totalAgeMonths } from "@/lib/nutrition/assess";
import { FOOD_GROUP_OPTIONS, NUTRITION_BANDS, nutritionBand } from "@/lib/nutrition/requirements";
import type { FoodGroupId, NutritionInput, NutritionResult } from "@/lib/nutrition/types";
import type { ConditionId } from "@/lib/nutrition/condition-advice";
import { ConditionAdvicePanel } from "@/components/nutrition/condition-advice-panel";

const empty: NutritionInput = {
  years: 1,
  months: 0,
  sex: "unspecified",
  weightKg: 0,
  heightCm: 0,
  breastfeeding: "partial",
  formulaMlPerDay: 0,
  complementary: "mashed",
  mealsPerDay: 3,
  snacksPerDay: 2,
  foodGroups: ["cereals", "pulses", "vegetables"],
  milkMlPerDay: 300,
  junkFrequency: "rarely",
  sugaryDrinksPerDay: 0,
  appetite: "good",
  constipation: "none",
};

export function NutritionForm() {
  const [form, setForm] = React.useState<NutritionInput>(empty);
  const [result, setResult] = React.useState<NutritionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const ageMonths = totalAgeMonths(form.years, form.months);
  const band = nutritionBand(ageMonths);
  const infant = band.id === "0-6m";
  const youngInfant = band.id === "0-6m" || band.id === "6-12m";
  const highlight = highlightedConditions(form, result);

  function patch<K extends keyof NutritionInput>(key: K, value: NutritionInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function toggleGroup(id: FoodGroupId) {
    setForm((prev) => {
      const has = prev.foodGroups.includes(id);
      return {
        ...prev,
        foodGroups: has
          ? prev.foodGroups.filter((g) => g !== id)
          : [...prev.foodGroups, id],
      };
    });
    setResult(null);
  }

  function applyBand(id: string) {
    const found = NUTRITION_BANDS.find((b) => b.id === id);
    if (!found) return;
    const months = found.minMonths;
    setForm((prev) => ({
      ...prev,
      years: Math.floor(months / 12),
      months: months % 12,
      complementary: found.id === "0-6m" ? "not_applicable" : prev.complementary,
      breastfeeding: found.id === "0-6m" ? "exclusive" : prev.breastfeeding,
    }));
    setResult(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!(form.weightKg > 0) || !(form.heightCm > 0)) {
      setError("Enter current weight (kg) and height / length (cm).");
      return;
    }
    setError(null);
    setResult(assessNutrition(form));
  }

  return (
    <div className="space-y-8">
      <ScreeningDisclaimer />
      <ConditionAdvicePanel highlight={highlight} />

      <div>
        <p className="text-sm font-medium">Age module</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {NUTRITION_BANDS.map((b) => (
            <Button
              key={b.id}
              type="button"
              size="sm"
              variant={band.id === b.id ? "default" : "outline"}
              onClick={() => applyBand(b.id)}
            >
              {b.label}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Active: {band.label} · {formatAgeMonths(ageMonths)} — adjust years/months if needed.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Years">
            <Input
              type="number"
              min={0}
              max={18}
              value={form.years}
              onChange={(e) => patch("years", Number(e.target.value))}
            />
          </Field>
          <Field label="Months">
            <Input
              type="number"
              min={0}
              max={11}
              value={form.months}
              onChange={(e) => patch("months", Number(e.target.value))}
            />
          </Field>
          <Field label="Weight (kg)">
            <Input
              type="number"
              min={1}
              step="0.1"
              value={form.weightKg || ""}
              onChange={(e) => patch("weightKg", Number(e.target.value))}
            />
          </Field>
          <Field label="Height / length (cm)">
            <Input
              type="number"
              min={40}
              step="0.1"
              value={form.heightCm || ""}
              onChange={(e) => patch("heightCm", Number(e.target.value))}
            />
          </Field>
        </div>

        <Field label="Sex (for older-child calorie reference)">
          <Select
            value={form.sex}
            onValueChange={(v) => patch("sex", v as NutritionInput["sex"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unspecified">Not specified</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {youngInfant ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Breastfeeding / formula">
              <Select
                value={form.breastfeeding}
                onValueChange={(v) =>
                  patch("breastfeeding", v as NutritionInput["breastfeeding"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exclusive">Exclusive breastfeeding</SelectItem>
                  <SelectItem value="partial">Mixed (breast + formula / other)</SelectItem>
                  <SelectItem value="none">Formula / no breast milk</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Formula (ml per day)">
              <Input
                type="number"
                min={0}
                step="10"
                value={form.formulaMlPerDay}
                onChange={(e) => patch("formulaMlPerDay", Number(e.target.value))}
              />
            </Field>
          </div>
        ) : (
          <Field label="Still breastfeeding?">
            <Select
              value={form.breastfeeding}
              onValueChange={(v) =>
                patch("breastfeeding", v as NutritionInput["breastfeeding"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partial">Yes, some breastfeeds</SelectItem>
                <SelectItem value="none">No</SelectItem>
                <SelectItem value="exclusive">Mostly breast milk still</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}

        {!infant ? (
          <>
            <Field label="Complementary / family feeding">
              <Select
                value={form.complementary}
                onValueChange={(v) =>
                  patch("complementary", v as NutritionInput["complementary"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Solids not started</SelectItem>
                  <SelectItem value="purees">Thin purees / watery feeds</SelectItem>
                  <SelectItem value="mashed">Thick mashed foods</SelectItem>
                  <SelectItem value="family_foods">Family foods (soft pieces)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meal frequency (meals / day)">
                <Input
                  type="number"
                  min={0}
                  max={8}
                  value={form.mealsPerDay}
                  onChange={(e) => patch("mealsPerDay", Number(e.target.value))}
                />
              </Field>
              <Field label="Snacks / day">
                <Input
                  type="number"
                  min={0}
                  max={6}
                  value={form.snacksPerDay}
                  onChange={(e) => patch("snacksPerDay", Number(e.target.value))}
                />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-medium">Food groups on most days</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {FOOD_GROUP_OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--primary)]"
                      checked={form.foodGroups.includes(opt.id)}
                      onChange={() => toggleGroup(opt.id)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Animal milk intake (ml / day)">
            <Input
              type="number"
              min={0}
              step="10"
              value={form.milkMlPerDay}
              onChange={(e) => patch("milkMlPerDay", Number(e.target.value))}
            />
          </Field>
          <Field label="Sugary drinks / day">
            <Input
              type="number"
              min={0}
              max={10}
              value={form.sugaryDrinksPerDay}
              onChange={(e) => patch("sugaryDrinksPerDay", Number(e.target.value))}
            />
          </Field>
          <Field label="Junk food / packaged snacks">
            <Select
              value={form.junkFrequency}
              onValueChange={(v) =>
                patch("junkFrequency", v as NutritionInput["junkFrequency"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rarely">Rarely</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Appetite">
            <Select
              value={form.appetite}
              onValueChange={(v) => patch("appetite", v as NutritionInput["appetite"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="variable">Variable</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Constipation">
          <Select
            value={form.constipation}
            onValueChange={(v) =>
              patch("constipation", v as NutritionInput["constipation"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="occasional">Occasional</SelectItem>
              <SelectItem value="frequent">Frequent / painful</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {error ? <p className="text-sm text-[var(--status-red)]">{error}</p> : null}

        <Button type="submit" size="lg">
          Generate nutrition report
        </Button>
      </form>

      {result ? <NutritionResultView result={result} /> : null}
    </div>
  );
}

function highlightedConditions(
  form: NutritionInput,
  result: NutritionResult | null,
): ConditionId[] {
  const ids: ConditionId[] = [];
  if (form.constipation !== "none") ids.push("constipation");
  if (
    result &&
    (result.growthLabel.includes("undernutrition") ||
      result.growthLabel.includes("Low BMI") ||
      result.gaps.some((g) => g.id === "low-energy" || g.id === "low-protein"))
  ) {
    ids.push("malnutrition");
  }
  if (result?.gaps.some((g) => g.id === "protein" || g.id === "micro")) {
    ids.push("anaemia");
  }
  return ids;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function NutritionResultView({ result }: { result: NutritionResult }) {
  const growthColor =
    result.growthLabel.startsWith("Possible severe") || result.growthLabel.startsWith("Low BMI")
      ? "red"
      : result.growthLabel.includes("moderate") || result.growthLabel.includes("overweight")
        ? "orange"
        : result.growthLabel.includes("mild")
          ? "yellow"
          : "green";

  return (
    <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {result.bandLabel}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold">Nutrition report</h2>
        <p className="mt-1 text-sm text-muted-foreground">Age {result.ageLabel}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Estimated energy"
          value={`${result.estimatedKcal} kcal`}
          hint={`Recommended ~${result.recommendedKcal} kcal/day`}
        />
        <Stat
          label="Estimated protein"
          value={`${result.estimatedProteinG} g`}
          hint={`Recommended ~${result.recommendedProteinG} g/day`}
        />
      </div>
      <p className="text-xs text-muted-foreground">{result.intakeNote}</p>

      <div className="rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">Growth interpretation</h3>
          <StatusBadge label={result.growthLabel} color={growthColor} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{result.growthDetail}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Weight {result.weightPercentExpected ?? "—"}% of expected ({result.expectedWeightKg} kg) ·
          Height {result.heightPercentExpected ?? "—"}% of expected ({result.expectedHeightCm} cm)
          {result.bmi != null ? ` · BMI ${result.bmi}` : ""}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/growth">Open Growth Monitor for WHO/IAP charts</Link>
        </Button>
        <Button asChild variant="secondary" size="sm" className="mt-3 ml-2">
          <Link href="#south-indian-diet">
            Open South Indian diet chart
            {result.weightPercentExpected != null &&
            result.weightPercentExpected < 80
              ? " (catch-up)"
              : ""}
          </Link>
        </Button>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold">Possible nutritional gaps</h3>
        {result.gaps.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No major gaps flagged from this questionnaire.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {result.gaps.map((gap) => (
              <li key={gap.id} className="border-l-2 border-accent pl-4">
                <p className="font-medium">{gap.title}</p>
                <p className="text-sm text-muted-foreground">{gap.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold">Age-specific feeding recommendations</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {result.feedingTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-semibold">Vegetarian meal ideas</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {result.vegMeals.map((m) => (
              <li key={m}>— {m}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Non-vegetarian meal ideas</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {result.nonVegMeals.map((m) => (
              <li key={m}>— {m}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
