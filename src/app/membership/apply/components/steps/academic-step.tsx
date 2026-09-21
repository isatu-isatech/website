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

export function AcademicStep() {
  const form = useFormContext<MembershipFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Academic Information</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>College *</FormLabel>
              <FormControl>
                <select
                  className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                  {...field}
                >
                  <option value="">Select college</option>
                  {fallback.college.map((opt) => (
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
                <Input placeholder="BSIT" {...field} />
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
                <select
                  className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                  {...field}
                >
                  <option value="">Select year</option>
                  {fallback.yearLevel.map((opt) => (
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
