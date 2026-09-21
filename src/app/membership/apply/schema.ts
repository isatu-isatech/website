import { z } from "zod";
import { MEMBERSHIP_FALLBACK } from "@/lib/constants/membership";

// Client-safe fallback for initial Zod shape — server re-validates against
// live Notion options (fetched via `getMembershipOptions(submissionsDataSourceId)`)
// before writing, so stale fallback values are rejected on submit.
const fallback = MEMBERSHIP_FALLBACK;

function enumWithFallback(options: readonly string[]) {
  // z.enum requires a non-empty tuple; fallback guarantees at least one.
  return z.enum(options as unknown as [string, ...string[]]);
}

// ISAT-U student email — strict: dotted alphanumeric local part
// (at least one dot, no leading/trailing/consecutive dots) plus the
// `@students.isatu.edu.ph` domain. Case-insensitive; the server action
// normalizes to lowercase before writing to Notion.
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
    host === "www.fb.com" ||
    host === "m.fb.com"
  );
}

export const membershipFormSchema = z
  .object({
    // Personal Information
    fullName: z
      .string()
      .min(2, "Full Name must be at least 2 characters")
      .max(100, "Full Name must be at most 100 characters"),
    nickname: z
      .string()
      .max(50, "Nickname must be at most 50 characters")
      .optional()
      .or(z.literal("")),
    studentId: z
      .string()
      .regex(
        /^\d{4}-\d{4}-[A-Z]$/,
        "Student ID must follow the format XXXX-XXXX-X",
      ),
    email: z
      .email("Invalid email address")
      .refine((v) => STUDENT_EMAIL_REGEX.test(v.trim()), STUDENT_EMAIL_MESSAGE),
    // Notion `Mobile Number` is a text/phone column. Accept digits, +, spaces, dashes, parentheses; stored verbatim.
    mobileNumber: z
      .string()
      .min(7, "Mobile Number must be at least 7 characters")
      .max(20, "Mobile Number must be at most 20 characters")
      .regex(
        /^[\d+\-\s()]+$/,
        "Mobile Number may only contain digits, +, -, spaces, or parentheses",
      ),
    birthdate: z
      .string()
      .min(1, "Birthdate is required")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid birthdate")
      .refine((v) => {
        const d = new Date(v);
        const now = new Date();
        // Compare as date only (ignore time)
        return d.getTime() <= now.getTime();
      }, "Birthdate cannot be in the future"),
    sex: enumWithFallback(fallback.sex),
    facebookUrl: z
      .string()
      .or(z.literal(""))
      .refine(
        (v) => !v || v === "" || isFacebookProfileUrl(v.trim()),
        "Facebook URL must be a facebook.com profile link",
      ),
    // Academic
    college: enumWithFallback(fallback.college),
    program: z
      .string()
      .min(1, "Program is required")
      .max(100, "Program must be at most 100 characters"),
    yearLevel: enumWithFallback(fallback.yearLevel),
    // Role Preferences
    primaryRole: enumWithFallback(fallback.primaryRole),
    secondaryRole: enumWithFallback(fallback.secondaryRole),
    relatedSkills: z
      .string()
      .max(1000, "Related Skills must be at most 1000 characters")
      .optional()
      .or(z.literal("")),
    relatedExperiences: z
      .string()
      .max(1000, "Related Experiences must be at most 1000 characters")
      .optional()
      .or(z.literal("")),
    // Availability & Commitment
    // Notion `Availability` is text; UI collects a commitment-band select
    availability: enumWithFallback(fallback.availability),
    eventAttendanceWillingness: z.literal(true, {
      error: "Please confirm you're willing to attend events",
    }),
    otherOrgs: z
      .string()
      .max(1000, "Other Orgs must be at most 1000 characters")
      .optional()
      .or(z.literal("")),
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
  .refine((data) => data.primaryRole !== data.secondaryRole, {
    message: "Primary and secondary roles must be different",
    path: ["secondaryRole"],
  });

export type MembershipFormValues = z.infer<typeof membershipFormSchema>;
