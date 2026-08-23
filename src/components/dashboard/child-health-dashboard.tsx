import Link from "next/link";
import { ExternalLink, Printer } from "lucide-react";
import { StatusBadge } from "@/components/growth/status-badge";
import { ConditionAdvicePanel } from "@/components/nutrition/condition-advice-panel";
import { DoseResultsList } from "@/components/dosage/dose-results-list";
import { ModuleStatusBoard } from "@/components/dashboard/module-status-board";
import { ScreeningFollowUp } from "@/components/screening/screening-follow-up";
import { Button } from "@/components/ui/button";
import { CLINIC_NAME, DOCTOR_NAME, VACCINATION_FORM_URL } from "@/lib/constants";
import { formatVisitDate } from "@/lib/dashboard/modules";
import type { ChildHealthDashboard } from "@/lib/dashboard/types";
import type { SeverityColor } from "@/lib/growth/types";

type ChildHealthDashboardViewProps = {
  data: ChildHealthDashboard;
  onPrint: () => void;
  onNewRequest: () => void;
};

export function ChildHealthDashboardView({
  data,
  onPrint,
  onNewRequest,
}: ChildHealthDashboardViewProps) {
  const { nutrition, screening, includeNutrition, includeDevelopment } = data;
  const growthColor = growthSeverity(nutrition.growthLabel);
  const devColor =
    screening?.verdict === "NORMAL_DEVELOPMENT" ? "green" : "orange";

  return (
    <article id="child-health-dashboard" className="space-y-8">
      <ModuleStatusBoard
        childName={data.childName}
        ageLabel={nutrition.ageLabel}
        modules={data.modules}
      />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Child health dashboard
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold">{data.childName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {nutrition.ageLabel} · {data.sexLabel} · {nutrition.bandLabel} ·{" "}
            {data.weightKg} kg
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {DOCTOR_NAME} · {CLINIC_NAME}
          </p>
          <p className="text-xs text-muted-foreground">Requested {data.generatedAt}</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onPrint}>
            <Printer className="h-4 w-4" />
            Print dashboard
          </Button>
          <Button type="button" variant="secondary" onClick={onNewRequest}>
            New request
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <StatusBadge label={nutrition.growthLabel} color={growthColor} />
        {screening ? (
          <>
            <StatusBadge label={screening.verdictLabel} color={devColor} />
            {screening.adhd.requireAssessment ? (
              <StatusBadge
                label={
                  screening.lang === "te"
                    ? "ADHD కోసం అంచనా అవసరం"
                    : "Require assessment for ADHD"
                }
                color="orange"
              />
            ) : null}
            {screening.autism.requireAssessment ? (
              <StatusBadge
                label={
                  screening.lang === "te"
                    ? "ఆటిజం కోసం అంచనా అవసరం"
                    : "Require assessment for autism"
                }
                color="orange"
              />
            ) : null}
          </>
        ) : null}
      </div>

      <section id="dash-growth" className="scroll-mt-20 space-y-3">
        <h3 className="font-display text-2xl font-semibold">Growth</h3>
        <p className="text-sm text-muted-foreground">{nutrition.growthDetail}</p>
        <p className="text-sm text-muted-foreground">
          Weight {nutrition.weightPercentExpected ?? "—"}% of expected (
          {nutrition.expectedWeightKg} kg) · Height{" "}
          {nutrition.heightPercentExpected ?? "—"}% of expected (
          {nutrition.expectedHeightCm} cm)
          {nutrition.bmi != null ? ` · BMI ${nutrition.bmi}` : ""}
        </p>
        <Button asChild variant="outline" size="sm" className="no-print">
          <Link href="/growth">Confirm on WHO/IAP charts</Link>
        </Button>
      </section>

      {includeNutrition ? (
      <section id="dash-nutrition" className="scroll-mt-20 space-y-3">
        <h3 className="font-display text-2xl font-semibold">Nutrition</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="rounded-xl border border-border p-4 text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Energy
            </span>
            <span className="font-display text-2xl font-semibold">
              {nutrition.estimatedKcal} kcal
            </span>
            <span className="mt-1 block text-muted-foreground">
              Recommended ~{nutrition.recommendedKcal} kcal/day
            </span>
          </p>
          <p className="rounded-xl border border-border p-4 text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Protein
            </span>
            <span className="font-display text-2xl font-semibold">
              {nutrition.estimatedProteinG} g
            </span>
            <span className="mt-1 block text-muted-foreground">
              Recommended ~{nutrition.recommendedProteinG} g/day
            </span>
          </p>
        </div>
        {nutrition.gaps.length > 0 ? (
          <ul className="space-y-2">
            {nutrition.gaps.map((gap) => (
              <li key={gap.id} className="border-l-2 border-accent pl-4">
                <p className="font-medium">{gap.title}</p>
                <p className="text-sm text-muted-foreground">{gap.detail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No major diet gaps flagged.</p>
        )}
        <ul className="space-y-2 text-sm text-muted-foreground">
          {nutrition.feedingTips.slice(0, 3).map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {tip}
            </li>
          ))}
        </ul>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="font-medium">Vegetarian ideas</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {nutrition.vegMeals.map((m) => (
                <li key={m}>— {m}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Non-vegetarian ideas</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {nutrition.nonVegMeals.map((m) => (
                <li key={m}>— {m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      ) : null}

      {includeDevelopment && screening ? (
      <section
        id="dash-development"
        className={`scroll-mt-20 space-y-3${screening.lang === "te" ? " font-telugu" : ""}`}
        lang={screening.lang === "te" ? "te" : "en"}
      >
        <h3 className="font-display text-2xl font-semibold">
          {screening.lang === "te" ? "వికాసం" : "Development"}
        </h3>
        <p className="text-sm text-muted-foreground">{screening.verdictLabel}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {screening.domainResults.map((domain) => (
            <div key={domain.domain} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{domain.label}</p>
                <StatusBadge
                  label={
                    domain.status === "typical"
                      ? screening.lang === "te"
                        ? "సాధారణం"
                        : "Typical"
                      : screening.lang === "te"
                        ? "ఎరుపు జెండాలు"
                        : "Red flags"
                  }
                  color={domain.status === "typical" ? "green" : "red"}
                />
              </div>
              {domain.status === "red_flag" ? (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {[...domain.redFlags, ...domain.missed].map((line) => (
                    <li key={line}>— {line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        {screening.adhd.applicable ? (
          <p className="text-sm text-muted-foreground">
            {screening.lang === "te" ? "ADHD స్క్రీన్" : "ADHD screen"}{" "}
            {screening.adhd.score}/{screening.adhd.total}
            {screening.adhd.requireAssessment
              ? screening.lang === "te"
                ? " — ADHD కోసం అంచనా అవసరం."
                : " — require assessment for ADHD."
              : screening.lang === "te"
                ? " — పరిమితి కంటే తక్కువ."
                : " — below threshold."}
          </p>
        ) : null}
        {screening.autism.applicable ? (
          <p className="text-sm text-muted-foreground">
            {screening.lang === "te" ? "ఆటిజం స్క్రీన్" : "Autism screen"}{" "}
            {screening.autism.score}/{screening.autism.total}
            {screening.autism.requireAssessment
              ? screening.lang === "te"
                ? " — ఆటిజం కోసం అంచనా అవసరం."
                : " — require assessment for autism."
              : screening.lang === "te"
                ? " — పరిమితి కంటే తక్కువ."
                : " — below threshold."}
          </p>
        ) : null}

        <ScreeningFollowUp result={screening} />
      </section>
      ) : null}

      <section id="dash-vaccination" className="scroll-mt-20 space-y-3">
        <h3 className="font-display text-2xl font-semibold">Vaccination</h3>
        <p className="text-sm text-muted-foreground">
          Vaccine Buddy — enrol once for a free schedule PDF and free due-date
          email reminders.
        </p>
        <Button asChild className="no-print">
          <a href={VACCINATION_FORM_URL} target="_blank" rel="noopener noreferrer">
            Free Vaccine reminder
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </section>

      <section id="dash-dosage" className="scroll-mt-20 space-y-3">
        <h3 className="font-display text-2xl font-semibold">Common drugs</h3>
        <p className="text-sm text-muted-foreground">
          ml by common bottle strengths for {data.weightKg} kg. Confirm the label
          before giving. Not a prescription.
        </p>
        <DoseResultsList results={data.doses} />
        <Button asChild variant="outline" size="sm" className="no-print">
          <Link href="/dosage">Open common drugs guide</Link>
        </Button>
      </section>

      <section id="dash-checks" className="scroll-mt-20 space-y-3">
        <h3 className="font-display text-2xl font-semibold">Screens & follow-up</h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <CheckItem label="Vision" value={screenLabel(data.checks.vision)} />
          <CheckItem label="Hearing" value={screenLabel(data.checks.hearing)} />
          <CheckItem
            label="Dental"
            value={
              data.checks.dental === "ok"
                ? "OK"
                : data.checks.dental === "due"
                  ? "Due"
                  : "Not screened"
            }
          />
          <CheckItem
            label="Labs"
            value={
              data.checks.labs === "done"
                ? "Done"
                : data.checks.labs === "pending"
                  ? "Pending"
                  : "—"
            }
          />
          <CheckItem
            label="Vaccines due"
            value={data.checks.vaccinesDue > 0 ? String(data.checks.vaccinesDue) : "None noted"}
          />
          <CheckItem
            label="Next visit"
            value={formatVisitDate(data.checks.nextVisit) || "Not set"}
          />
        </dl>
      </section>

      {data.illnesses.length > 0 ? (
        <div id="dash-illness" className="scroll-mt-20">
          <ConditionAdvicePanel highlight={data.illnesses} />
        </div>
      ) : (
        <section id="dash-illness" className="scroll-mt-20 space-y-2">
          <h3 className="font-display text-2xl font-semibold">Illness feeding</h3>
          <p className="text-sm text-muted-foreground">
            No current illness was marked. Open Nutrition for English/Telugu advice
            on constipation, anaemia, diarrhoea, fever, cold & cough, and
            malnutrition.
          </p>
          <Button asChild variant="outline" size="sm" className="no-print">
            <Link href="/nutrition">Illness feeding advice</Link>
          </Button>
        </section>
      )}

      <p className="text-xs text-muted-foreground">
        Parent education dashboard — not a diagnosis. Review with {DOCTOR_NAME} at{" "}
        {CLINIC_NAME}.
      </p>
    </article>
  );
}

function CheckItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function screenLabel(status: "ok" | "not_screened" | "concern"): string {
  if (status === "ok") return "OK";
  if (status === "concern") return "Concern";
  return "Not screened";
}

function growthSeverity(label: string): SeverityColor {
  if (label.startsWith("Possible severe") || label.startsWith("Low BMI")) return "red";
  if (label.includes("moderate") || label.includes("overweight")) return "orange";
  if (label.includes("mild")) return "yellow";
  return "green";
}
