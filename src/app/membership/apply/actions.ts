"use server";

import { createPageInDataSource } from "@/lib/notion/helpers";
import { membershipFormSchema } from "./schema";
import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { getMembershipOptions } from "@/lib/notion/membership-options";
import { getActiveCampaign } from "@/lib/notion/membership-campaigns";
import { membershipRateLimit } from "@/lib/services/cookie-rate-limit";
import { verifyTurnstile } from "@/lib/services/turnstile";

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

export async function submitMembershipApplication(formData: unknown) {
  // 1. Rate limit (browser-cookie, isolated)
  const cookieStore = await cookies();
  const submissionTimes = membershipRateLimit.parseSubmissionTimes(
    cookieStore.get(membershipRateLimit.cookieName)?.value,
  );
  if (membershipRateLimit.isRateLimited(submissionTimes)) {
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

  // 3. Campaign resolve — must have an active In progress campaign.
  // Checked BEFORE Turnstile so closed-campaign visitors never burn a
  // single-use challenge token on a submission that cannot succeed.
  // A throw means our records are unreachable (outage/misconfig) — report
  // that distinctly instead of claiming applications are closed.
  let activeCampaign: Awaited<ReturnType<typeof getActiveCampaign>>;
  try {
    activeCampaign = await getActiveCampaign();
  } catch (error) {
    console.error("[membership] campaign resolve failed:", error);
    return {
      success: false,
      error:
        "We couldn't reach our records just now — your answers are safe, please retry in a moment.",
    };
  }
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

  // 4. Turnstile verification (shared verifier; bounded wait so Cloudflare
  // stalls never hang to the Vercel limit).
  const turnstile = await verifyTurnstile(turnstileToken);
  if (!turnstile.ok) {
    if (turnstile.reason === "failed") {
      return {
        success: false,
        error: "The security check didn't go through — please try once more.",
      };
    }
    return {
      success: false,
      error:
        "We couldn't reach the security check just now. Please retry in a moment.",
    };
  }

  // 5. Live Notion option validation (source of truth) — against the active campaign's submissions DB
  try {
    const live = await getMembershipOptions(submissionsDataSourceId);
    const checks: Array<[string, string, readonly string[]]> = [
      ["College", parsed.data.college, live.college],
      ["Year Level", parsed.data.yearLevel, live.yearLevel],
      ["Sex", parsed.data.sex, live.sex],
      ["Primary Role", parsed.data.primaryRole, live.primaryRole],
      ["Secondary Role", parsed.data.secondaryRole, live.secondaryRole],
      ["Availability", parsed.data.availability, live.availability],
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
  // Build properties per verified schema types.
  // NOTE: `Mobile Number` must be a text/phone column in Notion (officer
  // action) — the old number column dropped leading zeros and `+63`.
  // Free text arrives trimmed (and email lowercased) from the schema, so the
  // action consumes parsed values directly with no second normalization pass.
  // Birthdate stays intentionally split: the schema is lenient at entry
  // (`Date.parse` + future check) while the write requires strict ISO
  // (Notion `date` needs YYYY-MM-DD).
  const nicknameValue = nickname ?? "";
  const facebookUrlValue = facebookUrl ?? "";
  const relatedSkillsValue = relatedSkills ?? "";
  const relatedExperiencesValue = relatedExperiences ?? "";
  const otherOrgsValue = otherOrgs ?? "";
  const birthdateMatch = /^\d{4}-\d{2}-\d{2}$/.exec(birthdate);
  if (!birthdateMatch) {
    return {
      success: false,
      error: "Invalid birthdate — please use the YYYY-MM-DD format.",
    };
  }
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
      rich_text: [{ text: { content: mobileNumber } }],
    },
    [MEMBERSHIP_PROPERTIES.birthdate]: {
      date: { start: birthdateMatch[0] },
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

  // Optional text fields — omit if empty (schema-trimmed values)
  if (nicknameValue !== "") {
    (properties as Record<string, unknown>)[MEMBERSHIP_PROPERTIES.nickname] = {
      rich_text: [{ text: { content: nicknameValue } }],
    };
  }
  if (facebookUrlValue !== "") {
    (properties as Record<string, unknown>)[MEMBERSHIP_PROPERTIES.facebookUrl] =
      {
        url: facebookUrlValue,
      };
  }
  if (relatedSkillsValue !== "") {
    (properties as Record<string, unknown>)[
      MEMBERSHIP_PROPERTIES.relatedSkills
    ] = {
      rich_text: [{ text: { content: relatedSkillsValue } }],
    };
  }
  if (relatedExperiencesValue !== "") {
    (properties as Record<string, unknown>)[
      MEMBERSHIP_PROPERTIES.relatedExperiences
    ] = {
      rich_text: [{ text: { content: relatedExperiencesValue } }],
    };
  }
  if (otherOrgsValue !== "") {
    (properties as Record<string, unknown>)[MEMBERSHIP_PROPERTIES.otherOrgs] = {
      rich_text: [{ text: { content: otherOrgsValue } }],
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
      membershipRateLimit.cookieName,
      JSON.stringify(
        membershipRateLimit.appendSubmissionTimestamp(submissionTimes),
      ),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: Math.ceil((2 * membershipRateLimit.windowMs) / 1000),
        secure: process.env.NODE_ENV === "production",
      },
    );

    return { success: true };
  } catch (error) {
    console.error("[membership] submission Notion write failed:", error);
    const msg = (error as { message?: string })?.message ?? "";
    // Officer action: `Mobile Number` must be a text/phone column. A stale
    // number column rejects `+63` / leading zeros with a validation error.
    if (
      /mobile\s?number/i.test(msg) ||
      /number.*format|invalid.*number/i.test(msg)
    ) {
      return {
        success: false,
        error:
          "We couldn't save your mobile number — please check the format and try again. If this persists, contact us at isatech@isatu.edu.ph.",
      };
    }
    return {
      success: false,
      error: "Something went wrong on our end. Please try again in a moment.",
    };
  }
}
