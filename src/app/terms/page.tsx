import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { BRAND_NAME } from "@/lib/site-nav";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page section-pad pt-24">
        <h1 className="font-display text-3xl font-semibold">Terms</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Tools on {BRAND_NAME} are for education and parent support. They do not
          replace in-person medical advice, diagnosis, or emergency care. Always
          consult a qualified clinician for your child&apos;s individual needs.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
