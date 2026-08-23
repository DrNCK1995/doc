import Link from "next/link";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { ToolTile } from "@/components/home/tool-tile";
import { Button } from "@/components/ui/button";
import { SMART_TOOLS, NEED_TODAY } from "@/lib/site-nav";

const EXTRA = [
  {
    id: "food",
    emoji: "🍎",
    title: "Food for Growth",
    description: "Age-wise feeding and illness diet tips.",
    href: "/nutrition",
  },
  {
    id: "health-record",
    emoji: "📋",
    title: "My Child's Health",
    description: "Request a combined child health report.",
    href: "/dashboard",
  },
];

export default function ToolsPage() {
  const tools = [...SMART_TOOLS, ...EXTRA, NEED_TODAY.find((t) => t.id === "worry")!];
  const seen = new Set<string>();
  const unique = tools.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  return (
    <>
      <SiteHeader />
      <main className="pt-16">
        <section className="section-pad">
          <div className="container-page">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Parent Tools
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground sm:text-lg">
              Smart tools for smart parents — growth, vaccines, doses, milestones,
              and more.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unique.map((tool) => (
                <ToolTile key={tool.id} tool={tool} />
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/my-child">Set up My Child</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
