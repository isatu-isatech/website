"use client";

import { useCookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function ConsentGatedAnalytics() {
  const { acceptedCategories } = useCookieConsent();

  if (!acceptedCategories.includes("analytics")) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
