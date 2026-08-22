"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/growth/status-badge";
import { ScreeningDisclaimer } from "@/components/tools/disclaimer";
import { YesNoField } from "@/components/tools/yes-no-field";
import { ScreeningFollowUp } from "@/components/screening/screening-follow-up";
import { ScreeningSources } from "@/components/screening/screening-sources";
import { cn } from "@/lib/utils/cn";
import {
  getScreeningSet,
  scoreScreening,
  totalAgeMonths,
  unansweredIds,
} from "@/lib/screening/score";
import { pickText } from "@/lib/screening/types";
import type { Answer, ScreeningLang, ScreeningResult } from "@/lib/screening/types";

const COPY = {
  en: {
    langTitle: "Choose language",
    langHint: "Select English or Telugu first, then answer the screening.",
    english: "English",
    telugu: "తెలుగు",
    changeLang: "Change language",
    ageYears: "Age — years",
    ageMonths: "Additional months",
    screeningSet: "Screening set",
    milestones: "Gross motor, fine motor, language, social & cognitive",
    redFlags: "Red flags",
    redHint: "Answer Yes only if the concern is present.",
    optionalTitle: "Optional screens",
    optionalHint:
      "ADHD and autism items are optional. Turn them on only if you want those questions.",
    includeAdhd: "Include ADHD screening (ages 4+)",
    includeAutism: "Include autism screening",
    autismAgeNote: "Autism-specific items appear from 16 months of age.",
    adhdTitle: "ADHD screening (ages 4+)",
    adhdHint: "Think about the last 6 months at home and school.",
    autismTitle: "Autism screening",
    autismHint: "These items look at social communication and repetitive patterns.",
    missing: (n: number) => `Please answer every question (${n} remaining).`,
    submit: "See screening result",
    result: "Result",
    age: "Age",
    typical: "Typical",
    red: "Red flags",
    noRed: "No red flags in this domain.",
    adhdItems: "ADHD items",
    autismItems: "Autism items",
    requireAdhd: "Require assessment for ADHD",
    requireAutism: "Require assessment for autism",
    belowAdhd: " — below the threshold on this screen.",
    belowAutism: " — below the threshold on this screen.",
    requireAdhdSuffix: " — require assessment for ADHD.",
    requireAutismSuffix: " — require assessment for autism.",
  },
  te: {
    langTitle: "భాష ఎంచుకోండి",
    langHint: "ముందు ఇంగ్లీష్ లేదా తెలుగు ఎంచుకుని, తర్వాత స్క్రీనింగ్ ప్రశ్నలకు సమాధానం ఇవ్వండి.",
    english: "English",
    telugu: "తెలుగు",
    changeLang: "భాష మార్చండి",
    ageYears: "వయసు — సంవత్సరాలు",
    ageMonths: "అదనపు నెలలు",
    screeningSet: "స్క్రీనింగ్ సెట్",
    milestones: "స్థూల చలనం, సూక్ష్మ చలనం, భాష, సామాజిక & జ్ఞానాత్మక",
    redFlags: "ఎరుపు జెండాలు",
    redHint: "సమస్య ఉంటే మాత్రమే అవును అనండి.",
    optionalTitle: "ఐచ్ఛిక స్క్రీన్లు",
    optionalHint:
      "ADHD మరియు ఆటిజం ప్రశ్నలు ఐచ్ఛికం. కావాలంటే మాత్రమే ఆన్ చేయండి.",
    includeAdhd: "ADHD స్క్రీనింగ్ చేర్చండి (4+ సంవత్సరాలు)",
    includeAutism: "ఆటిజం స్క్రీనింగ్ చేర్చండి",
    autismAgeNote: "ఆటిజం ప్రశ్నలు 16 నెలల నుంచి కనిపిస్తాయి.",
    adhdTitle: "ADHD స్క్రీనింగ్ (4+ సంవత్సరాలు)",
    adhdHint: "గత 6 నెలలు ఇల్లు మరియు స్కూల్ గురించి ఆలోచించండి.",
    autismTitle: "ఆటిజం స్క్రీనింగ్",
    autismHint: "సామాజిక సంభాషణ మరియు పునరావృత నమూనాలు గురించి.",
    missing: (n: number) => `దయచేసి అన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి (${n} మిగిలి ఉన్నాయి).`,
    submit: "స్క్రీనింగ్ ఫలితం చూడండి",
    result: "ఫలితం",
    age: "వయసు",
    typical: "సాధారణం",
    red: "ఎరుపు జెండాలు",
    noRed: "ఈ విభాగంలో ఎరుపు జెండాలు లేవు.",
    adhdItems: "ADHD అంశాలు",
    autismItems: "ఆటిజం అంశాలు",
    requireAdhd: "ADHD కోసం అంచనా అవసరం",
    requireAutism: "ఆటిజం కోసం అంచనా అవసరం",
    belowAdhd: " — ఈ స్క్రీన్‌లో పరిమితి కంటే తక్కువ.",
    belowAutism: " — ఈ స్క్రీన్‌లో పరిమితి కంటే తక్కువ.",
    requireAdhdSuffix: " — ADHD కోసం అంచనా అవసరం.",
    requireAutismSuffix: " — ఆటిజం కోసం అంచనా అవసరం.",
  },
} as const;

