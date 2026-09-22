"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
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
  // Virtual keyboards (notably iOS Safari) don't resize fixed shells, so a
  // focused field can end up hidden behind the keyboard. Nudge it into view
  // inside the pane on focus — instant, pane-local, never page-level.
  const handlePaneFocus = (e: FocusEvent) => {
    const pane = formScrollRef.current;
    const target = e.target as HTMLElement | null;
    if (!pane || !target || typeof target.scrollIntoView !== "function") return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "nearest", behavior: "auto" });
    });
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

  // Recompute pane chrome when the viewport changes the pane's capacity —
  // including the visual viewport, which is what actually shrinks when a
  // mobile keyboard opens.
  useEffect(() => {
    updatePaneChrome();
    window.addEventListener("resize", updatePaneChrome);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", updatePaneChrome);
    return () => {
      window.removeEventListener("resize", updatePaneChrome);
      vv?.removeEventListener("resize", updatePaneChrome);
    };
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
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 p-8 text-center">
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
      <div className="flex min-h-0 flex-1 overflow-y-auto">
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
          className="flex min-h-0 w-full flex-1 flex-col gap-5 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-stretch lg:gap-8"
        >
          {/* Position scent — static row; nothing scrolls past it in the
              fixed shell. Text is aria-hidden: the live region above
              announces step changes exactly once. */}
          <div
            className="border-b border-transparent pt-1 pb-3 lg:hidden"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-valuenow={step}
            aria-label={`Step ${step} of ${totalSteps}: ${STEPS[step - 1]?.label}`}
          >
            <p
              aria-hidden
              className="text-caption text-muted-foreground mb-1.5"
            >
              Step {step} of {totalSteps} —{" "}
              <span className="text-foreground font-semibold">
                {STEPS[step - 1]?.label}
              </span>
            </p>
            <div
              aria-hidden
              className="bg-border h-1.5 w-full overflow-hidden rounded-full"
            >
              <div
                className="bg-primary h-full rounded-full motion-safe:transition-[width] motion-safe:duration-200"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          <aside
            className="hidden lg:block lg:min-h-0 lg:self-stretch"
            aria-label="Application progress"
          >
            <MembershipStepper
              currentStep={step}
              onStepClick={handleStepClick}
            />
          </aside>

          {/* Right column: scrollable form pane + anchored nav. The divider
              replaces the card as the rail/form separation on lg. */}
          <div className="lg:border-border/60 flex min-h-0 min-w-0 flex-1 flex-col gap-5 lg:gap-0 lg:border-l lg:pl-8">
            <form
              ref={formScrollRef}
              onScroll={updatePaneChrome}
              onFocusCapture={handlePaneFocus}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              // Flat at every width — no card chrome; the section padding
              // carries the rhythm. p-2 breathing room keeps focus rings
              // unclipped in the scroll pane.
              className="form-pane-scroll flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto p-2"
            >
              <div
                className={`flex w-full flex-col gap-5 ${
                  paneEdge.top && paneEdge.bottom
                    ? "[mask-image:linear-gradient(to_bottom,transparent,black_28px,black_calc(100%-28px),transparent)]"
                    : paneEdge.top
                      ? "[mask-image:linear-gradient(to_bottom,transparent,black_28px)]"
                      : paneEdge.bottom
                        ? "[mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)]"
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

            {/* Anchored footer — static row pinned by layout at every
                width: below lg it sits under the pane in the fixed
                viewport; on lg it keeps its top border under the scroll
                pane. */}
            <div className="border-border/60 flex shrink-0 flex-col gap-2 border-t pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {/* Navigation sits below the content, right-aligned, in a
                  fixed Back → Next order. Step changes never scroll the
                  page — the transition is immediate and contained. */}
              <div className="flex items-center justify-end gap-2">
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
              <p className="text-muted-foreground text-center text-xs lg:text-right">
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
