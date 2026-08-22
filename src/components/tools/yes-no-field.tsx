import { cn } from "@/lib/utils/cn";
import type { ScreeningLang } from "@/lib/screening/types";

type YesNoFieldProps = {
  name: string;
  label: string;
  value?: "yes" | "no";
  onChange: (value: "yes" | "no") => void;
  error?: boolean;
  lang?: ScreeningLang;
};

export function YesNoField({
  name,
  label,
  value,
  onChange,
  error,
  lang = "en",
}: YesNoFieldProps) {
  const yesLabel = lang === "te" ? "అవును" : "Yes";
  const noLabel = lang === "te" ? "కాదు" : "No";

  return (
    <fieldset
      className={cn(
        "rounded-xl border border-border bg-card/70 px-4 py-3",
        error && "border-destructive",
        lang === "te" && "font-telugu",
      )}
      lang={lang === "te" ? "te" : "en"}
    >
      <legend className="mb-2 text-sm font-medium text-foreground">{label}</legend>
      <div className="flex gap-4">
        {(["yes", "no"] as const).map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            {option === "yes" ? yesLabel : noLabel}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
