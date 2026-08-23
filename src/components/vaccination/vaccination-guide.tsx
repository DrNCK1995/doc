import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScreeningDisclaimer } from "@/components/tools/disclaimer";
import { VACCINATION_FORM_URL } from "@/lib/constants";
import {
  COVERAGE_LABEL,
  IAP_SCHEDULE,
  IAP_SCHEDULE_SOURCE,
  PRIVATE_BEYOND_UIP,
  VACCINE_DETAILS,
  type VaccineCoverage,
} from "@/lib/vaccination/iap-schedule";
import {
  CLINIC_DAY_STEPS,
  HOW_VACCINES_WORK,
  UIP_VS_PRIVATE_STEPS,
  VAX_INFOGRAPHIC_PANELS,
  VAX_JOURNEY,
  type InfographicStep,
} from "@/lib/vaccination/infographics";

function coverageBadge(coverage: VaccineCoverage) {
  const label = COVERAGE_LABEL[coverage].short;
  if (coverage === "uip") return <Badge variant="success">{label}</Badge>;
  if (coverage === "private") return <Badge variant="warning">{label}</Badge>;
  if (coverage === "endemic") return <Badge variant="caution">{label}</Badge>;
  return <Badge variant="secondary">{label}</Badge>;
}

function ReminderCta({
  className,
  showDisclaimer = false,
}: {
  className?: string;
  showDisclaimer?: boolean;
}) {
  return (
    <section className={className}>
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        Vaccine Buddy
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
        Free Vaccine reminder
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Submit name, date of birth, gender, and parent email. You get a free
        vaccine schedule PDF by email, plus free reminders three days before each
        due date and on the day itself.
      </p>
      <div className="mt-4">
        <Button asChild size="lg">
          <a href={VACCINATION_FORM_URL} target="_blank" rel="noopener noreferrer">
            Free Vaccine reminder
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Opens Google Form · free PDF + reminders by email after submit
      </p>
      {showDisclaimer ? (
        <div className="mt-4">
          <ScreeningDisclaimer />
        </div>
      ) : null}
    </section>
  );
}

