import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { BRAND_NAME } from "@/lib/site-nav";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page section-pad pt-24">
        <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {BRAND_NAME} respects your privacy. Child health tools may store details
          you enter on this device (for example My Child) or in the clinic database
          when you register a growth record. We do not sell personal data. Contact
          the clinic for access or deletion requests related to clinical records.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
