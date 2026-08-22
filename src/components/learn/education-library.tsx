"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Activity,
  Baby,
  BookOpen,
  Clock,
  Stethoscope,
  Utensils,
  Users,
} from "lucide-react";
import { ScreeningDisclaimer } from "@/components/tools/disclaimer";
import { Button } from "@/components/ui/button";
import {
  AGE_BANDS,
  isAgeBandId,
  topicsForBand,
} from "@/lib/learn/library";
import type { AgeBandId, LearnLang, LearnTopic } from "@/lib/learn/types";
import { cn } from "@/lib/utils/cn";

const BAND_ICONS = {
  newborn: Baby,
  "2-6m": Activity,
  "6-12m": Utensils,
  "1-5y": Users,
} as const;

const COPY = {
  eyebrow: { en: "Parent education", te: "తల్లిదండ్రుల విద్య" },
  title: {
    en: "Library by age — not a blog",
    te: "వయసు ప్రకారం లైబ్రరీ — బ్లాగ్ కాదు",
  },
  lead: {
    en: "Pick the child’s age, then one topic. Each guide is a two-minute explanation, a four-step infographic, and warning signs — in English and Telugu. This is parent education, not a diagnosis.",
    te: "పిల్ల వయసు ఎంచుకుని, ఒక అంశం తీసుకోండి. ప్రతి గైడ్‌లో రెండు నిమిషాల వివరణ, నాలుగు దశల సూచన చిత్రం, హెచ్చరిక సైన్లు — ఆంగ్లం, తెలుగు. ఇది తల్లిదండ్రుల విద్య, రోగ నిర్ధారణ కాదు.",
  },
  pickAge: { en: "Choose an age", te: "వయసు ఎంచుకోండి" },
  pickTopic: { en: "Then a topic", te: "తర్వాత అంశం" },
  explanation: { en: "In two minutes", te: "రెండు నిమిషాల్లో" },
  infographic: { en: "Infographic", te: "సూచన చిత్రం" },
  seeDoctor: { en: "When to see the doctor", te: "డాక్టర్‌ను ఎప్పుడు చూపించాలి" },
};