function InfographicStrip({
  title,
  steps,
  accent = "var(--accent)",
}: {
  title: string;
  steps: InfographicStep[];
  accent?: string;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <ol className="relative mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <span
          className="learn-spine pointer-events-none absolute top-5 right-[12%] left-[12%] hidden h-px bg-border lg:block"
          aria-hidden
        />
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.label}
              className="learn-step relative"
              style={{ animationDelay: `${80 + index * 90}ms` }}
            >
              <p
                className="font-display text-4xl font-semibold tabular-nums"
                style={{ color: accent }}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <span
                className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-accent"
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-2 font-semibold">{step.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function AgeJourney() {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold">Age journey at a glance</h3>
      <ol className="relative mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <span
          className="pointer-events-none absolute top-[1.15rem] right-[8%] left-[8%] hidden h-px bg-border lg:block"
          aria-hidden
        />
        {VAX_JOURNEY.map((stop) => (
          <li key={stop.age} className="relative flex flex-col items-center text-center">
            <span
              className="relative z-10 h-9 w-9 rounded-full border-2 bg-background"
              style={{ borderColor: stop.accent }}
              aria-hidden
            />
            <p className="mt-3 font-display text-lg font-semibold">{stop.age}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{stop.focus}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function VaccinationGuide() {
  return (
    <div className="space-y-14">
      <ReminderCta />

      <section className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Infographics
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            See the schedule before you read it
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Visual guides for the age journey, how vaccines work, free UIP vs
            private IAP add-ons, and a calm clinic visit.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {VAX_INFOGRAPHIC_PANELS.map((panel) => (
            <figure key={panel.id} className="space-y-3">
              <Image
                src={panel.src}
                alt={panel.alt}
                width={1600}
                height={900}
                className="h-auto w-full"
                sizes="(max-width: 640px) 100vw, 32rem"
              />
              <figcaption>
                <p className="font-display text-lg font-semibold">{panel.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{panel.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <AgeJourney />
        <InfographicStrip
          title="How vaccines protect"
          steps={HOW_VACCINES_WORK}
          accent="#1b7a9e"
        />
        <InfographicStrip
          title="UIP and private — one plan"
          steps={UIP_VS_PRIVATE_STEPS}
          accent="#9a6b00"
        />
        <InfographicStrip
          title="On vaccination day"
          steps={CLINIC_DAY_STEPS}
          accent="#0b4f6c"
        />
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            IAP schedule
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Recent IAP vaccination timetable
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Based on the {IAP_SCHEDULE_SOURCE}. Ages are completed weeks, months,
            or years. Your paediatrician may adjust for catch-up, combination
            brands, or state UIP timing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {(Object.keys(COVERAGE_LABEL) as VaccineCoverage[]).map((key) => (
            <span key={key} className="inline-flex items-center gap-2">
              {coverageBadge(key)}
              <span>{COVERAGE_LABEL[key].blurb}</span>
            </span>
          ))}
        </div>

        <div className="overflow-x-auto border-y border-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-semibold">Age</th>
                <th className="py-3 font-semibold">Vaccines</th>
              </tr>
            </thead>
            <tbody>
              {IAP_SCHEDULE.map((visit) => (
                <tr
                  key={visit.age}
                  className="border-b border-border/80 align-top last:border-0"
                >
                  <th className="whitespace-nowrap py-4 pr-4 font-display text-base font-semibold text-foreground">
                    {visit.age}
                  </th>
                  <td className="py-4">
                    <ul className="space-y-2">
                      {visit.vaccines.map((v) => (
                        <li
                          key={`${visit.age}-${v.label}`}
                          className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3"
                        >
                          <span className="inline-flex flex-wrap items-center gap-2 font-medium">
                            {v.label}
                            {coverageBadge(v.coverage)}
                          </span>
                          {v.note ? (
                            <span className="text-muted-foreground">{v.note}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Why each vaccine
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            What each shot protects against
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Short parent explanations — not a substitute for counselling in
            clinic.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {VACCINE_DETAILS.map((v) => (
            <article key={v.id} className="grid gap-3 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <div>
                <h3 className="inline-block border-b-2 border-accent pb-1 font-display text-2xl font-semibold text-primary">
                  {v.name}
                </h3>
                {v.alsoCalled ? (
                  <p className="mt-2 text-xs text-muted-foreground">{v.alsoCalled}</p>
                ) : null}
                <div className="mt-3">{coverageBadge(v.coverage)}</div>
              </div>
              <div className="space-y-2 text-sm leading-relaxed">
                <p>
                  <span className="font-medium text-foreground">Protects against: </span>
                  <span className="text-muted-foreground">{v.protectsAgainst}</span>
                </p>
                <p className="text-foreground/90">{v.why}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Private beyond UIP
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Vaccines usually taken privately
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            India&apos;s Universal Immunization Programme (UIP) already covers the
            core free vaccines (BCG, OPV, Hepatitis B, Pentavalent, IPV/fIPV,
            rotavirus, PCV, MR, DPT/Td boosters, and JE in endemic areas). These
            IAP-recommended vaccines are typically arranged at a private clinic
            because they are not part of routine UIP — or they add cover UIP does
            not fully include (such as mumps via MMR).
          </p>
        </div>

        <ol className="space-y-4 border-l-2 border-accent/40 pl-5">
          {PRIVATE_BEYOND_UIP.map((item, index) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[1.55rem] top-0 font-display text-sm font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-lg font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ol>

        <p className="text-sm text-muted-foreground">
          Priority if you are choosing step by step:{" "}
          <span className="font-medium text-foreground">
            MMR (mumps), varicella, Hepatitis A, TCV, then influenza and HPV
          </span>{" "}
          — confirm the order for your child in clinic.
        </p>
      </section>

      <ReminderCta className="border-t border-border pt-10" showDisclaimer />
    </div>
  );
}
