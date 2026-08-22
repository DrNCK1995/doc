"use client";

import * as React from "react";
import {
  CONDITION_ADVICE,
  type AdviceLang,
  type ConditionId,
} from "@/lib/nutrition/condition-advice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

const SECTIONS = [
  { key: "offer", en: "Offer", te: "ఇవ్వండి" },
  { key: "avoid", en: "Limit / avoid", te: "తగ్గించండి / వద్దు" },
  { key: "homeCare", en: "At home", te: "ఇంట్లో" },
  { key: "seekCare", en: "See the doctor if", te: "డాక్టర్‌ను చూపించండి" },
] as const;

type ConditionAdvicePanelProps = {
  highlight?: ConditionId[];
  className?: string;
};

export function ConditionAdvicePanel({
  highlight = [],
  className,
}: ConditionAdvicePanelProps) {
  const [lang, setLang] = React.useState<AdviceLang>("en");
  const [tab, setTab] = React.useState<ConditionId>("constipation");

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">
            {lang === "en"
              ? "Feeding in common illnesses"
              : "సాధారణ జబ్బుల్లో ఆహారం"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === "en"
              ? "Parent guidance in English and Telugu. This does not replace a clinic visit."
              : "ఆంగ్లం, తెలుగులో తల్లిదండ్రుల మార్గదర్శకం. ఇది క్లినిక్ సందర్శనకు ప్రత్యామ్నాయం కాదు."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={lang === "en" ? "default" : "outline"}
            onClick={() => setLang("en")}
          >
            English
          </Button>
          <Button
            type="button"
            size="sm"
            variant={lang === "te" ? "default" : "outline"}
            onClick={() => setLang("te")}
          >
            తెలుగు
          </Button>
        </div>
      </div>

      {highlight.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          {lang === "en" ? "From your answers, see: " : "మీ సమాధానాల నుంచి చూడండి: "}
          {highlight.map((id) => {
            const item = CONDITION_ADVICE.find((c) => c.id === id);
            if (!item) return null;
            return (
              <button
                key={id}
                type="button"
                className="mr-2 font-medium text-primary underline-offset-2 hover:underline"
                onClick={() => setTab(id)}
              >
                {item.title[lang]}
              </button>
            );
          })}
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={(v) => setTab(v as ConditionId)}>
        <TabsList className="h-auto">
          {CONDITION_ADVICE.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="text-xs sm:text-sm">
              {c.title[lang]}
            </TabsTrigger>
          ))}
        </TabsList>
        {CONDITION_ADVICE.map((c) => (
          <TabsContent key={c.id} value={c.id}>
            <article
              className="space-y-5 rounded-2xl border border-border bg-card/80 p-5"
              lang={lang === "te" ? "te" : "en"}
            >
              <p className="text-sm text-muted-foreground">{c.summary[lang]}</p>
              {SECTIONS.map((section) => (
                <div key={section.key}>
                  <h3 className="text-sm font-semibold">{section[lang]}</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {c[section.key][lang].map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
