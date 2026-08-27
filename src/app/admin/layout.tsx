import Link from "next/link";
import { BRAND_NAME } from "@/lib/site-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/80 bg-background/90">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-primary"
          >
            {BRAND_NAME}
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/admin/parents"
              className="text-muted-foreground hover:text-foreground"
            >
              Parent list
            </Link>
            <Link
              href="/growth"
              className="text-muted-foreground hover:text-foreground"
            >
              Growth
            </Link>
          </nav>
        </div>
      </header>
      <main className="px-4">{children}</main>
    </div>
  );
}
