import type { ScreeningLang } from "@/lib/screening/types";
import { cn } from "@/lib/utils/cn";

const COPY = {
  en: {
    title: "Question sources",
    note: "Parent education screens only — adapted for clinic teaching, not a formal scored test or diagnosis.",
    milestones:
      "Development & red flags: adapted from CDC “Learn the Signs. Act Early.” milestone checklists, AAP developmental surveillance guidance, and IAP paediatric practice themes.",
    adhd:
      "ADHD screen (optional, ages 4+): adapted from DSM-5 inattention and hyperactivity–impulsivity symptom themes (parent checklist style).",
    autism:
      "Autism screen (optional): toddler items adapted from M-CHAT-R–style social-communication questions; older-child items adapted from DSM-5 autism spectrum social-communication and restricted/repetitive behaviour themes.",
  },
  te: {
    title: "ప్రశ్నల మూలాలు",
    note: "తల్లిదండ్రుల విద్యా స్క్రీన్లు మాత్రమే — క్లినిక్ బోధనకు స్వీకరించినవి; అధికారిక స్కోర్ టెస్ట్ లేదా నిర్ధారణ కాదు.",
    milestones:
      "వికాసం & ఎరుపు జెండాలు: CDC “Learn the Signs. Act Early.” మైలురాయి చెక్‌లిస్టులు, AAP వికాస పర్యవేక్షణ మార్గదర్శకాలు, IAP శిశువైద్య అభ్యాసాల నుంచి స్వీకరించబడ్డాయి.",
    adhd:
      "ADHD స్క్రీన్ (ఐచ్ఛికం, 4+ సం): DSM-5 దృష్టి లోపం మరియు అధిక చలనం–ఆవేశ లక్షణాల నుంచి స్వీకరించిన తల్లిదండ్రుల చెక్‌లిస్ట్.",
    autism:
      "ఆటిజం స్క్రీన్ (ఐచ్ఛికం): టాడ్లర్ అంశాలు M-CHAT-R శైలి సామాజిక-సంభాషణ ప్రశ్నల నుంచి; పెద్ద పిల్లల అంశాలు DSM-5 ఆటిజం స్పెక్ట్రం థీమ్‌ల నుంచి స్వీకరించబడ్డాయి.",
  },
} as const;

type ScreeningSourcesProps = {
  lang?: ScreeningLang;
  className?: string;
};

export function ScreeningSources({
  lang = "en",
  className,
}: ScreeningSourcesProps) {
  const t = COPY[lang];
  return (
    <aside
      className={cn(
        "space-y-2 border-y border-border py-4 text-sm",
        lang === "te" && "font-telugu",
        className,
      )}
      lang={lang === "te" ? "te" : "en"}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {t.title}
      </p>
      <ul className="space-y-2 text-muted-foreground">
        <li>{t.milestones}</li>
        <li>{t.adhd}</li>
        <li>{t.autism}</li>
      </ul>
      <p className="text-xs text-muted-foreground">{t.note}</p>
    </aside>
  );
}
