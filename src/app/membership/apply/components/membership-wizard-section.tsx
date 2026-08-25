"use client";

import { useCallback, useEffect, useState } from "react";
import { MembershipWizard } from "./membership-wizard";
import { getActiveCampaignStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

type Campaign = {
  id: string;
  academicYear: string;
  status: string;
} | null;

type FetchStatus = "loading" | "ready" | "error";

export function MembershipWizardSection() {
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [campaign, setCampaign] = useState<Campaign>(null);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await getActiveCampaignStatus();
      if (res.success) {
        setCampaign(res.campaign);
        setStatus("ready");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-4 py-16 text-center">
        <Loader2 className="text-primary size-6 animate-spin" aria-hidden />
        <p className="text-muted-foreground text-sm">
          Checking application status…
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-accent/30 border-border/60 mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border p-8 text-center">
        <AlertTriangle className="text-destructive size-6" aria-hidden />
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t check whether applications are open right now.
        </p>
        <Button type="button" variant="outline" onClick={load}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <section
      id="apply"
      className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 md:gap-6 md:py-10"
    >
      {/* Hide the page title/subtitle once submitted and in the closed state —
          neither is a place to start an application. */}
      {campaign && !submitted && (
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-secondary-dark dark:text-secondary text-2xl font-bold md:text-3xl">
            Membership Application
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm">
            Complete the steps below. Your progress is saved while this tab
            stays open.
          </p>
        </div>
      )}

      <MembershipWizard
        activeCampaign={campaign}
        onSubmittedChange={setSubmitted}
      />
    </section>
  );
}
