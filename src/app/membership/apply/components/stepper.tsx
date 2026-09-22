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
  /** Horizontal dots for narrow screens, vertical rail for the lg sidebar. */
  orientation?: "horizontal" | "vertical";
}

export function MembershipStepper({
  currentStep,
  onStepClick,
  className,
  orientation = "horizontal",
}: MembershipStepperProps) {
  const totalSteps = STEPS.length;

  if (orientation === "vertical") {
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

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      aria-label="Application steps"
    >
      {/* Mobile position scent — the dots alone say nothing about trip
          length; labels stay visible from sm up. */}
      <p className="text-caption text-muted-foreground sm:hidden" aria-hidden>
        Step {currentStep} of {totalSteps} — {STEPS[currentStep - 1]?.label}
      </p>
      <ol className="flex w-full items-start">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const clickable = isComplete && !!onStepClick;

          const indicator = clickable ? (
            <button
              type="button"
              onClick={() => onStepClick(stepNumber)}
              aria-label={`Go back to the ${step.label} step`}
              title={`Go back to ${step.label}`}
              className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/40 flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <Check className="size-4" aria-hidden />
            </button>
          ) : (
            <div
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
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
          );

          return (
            <li
              key={step.label}
              className="flex flex-1 items-start last:flex-none"
            >
              {/* Fixed-width cell from sm up (labels visible): every
                  indicator+label unit occupies the same width, so the
                  flex-1 connectors between them are mathematically even
                  instead of varying with label length. Dots-only on
                  mobile stay fluid. */}
              <div className="flex w-full flex-col items-center gap-1.5 sm:w-16 sm:shrink-0">
                {indicator}
                <span
                  className={cn(
                    "text-caption hidden text-center leading-tight sm:block",
                    isCurrent
                      ? "text-foreground font-semibold"
                      : clickable
                        ? "text-muted-foreground group-hover:text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "mt-4 h-0.5 flex-1 rounded-full",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
