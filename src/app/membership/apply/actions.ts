"use server";

import { createPageInDataSource } from "@/lib/notion/helpers";
import { membershipFormSchema } from "./schema";
import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { getMembershipOptions } from "@/lib/notion/membership-options";
import { getActiveCampaign } from "@/lib/notion/membership-campaigns";
import {
  appendMembershipSubmissionTimestamp,
  isMembershipRateLimited,
  MEMBERSHIP_RATE_LIMIT_COOKIE_NAME,
  MEMBERSHIP_RATE_LIMIT_WINDOW_MS,
  parseMembershipSubmissionTimes,
} from "@/lib/services/membership-rate-limit";

const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

/**
 * Notion property names for the Form Submissions DB.
 * Verified 2026-08-25 via MCP.
 */
const MEMBERSHIP_PROPERTIES = {
  studentId: "Student ID",
  fullName: "Full Name",
  nickname: "Nickname",
  email: "Email",
  mobileNumber: "Mobile Number",
  birthdate: "Birthdate",
  sex: "Sex",
  facebookUrl: "Facebook Profile URL",
  college: "College",
  program: "Program",
  yearLevel: "Year Level",
  primaryRole: "Primary Role Preference",
  secondaryRole: "Secondary Role Preference",
  relatedSkills: "Related Skills",
  relatedExperiences: "Related Experiences",
  availability: "Availability",
  eventWillingness: "Event-Attendance Willingness",
  otherOrgs: "Other Orgs Membership",
  campaign: "Campaign",
} as const;

function normalizeMobileToNumber(input: string): number | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

/**
 * Client-loadable campaign status. Lets the apply page render instantly
 * (no server round-trip to Notion on the critical path) and hydrate the
 * campaign afterwards with a loading indicator.
 */
export async function getActiveCampaignStatus() {
  try {
    const campaign = await getActiveCampaign();
    return { success: true as const, campaign };
  } catch (error) {
    console.error("[membership] getActiveCampaignStatus failed:", error);
    return { success: false as const, campaign: null };
  }
}

