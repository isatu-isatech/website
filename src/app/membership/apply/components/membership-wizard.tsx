"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useReducedMotion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipFormSchema, type MembershipFormValues } from "../schema";
import { submitMembershipApplication } from "../actions";
import { MembershipStepper, STEPS } from "./stepper";
import { IdentityStep } from "./steps/identity-step";
import { ContactStep } from "./steps/contact-step";
import { AcademicStep } from "./steps/academic-step";
import { RolePreferencesStep } from "./steps/role-preferences-step";
import { AvailabilityStep } from "./steps/availability-step";
import { ConsentStep } from "./steps/consent-step";
import { ReviewStep } from "./steps/review-step";
import { MembershipConfirmation } from "./confirmation";
import { LeaveApplyDialog } from "./leave-apply-dialog";
import { useFormLeaveGuard } from "@/lib/hooks/use-form-leave-guard";
import { SOCIAL_LINKS, TEAM_4H } from "@/lib/constants/site";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ActiveCampaign = {
  id: string;
  academicYear: string;
  status: string;
} | null;

const STEP_FIELDS: Record<number, (keyof MembershipFormValues)[]> = {
  1: ["fullName", "nickname", "birthdate", "sex"],
  2: ["email", "mobileNumber", "studentId", "facebookUrl"],
  3: ["college", "program", "yearLevel"],
  4: ["primaryRole", "secondaryRole", "relatedSkills", "relatedExperiences"],
  5: ["availability", "eventAttendanceWillingness", "otherOrgs"],
  6: ["privacyConsent", "declarationConsent"],
  7: [], // Turnstile token is validated on submit (step 7 Review) via full form.trigger()
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
  const [submittedEmail, setSubmittedEmail] = useState("");
  // Bumped to force the Turnstile widget to remount with a fresh challenge
  // (tokens are single-use — the server consumes one on every submit attempt).
  const [turnstileEpoch, setTurnstileEpoch] = useState(0);
  const totalSteps = 7;
  const reduceMotion = useReducedMotion();
  const wizardTopRef = useRef<HTMLDivElement>(null);
  // The lg form pane scrolls internally — reset it on every step change so
  // each step opens at its top. Instant (never smooth): the transition
  // itself must not move under the visitor.
  const formScrollRef = useRef<HTMLFormElement>(null);
  const resetPaneScroll = () => {
    formScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };
  // lg pane chrome: edge fades driven by the pane's own scroll position.
  // Updated on scroll, step change, and resize. The persistent scroll
  // indicator is the pane's own styled scrollbar (see .form-pane-scroll).
  const [paneEdge, setPaneEdge] = useState({ top: false, bottom: false });
  const updatePaneChrome = useCallback(() => {
    const el = formScrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 4) {
      setPaneEdge({ top: false, bottom: false });
      return;
    }
    setPaneEdge({ top: el.scrollTop > 4, bottom: el.scrollTop < max - 4 });
  }, []);

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
      eventAttendanceWillingness: false as unknown as true,
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
    resetPaneScroll();
    requestAnimationFrame(updatePaneChrome);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
    resetPaneScroll();
    requestAnimationFrame(updatePaneChrome);
  };

  // Fast navigation via the stepper: only completed steps are clickable, so
  // jumping back is always safe (that data was already validated).
  const handleStepClick = (targetStep: number) => {
    if (targetStep >= step) return;
    setError(null);
    setStep(targetStep);
    resetPaneScroll();
    requestAnimationFrame(updatePaneChrome);
    wizardTopRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  // Recompute pane chrome when the viewport changes the pane's capacity.
  useEffect(() => {
    updatePaneChrome();
    window.addEventListener("resize", updatePaneChrome);
    return () => window.removeEventListener("resize", updatePaneChrome);
  }, [step, updatePaneChrome]);

  // Warm the role-picker art on mount (step 1) so the step-4 pickers render
  // instantly instead of fetching on view.
  useEffect(() => {
    for (const { imagePath } of TEAM_4H) {
      const img = new window.Image();
      img.src = imagePath;
    }
  }, []);

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
      setSubmittedEmail(values.email);
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
    setSubmittedEmail("");
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
      // Plain flex shell — the confirmation centers itself with margin
      // auto (safe centering: top stays reachable if it ever overflows).
      <div className="lg:flex lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <MembershipConfirmation
          academicYear={activeCampaign.academicYear}
          email={submittedEmail}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <>
      <FormProvider {...form}>
        {/* Screen-reader step announcer — the mobile dots are visual-only,
            so position changes are announced here. Outside the grid. */}
        <p aria-live="polite" className="sr-only">
          Step {step} of {totalSteps}: {STEPS[step - 1]?.label}
        </p>
        <div
          ref={wizardTopRef}
          className="flex w-full flex-col gap-5 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-stretch lg:gap-8"
        >
          {/* Narrow screens: horizontal dots above the card. lg+: a fixed
              vertical rail; only the form pane scrolls. */}
          <MembershipStepper
            currentStep={step}
            onStepClick={handleStepClick}
            className="lg:hidden"
          />
          <aside
            className="hidden lg:block lg:min-h-0 lg:self-stretch"
            aria-label="Application progress"
          >
            <MembershipStepper
              currentStep={step}
              onStepClick={handleStepClick}
              orientation="vertical"
            />
          </aside>

          {/* Right column: scrollable form pane + anchored nav. The divider
              replaces the card as the rail/form separation on lg. */}
          <div className="lg:border-border/60 flex min-w-0 flex-col gap-5 lg:min-h-0 lg:flex-1 lg:gap-0 lg:border-l lg:pl-8">
            <form
              ref={formScrollRef}
              onScroll={updatePaneChrome}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              // lg breathing room inside the pane so focus rings and the
              // active step glow never clip at the scroll edges. The
              // position-aware edge fades live on the inner wrapper, NOT
              // the scroll container — mask-image on the container would
              // mask the pane's own scrollbar out of view.
              className="bg-card border-border/60 form-pane-scroll flex w-full flex-col gap-5 rounded-2xl border p-6 md:p-8 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:p-3"
            >
              <div
                className={`flex w-full flex-col gap-5 ${
                  paneEdge.top && paneEdge.bottom
                    ? "lg:[mask-image:linear-gradient(to_bottom,transparent,black_28px,black_calc(100%-28px),transparent)]"
                    : paneEdge.top
                      ? "lg:[mask-image:linear-gradient(to_bottom,transparent,black_28px)]"
                      : paneEdge.bottom
                        ? "lg:[mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)]"
                        : ""
                }`}
              >
                {error && (
                  <div
                    className="bg-destructive/10 text-destructive border-destructive/20 shrink-0 rounded-md border px-4 py-3 text-sm"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {step === 1 && <IdentityStep />}
                {step === 2 && <ContactStep />}
                {step === 3 && <AcademicStep />}
                {step === 4 && <RolePreferencesStep />}
                {step === 5 && <AvailabilityStep />}
                {step === 6 && <ConsentStep />}
                {step === 7 && (
                  <ReviewStep
                    onEdit={setStep}
                    onVerify={handleTurnstileVerify}
                    tokenEpoch={turnstileEpoch}
                    onRetryVerification={handleRetryVerification}
                  />
                )}
              </div>
            </form>

            {/* Anchored navigation — always visible below the pane. */}
            <div className="lg:border-border/60 flex flex-col gap-2 lg:shrink-0 lg:border-t lg:pt-4">
              {/* Navigation sits below the content, right-aligned, in a
                  fixed Back → Next order. Step changes never scroll the
                  page — the transition is immediate and contained. */}
              <div className="flex items-center justify-end gap-2 pt-1 lg:pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1 || submitting}
                >
                  Back
                </Button>{" "}
                {step < 7 ? (
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
              <p className="text-muted-foreground pt-1 text-center text-xs lg:pt-0 lg:text-right">
                Need help? Reach us at{" "}
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="text-primary underline"
                >
                  {SOCIAL_LINKS.email}
                </a>
                .
              </p>
            </div>
          </div>
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
