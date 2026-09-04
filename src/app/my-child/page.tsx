"use client";

import * as React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAgeLabel, guidanceForDob } from "@/lib/my-child/guidance";
import {
  clearMyChildProfile,
  readMyChildProfile,
  registerHrefFromProfile,
  writeMyChildProfile,
  type MyChildProfile,
} from "@/lib/my-child/profile";

export default function MyChildPage() {
  const [child, setChild] = React.useState<MyChildProfile | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState<MyChildProfile>({
    name: "",
    dateOfBirth: "",
    sex: "MALE",
  });
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const saved = readMyChildProfile();
    if (saved) {
      setChild(saved);
      setForm(saved);
    }
    setReady(true);
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.dateOfBirth) return;
    const next: MyChildProfile = {
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth,
      sex: form.sex,
      patientId: child?.patientId,
    };
    writeMyChildProfile(next);
    setChild(next);
    setEditing(false);
  }

  function clearChild() {
    clearMyChildProfile();
    setChild(null);
    setForm({ name: "", dateOfBirth: "", sex: "MALE" });
    setEditing(false);
  }

  const guidance = child ? guidanceForDob(child.dateOfBirth) : null;

  return (
    <>
      <SiteHeader />
      <main className="pt-16">
        <section className="section-pad">
          <div className="container-page max-w-3xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                My Child
              </h1>
              <SignOutButton />
            </div>
            <p className="mt-3 text-muted-foreground sm:text-lg">
              Age-based guidance for vaccines, growth, feeding, and when to seek
              care — linked to Grow Right registration when you&apos;re ready.
            </p>

            {!ready ? (
              <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
            ) : !child || editing ? (
              <form
                onSubmit={save}
                className="mt-10 space-y-5 rounded-3xl border border-border/80 bg-card p-6 sm:p-8"
              >
                <p className="text-sm text-muted-foreground">
                  Saved on this device only. To plot growth charts, register the
                  same child in Grow Right after saving.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="child-name">Child name</Label>
                  <Input
                    id="child-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Aarav"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-dob">Date of birth</Label>
                  <Input
                    id="child-dob"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                    }
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-sex">Gender</Label>
                  <select
                    id="child-sex"
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    value={form.sex}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sex: e.target.value as "MALE" | "FEMALE",
                      }))
                    }
                  >
                    <option value="MALE">Boy</option>
                    <option value="FEMALE">Girl</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" size="lg" className="rounded-full">
                    {child ? "Save changes" : "Save & show guidance"}
                  </Button>
                  {editing && child ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => {
                        setForm(child);
                        setEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </form>
            ) : (
              <div className="mt-10 space-y-10">
                <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 to-accent/10 p-6 sm:p-8">
                  <p className="font-display text-3xl font-semibold text-primary">
                    {child.name} — {formatAgeLabel(child.dateOfBirth)}
                  </p>
                  {guidance ? (
                    <>
                      <p className="mt-2 text-sm font-medium text-foreground/80">
                        {guidance.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {guidance.focus}
                      </p>
                    </>
                  ) : null}
                  {child.patientId ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Linked Grow Right ID:{" "}
                      <Link
                        href={`/growth/patients/${encodeURIComponent(child.patientId)}`}
                        className="font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {child.patientId}
                      </Link>
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Not registered in Grow Right yet — guidance below still
                      works from age alone.
                    </p>
                  )}
                </div>

                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    For this age
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Short notes you can act on today — each opens the right tool
                    when you want more detail.
                  </p>
                  <ul className="mt-5 space-y-4">
                    {guidance?.items.map((item) => (
                      <li
                        key={item.title}
                        className="rounded-2xl border border-border/80 bg-card p-5"
                      >
                        <div className="flex gap-4">
                          <span className="text-3xl shrink-0" aria-hidden>
                            {item.emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">{item.title}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {item.body}
                            </p>
                            <Button
                              asChild
                              variant="link"
                              className="mt-2 h-auto px-0 text-primary"
                            >
                              <Link href={item.href}>{item.cta} →</Link>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6">
                  <h2 className="font-display text-xl font-semibold">
                    Grow Right registration
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {child.patientId
                      ? "This child is already linked. Open the growth record to add visits and charts."
                      : "Register once with the same name, DOB, and gender to plot WHO/IAP charts and keep a clinic-ready growth record. Fields from My Child will be prefilled."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {child.patientId ? (
                      <Button asChild className="rounded-full">
                        <Link
                          href={`/growth/patients/${encodeURIComponent(child.patientId)}`}
                        >
                          Open growth record
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="rounded-full">
                        <Link href={registerHrefFromProfile(child)}>
                          Register child in Grow Right
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/vaccination">Free Vaccine reminder</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/dashboard">My Child&apos;s Health report</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => setEditing(true)}
                  >
                    Edit child details
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-muted-foreground"
                    onClick={clearChild}
                  >
                    Clear on this device
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
