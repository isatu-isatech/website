"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { submitMessage } from "./actions";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TurnstileWidget from "@/components/turnstile-widget";
import { contactFormSchema } from "./schema";

/**
 * ################################################################################
 * #################################### SCHEMA ####################################
 * ################################################################################
 */

/**
 * ################################################################################
 * ################################### COMPONENT ##################################
 * ################################################################################
 */
export default function ContactUsForm() {
  const [loading, startTransition] = useTransition();
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);

  // Initialize the form using react-hook-form and zod for validation
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema), // Use zod schema for validation
    defaultValues: {
      name: "", // Default value for name field
      email: "", // Default value for email field
      message: "", // Default value for message field
      turnstileToken: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    startTransition(async () => {
      // Form submission
      const res = await submitMessage(values);

      try {
        // Reset react-hook-form values (including hidden turnstileToken)
        contactForm.reset();
        contactForm.clearErrors("turnstileToken"); // Clear any validation errors for the token field
        setToken(null); // Clear local token state
        setWidgetKey((k) => k + 1); // Remount the Turnstile widget by bumping the key so it resets
      } catch (err) {
        // In the unlikely case resetting throws, log it but continue
        console.error("Error resetting contact form:", err);
      }

      if (res.success) {
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message. Try again later.");
      }
    });
  }

  return (
    <Form {...contactForm}>
      <form
        onSubmit={contactForm.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={contactForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start">
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Juan Dela Cruz"
                    type="text"
                    className="border-primary"
                    autoComplete="name"
                    id="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={contactForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    className="border-primary"
                    autoComplete="email"
                    id="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FormField
            control={contactForm.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start">
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your Message"
                    className="border-primary field-sizing-fixed"
                    id="message"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col items-end justify-start">
          <TurnstileWidget
            key={widgetKey}
            onVerify={(t) => {
              setToken(t);
              contactForm.setValue("turnstileToken", t);
              contactForm.clearErrors("turnstileToken");
            }}
            onExpire={() => {
              setToken(null);
              contactForm.setValue("turnstileToken", "");
            }}
            onError={() => {
              toast.error("CAPTCHA failed to load. Please refresh the page.");
            }}
          />
        </div>
        <FormField
          control={contactForm.control}
          name="turnstileToken"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end">
          <Button
            type="submit"
            size={"lg"}
            variant={"default"}
            disabled={loading || !token}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
