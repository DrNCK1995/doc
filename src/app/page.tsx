import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { ToolTile } from "@/components/home/tool-tile";
import { Button } from "@/components/ui/button";
import {
  ASK_DOCTOR,
  BRAND_HEADLINE,
  BRAND_NAME,
  BRAND_SUPPORT,
  BRAND_TAGLINE,
  BRAND_TRUST,
  CARE_SERVICES,
  DOCTOR_NAME,
  DOCTOR_TITLE,
  JOURNEY_STEPS,
  NEED_TODAY,
  SMART_TOOLS,
  WORRY_CARDS,
} from "@/lib/site-nav";
import {
  CLINIC_NAME,
  DOCTOR_PHOTO_ALT,
  DOCTOR_PHOTO_SRC,
} from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — full-bleed doctor portrait */}
        <section className="relative min-h-[100svh] overflow-hidden pt-16">
          <Image
            src={DOCTOR_PHOTO_SRC}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%] sm:object-[center_15%]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40 dark:from-background dark:via-background/90 dark:to-background/45"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20"
            aria-hidden
          />

          <div className="container-page relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-14 sm:py-20">
            <p className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl md:text-6xl">
              {BRAND_NAME}
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-[1.15] text-foreground sm:text-4xl md:text-5xl">
              {BRAND_HEADLINE}{" "}
              <span aria-hidden className="align-middle text-[0.9em]">
                ❤️
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              {BRAND_SUPPORT}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
                <Link href="/consult">
                  Consult Doctor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-7 text-base"
              >
                <Link href="/tools">Parent Tools</Link>
              </Button>
            </div>
            <div className="mt-10 max-w-lg border-l-2 border-primary/30 pl-4">
              <p className="font-medium text-foreground">{DOCTOR_NAME}</p>
              <p className="text-sm text-muted-foreground">{DOCTOR_TITLE}</p>
              <p className="mt-2 text-sm text-muted-foreground">{BRAND_TRUST}</p>
            </div>
          </div>
        </section>

        {/* WHAT DO YOU NEED TODAY */}
        <section className="section-pad" id="need-today">
          <div className="container-page">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              What do you need today?
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Tap a tool — built for busy parents on the go.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NEED_TODAY.map((tool) => (
                <ToolTile key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        {/* HEALTH JOURNEY */}
        <section className="section-pad bg-card/40" id="journey">
          <div className="container-page">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Your Child&apos;s Health Journey
            </h2>
            <p className="mt-2 text-muted-foreground">
              A simple path from prevention to everyday care.
            </p>
            <ol className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
              {JOURNEY_STEPS.map((step, i) => (
                <li key={step.href} className="flex items-center gap-2">
                  <Link
                    href={step.href}
                    className="inline-flex min-h-12 items-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-secondary"
                  >
                    {step.label}
                  </Link>
                  {i < JOURNEY_STEPS.length - 1 ? (
                    <span
                      className="hidden text-muted-foreground sm:inline"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SMART TOOLS */}
        <section className="section-pad" id="tools">
          <div className="container-page">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Smart Tools for Smart Parents
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Short, clear tools — no medical jargon on the surface.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SMART_TOOLS.map((tool) => (
                <ToolTile key={tool.id} tool={tool} />
              ))}
            </div>
            <div className="mt-8">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/tools">
                  See all parent tools
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* HOW WE CARE */}
        <section className="section-pad bg-card/40" id="care">
          <div className="container-page">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              How We Care for Kids
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Parent-friendly care with pediatric and intensive-care depth.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CARE_SERVICES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-background p-5"
                >
                  <span className="text-2xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHEN SHOULD I WORRY */}
        <section className="section-pad" id="worry-preview">
          <div className="container-page">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              When Should I Worry?{" "}
              <span aria-hidden>🚨</span>
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Quick checks for the moments that keep parents awake.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WORRY_CARDS.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="rounded-2xl border border-border/80 bg-card p-5 transition hover:-translate-y-0.5 hover:border-destructive/30 hover:shadow-md"
                >
                  <span className="text-2xl" aria-hidden>
                    {card.emoji}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{card.body}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild className="rounded-full">
                <Link href="/worry">Open warning signs guide</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ASK DR */}
        <section className="section-pad bg-card/40" id="ask">
          <div className="container-page">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ask Dr. Chaitanya
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Short, practical answers to everyday parent questions.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ASK_DOCTOR.map((item) => (
                <Link
                  key={item.question}
                  href={item.href}
                  className="rounded-2xl border border-border/80 bg-background p-5 transition hover:border-accent/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    <span aria-hidden>{item.emoji} </span>
                    {item.topic}
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-snug">
                    {item.question}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/learn">Explore Parent Guides</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* DOCTOR TRUST */}
        <section className="section-pad" id="doctor">
          <div className="container-page">
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-primary to-accent p-[1px]">
              <div className="grid items-center gap-8 rounded-[calc(1.5rem-1px)] bg-card px-6 py-10 sm:grid-cols-[minmax(0,14rem)_1fr] sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,18rem)_1fr]">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[16rem] overflow-hidden rounded-2xl sm:mx-0 sm:max-w-none">
                  <Image
                    src={DOCTOR_PHOTO_SRC}
                    alt={DOCTOR_PHOTO_ALT}
                    fill
                    sizes="(max-width: 640px) 16rem, 18rem"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    Care Designed by a Pediatrician
                  </h2>
                  <p className="mt-4 font-display text-2xl font-semibold text-primary">
                    {DOCTOR_NAME}
                  </p>
                  <p className="text-muted-foreground">{DOCTOR_TITLE}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{CLINIC_NAME}</p>
                  <ul className="mt-6 space-y-2 text-sm sm:text-base">
                    {[
                      "Pediatric expertise",
                      "Neonatal & critical care experience",
                      "Parent-friendly guidance",
                    ].map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <Check
                          className="h-4 w-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 max-w-lg text-sm text-muted-foreground">
                    {BRAND_TRUST}
                  </p>
                  <Button asChild className="mt-8 rounded-full" size="lg">
                    <Link href="/consult">Book Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING STRIP */}
        <section className="border-t border-border/60 py-12">
          <div className="container-page text-center">
            <p className="font-display text-2xl font-semibold text-primary sm:text-3xl">
              {BRAND_NAME}
            </p>
            <p className="mt-2 text-muted-foreground">{BRAND_TAGLINE}</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
