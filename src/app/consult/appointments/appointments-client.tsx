"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VISIT_TYPE_LABELS, type VisitTypeKey } from "@/lib/consult/config";

type Row = {
  confirmationCode: string;
  status: string;
  visitType: string;
  dateLabel: string;
  slotLabel: string;
  childName: string;
  parentName: string;
  parentMobile: string;
  parentEmail: string;
  amountInr: number;
  reason: string | null;
};

export default function DoctorAppointmentsClient() {
  const searchParams = useSearchParams();
  const [key, setKey] = React.useState(searchParams.get("key") ?? "");
  const [rows, setRows] = React.useState<Row[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function load(secret = key) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/appointments/admin?key=${encodeURIComponent(secret)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unauthorized");
      setRows(data.appointments ?? []);
    } catch (e) {
      setRows([]);
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const fromUrl = searchParams.get("key");
    if (fromUrl) {
      setKey(fromUrl);
      void load(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="pt-16">
        <section className="section-pad">
          <div className="container-page max-w-4xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Appointment records
            </h1>
            <p className="mt-2 text-muted-foreground">
              Clinic view of booked visits (requires admin secret).
            </p>

            <form
              className="mt-6 flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                void load();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="admin-key">Admin secret</Label>
                <Input
                  id="admin-key"
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="h-11 w-64 rounded-xl"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="rounded-full" disabled={loading}>
                {loading ? "Loading…" : "Load appointments"}
              </Button>
            </form>

            {error ? (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            ) : null}

            <div className="mt-8 space-y-3">
              {rows.length === 0 && !error && !loading ? (
                <p className="text-sm text-muted-foreground">
                  No appointments yet.
                </p>
              ) : null}
              {rows.map((row) => (
                <article
                  key={row.confirmationCode}
                  className="rounded-2xl border border-border/80 bg-card p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-sm font-semibold">
                      {row.confirmationCode}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {row.status}
                    </p>
                  </div>
                  <p className="mt-1 font-medium">
                    {row.dateLabel} · {row.slotLabel}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {VISIT_TYPE_LABELS[row.visitType as VisitTypeKey] ??
                      row.visitType}
                  </p>
                  <p className="mt-2 text-sm">
                    {row.childName} · parent {row.parentName} · {row.parentMobile}
                  </p>
                  <p className="text-xs text-muted-foreground">{row.parentEmail}</p>
                  {row.reason ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reason: {row.reason}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Fee ₹{row.amountInr}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
