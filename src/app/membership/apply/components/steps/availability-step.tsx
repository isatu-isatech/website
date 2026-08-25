"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import type { MembershipFormValues } from "../../schema";
import { MEMBERSHIP_FALLBACK } from "@/lib/constants/membership";

export function AvailabilityStep() {
  const form = useFormContext<MembershipFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Availability &amp; Commitment</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How many hours per week can you commit to ISATech activities and
                training? *
              </FormLabel>
              <FormControl>
                <select
                  className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                  {...field}
                >
                  <option value="">Select commitment</option>
                  {MEMBERSHIP_FALLBACK.availability.map((opt) => (
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
        <FormField
          control={form.control}
          name="eventAttendanceWillingness"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>
                Are you willing to attend general meetings, workshops, training,
                competitions and volunteer during events? *
              </FormLabel>
              <FormControl>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border"
                  />
                  <span className="text-sm">Yes, I am willing</span>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otherOrgs"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>
                Are you a member of other organizations? If yes, please specify.
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Student council, coding club"
                  {...field}
                  rows={2}
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
