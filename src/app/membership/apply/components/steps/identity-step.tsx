"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { MembershipFormValues } from "../../schema";
import { MEMBERSHIP_FALLBACK } from "@/lib/constants/membership";

const fallback = MEMBERSHIP_FALLBACK;

export function IdentityStep() {
  const form = useFormContext<MembershipFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Who are you?</h3>
      {/* Top-aligned cells: in two-column rows both fields start at the
          same line even when one grows an error or hint below. */}
      <div className="grid items-start gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Juan Dela Cruz"
                  className="bg-card"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Juan" className="bg-card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthdate *</FormLabel>
              <FormControl>
                <Input type="date" className="bg-card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Sex *</FormLabel>
              <FormControl>
                <select
                  className="border-input bg-card dark:bg-input/30 flex min-h-12 w-full rounded-md border px-3 py-1 text-base"
                  {...field}
                >
                  <option value="">Select</option>
                  {fallback.sex.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
