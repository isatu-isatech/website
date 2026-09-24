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
import { MEMBERSHIP_SELECT_CLASS } from "../membership-select";
import { Checkbox } from "@/components/ui/checkbox";

export function AvailabilityStep({
  bands = [...MEMBERSHIP_FALLBACK.availability],
}: {
  bands?: string[];
}) {
  const form = useFormContext<MembershipFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Availability &amp; Commitment</h3>
      <div className="grid items-start gap-4 md:grid-cols-2">
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
                <select className={MEMBERSHIP_SELECT_CLASS} {...field}>
                  <option value="">Select commitment</option>
                  {bands.map((opt) => (
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
            // Dedicated row: the label is long and the control is short —
            // sharing a row would squeeze the select beside it.
            <FormItem className="flex flex-col gap-2 md:col-span-2">
              <FormLabel>
                Are you willing to attend general meetings, workshops, training,
                competitions and volunteer during events? *
              </FormLabel>
              <FormControl>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    name={field.name}
                    onBlur={field.onBlur}
                    className="border-primary/60 bg-card dark:bg-card size-5 border-2 [&_svg]:size-4"
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
                  className="bg-card"
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
