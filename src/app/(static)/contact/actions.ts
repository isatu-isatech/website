"use server";

import { createPage } from "@/lib/notion/helpers";
import { contactFormSchema } from "./schema";
import { env } from "@/lib/env";
import { cookies } from "next/headers";
import {
  appendSubmissionTimestamp,
  isRateLimited,
  parseSubmissionTimes,
  RATE_LIMIT_COOKIE_NAME,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/services/cookie-rate-limit";

const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
const contactFormDatabaseID = env.NOTION_CONTACT_FORM_DATABASE_ID;

export async function submitMessage(formData: unknown) {
  // Browser-cookie rate limiting: the visitor's browser holds the record of
  // recent successful submissions (spec 002 / constitution P5). Browsers
  // without a readable record are treated as first-time submitters; only
  // successful submissions are recorded, so failed attempts never count.
  const cookieStore = await cookies();
  const submissionTimes = parseSubmissionTimes(
    cookieStore.get(RATE_LIMIT_COOKIE_NAME)?.value,
  );

  if (isRateLimited(submissionTimes)) {
    return {
      success: false,
      error:
        "You've sent quite a few messages this hour — please try again in about an hour. We read every single message.",
    };
  }

  // Validate the incoming form data
  const parsed = contactFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error:
        "A couple of details need another look — please double-check the form and resubmit.",
    };
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
      return {
        success: false,
        error: "The security check didn't go through — please try once more.",
      };
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return {
      success: false,
      error:
        "We couldn't reach the security check just now. Please retry in a moment.",
    };
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

    // Record the successful submission in the browser-held record so later
    // submissions within the rolling window count against the limit.
    cookieStore.set(
      RATE_LIMIT_COOKIE_NAME,
      JSON.stringify(appendSubmissionTimestamp(submissionTimes)),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // Keep the cookie past the window so recent activity survives idle
        // periods; stale entries are pruned on read.
        maxAge: Math.ceil((2 * RATE_LIMIT_WINDOW_MS) / 1000),
        secure: process.env.NODE_ENV === "production",
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Something went wrong:", error);
    return {
      success: false,
      error: "Something went wrong on our end. Please try again in a moment.",
    };
  }
}
