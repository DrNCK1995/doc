import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchPanel } from "@/components/growth/search-panel";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Find patient</h1>
        <p className="mt-2 text-muted-foreground">
          Search by patient ID, name, mobile number, or date of birth.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Search</CardTitle>
          <CardDescription>
            Combine fields for a narrower match, or use quick search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchPanel />
        </CardContent>
      </Card>
    </div>
  );
}
