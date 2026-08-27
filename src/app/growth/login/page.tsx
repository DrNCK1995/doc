import type { Metadata } from "next";
import { Suspense } from "react";
import { PersonalLoginForm } from "@/components/growth/personal-login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to My Child and Grow Right with your login ID or mobile, or as clinic admin.",
};

export default function GrowthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md text-sm text-muted-foreground">
          Loading login…
        </div>
      }
    >
      <PersonalLoginForm />
    </Suspense>
  );
}
