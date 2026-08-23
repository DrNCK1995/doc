import Link from "next/link";
import {
  FileDown,
  LineChart,
  Search,
  UserPlus,
  CalendarClock,
} from "lucide-react";
import { SearchPanel } from "@/components/growth/search-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GrowthHomePage() {
  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Pediatric growth workspace
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Monitor growth with WHO & IAP charts
        </h1>
        <p className="mt-3 text-muted-foreground">
          Register a child, search records, plot WHO / IAP charts, and export
          clinical reports — open access, no sign-in required.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button asChild size="lg" className="h-14 text-base">
          <Link href="/growth/register">
            <UserPlus className="h-5 w-5" />
            Register Child
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="h-14 text-base">
          <Link href="/growth/search">
            <Search className="h-5 w-5" />
            Find Patient
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick patient search</CardTitle>
          <CardDescription>
            Search by name, mobile, or patient ID and open the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchPanel compact />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: LineChart,
            title: "WHO / IAP charts",
            body: "Automatic reference selection by age with percentile curves and patient points.",
          },
          {
            icon: FileDown,
            title: "PDF & CSV export",
            body: "Download visit history and printable growth summaries from any record.",
          },
          {
            icon: CalendarClock,
            title: "Follow-up ready",
            body: "Track due visits and growth signals, and add clinical follow-up visits.",
          },
        ].map((item) => (
          <div key={item.title} className="space-y-2 border-t border-border pt-4">
            <item.icon className="h-5 w-5 text-accent" aria-hidden />
            <h3 className="font-display text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
