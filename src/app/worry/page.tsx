import Link from "next/link";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    id: "fever",
    emoji: "🌡️",
    title: "Fever",
    intro: "When fever needs medical review.",
    points: [
      "Baby under 3 months with any fever — seek care promptly.",
      "Fever with lethargy, poor feeding, or stiff neck — urgent review.",
      "Fever lasting more than 3 days — check with your pediatrician.",
      "Use Dose Check for weight-based fever medicine guidance.",
    ],
    cta: { href: "/dosage", label: "Open Dose Check" },
  },
  {
    id: "breathing",
    emoji: "😮‍💨",
    title: "Breathing",
    intro: "Warning signs of respiratory distress.",
    points: [
      "Fast breathing, chest indrawing, or nostrils flaring.",
      "Blue lips or tongue — emergency care now.",
      "Stridor (noisy breathing in) or severe wheeze.",
      "Child too breathless to drink or speak.",
    ],
    cta: { href: "/consult", label: "Consult Doctor" },
  },
  {
    id: "vomiting",
    emoji: "🤢",
    title: "Vomiting",
    intro: "When vomiting becomes concerning.",
    points: [
      "Green or bloody vomit — seek care urgently.",
      "Vomiting with severe tummy pain or swelling.",
      "Cannot keep fluids down and looks dehydrated.",
      "Newborn with forceful or persistent vomiting.",
    ],
    cta: { href: "/nutrition", label: "Food for Growth tips" },
  },
  {
    id: "diarrhea",
    emoji: "💧",
    title: "Diarrhea",
    intro: "Signs of dehydration.",
    points: [
      "Dry mouth, no tears, sunken eyes, fewer wet diapers.",
      "Blood in stool or very high fever with diarrhea.",
      "Listless or unusually sleepy child.",
      "Offer ORS as advised; get help if intake stays poor.",
    ],
    cta: { href: "/nutrition", label: "Illness feeding advice" },
  },
  {
    id: "newborn",
    emoji: "👶",
    title: "Newborn",
    intro: "Newborn danger signs.",
    points: [
      "Poor feeding, weak cry, or unusual sleepiness.",
      "Fever or feeling cold to touch.",
      "Fast or difficult breathing.",
      "Yellowing of palms/soles or seizures — urgent care.",
    ],
    cta: { href: "/learn", label: "Baby Basics in Learn" },
  },
] as const;

export default function WorryPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-16">
        <section className="section-pad">
          <div className="container-page">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              When Should I Worry? 🚨
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground sm:text-lg">
              Parent-first warning signs. This guide supports — it does not replace —
              emergency care. If your child looks very unwell, seek help now.
            </p>

            <div className="mt-10 space-y-8">
              {SECTIONS.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-3xl border border-border/80 bg-card p-6 sm:p-8"
                >
                  <h2 className="font-display text-2xl font-semibold">
                    <span aria-hidden>{section.emoji} </span>
                    {section.title}
                  </h2>
                  <p className="mt-1 text-muted-foreground">{section.intro}</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm sm:text-base">
                    {section.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 rounded-full" variant="outline">
                    <Link href={section.cta.href}>{section.cta.label}</Link>
                  </Button>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-secondary/60 p-6 text-center">
              <p className="font-medium">Still unsure?</p>
              <Button asChild className="mt-4 rounded-full">
                <Link href="/consult">Consult Doctor</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
