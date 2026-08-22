import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccessGate } from "@/components/growth/access-gate";
import { SearchPanel } from "@/components/growth/search-panel";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Find patient</h1>
        <p className="mt-2 text-muted-foreground">
          Parents: verify mobile with OTP to see only your children. Staff: use
          password login for full clinic search.
        </p>
      </div>
      <AccessGate title="Verify mobile to search records">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Search</CardTitle>
            <CardDescription>
              After OTP, results are limited to children registered on your
              mobile. Staff can search the full clinic list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchPanel />
          </CardContent>
        </Card>
      </AccessGate>
    </div>
  );
}
