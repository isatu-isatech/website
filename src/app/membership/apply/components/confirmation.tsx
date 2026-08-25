"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants/site";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function MembershipConfirmation({
  academicYear,
  redirectDelayMs = 4000,
  onReset,
}: {
  academicYear?: string;
  redirectDelayMs?: number;
  onReset: () => void;
}) {
  const reduceMotion = useReducedMotion();
  // Countdown mirrors the wizard's redirect timer, which fires at
  // `redirectDelayMs`, so both are based on the same duration.
  const totalSeconds = Math.max(1, Math.ceil(redirectDelayMs / 1000));
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        <CheckCircle className="text-primary h-8 w-8" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Application Submitted!</h3>
        {academicYear && (
          <p className="text-muted-foreground text-sm">
            Your application has been recorded under{" "}
            <span className="font-medium">{academicYear}</span>.
          </p>
        )}
        <p className="text-muted-foreground text-sm">
          Thank you for applying to ISATech Society. Our team will review your
          submission and reach out via the contact details you provided. For
          updates, you can reach us at{" "}
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-primary underline"
          >
            {SOCIAL_LINKS.email}
          </a>
          .
        </p>
      </div>

      {/* Auto-redirect duration indicator — matches the wizard's timer. */}
      <div className="flex w-full max-w-xs flex-col gap-2">
        <div className="bg-border h-1.5 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: reduceMotion ? 0 : redirectDelayMs / 1000,
              ease: "linear",
            }}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Redirecting to the membership page in{" "}
          <span className="text-foreground font-medium">{secondsLeft}s</span>…
        </p>
      </div>

      <Button variant="outline" onClick={onReset}>
        Submit another application
      </Button>
    </div>
  );
}
