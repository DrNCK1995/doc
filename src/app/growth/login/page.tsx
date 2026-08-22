import type { Metadata } from "next";
import { Suspense } from "react";
import { StaffLoginForm } from "@/components/growth/staff-login-form";

export const metadata: Metadata = {
  title: "Staff login",
  description: "Sign in to access Growth Monitor patient records and downloads.",
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
      <StaffLoginForm />
    </Suspense>
  );
}
