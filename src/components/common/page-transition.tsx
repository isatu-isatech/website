"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";

const WIPE_EASE = [0.65, 0, 0.35, 1] as const;
const ENTRY_DURATION = 0.45;
const EXIT_DURATION = 0.5;
const SAFETY_TIMEOUT_MS = 15_000;

/**
 * Custom event name for programmatic page-transition requests
 * (see `requestPageTransition`).
 */
export const PAGE_TRANSITION_NAVIGATE_EVENT = "page-transition:navigate";

/**
 * Request the wipe sequence for a programmatic navigation.
 *
 * Programmatic navigations can't be intercepted as link clicks, so the quiz
 * leave-guard (which confirms a leave with `router.push`) dispatches this
 * event instead; `PageTransition` listens for it and runs the same
 * cover → navigate → reveal sequence a link click would get.
 */
export function requestPageTransition(href: string): void {
  window.dispatchEvent(
    new CustomEvent(PAGE_TRANSITION_NAVIGATE_EVENT, { detail: { href } }),
  );
}

/**
 * Global page transition — a three-phase wipe.
 *
 * Entry: when the user clicks an internal link, a brand panel skewed at 45°
 * sweeps across the viewport left → right, its slanted edge covering the
 * outgoing page. Load: once fully covered, the real navigation fires and the
 * curtain holds while the next page is fetched. Exit: when the next page is
 * ready, the panel continues rightward and its receding slanted edge reveals
 * the incoming page.
 *
 * The navigation is driven by intercepting left-clicks on same-origin anchors
 * (every client-side route change in this app is a link click; programmatic
 * navigations — the quiz leave-guard — request the same wipe via
 * `requestPageTransition`). Browser back/forward and server-side redirects
 * land without a click and swap instantly, by design. Reduced motion renders
 * pages statically with no curtain and no interception.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const x = useMotionValue<string>("-100%");
  const busyRef = useRef(false);
  const revealingRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const pathnameRef = useRef(pathname);

  const reveal = useCallback(async () => {
    if (revealingRef.current) return;
    revealingRef.current = true;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingRef.current = null;
    await animate(x, "100%", { duration: EXIT_DURATION, ease: WIPE_EASE });
    busyRef.current = false;
    revealingRef.current = false;
    x.set("-100%");
  }, [x]);

  const beginNavigation = useCallback(
    async (target: string) => {
      busyRef.current = true;
      pendingRef.current = target;
      await animate(x, "0%", { duration: ENTRY_DURATION, ease: WIPE_EASE });
      if (pendingRef.current === null) {
        busyRef.current = false;
        return;
      }
      router.push(target);
      timeoutRef.current = window.setTimeout(() => {
        if (busyRef.current) void reveal();
      }, SAFETY_TIMEOUT_MS);
    },
    [router, x, reveal],
  );

  // Intercept same-origin left-clicks to drive the wipe sequence. Runs in the
  // capture phase and stops propagation so next/link's own click handler never
  // fires (it navigates immediately at click time); we cover first, then push.
  useEffect(() => {
    if (reduceMotion) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const raw = anchor.getAttribute("href") || "";
      if (
        !raw ||
        raw.startsWith("#") ||
        /^(mailto:|tel:|javascript:)/i.test(raw)
      ) {
        return;
      }
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathnameRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      if (busyRef.current) return;
      void beginNavigation(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [reduceMotion, beginNavigation]);

  // Programmatic navigations (the quiz leave-guard confirms a leave by
  // dispatching the navigate event) get the same wipe sequence as a link
  // click. Reduced motion falls through to a plain push.
  useEffect(() => {
    const onNavigateRequest = (event: Event) => {
      const href = (event as CustomEvent<{ href?: string }>).detail?.href;
      if (!href || href === pathnameRef.current) return;
      if (reduceMotion) {
        router.push(href);
        return;
      }
      if (busyRef.current) return;
      void beginNavigation(href);
    };
    window.addEventListener(PAGE_TRANSITION_NAVIGATE_EVENT, onNavigateRequest);
    return () =>
      window.removeEventListener(
        PAGE_TRANSITION_NAVIGATE_EVENT,
        onNavigateRequest,
      );
  }, [reduceMotion, router, beginNavigation]);

  // Reveal when the pending navigation lands; back/forward and server
  // redirects (pathname changed while idle) swap instantly.
  useEffect(() => {
    if (pathname === pathnameRef.current) return;
    pathnameRef.current = pathname;
    if (busyRef.current) void reveal();
  }, [pathname, reveal]);

  // Clear any lingering timeout on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (reduceMotion) return <>{children}</>;

  return (
    <>
      {children}

      <motion.div
        aria-hidden
        className="bg-secondary pointer-events-none fixed top-0 bottom-0 left-[-100vh] z-100 origin-bottom-left"
        style={{
          x,
          skewX: "-45deg",
          width: "400vw",
        }}
        initial={false}
      />
    </>
  );
}
