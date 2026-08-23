import type { Metadata } from "next";
import Image from "next/image";
import { NutritionForm } from "@/components/nutrition/nutrition-form";
import { SouthIndianDietChartPanel } from "@/components/nutrition/south-indian-diet-chart";

export const metadata: Metadata = {
  title: "Food for Growth — nutrition & South Indian diet charts",
  description:
    "Age and weight-based South Indian model diet charts, feeding assessment, and advice for malnutrition and common illnesses.",
};

export default function NutritionPage() {
  return (
    <div className="relative -mx-4 space-y-10 sm:-mx-6 lg:-mx-8">
      <div className="relative overflow-hidden px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/nutrition-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(27,122,158,0.14),transparent_55%)]"
            aria-hidden
          />
        </div>

        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Food for Growth
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Age-specific feeding &amp; South Indian diet charts
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Assess intake by age, then use a model day chart (idli, dosa, ragi,
            rice–sambar, curd rice) matched to weight — including catch-up plates
            when undernutrition is a concern. Illness feeding tips are in English
            and Telugu. For a full picture,{" "}
            <a
              href="/dashboard"
              className="font-medium text-primary hover:underline"
            >
              request the child health dashboard
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
        <SouthIndianDietChartPanel />
        <NutritionForm />
      </div>
    </div>
  );
}
