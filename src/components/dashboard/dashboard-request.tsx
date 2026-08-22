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
import { YesNoField } from "@/components/tools/yes-no-field";
import { ChildHealthDashboardView } from "@/components/dashboard/child-health-dashboard";
import { ScreeningSources } from "@/components/screening/screening-sources";
import { buildChildHealthDashboard } from "@/lib/dashboard/build";
import { emptyHealthChecks } from "@/lib/dashboard/modules";
import type { ChildHealthDashboard, HealthChecks } from "@/lib/dashboard/types";
import { CONDITION_ADVICE, type ConditionId } from "@/lib/nutrition/condition-advice";
import { FOOD_GROUP_OPTIONS, nutritionBand } from "@/lib/nutrition/requirements";
import type { FoodGroupId, NutritionInput } from "@/lib/nutrition/types";
import {
  getScreeningSet,
  totalAgeMonths,
  unansweredIds,
} from "@/lib/screening/score";
import { pickText } from "@/lib/screening/types";
import type { Answer, ScreeningLang } from "@/lib/screening/types";
import { cn } from "@/lib/utils/cn";

const dietDefaults: NutritionInput = {
  years: 1,
  months: 6,
  sex: "unspecified",
  weightKg: 0,
  heightCm: 0,
  breastfeeding: "partial",
  formulaMlPerDay: 0,
  complementary: "mashed",
  mealsPerDay: 3,
  snacksPerDay: 2,
  foodGroups: ["cereals", "pulses", "vegetables", "fruits", "dairy"],
  milkMlPerDay: 300,
  junkFrequency: "rarely",
  sugaryDrinksPerDay: 0,
  appetite: "good",
  constipation: "none",
};