export function ScreeningWizard() {
  const [lang, setLang] = React.useState<ScreeningLang | null>(null);
  const [years, setYears] = React.useState("1");
  const [months, setMonths] = React.useState("6");
  const [includeAdhd, setIncludeAdhd] = React.useState(false);
  const [includeAutism, setIncludeAutism] = React.useState(false);
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});
  const [missing, setMissing] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<ScreeningResult | null>(null);

  const ageMonths = totalAgeMonths(Number(years) || 0, Number(months) || 0);
  const activeLang = lang ?? "en";
  const t = COPY[activeLang];
  const set = getScreeningSet(ageMonths, {
    lang: activeLang,
    includeAdhd,
    includeAutism,
  });

  React.useEffect(() => {
    setAnswers({});
    setMissing([]);
    setResult(null);
    setIncludeAdhd(false);
    setIncludeAutism(false);
  }, [set.ageMonths]);

  function setAnswer(id: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setMissing((prev) => prev.filter((x) => x !== id));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lang) return;
    const pending = unansweredIds(set, answers);
    if (pending.length > 0) {
      setMissing(pending);
      setResult(null);
      document.getElementById(pending[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setResult(scoreScreening(set, answers, lang));
  }

  if (!lang) {
    return (
      <div className="space-y-8">
        <ScreeningDisclaimer />
        <ScreeningSources lang="en" />
        <section className="space-y-4 border-y border-border py-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">{COPY.en.langTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{COPY.en.langHint}</p>
            <p className="mt-2 font-telugu text-sm text-muted-foreground" lang="te">
              {COPY.te.langHint}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" size="lg" onClick={() => setLang("en")}>
              {COPY.en.english}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="secondary"
              className="font-telugu"
              onClick={() => setLang("te")}
            >
              {COPY.te.telugu}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", lang === "te" && "font-telugu")} lang={lang}>
      <ScreeningDisclaimer />
      <ScreeningSources lang={lang} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {lang === "en" ? "English" : "తెలుగు"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setLang(null);
            setResult(null);
            setAnswers({});
            setMissing([]);
          }}
        >
          {t.changeLang}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="years">{t.ageYears}</Label>
          <Input
            id="years"
            type="number"
            min={0}
            max={18}
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="months">{t.ageMonths}</Label>
          <Input
            id="months"
            type="number"
            min={0}
            max={11}
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {t.screeningSet}: {set.bandLabel} · {set.ageLabel}
      </p>

      <form onSubmit={onSubmit} className="space-y-10">
        <QuestionGroup
          title={t.milestones}
          items={set.milestones}
          answers={answers}
          missing={missing}
          lang={lang}
          onAnswer={setAnswer}
        />
        <QuestionGroup
          title={t.redFlags}
          hint={t.redHint}
          items={set.redFlags}
          answers={answers}
          missing={missing}
          lang={lang}
          onAnswer={setAnswer}
        />

        {set.adhdAvailable.length > 0 || set.autismAvailable.length > 0 ? (
          <section className="space-y-3">
            <div>
              <h2 className="font-display text-2xl font-semibold">{t.optionalTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.optionalHint}</p>
            </div>
            {set.adhdAvailable.length > 0 ? (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 accent-[var(--primary)]"
                  checked={includeAdhd}
                  onChange={(e) => {
                    setIncludeAdhd(e.target.checked);
                    setResult(null);
                    setMissing([]);
                  }}
                />
                <span className="text-sm font-medium">{t.includeAdhd}</span>
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
                    setResult(null);
                    setMissing([]);
                  }}
                />
                <span className="text-sm font-medium">{t.includeAutism}</span>
              </label>
            ) : (
              <p className="text-sm text-muted-foreground">{t.autismAgeNote}</p>
            )}
          </section>
        ) : (
          <p className="text-sm text-muted-foreground">{t.autismAgeNote}</p>
        )}

        {includeAdhd && set.adhd.length > 0 ? (
          <QuestionGroup
            title={t.adhdTitle}
            hint={t.adhdHint}
            items={set.adhd}
            answers={answers}
            missing={missing}
            lang={lang}
            onAnswer={setAnswer}
          />
        ) : null}
        {includeAutism && set.autism.length > 0 ? (
          <QuestionGroup
            title={t.autismTitle}
            hint={t.autismHint}
            items={set.autism}
            answers={answers}
            missing={missing}
            lang={lang}
            onAnswer={setAnswer}
          />
        ) : null}

        {missing.length > 0 ? (
          <p className="text-sm text-[var(--status-red)]">{t.missing(missing.length)}</p>
        ) : null}

        <Button type="submit" size="lg">
          {t.submit}
        </Button>
      </form>

      {result ? <ResultPanel result={result} copy={t} /> : null}
    </div>
  );
}

