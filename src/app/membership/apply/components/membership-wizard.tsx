"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AnimatePresence } from "motion/react";
import { useMountedReducedMotion } from "@/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipFormSchema, type MembershipFormValues } from "../schema";
import { submitMembershipApplication } from "../actions";
import { MembershipStepper, STEPS } from "./stepper";
import { ApplyIntroScreen } from "./apply-intro-screen";
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
import {
  APPLY_TOTAL_STEPS,
  clearDraft,
  loadDraft,
  makeApplyVersion,
  saveDraft,
} from "@/lib/membership-apply";
import { SOCIAL_LINKS } from "@/lib/constants/site";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { MembershipCampaign } from "@/lib/notion/membership-campaigns";

/** Idle reset budget on the success screen (quiz result-phase parity). */
const SUCCESS_IDLE_MS = 60 * 1000;
const TICK_MS = 1000;

type ActiveCampaign = Pick<
  MembershipCampaign,
  "id" | "academicYear" | "status"
> | null;

/**
 * Back → Next/Submit cluster, shared by the portrait top bar and the
 * bottom footer. One instance is always display:none, so tab order stays
 * single.
 */
function WizardNav({
  step,
  totalSteps,
  submitting,
  onBack,
  onNext,
  onSubmit,
}: {
  step: number;
  totalSteps: number;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={step === 1 || submitting}
      >
        Back
      </Button>{" "}
      {step < totalSteps ? (
        <Button type="button" onClick={onNext} disabled={submitting}>
          Next
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      )}
    </>
  );
}

const STEP_FIELDS: Record<number, (keyof MembershipFormValues)[]> = {
  1: ["fullName", "nickname", "birthdate", "sex"],
  2: ["email", "mobileNumber", "studentId", "facebookUrl"],
  3: ["college", "program", "yearLevel"],
  4: ["primaryRole", "secondaryRole", "relatedSkills", "relatedExperiences"],
  5: ["availability", "eventAttendanceWillingness", "otherOrgs"],
  6: ["privacyConsent", "declarationConsent"],
  7: [], // Turnstile token is validated on submit (step 7 Review) via full form.trigger()
};

// Compile-time guard: every schema key except the submit-only Turnstile token
// must appear in exactly one step's field list.
type _StepFieldsCoverage =
  Exclude<keyof MembershipFormValues, "turnstileToken"> extends
    | (typeof STEP_FIELDS)[1][number]
    | (typeof STEP_FIELDS)[2][number]
    | (typeof STEP_FIELDS)[3][number]
    | (typeof STEP_FIELDS)[4][number]
    | (typeof STEP_FIELDS)[5][number]
    | (typeof STEP_FIELDS)[6][number]
    ? true
    : never;
