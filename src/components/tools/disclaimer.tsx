import { CLINIC_NAME, DOCTOR_NAME } from "@/lib/constants";

export function ScreeningDisclaimer() {
  return (
    <p className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
      Parent education screen only — not a diagnosis. Discuss results with{" "}
      {DOCTOR_NAME} at {CLINIC_NAME}.
    </p>
  );
}
