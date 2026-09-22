"use client";

import { useRouter } from "next/navigation";
import { MembershipWizard } from "./membership-wizard";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { MembershipCampaign } from "@/lib/notion/membership-campaigns";

type Campaign = Pick<
  MembershipCampaign,
  "id" | "academicYear" | "status"
> | null;

function ApplyHeading({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-2 text-left">
      <h1 className="text-secondary-dark dark:text-secondary text-2xl font-bold md:text-3xl">
        Membership Application
      </h1>
      <p className="text-muted-foreground max-w-xl text-sm">{subtitle}</p>
    </div>
  );
}

export function MembershipWizardSection({
  campaign,
  loadError,
}: {
  campaign: Campaign;
  loadError: boolean;
}) {
  const router = useRouter();

  if (loadError) {
    return (
      <section
        id="apply"
        className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:px-12 xl:px-16 portrait:pt-[4svh] md:portrait:pt-[5svh]"
      >
        <ApplyHeading subtitle="We couldn't reach our records just now." />
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 p-8 text-center">
          <AlertTriangle className="text-destructive size-6" aria-hidden />
          <p className="text-muted-foreground text-sm">
            We couldn&apos;t check whether applications are open right now.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.refresh()}
          >
            Try again
          </Button>
        </div>
      </section>
    );
  }

  return (
    // Whole-page portrait nudge (header included), mirroring the quiz eye
    // level. Padding, not margin: this section is a flex-1 item in the
    // fixed shell, so margin would push the anchored nav out the bottom.
    // Landscape untouched.
    <section
      id="apply"
      className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-5 overflow-hidden px-4 py-6 sm:px-6 md:gap-6 md:px-8 md:py-10 lg:gap-8 lg:px-12 lg:py-8 xl:px-16 portrait:pt-[4svh] md:portrait:pt-[5svh]"
    >
      {/* Title + nav render inside the wizard (single nav instance);
          success and closed states bring their own headings. */}
      <MembershipWizard activeCampaign={campaign} />
    </section>
  );
}
