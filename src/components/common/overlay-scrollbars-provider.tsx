"use client";

import { useEffect } from "react";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";

/**
 * Replaces the native page scrollbar with OverlayScrollbars initialized on
 * <body>, themed via the `os-theme-isatech` CSS class (defined in
 * globals.css) so it mirrors the site's native scrollbar styling.
 *
 * - The scrollbar stays visible but subtle at rest and is emphasized on
 *   hover, on drag, and while the user is actively scrolling (via the
 *   `.is-scrolling` class toggled by ScrollActivityIndicator).
 * - Vertical scrolling is the only scroll axis: `overflow.x` is pinned to
 *   "hidden" (the horizontal scrollbar stays unusable and any horizontal
 *   overflow is clipped), while `overflow.y` stays synced with content.
 * - `prefers-reduced-motion` is honored via the globals.css media query that
 *   disables the handle's color transition (OverlayScrollbars v2.16 dropped
 *   its JS `reducedMotion` option; with visibility "visible" there are no
 *   auto-hide animations to suppress anyway).
 * - The native ::-webkit-scrollbar / scrollbar-color rules remain as the
 *   no-JS fallback and for inner scroll containers.
 */
export function OverlayScrollbarsProvider() {
  useEffect(() => {
    const instance = OverlayScrollbars(document.body, {
      // Vertical-only scrolling: x is permanently hidden (any horizontal
      // overflow is clipped, the horizontal scrollbar stays unusable), y
      // remains synced with content so the page scrolls normally.
      overflow: { x: "hidden", y: "scroll" },
      scrollbars: {
        theme: "os-theme-isatech",
        visibility: "visible",
        autoHide: "never",
        dragScroll: true,
        clickScroll: false,
      },
    });

    return () => {
      instance.destroy();
    };
  }, []);

  return null;
}
