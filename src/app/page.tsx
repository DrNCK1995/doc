import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Baby,
  Bell,
  BookOpen,
  CalendarDays,
  Download,
  ExternalLink,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  Puzzle,
  Shield,
  Syringe,
  Pill,
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
import {
  INSTAGRAM_URL,
  VACCINATION_FORM_URL,
  YOUTUBE_URL,
} from "@/lib/constants";

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
              Dr. N. Chaitanya Krishna
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
              Consultant paediatrician & intensivist — critical care, preventive
              paediatrics, and thoughtful follow-up.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Paediatric outpatient care, growth monitoring, and vaccination
              guidance at Imperial Hospitals, Bhimavaram — backed by PICU training
              at CMC Vellore and years of ICU leadership.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Child health dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/vaccination">Vaccine reminders</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-pad" id="growth">
          <div className="container-page">
            <Link
              href="/dashboard"
              className="group block overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-primary to-accent p-1 shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-6 rounded-[calc(1rem-2px)] bg-card/95 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                    <LayoutDashboard className="h-7 w-7" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      For parents
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                      Child health dashboard
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                      Request one report: growth, vaccination reminders, development
                      screening, nutrition, and illness feeding advice in English
                      and Telugu.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Request dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="parent-tools">
              {[
                {
                  href: "/growth",
                  icon: LineChart,
                  eyebrow: "WHO / IAP",
                  title: "Growth Monitor",
                  body: "Register, plot charts, and export clinical reports.",
                },
                {
                  href: "/vaccination",
                  icon: Syringe,
                  eyebrow: "Reminders & PDF",
                  title: "Vaccination",
                  body: "Schedule PDF and due-date email reminders.",
                },
                {
                  href: "/screening",
                  icon: Puzzle,
                  eyebrow: "Milestones",
                  title: "Development",
                  body: "Motor, language, social, ADHD, and autism screen.",
                },
                {
                  href: "/nutrition",
                  icon: Apple,
                  eyebrow: "Feeding",
                  title: "Nutrition",
                  body: "Diet assessment and bilingual illness advice.",
                },
                {
                  href: "/dosage",
                  icon: Pill,
                  eyebrow: "OTC ml",
                  title: "Common drugs",
                  body: "Weight- and age-based ml for common syrups and drops, with uses and precautions.",
                },
                {
                  href: "/learn",
                  icon: BookOpen,
                  eyebrow: "Age-based",
                  title: "Parent library",
                  body: "Newborn to 5 years — two-minute guides in English and Telugu.",
                },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col rounded-2xl border border-border bg-card/90 p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-accent/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                    <tool.icon className="h-6 w-6" aria-hidden />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
                    {tool.eyebrow}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold">{tool.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{tool.body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad border-t border-border/70" id="about">
          <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                About the doctor
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                Paediatrician, intensivist, and educator — from ASRAM to Imperial
                Hospitals.
              </h2>
              <p className="mt-4 text-muted-foreground">
                I am Dr. N. Chaitanya Krishna, a consultant paediatrician and
                intensivist at Imperial Hospitals, Bhimavaram. My work spans
                outpatient care, preventive paediatrics, vaccination, and
                paediatric critical care — with a commitment to clear guidance for
                parents and safe, evidence-based care for children.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">MD (Paediatrics), ASRAM Medical College</p>
                  <p className="text-sm text-muted-foreground">
                    College topper
                  </p>
                </li>
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">Senior residency, PICU — CMC Vellore</p>
                  <p className="text-sm text-muted-foreground">
                    Paediatric intensive care training at Christian Medical College
                  </p>
                </li>
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">Assistant Professor & ICU In-charge — GSL Medical College</p>
                  <p className="text-sm text-muted-foreground">
                    Academic and clinical leadership in paediatric critical care
                  </p>
                </li>
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">Consultant Paediatrician & Intensivist</p>
                  <p className="text-sm text-muted-foreground">
                    Imperial Hospitals, Bhimavaram (current)
                  </p>
                </li>
                <li className="border-l-2 border-accent pl-4">
                  <p className="font-medium">Languages</p>
                  <p className="text-sm text-muted-foreground">
                    English, Telugu, Hindi
                  </p>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram @dr.careforkids
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube @drcareforkids
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
            <aside className="rounded-2xl border border-border bg-card/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                At a glance
              </p>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Current role</dt>
                  <dd className="text-right font-medium">
                    Consultant Paediatrician & Intensivist
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Hospital</dt>
                  <dd className="text-right font-medium">Imperial Hospitals, Bhimavaram</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Training</dt>
                  <dd className="text-right font-medium">PICU, CMC Vellore</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">MD Paediatrics</dt>
                  <dd className="text-right font-medium">ASRAM · College topper</dd>
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
              Special interests in paediatric critical care, neonatal intensive
              care, preventive paediatrics, and vaccination — with growth
              monitoring tools for longitudinal follow-up.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: HeartPulse,
                  title: "Critical & emergency care",
                  body: "Paediatric intensive care and acute emergency management.",
                  href: undefined as string | undefined,
                },
                {
                  icon: Baby,
                  title: "NICU",
                  body: "Neonatal intensive care for newborns and early infancy.",
                  href: undefined,
                },
                {
                  icon: Shield,
                  title: "Preventive paediatrics",
                  body: "Well-child visits, anticipatory guidance, and growth tracking.",
                  href: "/dashboard",
                },
                {
                  icon: CalendarDays,
                  title: "Vaccination",
                  body: "Schedule PDF, email reminders, and age-appropriate immunisation.",
                  href: "/vaccination",
                },
              ].map((item) => {
                const content = (
                  <CardHeader>
                    <item.icon className="h-5 w-5 text-accent" />
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.body}</CardDescription>
                  </CardHeader>
                );
                return item.href ? (
                  <Link key={item.title} href={item.href} className="block">
                    <Card className="h-full bg-card/70 transition-colors hover:border-accent/50">
                      {content}
                    </Card>
                  </Link>
                ) : (
                  <Card key={item.title} className="bg-card/70">
                    {content}
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-pad border-t border-border/70" id="vaccination">
          <div className="container-page">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Vaccine schedule & reminders
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Get your child&apos;s vaccination schedule
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Fill a short form with your child&apos;s details. You&apos;ll receive a
              personalised vaccination PDF by email, plus automatic reminders
              three days before each due date and on the day itself.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/80 to-card p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Download className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  Download vaccination PDF
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  After you submit the form, a schedule PDF is generated and
                  emailed to you automatically — keep it for clinic visits and
                  records.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Child name, date of birth, and gender
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Parent email for PDF delivery
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/80 to-card p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Bell className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  Automated vaccine reminders
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Once enrolled, you get email reminders so due vaccines are not
                  missed — plan your clinic visit with time to spare.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Reminder 3 days before the due date
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Same-day alert when a vaccine is due
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild size="lg">
                <a
                  href={VACCINATION_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get vaccination PDF & reminders
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                Opens Google Form · PDF arrives by email after submit
              </p>
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
              Visit Imperial Hospitals, Bhimavaram for outpatient consultations.
              Use the child health dashboard for screening and feeding advice, or
              follow on social media for paediatric health education.
            </p>
            <Card className="mt-8">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Imperial Hospitals, Bhimavaram</p>
                  <p className="text-sm text-muted-foreground">
                    Consultant Paediatrician & Intensivist · Outpatient & ICU care
                  </p>
                </div>
                <Button asChild variant="secondary">
                  <Link href="/dashboard">Child health dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="section-pad border-t border-border/70" id="contact">
          <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Contact</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Imperial Hospitals, Bhimavaram · Paediatric outpatient & ICU
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Instagram @dr.careforkids
                </a>
                <span className="text-muted-foreground" aria-hidden>
                  ·
                </span>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  YouTube @drcareforkids
                </a>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Dr. N. Chaitanya Krishna
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
