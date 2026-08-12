"use client";

import * as React from "react";
import { parseApiError } from "@/types/api";
import type { ChartPayload } from "@/types/charts";

type ChartsState = {
  charts: ChartPayload | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useCharts(patientId: string | undefined): ChartsState {
  const [charts, setCharts] = React.useState<ChartPayload | null>(null);
  const [loading, setLoading] = React.useState(Boolean(patientId));
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/patients/${encodeURIComponent(patientId)}/charts`,
      );
      if (!res.ok) throw new Error(await parseApiError(res));
      const data = (await res.json()) as ChartPayload;
      setCharts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load charts");
      setCharts(null);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  return { charts, loading, error, refresh };
}
