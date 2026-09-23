"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Mount-gated reduced-motion flag.
 *
 * SSR + first client render always report `false` (animated tree), so
 * conditionally-rendered motion props never hydrate-mismatch when the OS
 * prefers reduced motion. After mount the real preference applies.
 */
export function useMountedReducedMotion(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (prefersReducedMotion ?? false) && mounted;
}
