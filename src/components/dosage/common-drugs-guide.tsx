import { OTC_MEDICATIONS } from "@/lib/dosage/medications";
import { CLINIC_NAME, DOCTOR_NAME } from "@/lib/constants";

export function CommonDrugsGuide() {
  return (
    <section className="space-y-8 border-t border-border pt-10">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          Uses of common drugs listed
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Quick reference for why each medicine is used and when to be careful.
        </p>
      </div>

      <div className="space-y-6">
        {OTC_MEDICATIONS.map((med) => (
          <article key={med.id} className="space-y-2 border-t border-border pt-4">
            <h3 className="font-display text-xl font-semibold">{med.name}</h3>
            <p className="text-sm">
              <span className="font-medium">Use: </span>
              <span className="text-muted-foreground">{med.use}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Usual timing: </span>
              {med.frequency}
            </p>
            {med.notes.length > 0 ? (
              <div>
                <p className="text-sm font-medium">How to use</p>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  {med.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {med.avoid.length > 0 ? (
              <div>
                <p className="text-sm font-medium">Precautions</p>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  {med.avoid.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--status-orange)]" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <aside className="space-y-3 border-y border-border py-6">
        <h2 className="font-display text-2xl font-semibold">
          Precautions &amp; disclaimers
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            This page is for parent education only. It is not a prescription and
            does not replace advice from {DOCTOR_NAME} at {CLINIC_NAME}.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Always read the bottle label. Strengths differ (mg/ml). Use the
            measuring cup or dropper that comes with the medicine.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Do not give two medicines that both contain paracetamol. Do not
            exceed the maximum doses or frequency shown for your child’s weight
            and age.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Seek same-day care for babies under 3 months with fever, breathing
            difficulty, persistent vomiting, blood in stool, extreme sleepiness,
            or if you are unsure which medicine to give.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Keep all medicines out of children’s reach. Store as labelled.
            Discard leftover ORS after 24 hours.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Calculated ml volumes follow common IAP/WHO-style teaching ranges.
            Your paediatrician may advise a different dose for your child.
          </li>
        </ul>
      </aside>
    </section>
  );
}
