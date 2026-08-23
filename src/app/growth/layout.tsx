"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Menu, X } from "lucide-react";
import { useGrowthAuth } from "@/components/growth/access-gate";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/growth", label: "Home" },
  { href: "/growth/register", label: "Register" },
  { href: "/growth/search", label: "Search" },
  { href: "/vaccination", label: "Vaccination" },
  { href: "/screening", label: "Development" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/dosage", label: "Common drugs" },
  { href: "/learn", label: "Learn" },
];

export default function GrowthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const isLogin = pathname === "/growth/login";
  const { auth, logout } = useGrowthAuth();

  async function onLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.refresh();
      if (pathname.startsWith("/growth/patients")) {
        router.replace("/growth");
      }
    } finally {
      setLoggingOut(false);
    }
  }

  const signedIn = Boolean(auth && auth.authenticated);
  let roleLabel: string | null = null;
  if (auth?.authenticated) {
    if (auth.role === "admin") roleLabel = "Admin";
    else if (auth.role === "staff") roleLabel = "Staff";
    else if (auth.role === "parent") {
      roleLabel = `Parent · ${auth.userId ?? auth.mobile}`;
    }
  }

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="container-page flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/growth"
              className="font-display text-lg font-semibold text-primary"
            >
              Growth Monitor
            </Link>
            {!isLogin ? (
              <nav className="hidden items-center gap-1 lg:flex" aria-label="Growth">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>

          <div className="flex items-center gap-1">
            {!isLogin && roleLabel ? (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {roleLabel}
              </span>
            ) : null}
            {!isLogin && signedIn ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => void onLogout()}
                disabled={loggingOut}
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Signing out…" : "Sign out"}
              </Button>
            ) : null}
            {!isLogin && !signedIn ? (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/growth/login">Staff login</Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Portfolio
              </Link>
            </Button>
            <ThemeToggle />
            {!isLogin ? (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            ) : null}
          </div>
        </div>

        {open && !isLogin ? (
          <nav className="border-t border-border px-4 py-3 lg:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {signedIn ? (
              <button
                type="button"
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-secondary"
                onClick={() => {
                  setOpen(false);
                  void onLogout();
                }}
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/growth/login"
                className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                Staff login
              </Link>
            )}
            <Link
              href="/"
              className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
              onClick={() => setOpen(false)}
            >
              Back to portfolio
            </Link>
          </nav>
        ) : null}
      </header>
      <div className="container-page py-8">{children}</div>
    </div>
  );
}
