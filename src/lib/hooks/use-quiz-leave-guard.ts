"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clearProgress, loadProgress } from "@/lib/quiz";
import { requestPageTransition } from "@/components/common/page-transition";

type LeaveAction = { type: "back" } | { type: "navigate"; href: string };

/**
 * Guard against leaving the quiz mid-attempt.
 *
 * When `armed` (quiz in progress), any attempt to navigate away — the
 * browser back/forward buttons or an internal/external anchor click — opens
 * the leave confirmation instead of navigating. "Continue" discards the
 * stored progress (`clearProgress`, so the next quiz visit starts fresh,
 * matching the modal's promise) and then performs the pending navigation.
 * "Cancel" keeps the visitor on the quiz; nothing is lost.
 *
 * Browser back/forward is intercepted with a history sentinel: while armed
 * there is exactly one duplicate same-URL `pushState` entry on top of the
 * stack (`sentinelCount`). A `popstate` while armed is cancelled by
 * re-pushing the sentinel (URL unchanged) and opening the modal. Continue
 * traverses past the sentinel AND the real quiz entry
 * (`history.go(-(sentinelCount + 1))`) to the page the visitor came from;
 * a directly-loaded quiz has no previous entry, so the browser clamps (no-op
 * per the history spec) — matching native back behavior on a first page.
 * When the guard disarms (quiz finished or retaken), the sentinel is popped
 * so no dead entries accumulate; Next's router treats same-URL/null-state
 * popstates as no-ops, so this traversal is invisible.
 *
 * Anchor clicks are intercepted with a capture-phase document listener so
 * the server-rendered header links ("Back to Home", logo) are covered
 * without converting the layout to a client component. A `pageshow` handler
 * reconciles bfcache restores: if the page is restored mid-quiz but the
 * stored record was cleared by a previous Continue, the quiz falls back to
 * the intro instead of a stale UI.
 *
 * Listeners are attached only while `armed` and re-created when it changes,
 * so handlers always close over the current value (no ref writes during
 * render).
 */
export function useQuizLeaveGuard(armed: boolean, onResetToIntro: () => void) {
  const [open, setOpen] = useState(false);
  const pending = useRef<LeaveAction | null>(null);
  // Set right before a deliberate history traversal so the resulting
  // popstate is not intercepted again.
  const allowNavigation = useRef(false);
  /** Number of our duplicate same-URL sentinels currently in the stack. */
  const sentinelCount = useRef(0);

  const cancelLeave = useCallback(() => {
    pending.current = null;
    setOpen(false);
  }, []);

  const continueLeave = useCallback(() => {
    setOpen(false);
    const action = pending.current;
    pending.current = null;

    // Proceeding = progress is permanently lost and the quiz resets; drop
    // the stored session record so the next /quiz visit starts fresh.
    clearProgress();

    if (!action) return;
    if (action.type === "back") {
      // Leave to the page the visitor came from: traverse past our sentinel
      // AND the real quiz entry. A directly-loaded quiz has no previous
      // entry — the browser clamps and stays (native first-page behavior).
      const depth = sentinelCount.current + 1;
      sentinelCount.current = 0;
      allowNavigation.current = true;
      window.history.go(-depth);
      // If no popstate follows (traversal out of range), don't leave the
      // allow-flag set and swallow a later legitimate back press.
      window.setTimeout(() => {
        allowNavigation.current = false;
      }, 1000);
    } else if (action.href.startsWith("/")) {
      // Route through the global page transition so leaving the quiz gets the
      // same cover → navigate → reveal wipe as a regular link click.
      requestPageTransition(action.href);
    } else {
      window.location.href = action.href;
    }
  }, []);

  /** Programmatic entry point — also used internally by the listeners. */
  const triggerLeave = useCallback((action: LeaveAction) => {
    pending.current = action;
    setOpen(true);
  }, []);

  // Browser back/forward: cancel the pop while armed and ask instead.
  const onPopState = useCallback(() => {
    if (allowNavigation.current) {
      allowNavigation.current = false;
      return;
    }
    if (!armed) return;
    // The browser popped our sentinel; re-push it so the URL stays on the
    // quiz and the next back press is intercepted again. Exactly one
    // sentinel remains on top (invariant maintained while armed).
    window.history.pushState(history.state, "", window.location.href);
    sentinelCount.current = 1;
    triggerLeave({ type: "back" });
  }, [armed, triggerLeave]);

  // Any anchor click navigating away from the quiz (header links included).
  const onClickCapture = useCallback(
    (event: MouseEvent) => {
      if (!armed) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return; // new tab / modified navigation keeps this tab's progress
      }
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }
      // Skip same-page links (trailing-slash insensitive).
      const current = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.origin);
      const samePath =
        targetUrl.pathname.replace(/\/+$/, "") ===
        current.pathname.replace(/\/+$/, "");
      if (samePath && targetUrl.search === current.search) return;
      event.preventDefault();
      triggerLeave({ type: "navigate", href });
    },
    [armed, triggerLeave],
  );

  // bfcache reconcile: restored mid-quiz UI with no stored record means the
  // visitor confirmed leaving earlier — reset to the intro.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted && armed && !loadProgress()) {
        onResetToIntro();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [armed, onResetToIntro]);

  // Arm: push the history sentinel once and attach the listeners.
  useEffect(() => {
    if (!armed) {
      return;
    }
    if (sentinelCount.current === 0) {
      window.history.pushState(history.state, "", window.location.href);
      sentinelCount.current = 1;
    }
    window.addEventListener("popstate", onPopState);
    // Attach to `window` capture: it runs BEFORE the document-capture
    // listener of the app's page-transition system, so we preventDefault
    // first and page-transition (which respects defaultPrevented) backs off.
    window.addEventListener("click", onClickCapture, true);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("click", onClickCapture, true);
    };
  }, [armed, onPopState, onClickCapture]);

  // Disarm: pop our sentinel(s) so no dead history entries accumulate. Next's
  // router treats same-URL / null-state popstates as no-ops, so this is
  // invisible (no remount, no visible navigation).
  useEffect(() => {
    if (armed || sentinelCount.current === 0) return;
    window.history.go(-sentinelCount.current);
    sentinelCount.current = 0;
  }, [armed]);

  return { open, triggerLeave, continueLeave, cancelLeave };
}
