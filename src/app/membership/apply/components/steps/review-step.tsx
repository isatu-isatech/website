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
  const { getValues } = useFormContext<MembershipFormValues>();
  const v = getValues();

  const sections: {
    title: string;
    step: number;
    items: { label: string; value: string }[];
  }[] = [
    {
      title: "Personal Information",
      step: 1,
      items: [
        { label: "Full Name", value: v.fullName },
        { label: "Nickname", value: v.nickname || "—" },
        { label: "Student ID", value: v.studentId },
        { label: "Email", value: v.email },
        { label: "Mobile Number", value: v.mobileNumber },
        { label: "Birthdate", value: v.birthdate },
        { label: "Sex", value: v.sex },
        { label: "Facebook URL", value: v.facebookUrl || "—" },
      ],
    },
    {
      title: "Academic Information",
      step: 2,
      items: [
        { label: "College", value: v.college },
        { label: "Program", value: v.program },
        { label: "Year Level", value: v.yearLevel },
      ],
    },
    {
      title: "Role Preferences",
      step: 3,
      items: [
        { label: "Primary Role", value: v.primaryRole },
        { label: "Secondary Role", value: v.secondaryRole },
        { label: "Related Skills", value: v.relatedSkills || "—" },
        { label: "Related Experiences", value: v.relatedExperiences || "—" },
      ],
    },
    {
      title: "Availability & Commitment",
      step: 4,
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
      step: 5,
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
                <dt className="text-muted-foreground">{it.label}</dt>
                <dd className="text-right font-medium break-all">{it.value}</dd>
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