export async function submitMembershipApplication(formData: unknown) {
  // 1. Rate limit (browser-cookie, isolated)
  const cookieStore = await cookies();
  const submissionTimes = parseMembershipSubmissionTimes(
    cookieStore.get(MEMBERSHIP_RATE_LIMIT_COOKIE_NAME)?.value,
  );
  if (isMembershipRateLimited(submissionTimes)) {
    return {
      success: false,
      error:
        "You've submitted quite a few applications this hour — please try again in about an hour.",
    };
  }

  // 2. Zod validation (fallback enums)
  const parsed = membershipFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error:
        "A couple of details need another look — please double-check the form and resubmit.",
    };
  }

  const {
    fullName,
    nickname,
    studentId,
    email,
    mobileNumber,
    birthdate,
    sex,
    facebookUrl,
    college,
    program,
    yearLevel,
    primaryRole,
    secondaryRole,
    relatedSkills,
    relatedExperiences,
    availability,
    eventAttendanceWillingness,
    otherOrgs,
    turnstileToken,
  } = parsed.data;

  // 4. Turnstile verification
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
    const data = (await response.json()) as { success?: boolean };
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

  // 5. Campaign resolve — must have an active In progress campaign
  const activeCampaign = await getActiveCampaign();
  if (!activeCampaign) {
    return {
      success: false,
      error:
        "Applications are currently closed — please check back when the next campaign opens.",
    };
  }

  // Resolve per-campaign Form Submissions data source ID dynamically from the campaign page's
  // inline database block (varies per campaign). Fallback to env var for campaigns created without template (blank).
  const submissionsDataSourceId =
    activeCampaign.submissionsDataSourceId ??
    env.NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID ??
    env.NOTION_MEMBERSHIP_DATABASE_ID ??
    "";
  if (!submissionsDataSourceId) {
    console.error("[membership] No submissions data source ID available");
    return {
      success: false,
      error: "Applications are currently closed — please try again later.",
    };
  }

  // 5b. Live Notion option validation (source of truth) — against the active campaign's submissions DB
  try {
    const live = await getMembershipOptions(submissionsDataSourceId);
    const checks: Array<[string, string, readonly string[]]> = [
      ["College", parsed.data.college, live.college],
      ["Year Level", parsed.data.yearLevel, live.yearLevel],
      ["Sex", parsed.data.sex, live.sex],
      ["Primary Role", parsed.data.primaryRole, live.primaryRole],
      ["Secondary Role", parsed.data.secondaryRole, live.secondaryRole],
    ];
    for (const [label, value, allowed] of checks) {
      if (!allowed.includes(value)) {
        return {
          success: false,
          error: `${label} "${value}" is no longer available — please refresh the page and pick from the current options.`,
        };
      }
    }
  } catch (error) {
    console.error("[membership] live option validation failed:", error);
    // Fail open: if Notion is unreachable, proceed with fallback validation already done.
  }

  // 6. Notion write
  const mobileNum = normalizeMobileToNumber(mobileNumber);
  if (mobileNum === null) {
    return {
      success: false,
      error: "Mobile Number looks invalid — please check it.",
    };
  }

  // Build properties per verified schema types
  const properties: Record<string, unknown> = {
    [MEMBERSHIP_PROPERTIES.studentId]: {
      title: [{ text: { content: studentId } }],
    },
    [MEMBERSHIP_PROPERTIES.fullName]: {
      rich_text: [{ text: { content: fullName } }],
    },
    [MEMBERSHIP_PROPERTIES.email]: {
      email: email,
    },
    [MEMBERSHIP_PROPERTIES.mobileNumber]: {
      number: mobileNum,
    },
    [MEMBERSHIP_PROPERTIES.birthdate]: {
      date: { start: new Date(birthdate).toISOString().split("T")[0] },
    },
    [MEMBERSHIP_PROPERTIES.sex]: {
      select: { name: sex },
    },
    [MEMBERSHIP_PROPERTIES.college]: {
      select: { name: college },
    },
    [MEMBERSHIP_PROPERTIES.program]: {
      rich_text: [{ text: { content: program } }],
    },
    [MEMBERSHIP_PROPERTIES.yearLevel]: {
      select: { name: yearLevel },
    },
    [MEMBERSHIP_PROPERTIES.primaryRole]: {
      select: { name: primaryRole },
    },
    [MEMBERSHIP_PROPERTIES.secondaryRole]: {
      select: { name: secondaryRole },
    },
    [MEMBERSHIP_PROPERTIES.availability]: {
      rich_text: [{ text: { content: availability } }],
    },
    [MEMBERSHIP_PROPERTIES.eventWillingness]: {
      checkbox: eventAttendanceWillingness,
    },
    // Relation to active campaign
    [MEMBERSHIP_PROPERTIES.campaign]: {
      relation: [{ id: activeCampaign.id }],
    },
  };

  // Optional text fields — omit if empty
  if (nickname && nickname.trim() !== "") {
    (properties as Record<string, unknown>)[MEMBERSHIP_PROPERTIES.nickname] = {
      rich_text: [{ text: { content: nickname } }],
    };
  }
  if (facebookUrl && facebookUrl.trim() !== "") {
    (properties as Record<string, unknown>)[MEMBERSHIP_PROPERTIES.facebookUrl] =
      {
        url: facebookUrl,
      };
  }
  if (relatedSkills && relatedSkills.trim() !== "") {
    (properties as Record<string, unknown>)[
      MEMBERSHIP_PROPERTIES.relatedSkills
    ] = {
      rich_text: [{ text: { content: relatedSkills } }],
    };
  }
  if (relatedExperiences && relatedExperiences.trim() !== "") {
    (properties as Record<string, unknown>)[
      MEMBERSHIP_PROPERTIES.relatedExperiences
    ] = {
      rich_text: [{ text: { content: relatedExperiences } }],
    };
  }
  if (otherOrgs && otherOrgs.trim() !== "") {
    (properties as Record<string, unknown>)[MEMBERSHIP_PROPERTIES.otherOrgs] = {
      rich_text: [{ text: { content: otherOrgs } }],
    };
  }

  try {
    // Submissions DBs are data sources (collection://…), so the page must be
    // created under `parent: { data_source_id }` — not a database_id parent.
    await createPageInDataSource(
      submissionsDataSourceId,
      properties as Parameters<typeof createPageInDataSource>[1],
    );

    // Record successful submission in the rate-limit cookie
    cookieStore.set(
      MEMBERSHIP_RATE_LIMIT_COOKIE_NAME,
      JSON.stringify(appendMembershipSubmissionTimestamp(submissionTimes)),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: Math.ceil((2 * MEMBERSHIP_RATE_LIMIT_WINDOW_MS) / 1000),
        secure: process.env.NODE_ENV === "production",
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Membership submission Notion write failed:", error);
    return {
      success: false,
      error: "Something went wrong on our end. Please try again in a moment.",
    };
  }
}
