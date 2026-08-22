import type { Metadata } from "next";
import { ScreeningWizard } from "@/components/screening/screening-wizard";

export const metadata: Metadata = {
  title: "Paediatric development screening",
  description:
    "Age-based parent questionnaire for motor, language, social, and cognitive development, plus ADHD and autism screens.",
};

export default function ScreeningPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Development screening
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Check milestones, red flags, ADHD, and autism
        </h1>
        <p className="mt-3 text-muted-foreground">
          Enter your child&apos;s age, choose English or Telugu, then answer the
          questionnaire. ADHD and autism screens are optional. You will see
          whether development looks typical and which domains need review. For
          growth, diet, and vaccination together,{" "}
          <a href="/dashboard" className="font-medium text-primary hover:underline">
            request the child health dashboard
          </a>
          .
        </p>
      </div>
      <ScreeningWizard />
    </div>
  );
}
