"use server";

import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { contactFormSchema } from "./form";

// Initialize Resend with the API key from your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: unknown) {
  // Validate the incoming form data
  const parsed = contactFormSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data." };
  }

  const { name, email, message } = parsed.data;

  try {
    const { data, error } = await resend.emails.send({
      from: "ISATech Contact Form <onboarding@resend.dev>", // Must be a verified domain in Resend
      to: "qsxdrtgbnmjuy@protonmail.ch", // Your email here
      subject: `New message from ${name}`,
      react: EmailTemplate({ name, email, message }), // Pass data to your template
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: "Failed to send email." };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
