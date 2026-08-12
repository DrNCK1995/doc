"use client";

import * as React from "react";
import type { ApiAlert, ApiPatient, ApiVisit } from "@/types/api";
import { parseApiError } from "@/types/api";

type PatientState = {
  patient: ApiPatient | null;
  visits: ApiVisit[];
  alerts: ApiAlert[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function usePatient(patientId: string | undefined): PatientState {
  const [patient, setPatient] = React.useState<ApiPatient | null>(null);
  const [visits, setVisits] = React.useState<ApiVisit[]>([]);
  const [alerts, setAlerts] = React.useState<ApiAlert[]>([]);
  const [loading, setLoading] = React.useState(Boolean(patientId));
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const [patientRes, visitsRes] = await Promise.all([
        fetch(`/api/patients/${encodeURIComponent(patientId)}`),
        fetch(
          `/api/patients/${encodeURIComponent(patientId)}/visits?alerts=1`,
        ),
      ]);

      if (!patientRes.ok) {
        throw new Error(await parseApiError(patientRes));
      }
      if (!visitsRes.ok) {
        throw new Error(await parseApiError(visitsRes));
      }

      const patientJson = (await patientRes.json()) as { patient: ApiPatient };
      const visitsJson = (await visitsRes.json()) as {
        visits: ApiVisit[];
        alerts?: ApiAlert[];
      };

      setPatient(patientJson.patient);
      setVisits(visitsJson.visits ?? []);
      setAlerts(visitsJson.alerts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patient");
      setPatient(null);
      setVisits([]);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  return { patient, visits, alerts, loading, error, refresh };
}
