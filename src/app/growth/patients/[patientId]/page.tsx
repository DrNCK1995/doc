import { Suspense } from "react";
import { PatientDashboard } from "@/components/growth/patient-dashboard";

export default function PatientDashboardPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">Loading patient…</p>
      }
    >
      <PatientDashboard />
    </Suspense>
  );
}
