import { StatusBadge } from "@/components/growth/status-badge";
import type { DoseResult } from "@/lib/dosage/types";

export function DoseResultsList({ results }: { results: DoseResult[] }) {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <article key={result.medicationId} className="rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-medium">{result.name}</h3>
              <p className="text-sm text-muted-foreground">{result.use}</p>
            </div>
            <StatusBadge
              label={result.eligible ? "Dose" : "Not for this age"}
              color={result.eligible ? "green" : "orange"}
            />
          </div>
          {result.eligible ? (
            <>
              {result.amountLabel ? (
                <p className="mt-3 text-sm">
                  <span className="font-medium">{result.amountLabel}</span>
                  <span className="text-muted-foreground"> · {result.frequency}</span>
                </p>
              ) : null}
              <ul className="mt-3 space-y-1.5">
                {result.formulations.map((form) => (
                  <li
                    key={form.id}
                    className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{form.label}</span>
                    <span className="font-display text-lg font-semibold text-foreground">
                      {form.display}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">{result.reason}</p>
          )}
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {result.notes.map((n) => (
              <li key={n}>— {n}</li>
            ))}
            {result.avoid.map((n) => (
              <li key={n} className="text-[var(--status-orange)]">
                — {n}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
