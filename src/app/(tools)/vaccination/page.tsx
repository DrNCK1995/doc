import type { Metadata } from "next";
import { VaccinationGuide } from "@/components/vaccination/vaccination-guide";

export const metadata: Metadata = {
  title: "Vaccine Buddy — free vaccine reminder",
  description:
    "Vaccine Buddy: IAP schedule, guides, and a free vaccine reminder with PDF and due-date emails.",
};

export default function VaccinationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Vaccine Buddy
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Never miss a vaccine — free vaccine reminder
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Visual guides, the full IAP timetable, and a free vaccine reminder
          (schedule PDF + due-date emails). Also see which shots are usually
          private beyond free government UIP vaccines.
        </p>
      </div>
      <VaccinationGuide />
    </div>
  );
}
