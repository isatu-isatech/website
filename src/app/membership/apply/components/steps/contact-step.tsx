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
import type { ReactNode } from "react";
import type { MembershipFormValues } from "../../schema";

const EMAIL_SUFFIX = "@students.isatu.edu.ph";
const FB_PREFIX = "https://facebook.com/";

// The form stores the COMPLETE value (affix included) so Zod and the
// Notion email/url properties validate unchanged — the adornments are
// display-only. Pasting a full address/URL still works.
function splitEmail(value: string): string {
  const i = value.toLowerCase().indexOf(EMAIL_SUFFIX);
  return i >= 0 ? value.slice(0, i) : value;
}

function composeEmail(raw: string): string {
  const clean = raw.replace(/\s+/g, "").toLowerCase();
  if (!clean) return "";
  return clean.includes("@") ? clean : `${clean}${EMAIL_SUFFIX}`;
}

function splitFacebook(value: string): string {
  const m = value
    .trim()
    .match(/^https?:\/\/(?:www\.|m\.)?(?:facebook\.com|fb\.com)\/(.*)$/i);
  return m ? (m[1] ?? "") : value;
}

function composeFacebook(raw: string): string {
  const clean = raw.trim().replace(/^\/+|\/+$/g, "");
  if (!clean) return "";
  if (/^(https?:\/\/)?([^/\s]*\.)?(facebook\.com|fb\.com)(\/|$)/i.test(clean)) {
    return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
  }
  return `${FB_PREFIX}${clean}`;
}

function Affix({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="border-input bg-muted text-muted-foreground inline-flex shrink-0 items-center border px-3 text-sm first:rounded-l-md first:border-r-0 last:rounded-r-md last:border-l-0"
    >
      {children}
    </span>
  );
}

export function ContactStep() {
  const form = useFormContext<MembershipFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">How do we reach you?</h3>
      {/* Top-aligned cells: in two-column rows both fields start at the
          same line even when one grows an error or hint below. */}
      <div className="grid items-start gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>School Email *</FormLabel>
              <FormControl>
                <div className="flex items-stretch">
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="juan.delacruz"
                    aria-label="School email username"
                    className="bg-card min-w-0 flex-1 rounded-r-none border-r-0"
                    value={splitEmail(field.value ?? "")}
                    onChange={(e) =>
                      field.onChange(composeEmail(e.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <Affix>{EMAIL_SUFFIX}</Affix>
                </div>
              </FormControl>
              <p className="text-muted-foreground text-xs">
                Your ISAT-U student email: firstname.lastname{EMAIL_SUFFIX}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="09123456789"
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
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID *</FormLabel>
              <FormControl>
                <Input
                  placeholder="2021-1234-A"
                  className="bg-card"
                  {...field}
                />
              </FormControl>
              <p className="text-muted-foreground text-xs">
                Format: year-number-section (e.g. 2021-1234-A)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookUrl"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Facebook Profile URL</FormLabel>
              <FormControl>
                <div className="flex items-stretch">
                  <Affix>{FB_PREFIX}</Affix>
                  <Input
                    type="text"
                    inputMode="url"
                    placeholder="juan.delacruz"
                    aria-label="Facebook profile username"
                    className="bg-card min-w-0 flex-1 rounded-l-none"
                    value={splitFacebook(field.value ?? "")}
                    onChange={(e) =>
                      field.onChange(composeFacebook(e.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
