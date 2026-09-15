import type { Metadata } from "next";
import Link from "next/link";
import { OneShotGrowthCheck } from "@/components/growth/oneshot-growth-check";

export const metadata: Metadata = {
  title: "Quick growth chart — check & print",
  description:
    "One-time WHO/IAP growth check and printable chart. Nothing is stored — no registration required.",
};

export default function GrowthQuickCheckPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl no-print">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Grow Right
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Quick check &amp; print
        </h1>
        <p className="mt-3 text-muted-foreground">
          See where your child sits on the growth chart today and print or save
          as PDF. No login, no history saved — for parents who only need a
          one-time check.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Want ongoing tracking?{" "}
          <Link href="/growth" className="text-primary underline-offset-2 hover:underline">
            Register and track with Grow Right
          </Link>
          .
        </p>
      </div>

      <OneShotGrowthCheck />
    </div>
  );
}
