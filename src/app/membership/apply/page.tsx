import { MembershipWizardSection } from "./components/membership-wizard-section";
import { BlobsAnimatedBackground } from "@/components/ui/blobs";
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
    <main className="from-background via-background to-muted/30 relative min-h-svh bg-linear-to-b lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
      {/* Background decorations — same language as the quiz page: masked
          brand emblems plus two restrained blobs. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="bg-primary absolute top-0 left-0 hidden aspect-364/527 w-[min(300px,100%)] mask-left opacity-10 md:block" />
        <div className="bg-secondary absolute right-0 bottom-0 aspect-320/528 w-[min(280px,100%)] mask-right opacity-10" />
      </div>
      <BlobsAnimatedBackground
        blobs={[
          {
            id: "apply-blob-primary",
            top: "-6rem",
            left: "-6rem",
            colorClass: "bg-primary/30",
            sizeClass: "h-[22rem] w-[22rem]",
            blurClass: "blur-[70px]",
            animateX: [0, 16, 0],
            animateY: [0, 24, 0],
            duration: 8,
          },
          {
            id: "apply-blob-secondary",
            bottom: "-6rem",
            right: "-6rem",
            colorClass: "bg-secondary/30",
            sizeClass: "h-[22rem] w-[22rem]",
            blurClass: "blur-[70px]",
            animateX: [0, -20, 0],
            animateY: [0, -30, 0],
            duration: 10,
          },
        ]}
        className="absolute inset-0 z-0! h-full w-full opacity-100"
        gridPatternOpacity="opacity-0"
        gridPatternDarkOpacity="opacity-0"
      />

      {/* Below lg the page scrolls naturally; on lg the section below owns
          the fixed height and the form pane scrolls within it. */}
      <div className="relative z-10 flex w-full lg:min-h-0 lg:flex-1 lg:flex-col">
        <MembershipWizardSection />
      </div>
    </main>
  );
}