export function EducationLibrary() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const ageParam = searchParams.get("age");
  const bandId: AgeBandId = isAgeBandId(ageParam) ? ageParam : "newborn";
  const band = AGE_BANDS.find((item) => item.id === bandId) ?? AGE_BANDS[0];
  const topics = topicsForBand(band.id);
  const topic =
    topics.find((item) => item.id === searchParams.get("topic")) ?? topics[0];
  const lang: LearnLang = searchParams.get("lang") === "te" ? "te" : "en";

  function goTo(nextBand: AgeBandId, nextTopic?: string, nextLang: LearnLang = lang) {
    const list = topicsForBand(nextBand);
    const chosen =
      nextTopic && list.some((item) => item.id === nextTopic)
        ? nextTopic
        : list[0]?.id;
    const params = new URLSearchParams();
    params.set("age", nextBand);
    if (chosen) params.set("topic", chosen);
    if (nextLang === "te") params.set("lang", "te");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className={cn("space-y-8", lang === "te" && "font-telugu")}
      lang={lang === "te" ? "te" : "en"}
      style={{ ["--learn-accent" as string]: band.accent }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {COPY.eyebrow[lang]}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            {COPY.title[lang]}
          </h1>
          <p className="mt-3 text-muted-foreground">{COPY.lead[lang]}</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={lang === "en" ? "default" : "outline"}
            onClick={() => goTo(band.id, topic?.id, "en")}
          >
            English
          </Button>
          <Button
            type="button"
            size="sm"
            variant={lang === "te" ? "default" : "outline"}
            onClick={() => goTo(band.id, topic?.id, "te")}
          >
            తెలుగు
          </Button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {COPY.pickAge[lang]}
        </p>
        <h2 className="sr-only">Age bands</h2>
      </div>

      <AgeRuler
        bandId={band.id}
        lang={lang}
        onSelect={(id) => goTo(id)}
      />

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          {COPY.pickTopic[lang]} · {band.label[lang]}
        </p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {topics.map((item) => {
            const active = item.id === topic.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(band.id, item.id)}
                className={cn(
                  "w-36 shrink-0 text-left transition-opacity",
                  active ? "opacity-100" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={item.image.src}
                  alt=""
                  width={288}
                  height={162}
                  className="aspect-[16/9] w-full object-cover"
                />
                <span
                  className={cn(
                    "mt-2 block border-b-2 pb-2 text-sm font-medium",
                    active
                      ? "border-[var(--learn-accent)] text-foreground"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  {item.title[lang]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {topic ? <TopicPane key={`${topic.id}-${lang}`} lang={lang} topic={topic} /> : null}

      <ScreeningDisclaimer />
    </div>
  );
}

function AgeRuler({
  bandId,
  lang,
  onSelect,
}: {
  bandId: AgeBandId;
  lang: LearnLang;
  onSelect: (id: AgeBandId) => void;
}) {
  const activeIndex = AGE_BANDS.findIndex((band) => band.id === bandId);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute top-[1.15rem] right-[12.5%] left-[12.5%] hidden h-px bg-border sm:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[1.15rem] left-[12.5%] hidden h-px origin-left bg-[var(--learn-accent)] transition-[width] duration-500 sm:block"
        style={{ width: `calc(${(activeIndex / 3) * 75}% )` }}
        aria-hidden
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-0">
        {AGE_BANDS.map((band) => {
          const Icon = BAND_ICONS[band.id];
          const active = band.id === bandId;
          return (
            <button
              key={band.id}
              type="button"
              onClick={() => onSelect(band.id)}
              className="group flex flex-col items-center text-center"
              aria-current={active ? "true" : undefined}
            >
              <span
                className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
                  active
                    ? "scale-110 border-transparent text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground group-hover:border-accent group-hover:text-foreground",
                )}
                style={active ? { backgroundColor: band.accent, color: "#06202b" } : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span
                className={cn(
                  "mt-3 font-display text-lg font-semibold transition-colors",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {band.label[lang]}
              </span>
              <span className="text-xs text-muted-foreground">{band.range[lang]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopicPane({ lang, topic }: { lang: LearnLang; topic: LearnTopic }) {
  return (
    <article className="learn-rise space-y-10">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {lang === "en"
            ? `${topic.minutes}-minute read`
            : `${topic.minutes} నిమిషాలు`}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          {topic.title[lang]}
        </h2>
      </header>

      <figure>
        <Image
          src={topic.image.src}
          alt={topic.image.alt[lang]}
          width={1600}
          height={900}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, 64rem"
          priority
        />
      </figure>

      <section>
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
          <BookOpen className="h-5 w-5 text-accent" aria-hidden />
          {COPY.explanation[lang]}
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/90">
          {topic.explanation[lang]}
        </p>
      </section>

      <section>
        <h3 className="font-display text-xl font-semibold">{COPY.infographic[lang]}</h3>
        <InfographicStrip lang={lang} topic={topic} />
      </section>

      <section>
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
          <Stethoscope className="h-5 w-5 text-[var(--status-red)]" aria-hidden />
          {COPY.seeDoctor[lang]}
        </h3>
        <ul className="mt-4 space-y-3 border-l-2 border-[var(--status-red)] pl-4">
          {topic.seeDoctor.map((item) => (
            <li key={item.en} className="text-sm leading-relaxed">
              {item[lang]}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function InfographicStrip({ lang, topic }: { lang: LearnLang; topic: LearnTopic }) {
  return (
    <ol className="relative mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <span
        className="learn-spine pointer-events-none absolute top-5 right-[12%] left-[12%] hidden h-px bg-border lg:block"
        aria-hidden
      />
      {topic.infographic.map((step, index) => (
        <li
          key={step.label.en}
          className="learn-step relative"
          style={{ animationDelay: `${80 + index * 90}ms` }}
        >
          <p
            className="font-display text-4xl font-semibold tabular-nums"
            style={{ color: "var(--learn-accent)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="mt-2 font-semibold">{step.label[lang]}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {step.detail[lang]}
          </p>
        </li>
      ))}
    </ol>
  );
}
