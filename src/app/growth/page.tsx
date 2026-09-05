import Link from "next/link";
import {
  FileDown,
  LineChart,
  Search,
  UserPlus,
  CalendarClock,
} from "lucide-react";
import { RegisteredChildrenList } from "@/components/growth/registered-children-list";
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
          Grow Right
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Track your child&apos;s growth
        </h1>
        <p className="mt-3 text-muted-foreground">
          Open a registered child to view charts, or enter new growth
          measurements — fill only what you measured.
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
          <CardTitle className="text-xl">Your registered children</CardTitle>
          <CardDescription>
            View growth records or enter new measurements. Search is still
            available above if you need another ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisteredChildrenList />
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
            title: "Partial measures OK",
            body: "Enter weight, height, or head circumference — we interpret whatever you fill.",
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
