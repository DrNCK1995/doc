"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BRAND_NAME, PRIMARY_NAV } from "@/lib/site-nav";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-[background,border-color] duration-300",
        scrolled
          ? "border-border/70 bg-background/92 backdrop-blur-md"
          : "border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="min-w-0">
          <span className="block truncate font-display text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            {BRAND_NAME}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {PRIMARY_NAV.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  "emphasize" in link && link.emphasize && !active
                    ? "text-primary"
                    : null,
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 rounded-full px-4">
            <Link href="/consult">Consult Doctor</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background/95 lg:hidden">
          <nav
            className="container-page flex flex-col gap-1 py-3"
            aria-label="Mobile"
          >
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2 h-12 rounded-xl text-base">
              <Link href="/consult" onClick={() => setOpen(false)}>
                Consult Doctor
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
