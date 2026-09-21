"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Personal" },
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

export function MembershipStepper({
  currentStep,
  onStepClick,
  className,
}: MembershipStepperProps) {
  const totalSteps = STEPS.length;

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      aria-label="Application steps"
    >
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
              <div className="flex flex-col items-center gap-1.5">
                {indicator}
                <span
                  className={cn(
                    "text-caption hidden sm:block",
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