export function DashboardRequest() {
  const [name, setName] = React.useState("");
  const [diet, setDiet] = React.useState<NutritionInput>(dietDefaults);
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});
  const [illnesses, setIllnesses] = React.useState<ConditionId[]>([]);
  const [checks, setChecks] = React.useState<HealthChecks>(emptyHealthChecks);
  const [includeNutrition, setIncludeNutrition] = React.useState(true);
  const [includeDevelopment, setIncludeDevelopment] = React.useState(true);
  const [screeningLang, setScreeningLang] = React.useState<ScreeningLang | null>(
    null,
  );
  const [includeAdhd, setIncludeAdhd] = React.useState(false);
  const [includeAutism, setIncludeAutism] = React.useState(false);
  const [missing, setMissing] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [dashboard, setDashboard] = React.useState<ChildHealthDashboard | null>(null);

  const ageMonths = totalAgeMonths(diet.years, diet.months);
  const activeLang = screeningLang ?? "en";
  const set = getScreeningSet(ageMonths, {
    lang: activeLang,
    includeAdhd,
    includeAutism,
  });
  const band = nutritionBand(ageMonths);
  const infant = band.id === "0-6m";
  const youngInfant = band.id === "0-6m" || band.id === "6-12m";

  React.useEffect(() => {
    setAnswers({});
    setMissing([]);
    setDashboard(null);
    setIncludeAdhd(false);
    setIncludeAutism(false);
  }, [set.ageMonths]);

  function patchDiet<K extends keyof NutritionInput>(key: K, value: NutritionInput[K]) {
    setDiet((prev) => ({ ...prev, [key]: value }));
    setDashboard(null);
  }

  function toggleGroup(id: FoodGroupId) {
    setDiet((prev) => ({
      ...prev,
      foodGroups: prev.foodGroups.includes(id)
        ? prev.foodGroups.filter((g) => g !== id)
        : [...prev.foodGroups, id],
    }));
    setDashboard(null);
  }

  function toggleIllness(id: ConditionId) {
    setIllnesses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setDashboard(null);
  }

  function onRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter the child’s name.");
      return;
    }
    if (!(diet.weightKg > 0) || !(diet.heightCm > 0)) {
      setError("Enter current weight (kg) and height / length (cm).");
      return;
    }
    if (includeDevelopment) {
      if (!screeningLang) {
        setError("Choose English or Telugu for development screening first.");
        document.getElementById("dash-dev-lang")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
      const pending = unansweredIds(set, answers);
      if (pending.length > 0) {
        setError(
          screeningLang === "te"
            ? `దయచేసి వికాస ప్రశ్నలు పూర్తి చేయండి (${pending.length} మిగిలి ఉన్నాయి).`
            : `Please finish the development questions (${pending.length} remaining).`,
        );
        setMissing(pending);
        document.getElementById(pending[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    setError(null);
    setMissing([]);
    const next = buildChildHealthDashboard({
      name,
      includeNutrition,
      includeDevelopment,
      includeAdhd,
      includeAutism,
      screeningLang: screeningLang ?? "en",
      nutrition: diet,
      screeningAnswers: includeDevelopment ? answers : {},
      illnesses,
      checks,
    });
    setDashboard(next);
    window.setTimeout(() => {
      document.getElementById("child-health-dashboard")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  return (
    <div className="space-y-10">
      <ScreeningDisclaimer />

      <form
        onSubmit={onRequest}
        className={dashboard ? "no-print space-y-10" : "space-y-10"}
      >
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Child</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Age — years">
              <Input
                type="number"
                min={0}
                max={18}
                value={diet.years}
                onChange={(e) => patchDiet("years", Number(e.target.value))}
              />
            </Field>
            <Field label="Additional months">
              <Input
                type="number"
                min={0}
                max={11}
                value={diet.months}
                onChange={(e) => patchDiet("months", Number(e.target.value))}
              />
            </Field>
            <Field label="Sex">
              <Select
                value={diet.sex}
                onValueChange={(v) => patchDiet("sex", v as NutritionInput["sex"])}
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
            <Field label="Weight (kg)">
              <Input
                type="number"
                min={1}
                step="0.1"
                value={diet.weightKg || ""}
                onChange={(e) => patchDiet("weightKg", Number(e.target.value))}
              />
            </Field>
            <Field label="Height / length (cm)">
              <Input
                type="number"
                min={40}
                step="0.1"
                value={diet.heightCm || ""}
                onChange={(e) => patchDiet("heightCm", Number(e.target.value))}
              />
            </Field>
          </div>
          <p className="text-sm text-muted-foreground">
            Module {band.label} · {set.ageLabel}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">What to include</h2>
          <p className="text-sm text-muted-foreground">
            Growth (from weight &amp; height), vaccination, screens, dosage, and
            illness advice stay available. Turn off modules you do not want to
            fill today.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3">
              <input
                type="checkbox"
                className="mt-1 accent-[var(--primary)]"
                checked={includeNutrition}
                onChange={(e) => {
                  setIncludeNutrition(e.target.checked);
                  setDashboard(null);
                }}
              />
              <span>
                <span className="block font-medium">Nutrition / diet</span>
                <span className="text-sm text-muted-foreground">
                  Meals, food groups, appetite — optional diet assessment
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3">
              <input
                type="checkbox"
                className="mt-1 accent-[var(--primary)]"
                checked={includeDevelopment}
                onChange={(e) => {
                  setIncludeDevelopment(e.target.checked);
                  setDashboard(null);
                  setMissing([]);
                  setError(null);
                }}
              />
              <span>
                <span className="block font-medium">Development screening</span>
                <span className="text-sm text-muted-foreground">
                  Milestones, red flags, ADHD / autism items when age-appropriate
                </span>
              </span>
            </label>
          </div>
        </section>

        {includeNutrition ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Diet</h2>
          {youngInfant ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Breastfeeding / formula">
                <Select
                  value={diet.breastfeeding}
                  onValueChange={(v) =>
                    patchDiet("breastfeeding", v as NutritionInput["breastfeeding"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exclusive">Exclusive breastfeeding</SelectItem>
                    <SelectItem value="partial">Mixed</SelectItem>
                    <SelectItem value="none">Formula / no breast milk</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Formula (ml / day)">
                <Input
                  type="number"
                  min={0}
                  step="10"
                  value={diet.formulaMlPerDay}
                  onChange={(e) => patchDiet("formulaMlPerDay", Number(e.target.value))}
                />
              </Field>
            </div>
          ) : null}

          {!infant ? (
            <>
              <Field label="Complementary / family feeding">
                <Select
                  value={diet.complementary}
                  onValueChange={(v) =>
                    patchDiet("complementary", v as NutritionInput["complementary"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Solids not started</SelectItem>
                    <SelectItem value="purees">Thin purees</SelectItem>
                    <SelectItem value="mashed">Thick mashed foods</SelectItem>
                    <SelectItem value="family_foods">Family foods</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Meals / day">
                  <Input
                    type="number"
                    min={0}
                    max={8}
                    value={diet.mealsPerDay}
                    onChange={(e) => patchDiet("mealsPerDay", Number(e.target.value))}
                  />
                </Field>
                <Field label="Snacks / day">
                  <Input
                    type="number"
                    min={0}
                    max={6}
                    value={diet.snacksPerDay}
                    onChange={(e) => patchDiet("snacksPerDay", Number(e.target.value))}
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
                        checked={diet.foodGroups.includes(opt.id)}
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
            <Field label="Animal milk (ml / day)">
              <Input
                type="number"
                min={0}
                step="10"
                value={diet.milkMlPerDay}
                onChange={(e) => patchDiet("milkMlPerDay", Number(e.target.value))}
              />
            </Field>
            <Field label="Sugary drinks / day">
              <Input
                type="number"
                min={0}
                max={10}
                value={diet.sugaryDrinksPerDay}
                onChange={(e) =>
                  patchDiet("sugaryDrinksPerDay", Number(e.target.value))
                }
              />
            </Field>
            <Field label="Junk food">
              <Select
                value={diet.junkFrequency}
                onValueChange={(v) =>
                  patchDiet("junkFrequency", v as NutritionInput["junkFrequency"])
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
                value={diet.appetite}
                onValueChange={(v) =>
                  patchDiet("appetite", v as NutritionInput["appetite"])
                }
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
              value={diet.constipation}
              onValueChange={(v) =>
                patchDiet("constipation", v as NutritionInput["constipation"])
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
        </section>
        ) : null}

        {includeDevelopment ? (
        <section
          className={cn("space-y-4", screeningLang === "te" && "font-telugu")}
          lang={screeningLang === "te" ? "te" : "en"}
        >
          <h2 className="font-display text-2xl font-semibold">
            {screeningLang === "te" ? "వికాసం" : "Development"}
          </h2>

          <ScreeningSources lang={screeningLang ?? "en"} />

          <div id="dash-dev-lang" className="space-y-3 rounded-xl border border-border px-4 py-4">
            <p className="font-medium">
              {screeningLang
                ? screeningLang === "te"
                  ? "భాష"
                  : "Language"
                : "Choose language first"}
            </p>
            <p className="text-sm text-muted-foreground">
              Select English or Telugu, then answer screening questions.
            </p>
            <p className="font-telugu text-sm text-muted-foreground" lang="te">
              ఇంగ్లీష్ లేదా తెలుగు ఎంచుకుని, తర్వాత ప్రశ్నలకు సమాధానం ఇవ్వండి.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={screeningLang === "en" ? "default" : "outline"}
                onClick={() => {
                  setScreeningLang("en");
                  setDashboard(null);
                }}
              >
                English
              </Button>
              <Button
                type="button"
                variant={screeningLang === "te" ? "default" : "outline"}
                className="font-telugu"
                onClick={() => {
                  setScreeningLang("te");
                  setDashboard(null);
                }}
              >
                తెలుగు
              </Button>
            </div>
          </div>

          {screeningLang ? (
            <>
              <p className="text-sm text-muted-foreground">
                {screeningLang === "te"
                  ? "స్థూల చలనం, సూక్ష్మ చలనం, భాష, సామాజిక & జ్ఞానాత్మక — మరియు ఎరుపు జెండాలు. ADHD / ఆటిజం ఐచ్ఛికం."
                  : "Gross motor, fine motor, language, social & cognitive — plus red flags. ADHD and autism are optional."}
              </p>
              <QuestionList
                items={set.milestones}
                answers={answers}
                missing={missing}
                lang={screeningLang}
                onAnswer={(id, v) => {
                  setAnswers((prev) => ({ ...prev, [id]: v }));
                  setMissing((prev) => prev.filter((x) => x !== id));
                  setDashboard(null);
                }}
              />
              <h3 className="font-medium">
                {screeningLang === "te" ? "ఎరుపు జెండాలు" : "Red flags"}
              </h3>
              <QuestionList
                items={set.redFlags}
                answers={answers}
                missing={missing}
                lang={screeningLang}
                onAnswer={(id, v) => {
                  setAnswers((prev) => ({ ...prev, [id]: v }));
                  setMissing((prev) => prev.filter((x) => x !== id));
                  setDashboard(null);
                }}
              />

              {set.adhdAvailable.length > 0 || set.autismAvailable.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-medium">
                    {screeningLang === "te" ? "ఐచ్ఛిక స్క్రీన్లు" : "Optional screens"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {screeningLang === "te"
                      ? "ADHD మరియు ఆటిజం ప్రశ్నలు మీ ఇష్టం — కావాలంటే మాత్రమే చేర్చండి."
                      : "ADHD and autism questions are optional — include only if you want them."}
                  </p>
                  {set.adhdAvailable.length > 0 ? (
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3">
                      <input
                        type="checkbox"
                        className="mt-1 accent-[var(--primary)]"
                        checked={includeAdhd}
                        onChange={(e) => {
                          setIncludeAdhd(e.target.checked);
                          setDashboard(null);
                          setMissing([]);
                        }}
                      />
                      <span className="text-sm font-medium">
                        {screeningLang === "te"
                          ? "ADHD స్క్రీనింగ్ చేర్చండి (4+ సంవత్సరాలు)"
                          : "Include ADHD screening (ages 4+)"}
                      </span>
                    </label>
                  ) : null}
                  {set.autismAvailable.length > 0 ? (
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3">
                      <input
                        type="checkbox"
                        className="mt-1 accent-[var(--primary)]"
                        checked={includeAutism}
                        onChange={(e) => {
                          setIncludeAutism(e.target.checked);
                          setDashboard(null);
                          setMissing([]);
                        }}
                      />
                      <span className="text-sm font-medium">
                        {screeningLang === "te"
                          ? "ఆటిజం స్క్రీనింగ్ చేర్చండి"
                          : "Include autism screening"}
                      </span>
                    </label>
                  ) : null}
                </div>
              ) : null}

              {includeAdhd && set.adhd.length > 0 ? (
                <>
                  <h3 className="font-medium">
                    {screeningLang === "te" ? "ADHD స్క్రీనింగ్" : "ADHD screening"}
                  </h3>
                  <QuestionList
                    items={set.adhd}
                    answers={answers}
                    missing={missing}
                    lang={screeningLang}
                    onAnswer={(id, v) => {
                      setAnswers((prev) => ({ ...prev, [id]: v }));
                      setMissing((prev) => prev.filter((x) => x !== id));
                      setDashboard(null);
                    }}
                  />
                </>
              ) : null}
              {includeAutism && set.autism.length > 0 ? (
                <>
                  <h3 className="font-medium">
                    {screeningLang === "te" ? "ఆటిజం స్క్రీనింగ్" : "Autism screening"}
                  </h3>
                  <QuestionList
                    items={set.autism}
                    answers={answers}
                    missing={missing}
                    lang={screeningLang}
                    onAnswer={(id, v) => {
                      setAnswers((prev) => ({ ...prev, [id]: v }));
                      setMissing((prev) => prev.filter((x) => x !== id));
                      setDashboard(null);
                    }}
                  />
                </>
              ) : null}
            </>
          ) : null}
        </section>
        ) : null}

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Screens & visits</h2>
          <p className="text-sm text-muted-foreground">
            Optional — fills Vision, Hearing, Dental, Labs, and Next visit on the
            colourful status board.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vision">
              <Select
                value={checks.vision}
                onValueChange={(v) => {
                  setChecks((p) => ({ ...p, vision: v as HealthChecks["vision"] }));
                  setDashboard(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_screened">Not screened</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="concern">Concern</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Hearing">
              <Select
                value={checks.hearing}
                onValueChange={(v) => {
                  setChecks((p) => ({ ...p, hearing: v as HealthChecks["hearing"] }));
                  setDashboard(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_screened">Not screened</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="concern">Concern</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Dental">
              <Select
                value={checks.dental}
                onValueChange={(v) => {
                  setChecks((p) => ({ ...p, dental: v as HealthChecks["dental"] }));
                  setDashboard(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_screened">Not screened</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Labs">
              <Select
                value={checks.labs}
                onValueChange={(v) => {
                  setChecks((p) => ({ ...p, labs: v as HealthChecks["labs"] }));
                  setDashboard(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Vaccines currently due">
              <Input
                type="number"
                min={0}
                max={20}
                value={checks.vaccinesDue}
                onChange={(e) => {
                  setChecks((p) => ({ ...p, vaccinesDue: Number(e.target.value) || 0 }));
                  setDashboard(null);
                }}
              />
            </Field>
            <Field label="Illness episodes (past year)">
              <Input
                type="number"
                min={0}
                max={30}
                value={checks.illnessEpisodes}
                onChange={(e) => {
                  setChecks((p) => ({
                    ...p,
                    illnessEpisodes: Number(e.target.value) || 0,
                  }));
                  setDashboard(null);
                }}
              />
            </Field>
            <Field label="Next visit">
              <Input
                type="date"
                value={checks.nextVisit}
                onChange={(e) => {
                  setChecks((p) => ({ ...p, nextVisit: e.target.value }));
                  setDashboard(null);
                }}
              />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Current concerns</h2>
          <p className="text-sm text-muted-foreground">
            Tick any illness you want feeding advice for (English &amp; Telugu on
            the dashboard).
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CONDITION_ADVICE.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[var(--primary)]"
                  checked={illnesses.includes(c.id)}
                  onChange={() => toggleIllness(c.id)}
                />
                {c.title.en} / {c.title.te}
              </label>
            ))}
          </div>
        </section>

        {error ? <p className="text-sm text-[var(--status-red)]">{error}</p> : null}

        <Button type="submit" size="lg">
          Request child health dashboard
        </Button>
      </form>

      {dashboard ? (
        <ChildHealthDashboardView
          data={dashboard}
          onPrint={() => window.print()}
          onNewRequest={() => {
            setDashboard(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function QuestionList({
  items,
  answers,
  missing,
  lang,
  onAnswer,
}: {
  items: { id: string; text: { en: string; te: string } }[];
  answers: Record<string, Answer>;
  missing: string[];
  lang: ScreeningLang;
  onAnswer: (id: string, value: Answer) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div id={item.id} key={item.id}>
          <YesNoField
            name={item.id}
            label={pickText(item.text, lang)}
            value={answers[item.id]}
            error={missing.includes(item.id)}
            lang={lang}
            onChange={(v) => onAnswer(item.id, v)}
          />
        </div>
      ))}
    </div>
  );
}
