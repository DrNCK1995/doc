import type { Metadata } from "next";
import { DashboardRequest } from "@/components/dashboard/dashboard-request";

export const metadata: Metadata = {
  title: "Child health dashboard",
  description:
    "Request an integrated dashboard for growth, vaccination, development screening, nutrition, and illness feeding advice.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Parent request
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Child health dashboard
        </h1>
        <p className="mt-3 text-muted-foreground">
          Enter your child’s basics, then choose whether to include diet and
          development. Request the dashboard when you are ready — growth,
          vaccination enrolment, optional nutrition and milestones, and bilingual
          feeding advice in one place.
        </p>
      </div>
      <DashboardRequest />
    </div>
  );
}
