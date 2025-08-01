"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { sendContactEmail } from "./actions";
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

/**
 * ################################################################################
 * #################################### SCHEMA ####################################
 * ################################################################################
 */
// Define the schema for the contact form using zod
export const contactFormSchema = z.object({
  // Name must be a string between 2 and 50 characters
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  // Email must be a valid email address
  email: z.email("Invalid email address"),
  // Message must be a string between 10 and 1000 characters
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
});

/**
 * ################################################################################
 * ################################### COMPONENT ##################################
 * ################################################################################
 */
export default function ContactUsForm() {
  const [loading, startTransition] = useTransition();

  // Initialize the form using react-hook-form and zod for validation
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema), // Use zod schema for validation
    defaultValues: {
      name: "", // Default value for name field
      email: "", // Default value for email field
      message: "", // Default value for message field
    },
  });

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    startTransition(async () => {
      //form submission
      const res = await sendContactEmail(values);

      if (res.success) {
        // Simulate successful form submission
        contactForm.reset();
        toast("Form submitted successfully!");
      } else {
        toast("Failed to submit form. Try again later.");
      }
    });
  }

  return (
    <Form {...contactForm}>
      <form
        onSubmit={contactForm.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
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
        <div className="flex w-full items-center justify-end">
          <Button
            type="submit"
            size={"lg"}
            variant={"default"}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
