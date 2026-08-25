"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { requestPageTransition } from "@/components/common/page-transition";

type LeaveAction = { type: "back" } | { type: "navigate"; href: string };

/**
 * Guard against leaving a form with unsaved data.
 *
 * When `armed` (form has entered values), any attempt to navigate away — the
 * browser back/forward buttons, a link click (header included), or a refresh
 * / tab close — is intercepted. "Continue" discards the form state (via
 * `onDiscard`) and then performs the pending navigation; "Cancel" keeps the
 * visitor on the form with nothing lost.
 *
 * Browser back/forward uses a history sentinel (one duplicate same-URL
 * `pushState` while armed); a `popstate` while armed is cancelled and the
 * modal opens instead. Link clicks are intercepted with a capture-phase
 * document listener so the server-rendered header links are covered. A
 * `beforeunload` handler surfaces the native prompt on refresh/close.
 *
 * Listeners attach only while `armed`, so handlers always close over the
 * current value.
 */
export function useFormLeaveGuard(armed: boolean, onDiscard?: () => void) {
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

    // Proceeding = the entered data is discarded.
    onDiscard?.();

    if (!action) return;
    if (action.type === "back") {
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
      // Route through the global page transition for a consistent wipe.
      requestPageTransition(action.href);
    } else {
      window.location.href = action.href;
    }
  }, [onDiscard]);

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
    window.history.pushState(history.state, "", window.location.href);
    sentinelCount.current = 1;
    triggerLeave({ type: "back" });
  }, [armed, triggerLeave]);

  // Any anchor click navigating away from the form (header links included).
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

  // Warn before a refresh / tab close with unsaved data (native prompt).
  useEffect(() => {
    if (!armed) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [armed]);

  // Arm: push the history sentinel once and attach the listeners.
  useEffect(() => {
    if (!armed) return;
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
