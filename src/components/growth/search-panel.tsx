"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { calculateAge } from "@/lib/growth/age";
import { formatAge, formatPatientId } from "@/lib/utils/format";
import type { ApiPatient } from "@/types/api";
import { inferSeverityColor, parseApiError } from "@/types/api";
import { StatusBadge } from "@/components/growth/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

type SearchPanelProps = {
  compact?: boolean;
  initialQuery?: string;
};

export function SearchPanel({
  compact = false,
  initialQuery = "",
}: SearchPanelProps) {
  const [q, setQ] = React.useState(initialQuery);
  const [patientId, setPatientId] = React.useState("");
  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [results, setResults] = React.useState<ApiPatient[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (patientId.trim()) params.set("patientId", patientId.trim());
      if (name.trim()) params.set("name", name.trim());
      if (mobile.trim()) params.set("mobile", mobile.trim());
      if (dob) params.set("dob", dob);

      if (![...params.keys()].length) {
        toast({
          variant: "destructive",
          title: "Enter a search term",
          description: "Use patient ID, name, mobile, DOB, or free text.",
        });
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/patients?${params.toString()}`);
      if (!res.ok) throw new Error(await parseApiError(res));
      const data = (await res.json()) as { patients: ApiPatient[] };
      setResults(data.patients ?? []);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Search failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={runSearch} className="space-y-4">
        <div>
          <Label htmlFor="q" className="mb-1.5 block">
            Quick search
          </Label>
          <div className="flex gap-2">
            <Input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Patient ID, name, mobile, or parent"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4" />
              {loading ? "Searching…" : "Search"}
            </Button>
          </div>
        </div>

        {!compact ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="sid" className="mb-1.5 block">
                Patient ID
              </Label>
              <Input
                id="sid"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sname" className="mb-1.5 block">
                Name
              </Label>
              <Input
                id="sname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smobile" className="mb-1.5 block">
                Mobile
              </Label>
              <Input
                id="smobile"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            </div>
            <div>
              <Label htmlFor="sdob" className="mb-1.5 block">
                Date of birth
              </Label>
              <Input
                id="sdob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>
        ) : null}
      </form>

      {searched ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          {results.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                No patients matched. Try another field or register a new child.
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {results.map((p) => {
                const age = calculateAge(p.dateOfBirth);
                const m = p.latestVisit?.measurements?.[0];
                return (
                  <li key={p.patientId}>
                    <Link
                      href={`/growth/patients/${encodeURIComponent(p.patientId)}`}
                      className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/50 hover:bg-secondary/40"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                            {formatPatientId(p.patientId)}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {formatAge(age)} · {p.sex === "MALE" ? "Male" : "Female"} ·{" "}
                            {p.mobileNumber}
                          </p>
                        </div>
                        <StatusBadge
                          label={m?.nutritionalStatus ?? "No visit"}
                          color={
                            m
                              ? inferSeverityColor(
                                  m.nutritionalStatus,
                                  m.clinicalFlags,
                                )
                              : "yellow"
                          }
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
