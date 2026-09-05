import Image from "next/image";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { ConsultBookingWizard } from "@/components/consult/booking-wizard";
import {
  CLINIC_NAME,
  DOCTOR_PHOTO_ALT,
  DOCTOR_PHOTO_SRC,
} from "@/lib/constants";
import { DOCTOR_NAME, DOCTOR_TITLE, BRAND_TRUST } from "@/lib/site-nav";
import {
  CONSULT_FEE_FOLLOWER_INR,
  CONSULT_FEE_NON_FOLLOWER_INR,
  CONSULT_PAYMENT_LINK,
} from "@/lib/consult/config";

export const metadata = {
  title: "Consult Doctor — book appointment",
  description:
    "Book a paediatric consult slot, pay via Razorpay, and get confirmation plus reminders.",
};

export default function ConsultPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-16">
        <section className="section-pad">
          <div className="container-page max-w-3xl">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Consult Doctor
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Choose a slot, pay the consult fee (₹{CONSULT_FEE_FOLLOWER_INR}{" "}
              only for my followers, otherwise ₹{CONSULT_FEE_NON_FOLLOWER_INR}),
              and receive confirmation for you and the clinic — with reminders
              before the visit.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Payment:{" "}
              <a
                href={CONSULT_PAYMENT_LINK}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                razorpay.me/@drcareforkids
              </a>
            </p>

            <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-border/80 bg-card p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-2xl sm:mx-0 sm:h-40 sm:w-40">
                <Image
                  src={DOCTOR_PHOTO_SRC}
                  alt={DOCTOR_PHOTO_ALT}
                  fill
                  sizes="160px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="min-w-0 text-center sm:text-left">
                <p className="font-display text-2xl font-semibold text-primary">
                  {DOCTOR_NAME}
                </p>
                <p className="text-muted-foreground">{DOCTOR_TITLE}</p>
                <p className="mt-3 text-sm font-medium">{CLINIC_NAME}</p>
                <p className="mt-2 text-sm text-muted-foreground">{BRAND_TRUST}</p>
              </div>
            </div>

            <ConsultBookingWizard />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
