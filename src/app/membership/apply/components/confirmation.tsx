"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants/site";

export function MembershipConfirmation({
  academicYear,
  email,
  onReset,
}: {
  academicYear?: string;
  email?: string;
  onReset: () => void;
}) {
  return (
    // Margin-auto centers on lg without the overflow-clipping that
    // items-center/justify-center cause on short viewports; top-nudged
    // toward eye level on portrait.
    <div className="m-auto flex flex-col items-center gap-6 py-8 text-center portrait:pt-[3svh]">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        <CheckCircle className="text-primary h-8 w-8" />
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
        <Button variant="default" asChild>
          <Link href="/membership">Back to membership</Link>
        </Button>
        <Button variant="outline" onClick={onReset}>
          Submit another application
        </Button>
      </div>
    </div>
  );
}
