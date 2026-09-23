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
import { MEMBERSHIP_SELECT_CLASS } from "../membership-select";

export function AcademicStep({
  colleges = [...MEMBERSHIP_FALLBACK.college],
  yearLevels = [...MEMBERSHIP_FALLBACK.yearLevel],
}: {
  colleges?: string[];
  yearLevels?: string[];
}) {
  const form = useFormContext<MembershipFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Academic Information</h3>
      <div className="grid items-start gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>College *</FormLabel>
              <FormControl>
                <select className={MEMBERSHIP_SELECT_CLASS} {...field}>
                  <option value="">Select college</option>
                  {colleges.map((opt) => (
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
          name="program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program *</FormLabel>
              <FormControl>
                <Input placeholder="BSIT" className="bg-card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Level *</FormLabel>
              <FormControl>
                <select className={MEMBERSHIP_SELECT_CLASS} {...field}>
                  <option value="">Select year</option>
                  {yearLevels.map((opt) => (
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