const _stepFieldsCovered: _StepFieldsCoverage = true;
void _stepFieldsCovered;

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
  // Entry/exit phases (quiz parity): the wizard opens on `intro` and only
  // enters `form` via Start; every reset lands back on `intro`.
  const [phase, setPhase] = useState<"intro" | "form" | "success">("intro");
  // Whether the mount-time draft restore has been applied (guards the save
  // effect so empty defaults can't clobber a stored draft on first paint).
  const [restored, setRestored] = useState(false);
  // Explicit "Start over" confirmation (separate from the navigation leave
  // guard below — confirming returns to intro instead of navigating).
  const [confirmReset, setConfirmReset] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  // Bumped to force the Turnstile widget to remount with a fresh challenge
  // (tokens are single-use — the server consumes one on every submit attempt).
  const [turnstileEpoch, setTurnstileEpoch] = useState(0);
  const totalSteps = APPLY_TOTAL_STEPS;
  const reduceMotion = useMountedReducedMotion();
  const wizardTopRef = useRef<HTMLDivElement>(null);
  // Focus target for step changes — keyboard/SR users must land on the new
  // step, not on the unmounted Next/Submit button. `tabIndex={-1}` allows
  // programmatic focus without adding to tab order.
  const stepFocusRef = useRef<HTMLDivElement>(null);
  const focusStep = () => {
    stepFocusRef.current?.focus({ preventScroll: true });
  };
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

  // Session persistence (quiz FR-008 parity): restore an in-progress draft
  // on mount so a refresh or back/forward resumes at the same step with
  // entered values intact. Stale/cross-campaign records are discarded by
  // `loadDraft`, leaving the visitor on the intro.
  useEffect(() => {
    const saved = loadDraft(activeCampaign?.id ?? null);
    if (saved) {
      // Mount-time hydration from sessionStorage is a legitimate external
      // system sync; lazy state init would break SSR hydration of the intro.
      // oxlint-disable-next-line react/set-state-in-effect
      form.reset({
        ...form.getValues(),
        ...saved.values,
        turnstileToken: "",
      } as MembershipFormValues);
      // oxlint-disable-next-line react/set-state-in-effect
      setStep(saved.step);
      // oxlint-disable-next-line react/set-state-in-effect
      setPhase("form");
    }
    setRestored(true);
    // Mount-only, mirroring the quiz restore effect.
  }, []);

  // Draft saver — reads are always fresh: field edits bubble `change` events
  // to the form (after RHF updates its own state), and step/phase
  // transitions re-run the effect below.
  const persistDraft = useCallback(() => {
    if (!restored || !activeCampaign || phase !== "form") return;
    saveDraft({
      version: makeApplyVersion(),
      campaignId: activeCampaign.id,
      step,
      values: { ...form.getValues() },
    });
  }, [restored, activeCampaign, phase, step, form]);

  // Save the draft on step/phase changes; clear on intro/success so the
  // next visit always starts fresh (quiz save-effect parity).
  useEffect(() => {
    if (!restored || !activeCampaign) return;
    if (phase !== "form") {
      clearDraft();
      return;
    }
    persistDraft();
  }, [restored, phase, step, activeCampaign, persistDraft]);

  const focusFirstError = () => {
    const first = Object.keys(form.formState.errors)[0];
    if (first) {
      try {
        form.setFocus(first as never);
        return;
      } catch {
        // fall through to step focus
      }
    }
    focusStep();
  };

  const handleNext = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    if (fields.length > 0) {
      const ok = await form.trigger(fields as never);
      if (!ok) {
        focusFirstError();
        return;
      }
    }
    setError(null);
    setStep((s) => Math.min(s + 1, totalSteps));
    resetPaneScroll();
    scrollToTop();
    requestAnimationFrame(() => {
      updatePaneChrome();
      focusStep();
    });
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
    resetPaneScroll();
    scrollToTop();
    requestAnimationFrame(() => {
      updatePaneChrome();
      focusStep();
    });
  };

  // Fast navigation via the stepper: only completed steps are clickable, so
  // jumping back is always safe (that data was already validated).
  const handleStepClick = (targetStep: number) => {
    if (targetStep >= step) return;
    setError(null);
    setStep(targetStep);
    resetPaneScroll();
    scrollToTop();
    requestAnimationFrame(() => {
      updatePaneChrome();
      focusStep();
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

  const handleSubmit = async () => {
    const ok = await form.trigger();
    if (!ok) {
      setError("Please fix the highlighted fields before submitting.");
      scrollToTop();
      focusFirstError();
      return;
    }
    setSubmitting(true);
    setError(null);
    const values = form.getValues();
    const result = await submitMembershipApplication(values);
    setSubmitting(false);
    if (result.success) {
      setSubmittedEmail(values.email);
      setPhase("success");
      clearDraft();
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

  // Entry from the intro screen (quiz `startQuiz` parity): always a clean
  // step 1 — drafts auto-resume on mount, so reaching the intro means
  // there is nothing to resume.
  const handleStart = () => {
    setError(null);
    setStep(1);
    setPhase("form");
    resetPaneScroll();
    scrollToTop();
    requestAnimationFrame(() => {
      updatePaneChrome();
      focusStep();
    });
  };

  // Every reset lands back on the intro with a clean form and no stored
  // draft (quiz `resetQuiz` parity). Used by "Submit another application",
  // "Start over", and the leave guard's Continue.
  const handleResetToIntro = useCallback(() => {
    clearDraft();
    form.reset();
    setStep(1);
    setPhase("intro");
    setSubmittedEmail("");
    onSubmittedChange?.(false);
    setError(null);
    setTurnstileEpoch((e) => e + 1);
    setConfirmReset(false);
  }, [form, onSubmittedChange]);

  // Explicit mid-form reset: pristine forms reset instantly; anything
  // entered asks first via the reset-mode dialog. Reads `isDirty` at call
  // time so this stays above the leave-guard wiring below.
  const requestReset = () => {
    if (phase === "form" && form.formState.isDirty) {
      setConfirmReset(true);
    } else {
      handleResetToIntro();
    }
  };

  const handleTurnstileVerify = (token: string) => {
    form.setValue("turnstileToken", token, { shouldValidate: true });
  };

  const handleRetryVerification = () => {
    setTurnstileEpoch((e) => e + 1);
  };

  // Arm the leave guard only while the form phase holds entered data (quiz
  // parity: the guard is silent on intro and on the submitted screen).
  // Continue discards the draft and resets to intro, so a blocked/failed
  // navigation still honors the dialog's promise.
  const { isDirty: formDirtyFlag } = form.formState;
  const formDirty = formDirtyFlag && phase === "form" && !!activeCampaign;
  const {
    open: leaveOpen,
    continueLeave,
    cancelLeave,
  } = useFormLeaveGuard(formDirty, handleResetToIntro);

  // bfcache reconcile (quiz parity): a restore showing the form with no
  // stored draft means the visitor confirmed leaving earlier — fall back to
  // the intro instead of a stale UI.
  useEffect(() => {
    if (phase !== "form" || !activeCampaign) return;
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !loadDraft(activeCampaign.id)) {
        handleResetToIntro();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [phase, activeCampaign, handleResetToIntro]);

  // Idle reset for the success screen only (quiz result-phase parity):
  // after 60s of inactivity return to a clean intro so the next visitor
  // on a shared/kiosk device starts fresh. The countdown pill is visible
  // for the whole minute; hidden tabs pause the timer instead of wiping a
  // visitor who tabbed away, and an open dialog suppresses the reset.
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (phase !== "success" || leaveOpen || confirmReset) {
      setSecondsLeft(null);
      return;
    }

    let timeoutId: number | undefined;
    let intervalId: number | undefined;
    let deadline = Date.now() + SUCCESS_IDLE_MS;

    const clearTimers = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      timeoutId = undefined;
      intervalId = undefined;
    };

    const resetToIdle = () => {
      clearTimers();
      setSecondsLeft(null);
      handleResetToIntro();
      toast("Session reset due to inactivity");
    };

    const tick = () => {
      const remainingMs = Math.max(0, deadline - Date.now());
      setSecondsLeft(Math.ceil(remainingMs / 1000));
    };

    const schedule = () => {
      clearTimers();
      deadline = Date.now() + SUCCESS_IDLE_MS;
      tick();
      timeoutId = window.setTimeout(resetToIdle, SUCCESS_IDLE_MS);
      intervalId = window.setInterval(tick, TICK_MS);
    };

    const handleActivity = () => schedule();

    const handleVisibility = () => {
      if (document.hidden) {
        // Pause while hidden — never wipe a tabbed-away visitor.
        clearTimers();
      } else {
        schedule();
      }
    };

    // Initial schedule
    schedule();

    const bubbleEvents: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "touchmove",
      "click",
    ];
    for (const evt of bubbleEvents) {
      window.addEventListener(evt, handleActivity, { passive: true });
    }
    // `scroll` doesn't bubble, so a capture listener is required to catch
    // scrolls inside the inner overflow container.
    window.addEventListener("scroll", handleActivity, {
      passive: true,
      capture: true,
    });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimers();
      for (const evt of bubbleEvents) {
        window.removeEventListener(evt, handleActivity);
      }
      window.removeEventListener("scroll", handleActivity, { capture: true });
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [phase, leaveOpen, confirmReset, handleResetToIntro]);

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

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "success" ? (
          // Plain flex shell — the confirmation centers itself with margin
          // auto (safe centering: top stays reachable if it ever overflows).
          <div
            key="apply-success"
            className="flex min-h-0 flex-1 overflow-y-auto"
          >
            <MembershipConfirmation
              academicYear={activeCampaign.academicYear}
              email={submittedEmail}
              secondsLeft={secondsLeft}
              onReset={handleResetToIntro}
            />
          </div>
        ) : phase === "intro" ? (
          <ApplyIntroScreen
            key="apply-intro"
            academicYear={activeCampaign.academicYear}
            onStart={handleStart}
          />
        ) : (
          <FormProvider key="apply-form" {...form}>
            {/* Screen-reader step announcer — the mobile dots are visual-only,
            so position changes are announced here. Outside the grid. */}
            <p aria-live="polite" className="sr-only">
              Step {step} of {totalSteps}: {STEPS[step - 1]?.label}
            </p>
            {/* Page header + primary actions in one top bar: identity on the
            left, Back → Next on the right. The single nav instance for
            every breakpoint. */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between landscape:flex-row landscape:items-center landscape:justify-between">
              <div className="flex min-w-0 flex-col items-start gap-2 text-left">
                <h1 className="text-secondary-dark dark:text-secondary text-2xl font-bold md:text-3xl">
                  Membership Application
                </h1>
                <p className="text-muted-foreground max-w-xl text-sm">
                  {activeCampaign ? (
                    <>
                      Need help? Reach us at{" "}
                      <a
                        href={`mailto:${SOCIAL_LINKS.email}`}
                        className="text-primary underline"
                      >
                        {SOCIAL_LINKS.email}
                      </a>
                      .
                    </>
                  ) : (
                    "There is no active membership campaign at the moment. Please check back when the next campaign opens."
                  )}
                </p>
              </div>
              {activeCampaign && (
                // Header nav renders ONLY on desktop portrait and mobile
                // landscape; every other screen uses the bottom footer.
                // display:none keeps the inactive twin out of tab order.
                <div className="hidden shrink-0 items-center justify-end gap-2 lg:portrait:flex max-lg:landscape:flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={requestReset}
                    className="text-muted-foreground gap-2"
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    Start over
                  </Button>
                  <WizardNav
                    step={step}
                    totalSteps={totalSteps}
                    submitting={submitting}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                  />
                </div>
              )}
            </div>
            <div
              ref={wizardTopRef}
              className="flex min-h-0 w-full flex-1 flex-col justify-start gap-5 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:content-stretch lg:items-stretch lg:gap-8"
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
                className="hidden lg:block lg:max-h-full lg:min-h-0 lg:self-start lg:overflow-y-auto"
                aria-label="Application progress"
              >
                <MembershipStepper
                  currentStep={step}
                  onStepClick={handleStepClick}
                />
              </aside>

              {/* Right column: scrollable form pane + anchored nav. The divider
              replaces the card as the rail/form separation on lg. The column
              fills the stretched grid row (lg:h-full) so the footer pins to
              the viewport bottom on every step; only the form pane scrolls. */}
              <div className="lg:border-border/60 flex min-h-0 min-w-0 flex-1 flex-col justify-start gap-5 lg:h-full lg:gap-0 lg:border-l lg:pl-8">
                <form
                  ref={formScrollRef}
                  onScroll={updatePaneChrome}
                  onFocusCapture={handlePaneFocus}
                  onChange={persistDraft}
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  // Flat at every width — no card chrome; the section padding
                  // carries the rhythm. p-2 breathing room keeps focus rings
                  // unclipped in the scroll pane.
                  className="form-pane-scroll flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto p-2"
                >
                  <div
                    className={cn(
                      "flex w-full flex-col gap-5",
                      paneEdge.top &&
                        paneEdge.bottom &&
                        "[mask-image:linear-gradient(to_bottom,transparent,black_28px,black_calc(100%-28px),transparent)]",
                      paneEdge.top &&
                        !paneEdge.bottom &&
                        "[mask-image:linear-gradient(to_bottom,transparent,black_28px)]",
                      !paneEdge.top &&
                        paneEdge.bottom &&
                        "[mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)]",
                    )}
                  >
                    <div
                      ref={stepFocusRef}
                      tabIndex={-1}
                      aria-label={`Step ${step}: ${STEPS[step - 1]?.label}`}
                      className="outline-none"
                    />
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

                {/* Footer nav + hint — the default-position instance, pinned to
                the column bottom via mt-auto so its level is identical on
                every step. Hidden on lg portrait and mobile landscape, where
                the header carries the nav instead. */}
                <div className="border-border/60 mt-auto flex shrink-0 flex-col gap-2 border-t pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:portrait:hidden max-lg:landscape:hidden">
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={requestReset}
                      className="text-muted-foreground gap-2"
                    >
                      <RotateCcw className="size-4" aria-hidden />
                      Start over
                    </Button>
                    <div className="flex items-center justify-end gap-2">
                      <WizardNav
                        step={step}
                        totalSteps={totalSteps}
                        submitting={submitting}
                        onBack={handleBack}
                        onNext={handleNext}
                        onSubmit={handleSubmit}
                      />
                    </div>
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
        )}
      </AnimatePresence>

      <LeaveApplyDialog
        open={leaveOpen || confirmReset}
        mode={confirmReset ? "reset" : "leave"}
        onContinue={confirmReset ? handleResetToIntro : continueLeave}
        onCancel={confirmReset ? () => setConfirmReset(false) : cancelLeave}
      />
    </>
  );
}
