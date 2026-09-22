"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEPS = [
  { label: "Identity" },
  { label: "Contact" },
  { label: "Academic" },
  { label: "Roles" },
  { label: "Availability" },
  { label: "Consent" },
  { label: "Review" },
] as const;

interface MembershipStepperProps {
  currentStep: number; // 1-based
  onStepClick?: (step: number) => void;
  className?: string;
}

/**
 * Vertical progress rail for the lg sidebar. Below lg the wizard shows a
 * progress bar instead, so this component only ever renders vertically.
 */
export function MembershipStepper({
  currentStep,
  onStepClick,
  className,
}: MembershipStepperProps) {
  const totalSteps = STEPS.length;

  return (
    <ol
      // Roomy padding so the active indicator's focus ring never clips
      // against the rail edges. h-full + flex-1 rows stretch the rail to
      // match the form column's height.
      className={cn("flex w-full flex-col px-2 py-2 lg:h-full", className)}
      aria-label="Application steps"
    >
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const clickable = isComplete && !!onStepClick;

        return (
          <li key={step.label} className="flex gap-3 lg:min-h-0 lg:flex-1">
            {/* Dot rail with vertical connector */}
            <div className="flex flex-col items-center">
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(stepNumber)}
                  aria-label={`Go back to the ${step.label} step`}
                  title={`Go back to ${step.label}`}
                  className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/40 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Check className="size-4" aria-hidden />
                </button>
              ) : (
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCurrent &&
                      "border-primary bg-primary/10 text-primary ring-primary/15 ring-4",
                    !isComplete &&
                      !isCurrent &&
                      "border-border bg-card text-muted-foreground",
                  )}
                >
                  {isComplete ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    stepNumber
                  )}
                </div>
              )}
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "min-h-6 w-0.5 flex-1 rounded-full",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </div>
            <div className="flex flex-col gap-0.5 pt-1 last:pb-0">
              <span
                className={cn(
                  "mt-1 text-sm leading-tight",
                  isCurrent
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
