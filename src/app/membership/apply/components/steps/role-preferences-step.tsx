"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import type { MembershipFormValues } from "../../schema";
import { MEMBERSHIP_FALLBACK } from "@/lib/constants/membership";
import { TEAM_4H } from "@/lib/constants/site";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from "next/image";

const fallback = MEMBERSHIP_FALLBACK;

/** role → archetype icon path (same art as the quiz, from the site constants). */
const ROLE_ICONS = Object.fromEntries(
  TEAM_4H.map(({ role, imagePath }) => [role, imagePath]),
);

function RolePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Select a 4H role"
      className="grid grid-cols-2 gap-3"
    >
      {fallback.primaryRole.map((role) => {
        const selected = value === role;
        return (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(role)}
            className={cn(
              "border-border/60 bg-accent/40 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors",
              selected && "border-primary bg-primary/5 ring-primary/15 ring-2",
            )}
          >
            <Image
              src={ROLE_ICONS[role] ?? ""}
              alt={role}
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span
              className={cn("text-sm font-medium", selected && "text-primary")}
            >
              {role}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function RolePreferencesStep() {
  const form = useFormContext<MembershipFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Role Preferences</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="primaryRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary 4H Role *</FormLabel>
              <RolePicker value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondaryRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary 4H Role *</FormLabel>
              <RolePicker value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relatedSkills"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Related Skills</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Graphic design, public speaking"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relatedExperiences"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Related Experiences / Involvements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Previous orgs, projects"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
