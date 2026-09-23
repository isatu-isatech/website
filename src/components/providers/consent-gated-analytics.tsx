"use client";

import { useCookieConsent } from "./cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function ConsentGatedAnalytics() {
  const { acceptedCategories } = useCookieConsent();

  // Speed Insights is anonymous RUM (no cookies) — mount unconditionally so
  // pre-consent field data isn't lost. Vercel Analytics stays gated.
  return (
    <>
      {acceptedCategories.includes("analytics") && <Analytics />}
      <SpeedInsights />
    </>
  );
}
