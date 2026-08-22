"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type ClinicMe =
  | { authenticated: false }
  | {
      authenticated: true;
      role: "admin" | "staff";
      kind?: "owner" | "staff";
      canChangePassword?: boolean;
    };

export function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/growth";

  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [me, setMe] = React.useState<ClinicMe | null>(null);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [changing, setChanging] = React.useState(false);

  const refreshMe = React.useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = (await res.json()) as ClinicMe & {
      role?: string;
      authenticated?: boolean;
    };
    if (
      data.authenticated &&
      (data.role === "staff" || data.role === "admin")
    ) {
      setMe(data as ClinicMe);
    } else {
      setMe({ authenticated: false });
    }
  }, []);

  React.useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        kind?: string;
      };
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      await refreshMe();
      router.replace(next.startsWith("/growth") || next.startsWith("/dashboard") ? next : "/growth");
      router.refresh();
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChanging(true);
    try {
      const res = await fetch("/api/auth/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not change password");
      toast({
        title: "Password updated",
        description: "Use the new staff password next time you sign in.",
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Change failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setChanging(false);
    }
  }

  if (me?.authenticated) {
    const isOwner = me.role === "admin" || me.kind === "owner";
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {isOwner ? "Owner admin" : "Staff access"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Signed in
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {isOwner
              ? "Full clinic access. Owner password cannot be changed in the app."
              : "Full clinic search, charts, exports, and follow-up visits."}
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/growth">Open Growth Monitor</Link>
        </Button>

        {!isOwner && me.canChangePassword !== false ? (
          <form onSubmit={onChangePassword} className="space-y-4 border-t border-border pt-6">
            <h2 className="font-display text-xl font-semibold">
              Change staff password
            </h2>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={changing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={changing}
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              disabled={changing || !currentPassword || !newPassword}
            >
              {changing ? "Updating…" : "Update password"}
            </Button>
          </form>
        ) : null}

        <p className="text-xs text-muted-foreground">
          Parents:{" "}
          <Link href="/growth" className="font-medium text-primary hover:underline">
            user ID / mobile + password
          </Link>{" "}
          on Growth or the child health dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Staff / admin access
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Growth Monitor login
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Full clinic search and follow-up visits. Staff can change their
          password after signing in. Owner admin uses a fixed password that
          cannot be changed here.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="staff-password">Password</Label>
        <Input
          id="staff-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error ? (
        <p className="text-sm text-[var(--status-red)]" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={loading || !password}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Parents:{" "}
        <Link href="/growth" className="font-medium text-primary hover:underline">
          use mobile / user ID + password on Growth
        </Link>
        .
      </p>
    </form>
  );
}
