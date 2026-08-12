import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  CalendarDays,
  LineChart,
  Stethoscope,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative min-h-[100svh] overflow-hidden pt-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2200&q=80)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/25 dark:from-background dark:via-background/80 dark:to-background/30"
            aria-hidden
          />
          <div className="container-page relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16">
            <p className="font-display text-3xl font-semibold text-primary sm:text-4xl md:text-5xl">
              Dr. Chaitanya Krishna
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
              Pediatric care with clear guidance and careful growth tracking.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Thoughtful consultations for infants and children — plus a clinical
              growth monitoring workspace for WHO/IAP charts, follow-ups, and
              printable reports.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/growth">
                  Open Growth Monitor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#book">Book consult</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-pad" id="growth">
          <div className="container-page">
            <Link
              href="/growth"
              className="group block overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-primary to-accent p-1 shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-6 rounded-[calc(1rem-2px)] bg-card/95 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                    <LineChart className="h-7 w-7" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      For parents & clinic staff
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                      Pediatric Growth Monitoring
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                      Register a child, plot WHO/IAP percentiles, track follow-ups,
                      and export PDF/CSV growth reports in one place.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Enter app
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="section-pad border-t border-border/70" id="about">
          <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                About the doctor
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                Pediatrics grounded in listening, clarity, and practical next
                steps.
              </h2>
              <p className="mt-4 text-muted-foreground">
                I am Dr. Chaitanya Krishna, focused on child health, nutrition,
                developmental follow-up, and growth monitoring. This site is for
                parents seeking a calm consult and for clinic use of the growth
                workspace.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">MBBS, MD (Pediatrics)</p>
                  <p className="text-sm text-muted-foreground">
                    Demo credential for this portfolio build
                  </p>
                </li>
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">Growth & nutrition focus</p>
                  <p className="text-sm text-muted-foreground">
                    WHO under-5 and IAP school-age references
                  </p>
                </li>
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">Languages</p>
                  <p className="text-sm text-muted-foreground">
                    English, Telugu, Hindi
                  </p>
                </li>
              </ul>
            </div>
            <aside className="rounded-2xl border border-border bg-card/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                At a glance
              </p>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Consult fee</dt>
                  <dd className="font-medium">₹800 (demo)</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Duration</dt>
                  <dd className="font-medium">20–25 minutes</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Mode</dt>
                  <dd className="font-medium">Clinic / video</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Clinic</dt>
                  <dd className="font-medium">Hyderabad (demo)</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="section-pad border-t border-border/70" id="practice">
          <div className="container-page">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Practice focus
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Where I can help
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Best suited for routine pediatric concerns, nutrition guidance, and
              longitudinal growth review. For emergencies, seek urgent care.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Baby,
                  title: "Well-child care",
                  body: "Feeding, sleep, common illnesses, and parent counseling.",
                },
                {
                  icon: Activity,
                  title: "Growth monitoring",
                  body: "WHO/IAP charts, z-scores, velocity, and follow-up alerts.",
                },
                {
                  icon: Stethoscope,
                  title: "Nutrition support",
                  body: "Underweight, stunting, and catch-up growth plans.",
                },
                {
                  icon: CalendarDays,
                  title: "Vaccination review",
                  body: "Age-appropriate status notes with visit documentation.",
                },
              ].map((item) => (
                <Card key={item.title} className="bg-card/70">
                  <CardHeader>
                    <item.icon className="h-5 w-5 text-accent" />
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.body}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad border-t border-border/70" id="book">
          <div className="container-page max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Consult booking
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Book a consultation
            </h2>
            <p className="mt-3 text-muted-foreground">
              Online slot booking and UPI payment will connect here later. For now,
              use the growth monitor for clinical tracking, or reach the clinic
              directly for appointments.
            </p>
            <Card className="mt-8">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Clinic contact (demo)</p>
                  <p className="text-sm text-muted-foreground">
                    +91 90000 00000 · clinic.drchaitanya@example.com
                  </p>
                </div>
                <Button asChild variant="secondary">
                  <Link href="/growth">Meanwhile, open Growth Monitor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="section-pad border-t border-border/70" id="contact">
          <div className="container-page flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Contact</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Hyderabad · Pediatric outpatient & teleconsult (demo)
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Dr. Chaitanya Krishna
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
