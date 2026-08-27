"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/site-nav";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/growth", label: "Growth Tracker" },
  { href: "/growth/register", label: "Register" },
  { href: "/growth/search", label: "Search" },
  { href: "/my-child", label: "My Child" },
  { href: "/growth/login", label: "Sign in" },
];

export default function GrowthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

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

          <div className="flex items-center gap-1">
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
          </nav>
        ) : null}
      </header>
      <div className="container-page py-8">{children}</div>
    </div>
  );
}
