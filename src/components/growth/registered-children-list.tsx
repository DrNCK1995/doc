"use client";

import * as React from "react";
import Link from "next/link";
import { LineChart, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPatientId } from "@/lib/utils/format";

type ChildRow = {
  patientId: string;
  name: string;
  dateOfBirth: string;
  sex: string;
  parentName: string;
  mobileNumber: string;
  visitCount?: number;
  latestVisit?: { visitDate: string } | null;
};

export function RegisteredChildrenList() {
  const [children, setChildren] = React.useState<ChildRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/patients");
        const data = (await res.json()) as {
          error?: string;
          patients?: ChildRow[];
        };
        if (!res.ok) throw new Error(data.error || "Could not load children");
        if (!cancelled) setChildren(data.patients ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
          setChildren([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading children…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }

  if (children.length === 0) {
    return (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>No registered children yet for this account.</p>
        <Button asChild size="sm">
          <Link href="/growth/register">Register a child</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {children.map((child) => {
        const base = `/growth/patients/${encodeURIComponent(child.patientId)}`;
        return (
          <li
            key={child.patientId}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground">{child.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatPatientId(child.patientId)} · DOB{" "}
                {new Date(child.dateOfBirth).toLocaleDateString("en-IN")} ·{" "}
                {child.sex === "MALE" ? "Boy" : "Girl"}
                {child.latestVisit
                  ? ` · Last visit ${new Date(child.latestVisit.visitDate).toLocaleDateString("en-IN")}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={base}>
                  <LineChart className="h-4 w-4" />
                  View
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`${base}?tab=enter`}>
                  <Ruler className="h-4 w-4" />
                  Enter growth
                </Link>
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
