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
          Capture demographics and baseline anthropometry. Age updates live from
          date of birth. On success you will open the patient dashboard.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Registration form</CardTitle>
          <CardDescription>
            Required: name, DOB, sex, weight, height, mobile, parent name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
