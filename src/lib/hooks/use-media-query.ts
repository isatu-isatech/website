"use client";

import { useState, useEffect } from "react";
import { BREAKPOINTS } from "@/lib/constants/design-tokens";

type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Hook to detect if the viewport matches a breakpoint
 * @param breakpoint - The breakpoint to check against
 * @param direction - "up" (min-width) or "down" (max-width)
 * @returns boolean indicating if the viewport matches
 */
export function useBreakpoint(
  breakpoint: BreakpointKey,
  direction: "up" | "down" = "up",
): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const value = BREAKPOINTS[breakpoint];
    const query =
      direction === "up"
        ? `(min-width: ${value}px)`
        : `(max-width: ${value - 1}px)`;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint, direction]);

  return matches;
}

/**
 * Hook to check if we're on mobile
 */
export function useIsMobile(): boolean {
  return !useBreakpoint("md", "up");
}

/**
 * Hook to check if we're on desktop
 */
export function useIsDesktop(): boolean {
  return useBreakpoint("lg", "up");
}
