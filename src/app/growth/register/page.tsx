import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/growth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Register child</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the child&apos;s details and first measurements to create a Grow
          Right record. If you already use My Child, name, DOB, and gender are
          prefilled and kept in sync after registration.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Registration form</CardTitle>
          <CardDescription>
            Required: name, DOB, sex, weight, height, parent name, and mobile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading form…</p>}>
            <RegisterForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
