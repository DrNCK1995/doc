"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type AuthMe =
  | { authenticated: false }
  | {
      authenticated: true;
      role: "staff" | "admin";
      kind?: "staff" | "owner";
      canChangePassword?: boolean;
    }
  | { authenticated: true; role: "parent"; mobile: string; userId?: string };

type AccessGateProps = {
  children: React.ReactNode;
  title?: string;
};

export function AccessGate({
  children,
  title = "Sign in to view growth records",
}: AccessGateProps) {
  const [auth, setAuth] = React.useState<AuthMe | null>(null);
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [login, setLogin] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = (await res.json()) as AuthMe;
    setAuth(data);
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/auth/parent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");
      await refresh();
      toast({
        title: "Signed in",
        description: "You can view your child’s records.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Sign-in failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
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
      await refresh();
      toast({
        title: "Account created",
        description: data.userId
          ? `Your user ID is ${data.userId}. Use it or your mobile to sign in.`
          : "You can now open growth records.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  if (auth === null) {
    return <p className="text-sm text-muted-foreground">Checking access…</p>;
  }

  if (auth.authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-md space-y-6 border-y border-border py-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Parent access
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with your user ID or mobile number and password. Create an
          account once, then use the same login for growth records and the child
          health dashboard.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "login" ? "default" : "outline"}
          onClick={() => setMode("login")}
        >
          Sign in
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "register" ? "default" : "outline"}
          onClick={() => setMode("register")}
        >
          Create account
        </Button>
      </div>

      {mode === "login" ? (
        <form onSubmit={onLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parent-login">User ID or mobile</Label>
            <Input
              id="parent-login"
              autoComplete="username"
              placeholder="user ID or 10-digit mobile"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent-password">Password</Label>
            <Input
              id="parent-password"
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
      ) : (
        <form onSubmit={onRegister} className="space-y-4">
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
            <Label htmlFor="reg-userid">User ID (optional)</Label>
            <Input
              id="reg-userid"
              autoComplete="username"
              placeholder="Defaults to your mobile"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password (any)</Label>
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
            {busy ? "Creating…" : "Create account & continue"}
          </Button>
        </form>
      )}

      <p className="text-sm text-muted-foreground">
        Clinic staff / admin:{" "}
        <Link
          href="/growth/login"
          className="font-medium text-primary hover:underline"
        >
          password login
        </Link>{" "}
        for full search and follow-up visits.
      </p>
    </div>
  );
}

export function useGrowthAuth() {
  const [auth, setAuth] = React.useState<AuthMe | null>(null);

  const refresh = React.useCallback(async () => {
    const res = await fetch("/api/auth/me");
    setAuth((await res.json()) as AuthMe);
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  async function logout() {
    const role = auth && auth.authenticated ? auth.role : null;
    if (role === "staff" || role === "admin") {
      await fetch("/api/auth/admin", { method: "DELETE" });
    } else {
      await fetch("/api/auth/parent", { method: "DELETE" });
    }
    await refresh();
  }

  return { auth, refresh, logout };
}