function QuestionGroup({
  title,
  hint,
  items,
  answers,
  missing,
  lang,
  onAnswer,
}: {
  title: string;
  hint?: string;
  items: { id: string; text: { en: string; te: string } }[];
  answers: Record<string, Answer>;
  missing: string[];
  lang: ScreeningLang;
  onAnswer: (id: string, value: Answer) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
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
    </section>
  );
}

function ResultPanel({
  result,
  copy,
}: {
  result: ScreeningResult;
  copy: (typeof COPY)[ScreeningLang];
}) {
  return (
    <section
      className={cn(
        "space-y-6 rounded-2xl border border-border bg-card p-6",
        result.lang === "te" && "font-telugu",
      )}
      lang={result.lang}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {copy.result}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold">{result.verdictLabel}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {copy.age} {result.ageLabel}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge
          label={result.verdictLabel}
          color={result.verdict === "NORMAL_DEVELOPMENT" ? "green" : "orange"}
        />
        {result.adhd.requireAssessment ? (
          <StatusBadge label={copy.requireAdhd} color="orange" />
        ) : null}
        {result.autism.requireAssessment ? (
          <StatusBadge label={copy.requireAutism} color="orange" />
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {result.domainResults.map((domain) => (
          <div key={domain.domain} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium">{domain.label}</h3>
              <StatusBadge
                label={domain.status === "typical" ? copy.typical : copy.red}
                color={domain.status === "typical" ? "green" : "red"}
              />
            </div>
            {domain.status === "typical" ? (
              <p className="mt-2 text-sm text-muted-foreground">{copy.noRed}</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {[...domain.redFlags, ...domain.missed].map((line) => (
                  <li key={line}>— {line}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {result.adhd.applicable ? (
        <p className="text-sm text-muted-foreground">
          {copy.adhdItems}: {result.adhd.score}/{result.adhd.total}
          {result.adhd.requireAssessment ? copy.requireAdhdSuffix : copy.belowAdhd}
        </p>
      ) : null}
      {result.autism.applicable ? (
        <p className="text-sm text-muted-foreground">
          {copy.autismItems}: {result.autism.score}/{result.autism.total}
          {result.autism.requireAssessment
            ? copy.requireAutismSuffix
            : copy.belowAutism}
        </p>
      ) : null}

      <ScreeningFollowUp result={result} />
    </section>
  );
}
