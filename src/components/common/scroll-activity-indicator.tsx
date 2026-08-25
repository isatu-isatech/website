"use client";

import { useEffect } from "react";

const SCROLLING_CLASS = "is-scrolling";
const IDLE_DELAY_MS = 250;

/**
 * ScrollActivityIndicator
 *
 * Toggles a temporary `is-scrolling` class on the root <html> element while
 * the user is actively scrolling (wheel/touch/drag), then removes it shortly
 * after scrolling stops. The class drives the scrollbar emphasis in
 * globals.css — the thumb reads as subtle when idle and gains presence the
 * moment the page starts moving, then fades back.
 */
export function ScrollActivityIndicator() {
  useEffect(() => {
    const root = document.documentElement;
    let idleTimer: number | undefined;
    let startTimer: number | undefined;

    const onScroll = () => {
      root.classList.add(SCROLLING_CLASS);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        root.classList.remove(SCROLLING_CLASS);
      }, IDLE_DELAY_MS);
    };

    // Let the initial layout/paint settle before attaching the listener so
    // programmatic scroll restoration doesn't flash the emphasis state.
    startTimer = window.setTimeout(() => {
      window.addEventListener("scroll", onScroll, { passive: true });
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
      root.classList.remove(SCROLLING_CLASS);
    };
  }, []);

  return null;
}
