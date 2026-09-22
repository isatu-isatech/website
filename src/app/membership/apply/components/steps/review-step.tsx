"use client";

import { useFormContext } from "react-hook-form";
import type { MembershipFormValues } from "../../schema";
import { Button } from "@/components/ui/button";
import { FormField, FormMessage } from "@/components/ui/form";
import TurnstileWidget from "@/components/ui/turnstile-widget";

export function ReviewStep({
  onEdit,
  onVerify,
  tokenEpoch,
  onRetryVerification,
}: {
  onEdit: (step: number) => void;
  onVerify: (token: string) => void;
  tokenEpoch: number;
  onRetryVerification: () => void;
}) {
  const form = useFormContext<MembershipFormValues>();
  // Subscribed (not a one-shot snapshot) so Edit → back always renders the
  // current values even if this step ever stops remounting.
  const v = form.watch();

  const sections: {
    title: string;
    step: number;
    items: { label: string; value: string }[];
  }[] = [
    {
      title: "Identity",
      step: 1,
      items: [
        { label: "Full Name", value: v.fullName },
        { label: "Nickname", value: v.nickname || "—" },
        { label: "Birthdate", value: v.birthdate },
        { label: "Sex", value: v.sex },
      ],
    },
    {
      title: "Contact",
      step: 2,
      items: [
        { label: "Email", value: v.email },
        { label: "Mobile Number", value: v.mobileNumber },
        { label: "Student ID", value: v.studentId },
        { label: "Facebook URL", value: v.facebookUrl || "—" },
      ],
    },
    {
      title: "Academic Information",
      step: 3,
      items: [
        { label: "College", value: v.college },
        { label: "Program", value: v.program },
        { label: "Year Level", value: v.yearLevel },
      ],
    },
    {
      title: "Role Preferences",
      step: 4,
      items: [
        { label: "Primary Role", value: v.primaryRole },
        { label: "Secondary Role", value: v.secondaryRole },
        { label: "Related Skills", value: v.relatedSkills || "—" },
        { label: "Related Experiences", value: v.relatedExperiences || "—" },
      ],
    },
    {
      title: "Availability & Commitment",
      step: 5,
      items: [
        { label: "Availability (hrs/week)", value: v.availability },
        {
          label: "Event Attendance",
          value: v.eventAttendanceWillingness ? "Yes" : "No",
        },
        { label: "Other Orgs", value: v.otherOrgs || "—" },
      ],
    },
    {
      title: "Consent",
      step: 6,
      items: [
        { label: "Privacy Consent", value: v.privacyConsent ? "Yes" : "No" },
        { label: "Declaration", value: v.declarationConsent ? "Yes" : "No" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-semibold">Review Your Application</h3>
      <p className="text-muted-foreground text-sm">
        Please review everything carefully. You can edit any section before
        submitting.
      </p>
      {/* One-glance summary so reviewers don't cross-compare every card. */}
      <p className="text-sm" aria-label="Application summary">
        <span className="font-semibold">{v.fullName || "—"}</span>
        {v.program ? ` · ${v.program}` : ""}
        {v.yearLevel ? ` ${v.yearLevel}` : ""}
        {v.primaryRole
          ? ` · ${v.primaryRole}${v.secondaryRole ? `/${v.secondaryRole}` : ""}`
          : ""}
        {v.availability ? ` · ${v.availability} hrs/wk` : ""}
      </p>
      {sections.map((sec) => (
        <div
          key={sec.title}
          className="bg-accent/30 border-border/60 rounded-xl border p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium">{sec.title}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(sec.step)}
            >
              Edit
            </Button>
          </div>
          <dl className="grid gap-1 text-sm">
            {sec.items.map((it) => (
              <div key={it.label} className="flex justify-between gap-4">
                {/* min-w-0 lets long unbroken values (emails, URLs) wrap
                    inside the flex row instead of forcing x-scroll. */}
                <dt className="text-muted-foreground shrink-0">{it.label}</dt>
                <dd className="min-w-0 text-right font-medium break-words">
                  {it.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      <div className="bg-accent/30 border-border/60 rounded-xl border p-4">
        <p className="text-sm font-medium">Verification *</p>
        <p className="text-muted-foreground text-xs">
          Complete the verification right before submitting — the token expires
          after a few minutes.
        </p>
        <TurnstileWidget
          key={tokenEpoch}
          onVerify={onVerify}
          onExpire={() => {
            form.setValue("turnstileToken", "");
            onRetryVerification();
          }}
          onError={() => {
            form.setValue("turnstileToken", "");
            onRetryVerification();
          }}
        />
        <FormField
          control={form.control}
          name="turnstileToken"
          render={() => <FormMessage />}
        />
      </div>
    </div>
  );
}
