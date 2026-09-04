"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

type PatientRow = {
  patientId: string;
  name: string;
  dateOfBirth: string;
  sex: string;
  mobileNumber: string;
  parentName: string;
  createdAt: string;
};

type ParentRow = {
  id: string;
  userId: string;
  mobile: string;
  name: string | null;
  createdAt: string;
  patients: PatientRow[];
};

function shortDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminParentsPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [parents, setParents] = React.useState<ParentRow[]>([]);
  const [totals, setTotals] = React.useState({ parents: 0, patients: 0 });

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (!me.authenticated || me.role !== "admin") {
        router.replace("/growth/login?next=/admin/parents");
        return;
      }
      const res = await fetch("/api/admin/parents");
      const data = (await res.json()) as {
        error?: string;
        parents?: ParentRow[];
        totalParents?: number;
        totalPatients?: number;
      };
      if (!res.ok) throw new Error(data.error || "Could not load list");
      setParents(data.parents ?? []);
      setTotals({
        parents: data.totalParents ?? 0,
        patients: data.totalPatients ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Admin
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Parent accounts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Everyone who created a login for My Child / Grow Right, with linked
            growth records by mobile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/growth">Growth home</Link>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => void load()}>
            Refresh
          </Button>
          <SignOutButton variant="ghost" />
        </div>
      </div>

      {!loading && !error ? (
        <p className="text-sm text-muted-foreground">
          {totals.parents} parent account{totals.parents === 1 ? "" : "s"} ·{" "}
          {totals.patients} linked patient record
          {totals.patients === 1 ? "" : "s"}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && parents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No parent accounts yet. When parents create an account on the sign-in
          page, they will appear here.
        </p>
      ) : null}

      <ul className="space-y-6">
        {parents.map((p) => (
          <li
            key={p.id}
            className="border-t border-border pt-4 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">
                  {p.name || p.userId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Login ID: <span className="text-foreground">{p.userId}</span>
                  {" · "}
                  Mobile: <span className="text-foreground">{p.mobile}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Created {shortDate(p.createdAt)}
              </p>
            </div>
            {p.patients.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No growth patient records linked to this mobile yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {p.patients.map((child) => (
                  <li key={child.patientId} className="text-sm">
                    <Link
                      href={`/growth/patients/${child.patientId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {child.name}
                    </Link>
                    <span className="text-muted-foreground">
                      {" "}
                      · {child.patientId} · DOB{" "}
                      {shortDate(child.dateOfBirth)} · Parent{" "}
                      {child.parentName}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
