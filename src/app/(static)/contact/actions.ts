"use server";

import { createPage } from "@/lib/notion/helpers";
import { contactFormSchema } from "./schema";
import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { contactRateLimit } from "@/lib/services/cookie-rate-limit";
import {
  verifyTurnstile,
  turnstileErrorMessage,
} from "@/lib/services/turnstile";

/**
 * Contact-form database property names (the Notion schema keys). The
 * property VALUES are built from validated form data below; only the keys
 * are pinned here so a Notion schema rename is a single, findable change
 * instead of three scattered string literals.
 */
const CONTACT_PROPERTIES = {
  name: "Name",
  email: "Email",
  message: "Message",
} as const;

export async function submitMessage(formData: unknown) {
  // Read env lazily inside the request so a missing contact DB ID fails
  // only this action (not every route importing this module at build).
  const contactFormDatabaseID = env.NOTION_CONTACT_FORM_DATABASE_ID;
  // Browser-cookie rate limiting: the visitor's browser holds the record of
  // recent successful submissions (spec 002 / constitution P5). Browsers
  // without a readable record are treated as first-time submitters; only
  // successful submissions are recorded, so failed attempts never count.
  const cookieStore = await cookies();
  const submissionTimes = contactRateLimit.parseSubmissionTimes(
    cookieStore.get(contactRateLimit.cookieName)?.value,
  );

  if (contactRateLimit.isRateLimited(submissionTimes)) {
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
      // Additive field detail for API callers; the RHF UI already shows
      // per-field messages inline.
      issues: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, message, turnstileToken } = parsed.data;

  // Verify the Turnstile token (shared verifier with timeout).
  const turnstile = await verifyTurnstile(turnstileToken);
  if (!turnstile.ok) {
    return { success: false, error: turnstileErrorMessage(turnstile) };
  }

  try {
    await createPage(contactFormDatabaseID, {
      [CONTACT_PROPERTIES.name]: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      [CONTACT_PROPERTIES.email]: {
        email: email,
      },
      [CONTACT_PROPERTIES.message]: {
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
      contactRateLimit.cookieName,
      JSON.stringify(
        contactRateLimit.appendSubmissionTimestamp(submissionTimes),
      ),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // Keep the cookie past the window so recent activity survives idle
        // periods; stale entries are pruned on read.
        maxAge: Math.ceil((2 * contactRateLimit.windowMs) / 1000),
        secure: process.env.NODE_ENV === "production",
      },
    );

    return { success: true };
  } catch (error) {
    console.error("[contact] submission Notion write failed:", error);
    return {
      success: false,
      error: "Something went wrong on our end. Please try again in a moment.",
    };
  }
}
