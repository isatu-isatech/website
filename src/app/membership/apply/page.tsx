import { MembershipWizardSection } from "./components/membership-wizard-section";
import { SITE_CONFIG } from "@/lib/constants/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Membership",
  description:
    "Complete your ISATech Society membership application. All fields are validated and submissions are linked to the active academic-year campaign.",
  openGraph: {
    title: "Apply for Membership — ISATech Society",
    description:
      "Complete your ISATech Society membership application and join a vibrant community of student innovators and technopreneurs.",
    url: `${SITE_CONFIG.url}/membership/apply`,
    siteName: "ISATech Society",
    type: "website",
  },
};

export default function MembershipApplyPage() {
  // Deliberately no server-side Notion fetch: the page renders instantly and
  // the wizard section hydrates campaign status on the client with an
  // indicator, so Notion latency/outages never block page load.
  return (
    <main className="from-background via-background to-muted/30 relative min-h-svh bg-linear-to-b">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-secondary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      {/* Page scrolls naturally; the form is not constrained to the viewport */}
      <div className="relative flex w-full">
        <MembershipWizardSection />
      </div>
    </main>
  );
}
