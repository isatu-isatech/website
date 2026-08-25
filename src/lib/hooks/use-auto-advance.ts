"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Runs `onTick` on a fixed interval while `enabled`.
 *
 * - Always calls the latest `onTick` (via a ref), so callers can close over
 *   changing state without re-creating the effect.
 * - Respects `prefers-reduced-motion`: the interval is skipped when the OS
 *   requests reduced motion (auto-advance is a motion-based behavior).
 *
 * Replaces the previously copy-pasted `setInterval` effects in the member
 * benefits band and the advisers carousel.
 */
export function useAutoAdvance(
  intervalMs: number,
  onTick: () => void,
  enabled = true,
) {
  const onTickRef = useRef(onTick);
  const reduceMotion = useReducedMotion();

  // Keep the ref pointing at the latest callback without restarting the
  // interval. Written in an effect (not during render) per react-hooks/refs.
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!enabled || reduceMotion) return;
    const id = window.setInterval(() => onTickRef.current(), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, enabled, reduceMotion]);
}
