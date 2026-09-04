"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils/cn";

/** Clears both parent and admin session cookies. */
export async function signOutAccount(): Promise<void> {
  await Promise.all([
    fetch("/api/auth/parent", { method: "DELETE" }),
    fetch("/api/auth/admin", { method: "DELETE" }),
  ]);
}

type SignOutButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  /** Where to send the user after logout. Default: login page. */
  redirectTo?: string;
  label?: string;
};

export function SignOutButton({
  className,
  variant = "outline",
  size = "sm",
  redirectTo = "/growth/login",
  label = "Sign out",
}: SignOutButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      await signOutAccount();
      toast({
        title: "Signed out",
        description: "Your account has been logged out.",
      });
      router.replace(redirectTo);
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "Please try again.",
      });
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      disabled={busy}
      onClick={() => void onClick()}
    >
      {busy ? "Signing out…" : label}
    </Button>
  );
}
