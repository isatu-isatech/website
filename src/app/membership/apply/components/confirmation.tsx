"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { IdleCountdown } from "@/components/common";
import { useKiosk } from "@/components/kiosk";
import { SOCIAL_LINKS } from "@/lib/constants/site";

export function MembershipConfirmation({
  academicYear,
  email,
  secondsLeft = null,
  onReset,
}: {
  academicYear?: string;
  email?: string;
  /** Idle-reset countdown — rendered snug above the icon when present. */
  secondsLeft?: number | null;
  onReset: () => void;
}) {
  // Kiosk display hides the outbound back link so visitors can't wander
  // off the application on shared devices; reset stays available.
  const { isKioskEnforced } = useKiosk();
  return (
    // Margin-auto centers on lg without the overflow-clipping that
    // items-center/justify-center cause on short viewports; top-nudged
    // toward eye level on portrait. Base rhythm mirrors the quiz result
    // screen (py-3 / md:py-4); portrait top padding adds the quiz shell's
    // 2rem base (3rem at md) on top of the section's svh nudge.
    <div className="m-auto flex flex-col items-center gap-6 py-3 text-center md:py-4 portrait:mt-0 portrait:mb-auto portrait:pt-[2.75rem] md:portrait:pt-[4rem]">
      <div className="flex flex-col items-center">
        {secondsLeft !== null && <IdleCountdown secondsLeft={secondsLeft} />}
        <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle className="text-primary h-8 w-8" />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        <h3 className="text-xl font-semibold">Application Submitted!</h3>
        {academicYear && (
          <p className="text-muted-foreground text-sm">
            Your application has been recorded under{" "}
            <span className="font-medium">{academicYear}</span>.
          </p>
        )}
        <p className="text-muted-foreground text-sm">
          Thank you for applying to ISATech Society. Our team will review your
          submission
          {email ? (
            <>
              {" "}
              and reach out to <span className="font-medium">{email}</span>
            </>
          ) : (
            " and reach out via the contact details you provided"
          )}
          . For updates, you can reach us at{" "}
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-primary underline"
          >
            {SOCIAL_LINKS.email}
          </a>
          .
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center">
        {!isKioskEnforced && (
          <Button variant="default" asChild>
            <Link href="/membership">Back to membership</Link>
          </Button>
        )}
        <Button variant="outline" onClick={onReset}>
          Submit another application
        </Button>
      </div>
    </div>
  );
}
