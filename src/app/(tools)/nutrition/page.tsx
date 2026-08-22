import type { Metadata } from "next";
import { NutritionForm } from "@/components/nutrition/nutrition-form";

export const metadata: Metadata = {
  title: "Nutrition and diet assessment",
  description:
    "Age-specific feeding assessment plus English and Telugu advice for constipation, anaemia, diarrhoea, fever, cold and cough, and malnutrition.",
};

export default function NutritionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Nutrition & diet
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Age-specific feeding assessment
        </h1>
        <p className="mt-3 text-muted-foreground">
          Modules for 0–6 months, 6–12 months, 1–2 years, preschool, school age,
          and adolescents. Enter growth and diet details for an energy/protein
          estimate, possible gaps, feeding advice, and vegetarian / non-vegetarian
          meal ideas. Below, feeding tips for constipation, anaemia, diarrhoea,
          fever, cold &amp; cough, and malnutrition are in English and Telugu. To
          combine this with development and vaccination,{" "}
          <a href="/dashboard" className="font-medium text-primary hover:underline">
            request the child health dashboard
          </a>
          .
        </p>
      </div>
      <NutritionForm />
    </div>
  );
}
