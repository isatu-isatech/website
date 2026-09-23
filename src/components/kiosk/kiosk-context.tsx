"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

const KIOSK_STORAGE_KEY = "kiosk-mode-v1";
/** Desktop portrait: the only surface where the kiosk toggle is offered. */
const KIOSK_MEDIA_QUERY = "(min-width: 1024px) and (orientation: portrait)";

interface KioskContextValue {
  /** Raw toggle intent (persisted per tab). */
  isKiosk: boolean;
  /** Effective kiosk UI — intent gated on desktop-portrait eligibility. */
  isKioskEnforced: boolean;
  enter: () => void;
  exit: () => void;
  toggle: () => void;
}

const KioskContext = createContext<KioskContextValue | null>(null);

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error("useKiosk must be used within KioskProvider");
  return ctx;
}

function isKioskEligible() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(KIOSK_MEDIA_QUERY).matches
  );
}

/**
 * Kiosk display state for shared/event devices (quiz + membership apply).
 *
 * While enforced, outbound navigation and sharing are hidden and the page
 * runs fullscreen. The existing per-phase idle resets (quiz progress,
 * apply draft) are untouched — kiosk only removes the exits so those
 * timers can return the device to a clean intro for the next visitor.
 */
export function KioskProvider({ children }: { children: ReactNode }) {
  const [isKiosk, setIsKiosk] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const isKioskRef = useRef(false);

  useEffect(() => {
    isKioskRef.current = isKiosk;
  }, [isKiosk]);

  // Restore persisted intent and track desktop-portrait eligibility.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KIOSK_STORAGE_KEY) === "1") {
        // Mount-time hydration from sessionStorage is a legitimate external
        // system sync (quiz/apply restore effects follow the same pattern).
        // oxlint-disable-next-line react/set-state-in-effect
        setIsKiosk(true);
      }
    } catch {
      // sessionStorage unavailable — kiosk simply won't survive a reload.
    }
    const mq = window.matchMedia(KIOSK_MEDIA_QUERY);
    // oxlint-disable-next-line react/set-state-in-effect
    setIsEligible(mq.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setIsEligible(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Persist intent per tab so a reload mid-event stays in kiosk display
  // (fullscreen itself can't survive reload — it needs a fresh gesture).
  useEffect(() => {
    try {
      if (isKiosk) window.sessionStorage.setItem(KIOSK_STORAGE_KEY, "1");
      else window.sessionStorage.removeItem(KIOSK_STORAGE_KEY);
    } catch {
      // sessionStorage unavailable — nothing to persist.
    }
  }, [isKiosk]);

  // Esc (or any other fullscreen exit) also leaves kiosk display so staff
  // are never stranded with hidden navigation outside fullscreen.
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && isKioskRef.current) {
        setIsKiosk(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const enter = useCallback(() => {
    setIsKiosk(true);
    // Fullscreen is best-effort: the toggle is only rendered on
    // desktop-portrait screens, but the request itself can still be denied
    // (permissions, embedding policy). Kiosk display applies regardless.
    if (!isKioskEligible()) return;
    try {
      void document.documentElement
        .requestFullscreen()
        .catch(() => toast("Fullscreen was blocked — kiosk display still on."));
    } catch {
      toast("Fullscreen isn't available — kiosk display still on.");
    }
  }, []);

  const exit = useCallback(() => {
    setIsKiosk(false);
    if (document.fullscreenElement) {
      try {
        void document.exitFullscreen().catch(() => {
          // Already exiting — the fullscreenchange listener reconciles state.
        });
      } catch {
        // Already exiting — the fullscreenchange listener reconciles state.
      }
    }
  }, []);

  const toggle = useCallback(() => {
    if (isKiosk) exit();
    else enter();
  }, [isKiosk, enter, exit]);

  const value = useMemo<KioskContextValue>(
    () => ({
      isKiosk,
      isKioskEnforced: isKiosk && isEligible,
      enter,
      exit,
      toggle,
    }),
    [isKiosk, isEligible, enter, exit, toggle],
  );

  return (
    <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
  );
}
