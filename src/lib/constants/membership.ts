/**
 * Fallback option sets for the membership form — client-safe, no server env.
 *
 * Notion is the source of truth at runtime (fetched via `membership-options.ts`
 * on the server), but the client bundle cannot import `src/lib/env.ts` (which
 * validates server-only vars like NOTION_API_KEY and throws ZodError in the
 * browser). This file is the client-safe fallback used by `schema.ts` for
 * initial `z.enum` shapes and by the step components for rendering selects
 * before the server has validated against live Notion options.
 *
 * Verified live values on 2026-08-25 — keep in sync with Notion, but server
 * will re-validate against live lists on submit and reject stale values.
 */

export const MEMBERSHIP_FALLBACK = {
  college: [
    "College of Engineering and Architecture",
    "College of Industrial Technology",
    "College of Education",
    "College of Arts and Sciences",
    "College of Computing and Informatics",
  ] as const,
  yearLevel: [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
  ] as const,
  sex: ["Male", "Female"] as const,
  role: ["Hound", "Hacker", "Hipster", "Hustler"] as const,
  primaryRole: ["Hound", "Hacker", "Hipster", "Hustler"] as const,
  secondaryRole: ["Hound", "Hacker", "Hipster", "Hustler"] as const,
  // Hardcoded hours-commitment options (org decision — not Notion-sourced)
  availability: [
    "Less than 2 hours",
    "2-5 hours",
    "6-10 hours",
    "More than 10 hours",
  ] as const,
} as const;

// Convenience re-exports for step components
export const COLLEGE_OPTIONS = MEMBERSHIP_FALLBACK.college;
export const YEAR_LEVEL_OPTIONS = MEMBERSHIP_FALLBACK.yearLevel;
export const SEX_OPTIONS = MEMBERSHIP_FALLBACK.sex;
export const ROLE_OPTIONS = MEMBERSHIP_FALLBACK.role;
