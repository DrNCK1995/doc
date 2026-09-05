"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Activity,
  Baby,
  BookOpen,
  CircleHelp,
  Clock,
  HeartPulse,
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
import {
  FAQ_GROUP_LABELS,
  FAQ_KIND_LABELS,
  PARENT_FAQ_SECTIONS,
  type FaqGroupId,
  type FaqKind,
} from "@/lib/learn/faqs";
import type { AgeBandId, LearnLang, LearnTopic } from "@/lib/learn/types";
import { cn } from "@/lib/utils/cn";

const BAND_ICONS = {
  newborn: Baby,
  "2-6m": Activity,
  "6-12m": Utensils,
  "1-5y": Users,
} as const;

const COPY = {
  eyebrow: { en: "Guides & FAQs", te: "గైడ్‌లు & ప్రశ్నోత్తరాలు" },
  title: {
    en: "Age guides, common problems & FAQs",
    te: "వయసు గైడ్‌లు, సాధారణ సమస్యలు & ప్రశ్నోత్తరాలు",
  },
  lead: {
    en: "Baby and child care by age, plus common clinic problems and parent FAQs — English and Telugu. Education only, not a diagnosis.",
    te: "వయసు ప్రకారం పాప / పిల్ల సంరక్షణ, సాధారణ క్లినిక్ సమస్యలు, తల్లిదండ్రుల ప్రశ్నోత్తరాలు — ఆంగ్లం & తెలుగు. విద్య మాత్రమే, రోగ నిర్ధారణ కాదు.",
  },
  jumpAge: { en: "Age guides", te: "వయసు గైడ్‌లు" },
  jumpAgeHint: {
    en: "Newborn to 5 years",
    te: "నవజాతం నుంచి 5 ఏళ్లు",
  },
  jumpProblems: { en: "Common problems", te: "సాధారణ సమస్యలు" },
  jumpProblemsHint: {
    en: "Cough, constipation, seizures…",
    te: "దగ్గు, మలబద్ధకం, మూర్ఛ…",
  },
  jumpFaqs: { en: "Parent FAQs", te: "తల్లిదండ్రుల FAQs" },
  jumpFaqsHint: {
    en: "Vaccines, sleep, nutrition…",
    te: "టీకాలు, నిద్ర, పోషణ…",
  },
  pickAge: { en: "Choose an age", te: "వయసు ఎంచుకోండి" },
  pickTopic: { en: "Then a topic", te: "తర్వాత అంశం" },
  explanation: { en: "In two minutes", te: "రెండు నిమిషాల్లో" },
  infographic: { en: "Infographic", te: "సూచన చిత్రం" },
  seeDoctor: { en: "When to see the doctor", te: "డాక్టర్‌ను ఎప్పుడు చూపించాలి" },
  faqsEyebrow: { en: "At a glance", te: "ఒక చూపులో" },
  faqsTitle: {
    en: "Common problems & FAQs",
    te: "సాధారణ సమస్యలు & ప్రశ్నోత్తరాలు",
  },
  faqsLead: {
    en: "Organised by topic — common clinic problems and parent FAQs in English and Telugu. Education only, not a personal diagnosis. Based on everyday paediatric questions and IAP parent-guideline themes.",
    te: "అంశాల వారీగా — సాధారణ క్లినిక్ సమస్యలు, తల్లిదండ్రుల ప్రశ్నోత్తరాలు ఆంగ్లం & తెలుగు. విద్య మాత్రమే, వ్యక్తిగత రోగ నిర్ధారణ కాదు. రోజువారీ పీడియాట్రిక్ ప్రశ్నలు, IAP పేరెంట్ గైడ్‌లైన్ థీమ్‌ల ఆధారంగా.",
  },
  allGroups: { en: "All groups", te: "అన్ని గ్రూపులు" },
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
  const hubParam = searchParams.get("hub");
  const faqKind: FaqKind =
    hubParam === "faqs" ? "faq" : "common-problem";

  function buildParams(opts: {
    age?: AgeBandId;
    topic?: string;
    lang?: LearnLang;
    hub?: "problems" | "faqs" | null;
  }) {
    const params = new URLSearchParams();
    const nextAge = opts.age ?? band.id;
    params.set("age", nextAge);
    const list = topicsForBand(nextAge);
    const chosen =
      opts.topic && list.some((item) => item.id === opts.topic)
        ? opts.topic
        : (topic?.id ?? list[0]?.id);
    if (chosen) params.set("topic", chosen);
    const nextLang = opts.lang ?? lang;
    if (nextLang === "te") params.set("lang", "te");
    if (opts.hub === "problems" || opts.hub === "faqs") {
      params.set("hub", opts.hub);
    }
    return params;
  }

  function goTo(nextBand: AgeBandId, nextTopic?: string, nextLang: LearnLang = lang) {
    const params = buildParams({
      age: nextBand,
      topic: nextTopic,
      lang: nextLang,
      hub: hubParam === "faqs" || hubParam === "problems" ? hubParam : null,
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function jumpTo(target: "age" | "problems" | "faqs") {
    const hash =
      target === "age"
        ? "age-guides"
        : target === "problems"
          ? "common-problems"
          : "parent-faqs";
    const params = buildParams({
      hub: target === "age" ? null : target === "problems" ? "problems" : "faqs",
    });
    router.replace(`${pathname}?${params.toString()}#${hash}`, {
      scroll: false,
    });
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (
      hash === "age-guides" ||
      hash === "common-problems" ||
      hash === "parent-faqs"
    ) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [hubParam]);

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

      <div className="grid gap-3 sm:grid-cols-3">
        <JumpCard
          icon={Baby}
          title={COPY.jumpAge[lang]}
          hint={COPY.jumpAgeHint[lang]}
          onClick={() => jumpTo("age")}
        />
        <JumpCard
          icon={HeartPulse}
          title={COPY.jumpProblems[lang]}
          hint={COPY.jumpProblemsHint[lang]}
          onClick={() => jumpTo("problems")}
        />
        <JumpCard
          icon={CircleHelp}
          title={COPY.jumpFaqs[lang]}
          hint={COPY.jumpFaqsHint[lang]}
          onClick={() => jumpTo("faqs")}
        />
      </div>

      <div id="age-guides" className="scroll-mt-24 space-y-3">
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

      <ParentFaqBlock lang={lang} initialKind={faqKind} hubParam={hubParam} />

      <ScreeningDisclaimer />
    </div>
  );
}

function JumpCard({
  icon: Icon,
  title,
  hint,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/80 px-4 py-3 text-left transition hover:border-accent/50 hover:bg-accent/5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
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

function ParentFaqBlock({
  lang,
  initialKind,
  hubParam,
}: {
  lang: LearnLang;
  initialKind: FaqKind;
  hubParam: string | null;
}) {
  const [kind, setKind] = React.useState<FaqKind>(initialKind);
  const [group, setGroup] = React.useState<FaqGroupId | "all">("all");

  React.useEffect(() => {
    setKind(initialKind);
    setGroup("all");
  }, [initialKind, hubParam]);

  const kindSections = PARENT_FAQ_SECTIONS.filter((s) => s.kind === kind);
  const groupsInKind = [...new Set(kindSections.map((s) => s.group))];
  const filtered = kindSections.filter((s) =>
    group === "all" ? true : s.group === group,
  );

  const [openId, setOpenId] = React.useState<string | null>(
    () =>
      PARENT_FAQ_SECTIONS.find((s) => s.kind === initialKind)?.id ?? null,
  );

  React.useEffect(() => {
    setGroup("all");
  }, [kind]);

  React.useEffect(() => {
    const sections = PARENT_FAQ_SECTIONS.filter((s) => s.kind === kind).filter(
      (s) => (group === "all" ? true : s.group === group),
    );
    setOpenId((current) => {
      if (current && sections.some((s) => s.id === current)) return current;
      return sections[0]?.id ?? null;
    });
  }, [kind, group]);

  const active = filtered.find((s) => s.id === openId) ?? filtered[0];

  return (
    <div className="space-y-6 border-t border-border/80 pt-10">
      <div id="common-problems" className="scroll-mt-24" />
      <div id="parent-faqs" className="scroll-mt-24" />

      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {COPY.faqsEyebrow[lang]}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          {COPY.faqsTitle[lang]}
        </h2>
        <p className="mt-3 text-muted-foreground">{COPY.faqsLead[lang]}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["common-problem", "faq"] as const).map((k) => {
          const selected = kind === k;
          const count = PARENT_FAQ_SECTIONS.filter((s) => s.kind === k).length;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                selected
                  ? "border-primary bg-primary text-primary-foreground font-medium"
                  : "border-border/80 text-muted-foreground hover:border-accent/50",
              )}
            >
              {FAQ_KIND_LABELS[k][lang]}
              <span className="ml-1.5 opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroup("all")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs transition sm:text-sm",
            group === "all"
              ? "border-accent bg-accent/15 font-medium text-foreground"
              : "border-border/80 text-muted-foreground hover:border-accent/40",
          )}
        >
          {COPY.allGroups[lang]}
        </button>
        {groupsInKind.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition sm:text-sm",
              group === g
                ? "border-accent bg-accent/15 font-medium text-foreground"
                : "border-border/80 text-muted-foreground hover:border-accent/40",
            )}
          >
            {FAQ_GROUP_LABELS[g][lang]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.map((section) => {
          const selected = active?.id === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setOpenId(section.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition",
                selected
                  ? "border-primary bg-primary/10 font-medium text-foreground"
                  : "border-border/80 text-muted-foreground hover:border-accent/50",
              )}
            >
              <span aria-hidden>{section.emoji} </span>
              {section.title[lang]}
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="space-y-4 rounded-3xl border border-border/80 bg-card/80 p-5 sm:p-7">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {FAQ_GROUP_LABELS[active.group][lang]}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold">
              <span aria-hidden>{active.emoji} </span>
              {active.title[lang]}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {active.intro[lang]}
            </p>
          </div>
          <ul className="space-y-3">
            {active.items.map((item) => (
              <li key={item.q.en}>
                <details className="group rounded-2xl border border-border/60 bg-background/70 px-4 py-3 open:border-accent/40">
                  <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-3">
                      <span>{item.q[lang]}</span>
                      <span
                        className="shrink-0 text-accent transition group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a[lang]}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
