import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccessGate } from "@/components/growth/access-gate";
import { RegisterForm } from "@/components/growth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Register child</h1>
        <p className="mt-2 text-muted-foreground">
          Verify your mobile with OTP first. The child is saved under that
          number so only you (or clinic staff) can open the record later.
        </p>
      </div>
      <AccessGate title="Verify mobile before registration">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Registration form</CardTitle>
            <CardDescription>
              Required: name, DOB, sex, weight, height, parent name. Mobile is
              locked to your verified number when using parent OTP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </AccessGate>
    </div>
  );
}
