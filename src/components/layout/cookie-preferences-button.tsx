"use client";

import * as CookieConsent from "vanilla-cookieconsent";

/**
 * Footer link that opens the cookie preferences modal directly,
 * instead of navigating to /privacy#manage-cookies.
 */
export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => {
        CookieConsent.showPreferences();
      }}
      className="decoration-secondary cursor-pointer bg-transparent p-0 text-left hover:underline hover:underline-offset-4"
    >
      <span className="text-label text-primary-foreground">
        Cookie Preferences
      </span>
    </button>
  );
}
