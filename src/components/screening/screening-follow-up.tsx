import type { ScreeningResult } from "@/lib/screening/types";

type ScreeningFollowUpProps = {
  result: ScreeningResult;
};

export function ScreeningFollowUp({ result }: ScreeningFollowUpProps) {
  const { consultDoctor, activities, lang } = result;
  const activitiesTitle =
    lang === "te" ? "ఇంటి ఆటలు (వయసు & ఆలస్యం ప్రకారం)" : "Home activities for this age";
  const activitiesHint =
    lang === "te"
      ? `${activities.ageBandLabel} — డాక్టర్ సలహాకు బదులు కాదు; రోజుకు కొన్ని నిమిషాలు సాధన.`
      : `${activities.ageBandLabel} — practice a few minutes a day. These do not replace a doctor visit.`;
  const noActivities =
    lang === "te"
      ? "ఈ స్క్రీన్‌లో ప్రత్యేక ఆలస్యం లేదు. సాధారణ ఆట, మాట్లాడటం, బయట సమయం కొనసాగించండి."
      : "No specific delay flagged on this screen. Keep everyday play, talk, and outdoor time going.";

  return (
    <div className="space-y-6">
      <aside
        className={
          consultDoctor.urgent
            ? "space-y-2 border-l-4 border-[var(--status-orange)] bg-secondary/50 px-4 py-4"
            : "space-y-2 border-l-4 border-accent bg-secondary/40 px-4 py-4"
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {lang === "te" ? "తదుపరి అడుగు" : "Next step"}
        </p>
        <h3 className="font-display text-xl font-semibold">{consultDoctor.title}</h3>
        <p className="text-sm text-muted-foreground">{consultDoctor.body}</p>
        <p className="text-sm font-medium">{consultDoctor.doctorLine}</p>
      </aside>

      <section className="space-y-4">
        <div>
          <h3 className="font-display text-xl font-semibold">{activitiesTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{activitiesHint}</p>
        </div>

        {activities.groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">{noActivities}</p>
        ) : (
          <div className="space-y-4">
            {activities.groups.map((group) => (
              <div
                key={`${group.focus}-${group.title}`}
                className="space-y-2 border-t border-border pt-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <h4 className="font-medium">{group.title}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {group.steps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
