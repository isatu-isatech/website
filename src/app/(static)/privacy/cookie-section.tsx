"use client";

import { Button } from "@/components/ui/button";
import * as CookieConsent from "vanilla-cookieconsent";

export default function ManageCookiesSection() {
  return (
    <section
      className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm"
      id="manage-cookies"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">Manage Cookie Preferences</h3>
          <p className="text-muted-foreground text-sm">
            You can review and update your cookie settings at any time.
          </p>
        </div>
        <Button
          onClick={() => {
            CookieConsent.showPreferences();
          }}
        >
          Open Preferences
        </Button>
      </div>
    </section>
  );
}
