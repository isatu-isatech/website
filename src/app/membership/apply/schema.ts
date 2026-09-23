import { z } from "zod";

/**
 * Option fields accept any non-empty string at the Zod layer so newly added
 * Notion options are never rejected by a stale static enum. Membership in
 * the live option set is enforced server-side in `actions.ts` against
 * `getMembershipOptions(submissionsDataSourceId)` (the source of truth),
 * and the UI renders the live lists it receives from the server (falling
 * back to `MEMBERSHIP_FALLBACK` only when Notion is unreachable).
 */
function optionField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(200, `${label} must be at most 200 characters`);
}

/** True only for real calendar dates (rejects overflow like 2024-02-30). */
export function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

function optionalText(max: number, label: string) {
  return z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .optional()
    .or(z.literal(""));
}

// ISAT-U student email — strict: dotted alphanumeric local part
// (at least one dot, no leading/trailing/consecutive dots) plus the
// `@students.isatu.edu.ph` domain. Trimmed and lowercased by the schema
// before validation, so the stored value is already normalized.
export const STUDENT_EMAIL_REGEX =
  /^[a-z0-9]+(\.[a-z0-9]+)+@students\.isatu\.edu\.ph$/i;
export const STUDENT_EMAIL_MESSAGE =
  "Use your ISAT-U student email (firstname.lastname@students.isatu.edu.ph)";

/**
 * Optional Facebook Profile URL — empty is fine, otherwise must be an
 * http(s) link on a Facebook host (`facebook.com` + common subdomains,
 * or `fb.com` short links).
 */
export function isFacebookProfileUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  return (
    host === "facebook.com" ||
    host.endsWith(".facebook.com") ||
    host === "fb.com" ||
    host.endsWith(".fb.com")
  );
}

export const membershipFormSchema = z
  .object({
    // Personal Information
    fullName: z
      .string()
      .trim()
      .min(2, "Full Name must be at least 2 characters")
      .max(100, "Full Name must be at most 100 characters"),
    nickname: optionalText(50, "Nickname"),
    studentId: z
      .string()
      .trim()
      .regex(
        /^\d{4}-\d{4}-[A-Z]$/,
        "Student ID must follow the format XXXX-XXXX-X",
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Invalid email address"))
      .refine((v) => STUDENT_EMAIL_REGEX.test(v), STUDENT_EMAIL_MESSAGE),
    // Notion `Mobile Number` is a text/phone column. Accept digits, +, spaces, dashes, parentheses; stored verbatim.
    mobileNumber: z
      .string()
      .trim()
      .min(7, "Mobile Number must be at least 7 characters")
      .max(20, "Mobile Number must be at most 20 characters")
      .regex(
        /^[\d+\-\s()]+$/,
        "Mobile Number may only contain digits, +, -, spaces, or parentheses",
      ),
    birthdate: z
      .string()
      .trim()
      .min(1, "Birthdate is required")
      // Strict ISO first so non-`type=date` values fail here — before the
      // single-use Turnstile token is spent in the action. The calendar
      // check rejects overflow dates (e.g. 2024-02-30) that `Date.parse`
      // silently rolls over to March.
      .refine(
        (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && isValidCalendarDate(v),
        "Invalid birthdate — please enter a real date in YYYY-MM-DD format",
      )
      .refine((v) => {
        const d = new Date(`${v}T00:00:00`);
        const now = new Date();
        // Compare as date only (ignore time)
        d.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        return d.getTime() <= now.getTime();
      }, "Birthdate cannot be in the future"),
    sex: optionField("Sex"),
    facebookUrl: z
      .string()
      .trim()
      .max(2048, "Facebook URL must be at most 2048 characters")
      .refine(
        (v) => !v || v === "" || isFacebookProfileUrl(v),
        "Facebook URL must be a facebook.com or fb.com profile link",
      ),
    // Academic
    college: optionField("College"),
    program: z
      .string()
      .trim()
      .min(1, "Program is required")
      .max(100, "Program must be at most 100 characters"),
    yearLevel: optionField("Year Level"),
    // Role Preferences
    primaryRole: optionField("Primary role"),
    secondaryRole: optionField("Secondary role"),
    relatedSkills: optionalText(1000, "Related Skills"),
    relatedExperiences: optionalText(1000, "Related Experiences"),
    // Availability & Commitment
    // Notion `Availability` is text; UI collects a commitment-band select
    availability: optionField("Availability"),
    eventAttendanceWillingness: z.literal(true, {
      error: "Please confirm you're willing to attend events",
    }),
    otherOrgs: optionalText(1000, "Other Orgs"),
    // Consent & Declaration
    privacyConsent: z.literal(true, {
      error: "You must accept the privacy notice",
    }),
    declarationConsent: z.literal(true, {
      error: "You must declare the information is accurate",
    }),
    // Abuse defense — Turnstile token (hidden)
    turnstileToken: z.string().min(1, "Please complete the verification"),
  })
  .refine(
    (data) =>
      !data.primaryRole ||
      !data.secondaryRole ||
      data.primaryRole !== data.secondaryRole,
    {
      message: "Primary and secondary roles must be different",
      path: ["secondaryRole"],
    },
  );

export type MembershipFormValues = z.infer<typeof membershipFormSchema>;
