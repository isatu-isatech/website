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
import { Checkbox } from "@/components/ui/checkbox";

export function ConsentStep() {
  const form = useFormContext<MembershipFormValues>();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Consent &amp; Declaration</h3>
      <FormField
        control={form.control}
        name="privacyConsent"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-start gap-2">
              <FormControl>
                <Checkbox
                  id="privacyConsent"
                  name={field.name}
                  checked={field.value === true}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  onBlur={field.onBlur}
                  className="border-primary/60 bg-card dark:bg-card mt-0.5 size-5 border-2 [&_svg]:size-4"
                />
              </FormControl>
              <FormLabel htmlFor="privacyConsent" className="font-normal">
                I consent to the collection and processing of my personal data
                by ISATech Society in accordance with the Data Privacy Act of
                2012 (Republic Act No. 10173). The information collected on this
                form will be used for membership registration. We are committed
                to protecting your privacy and ensuring the security of your
                data. You have the right to access, correct, or request the
                deletion of your personal data. *
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="declarationConsent"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-start gap-2">
              <FormControl>
                <Checkbox
                  id="declarationConsent"
                  name={field.name}
                  checked={field.value === true}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  onBlur={field.onBlur}
                  className="border-primary/60 bg-card dark:bg-card mt-0.5 size-5 border-2 [&_svg]:size-4"
                />
              </FormControl>
              <FormLabel htmlFor="declarationConsent" className="font-normal">
                I confirm that all information I have provided is true and
                accurate. I also commit to upholding the values and objectives
                of the ISATech Society. *
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
