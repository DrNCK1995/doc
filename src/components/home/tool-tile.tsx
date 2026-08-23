import Link from "next/link";
import type { ToolCard } from "@/lib/site-nav";
import { cn } from "@/lib/utils/cn";

export function ToolTile({
  tool,
  className,
}: {
  tool: ToolCard;
  className?: string;
}) {
  return (
    <Link
      href={tool.href}
      className={cn(
        "group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition duration-300",
        "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="text-3xl leading-none" aria-hidden>
        {tool.emoji}
      </span>
      <div className="mt-4">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {tool.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
      </div>
    </Link>
  );
}
