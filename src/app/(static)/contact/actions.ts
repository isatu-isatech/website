"use server";

import { createPage } from "@/lib/notion/helpers";
import { contactFormSchema } from "./schema";
import { env } from "@/lib/env";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";

// Initialize rate limiter: 5 requests per hour per IP
let ratelimit: Ratelimit | null = null;

try {
  ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
  });
} catch (error) {
  console.warn("Rate limiting disabled: Vercel KV not available", error);
}

// Initialize Resend with the API key from your .env file
const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
const contactFormDatabaseID = env.NOTION_CONTACT_FORM_DATABASE_ID;

export async function submitMessage(formData: unknown) {
  // Get client IP for rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "127.0.0.1";

  // Check rate limit (skip if KV not available)
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }
  }

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
    await createPage(contactFormDatabaseID, {
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

    return { success: true };
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// Utility function to check rate limit status (for debugging)
export async function getRateLimitStatus(
  ip?: string,
): Promise<{ remaining: number; reset: number } | null> {
  if (!ratelimit || !ip) return null;

  try {
    const { remaining, reset } = await ratelimit.limit(ip);
    return { remaining, reset };
  } catch (error) {
    console.warn("Could not check rate limit status:", error);
    return null;
  }
}
