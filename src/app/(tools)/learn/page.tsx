import type { Metadata } from "next";
import { Suspense } from "react";
import { EducationLibrary } from "@/components/learn/education-library";

export const metadata: Metadata = {
  title: "Guides & FAQs — parent education",
  description:
    "Age-based baby and child guides plus organised Common Problems and Parent FAQs — English and Telugu.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Suspense fallback={<LearnFallback />}>
        <EducationLibrary />
      </Suspense>
    </div>
  );
}

function LearnFallback() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-24 rounded-xl bg-secondary/60" />
      <div className="h-10 w-2/3 rounded-lg bg-secondary/40" />
      <div className="h-40 rounded-xl bg-secondary/30" />
    </div>
  );
}
