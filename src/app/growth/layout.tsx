"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/site-nav";
import { cn } from "@/lib/utils/cn";

const baseLinks = [
  { href: "/growth", label: "Growth Tracker" },
  { href: "/growth/register", label: "Register" },
  { href: "/growth/search", label: "Search" },
  { href: "/my-child", label: "My Child" },
];

type AuthMe =
  | { authenticated: false }
  | { authenticated: true; role: string; userId?: string; mobile?: string };

export default function GrowthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [auth, setAuth] = React.useState<AuthMe | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = (await res.json()) as AuthMe;
        if (!cancelled) setAuth(data);
      } catch {
        if (!cancelled) setAuth({ authenticated: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const signedIn = Boolean(auth?.authenticated);
  const isLoginPage = pathname.startsWith("/growth/login");

  const links = signedIn
    ? [
        ...baseLinks,
        ...(auth && "role" in auth && auth.role === "admin"
          ? [{ href: "/admin/parents", label: "Admin parents" }]
          : []),
      ]
    : [...baseLinks, { href: "/growth/login", label: "Sign in" }];

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="container-page flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 font-display text-lg font-semibold text-primary"
            >
              {BRAND_NAME}
            </Link>
            <span className="hidden text-muted-foreground sm:inline">/</span>
            <Link
              href="/growth"
              className="truncate text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Grow Right
            </Link>
            <nav
              className="ml-2 hidden items-center gap-1 xl:flex"
              aria-label="Growth"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {signedIn && !isLoginPage ? (
              <div className="hidden items-center gap-2 sm:flex">
                {auth && "userId" in auth && auth.userId ? (
                  <span className="max-w-[10rem] truncate text-xs text-muted-foreground">
                    {auth.userId}
                  </span>
                ) : auth && "role" in auth && auth.role === "admin" ? (
                  <span className="text-xs text-muted-foreground">Admin</span>
                ) : null}
                <SignOutButton />
              </div>
            ) : null}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-border px-4 py-3 xl:hidden">
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
            {signedIn && !isLoginPage ? (
              <div className="mt-2 px-3">
                <SignOutButton className="w-full" />
              </div>
            ) : null}
          </nav>
        ) : null}
      </header>
      <div className="container-page py-8">{children}</div>
    </div>
  );
}
