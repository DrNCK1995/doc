import { Suspense } from "react";
import DoctorAppointmentsClient from "./appointments-client";

export const metadata = {
  title: "Appointment records",
  description: "Clinic appointment list for Dr Care for Kids.",
};

export default function DoctorAppointmentsPage() {
  return (
    <Suspense
      fallback={
        <main className="pt-16">
          <p className="container-page section-pad text-sm text-muted-foreground">
            Loading…
          </p>
        </main>
      }
    >
      <DoctorAppointmentsClient />
    </Suspense>
  );
}
