"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type Tab = "parent-login" | "parent-register" | "admin";

function safeNext(raw: string | null): string {
  if (!raw) return "/growth";
  if (raw.startsWith("/my-child") || raw.startsWith("/growth") || raw.startsWith("/admin")) {
    return raw;
  }
  return "/growth";
}

export function PersonalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [tab, setTab] = React.useState<Tab>("parent-login");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [adminId, setAdminId] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");

  React.useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me");
      const data = (await res.json()) as {
        authenticated?: boolean;
        role?: string;
      };
      if (!data.authenticated) return;
      if (data.role === "admin") {
        router.replace(next.startsWith("/admin") ? next : "/admin/parents");
      } else {
        router.replace(next);
      }
      router.refresh();
    })();
  }, [next, router]);

  async function onParentLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/parent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast({ title: "Signed in", description: "Opening your records…" });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function onParentRegister(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          password,
          userId: userId.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; userId?: string };
      if (!res.ok) throw new Error(data.error || "Could not create account");
      toast({
        title: "Account created",
        description: data.userId
          ? `Your login ID is ${data.userId}. Use it or your mobile to sign in.`
          : "You can now open My Child and growth records.",
      });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  async function onAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: adminId,
          password: adminPassword,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Admin login failed");
      toast({ title: "Admin signed in" });
      router.replace(next.startsWith("/admin") ? next : "/admin/parents");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Private access
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Sign in for personal details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          My Child and Grow Right need a login. Vaccine Buddy, nutrition,
          screening, learn, and consult stay open without signing in.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["parent-login", "Parent sign in"],
            ["parent-register", "Create account"],
            ["admin", "Admin"],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={tab === id ? "default" : "outline"}
            onClick={() => {
              setTab(id);
              setError(null);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {tab === "parent-login" ? (
        <form onSubmit={onParentLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login">Login ID or mobile</Label>
            <Input
              id="login"
              autoComplete="username"
              placeholder="Your login ID or 10-digit mobile"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>
          <Button type="submit" disabled={busy || !login.trim() || !password}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      ) : null}

      {tab === "parent-register" ? (
        <form onSubmit={onParentRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-mobile">Mobile number</Label>
            <Input
              id="reg-mobile"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit mobile"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              required
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-userid">Login ID (optional)</Label>
            <Input
              id="reg-userid"
              autoComplete="username"
              placeholder="Leave blank to use your mobile as login ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={busy}
            />
            <p className="text-xs text-muted-foreground">
              Choose any unique ID you like (no spaces), or skip and sign in with
              mobile.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password (any you choose)</Label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>
          <Button
            type="submit"
            disabled={busy || mobile.length < 10 || !password}
          >
            {busy ? "Creating…" : "Create account"}
          </Button>
        </form>
      ) : null}

      {tab === "admin" ? (
        <form onSubmit={onAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-id">Admin login ID</Label>
            <Input
              id="admin-id"
              autoComplete="username"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>
          <Button
            type="submit"
            disabled={busy || !adminId.trim() || !adminPassword}
          >
            {busy ? "Signing in…" : "Admin sign in"}
          </Button>
          <p className="text-xs text-muted-foreground">
            After signing in you can open the full parent list and all growth
            records.
          </p>
        </form>
      ) : null}

      <p className="text-sm text-muted-foreground">
        <Link href="/" className="font-medium text-primary hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
