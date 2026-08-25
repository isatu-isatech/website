"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipFormSchema, type MembershipFormValues } from "../schema";
import { submitMembershipApplication } from "../actions";
import { MembershipStepper } from "./stepper";
import { PersonalStep } from "./steps/personal-step";
import { AcademicStep } from "./steps/academic-step";
import { RolePreferencesStep } from "./steps/role-preferences-step";
import { AvailabilityStep } from "./steps/availability-step";
import { ConsentStep } from "./steps/consent-step";
import { ReviewStep } from "./steps/review-step";
import { MembershipConfirmation } from "./confirmation";
import { LeaveApplyDialog } from "./leave-apply-dialog";
import { useFormLeaveGuard } from "@/lib/hooks/use-form-leave-guard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ActiveCampaign = {
  id: string;
  academicYear: string;
  status: string;
} | null;

const REDIRECT_DELAY_MS = 10000;

const STEP_FIELDS: Record<number, (keyof MembershipFormValues)[]> = {
  1: [
    "fullName",
    "nickname",
    "studentId",
    "email",
    "mobileNumber",
    "birthdate",
    "sex",
    "facebookUrl",
  ],
  2: ["college", "program", "yearLevel"],
  3: ["primaryRole", "secondaryRole", "relatedSkills", "relatedExperiences"],
  4: ["availability", "eventAttendanceWillingness", "otherOrgs"],
  5: ["privacyConsent", "declarationConsent"],
  6: [], // Turnstile token is validated on submit (step 6 Review) via full form.trigger()
};

export function MembershipWizard({
  activeCampaign,
  onSubmittedChange,
}: {
  activeCampaign: ActiveCampaign;
  onSubmittedChange?: (submitted: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Bumped to force the Turnstile widget to remount with a fresh challenge
  // (tokens are single-use — the server consumes one on every submit attempt).
  const [turnstileEpoch, setTurnstileEpoch] = useState(0);
  const totalSteps = 6;
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const wizardTopRef = useRef<HTMLDivElement>(null);

  // After a successful submission, return the applicant to the membership
  // page shortly so they see the confirmation without getting stuck.
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      router.push("/membership");
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [success, router]);

  const scrollToTop = () => {
    wizardTopRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      fullName: "",
      nickname: "",
      studentId: "",
      email: "",
      mobileNumber: "",
      birthdate: "",
      sex: "" as unknown as MembershipFormValues["sex"],
      facebookUrl: "",
      college: "" as unknown as MembershipFormValues["college"],
      program: "",
      yearLevel: "" as unknown as MembershipFormValues["yearLevel"],
      primaryRole: "" as unknown as MembershipFormValues["primaryRole"],
      secondaryRole: "" as unknown as MembershipFormValues["secondaryRole"],
      relatedSkills: "",
      relatedExperiences: "",
      availability: "",
      eventAttendanceWillingness: false,
      otherOrgs: "",
      privacyConsent: false as unknown as true,
      declarationConsent: false as unknown as true,
      turnstileToken: "",
    },
    mode: "onChange",
  });

  const handleNext = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    if (fields.length > 0) {
      const ok = await form.trigger(fields as never);
      if (!ok) return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  // Fast navigation via the stepper: only completed steps are clickable, so
  // jumping back is always safe (that data was already validated).
  const handleStepClick = (targetStep: number) => {
    if (targetStep >= step) return;
    setError(null);
    setStep(targetStep);
    wizardTopRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleSubmit = async () => {
    const ok = await form.trigger();
    if (!ok) {
      setError("Please fix the highlighted fields before submitting.");
      scrollToTop();
      return;
    }
    setSubmitting(true);
    setError(null);
    const values = form.getValues();
    // Ensure boolean is true for checkbox (Zod expects true literal)
    const result = await submitMembershipApplication(values);
    setSubmitting(false);
    if (result.success) {
      setSuccess(true);
      onSubmittedChange?.(true);
      toast.success("Application submitted!");
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
      // The Turnstile token is single-use and was consumed by the server, so
      // remount the widget to mint a fresh token for a faster retry.
      setTurnstileEpoch((e) => e + 1);
      form.setValue("turnstileToken", "");
      scrollToTop();
    }
  };

  const handleReset = () => {
    form.reset();
    setStep(1);
    setSuccess(false);
    onSubmittedChange?.(false);
    setError(null);
    setTurnstileEpoch((e) => e + 1);
  };

  const handleTurnstileVerify = (token: string) => {
    form.setValue("turnstileToken", token, { shouldValidate: true });
  };

  const handleRetryVerification = () => {
    setTurnstileEpoch((e) => e + 1);
  };

  // Arm the leave guard once the visitor has entered any data — the form is
  // only mounted during the active-campaign state, so this never fires on the
  // closed or submitted screens.
  const formDirty = form.formState.isDirty && !success && !!activeCampaign;
  const {
    open: leaveOpen,
    continueLeave,
    cancelLeave,
  } = useFormLeaveGuard(formDirty, handleReset);

  if (!activeCampaign) {
    return (
      <div className="bg-accent/30 border-border/60 mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border p-8 text-center">
        <h3 className="text-lg font-semibold">
          Applications are currently closed
        </h3>
        <p className="text-muted-foreground text-sm">
          There is no active membership campaign at the moment. Please check
          back when the next campaign opens, or follow us on Facebook for
          announcements.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <MembershipConfirmation
        academicYear={activeCampaign.academicYear}
        redirectDelayMs={REDIRECT_DELAY_MS}
        onReset={handleReset}
      />
    );
  }

  return (
    <>
      <FormProvider {...form}>
        <div ref={wizardTopRef} className="flex w-full flex-col gap-5">
          {/* Stepper — OUTSIDE the card */}
          <MembershipStepper currentStep={step} onStepClick={handleStepClick} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="bg-card border-border/60 flex w-full flex-col gap-5 rounded-2xl border p-6 md:p-8"
          >
            {error && (
              <div
                className="bg-destructive/10 text-destructive border-destructive/20 shrink-0 rounded-md border px-4 py-3 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {step === 1 && <PersonalStep />}
            {step === 2 && <AcademicStep />}
            {step === 3 && <RolePreferencesStep />}
            {step === 4 && <AvailabilityStep />}
            {step === 5 && <ConsentStep />}
            {step === 6 && (
              <ReviewStep
                onEdit={setStep}
                onVerify={handleTurnstileVerify}
                tokenEpoch={turnstileEpoch}
                onRetryVerification={handleRetryVerification}
              />
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || submitting}
              >
                Back
              </Button>
              {step < 6 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </FormProvider>

      <LeaveApplyDialog
        open={leaveOpen}
        onContinue={continueLeave}
        onCancel={cancelLeave}
      />
    </>
  );
}
