import type { Metadata } from "next";
import { DosageCalculator } from "@/components/dosage/dosage-calculator";
import { CommonDrugsGuide } from "@/components/dosage/common-drugs-guide";

export const metadata: Metadata = {
  title: "Common drugs — paediatric dose guide",
  description:
    "Common OTC paediatric drugs with ml dose calculator, uses, precautions, and disclaimers.",
};

export default function DosagePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Medicines
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Common drugs
        </h1>
        <p className="mt-3 text-muted-foreground">
          Enter weight and age to see ml doses for common Indian formulations —
          then review uses, precautions, and disclaimers for every drug listed.
        </p>
      </div>
      <DosageCalculator />
      <CommonDrugsGuide />
    </div>
  );
}
