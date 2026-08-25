"use client";

import { usePathname } from "next/navigation";

/**
 * Compensates for the fixed (overlaying) header on pages that don't feature the
 * full-viewport hero. The homepage hero is intentionally full-bleed under the
 * header; every other static page gets an in-flow spacer so its content is not
 * hidden beneath the fixed bar.
 *
 * Keep this in sync with the header's solid-state height (logo h-10 + py-2 =
 * 56px = h-14); a mismatch shows as a gap under the bar.
 */
export function HeaderOffset() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <div aria-hidden="true" className="h-14 w-full" />;
}
