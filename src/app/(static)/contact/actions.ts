"use server";

import { createPage } from "@/lib/notion/helpers";
import { contactFormSchema } from "./schema";
import { env } from "@/lib/env";

// Initialize Resend with the API key from your .env file
const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
const contactFormDatabaseID = env.NOTION_CONTACT_FORM_DATABASE_ID;

export async function sendContactEmail(formData: unknown) {
  // Validate the incoming form data
  const parsed = await contactFormSchema.safeParseAsync(formData);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data." };
  }

  const { name, email, message, turnstileToken } = parsed.data;

  // Verify the Turnstile token
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: cloudflareTurnstileSecretKey,
          response: turnstileToken,
        }),
      },
    );

    const data = await response.json();
    if (!data.success) {
      return { success: false, error: "CAPTCHA verification failed." };
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Failed to verify CAPTCHA." };
  }

  try {
    const data = await createPage(contactFormDatabaseID, {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Email: {
        email: email,
      },
      Message: {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
