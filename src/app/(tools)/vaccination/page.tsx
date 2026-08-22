import type { Metadata } from "next";
import { VaccinationGuide } from "@/components/vaccination/vaccination-guide";

export const metadata: Metadata = {
  title: "IAP vaccination schedule",
  description:
    "Vaccination infographics, IAP ACVIP 2023 timetable, why each vaccine is given, private vs UIP, and automated PDF reminders.",
};

export default function VaccinationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Vaccination
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Infographics, IAP schedule, and private vs UIP
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Enrol for a PDF and email reminders, then use the visual guides and full
          IAP timetable — including which shots are usually private beyond free
          government UIP vaccines.
        </p>
      </div>
      <VaccinationGuide />
    </div>
  );
}
