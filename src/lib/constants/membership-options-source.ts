/**
 * Canonical Membership option lists — the single source both fallbacks build
 * from.
 *
 * Client-safe (no server env import): `src/lib/constants/membership.ts`
 * re-exports these for selects/schema shapes, and
 * `src/lib/notion/membership-options.ts` uses them as its offline fallback.
 * Notion is the runtime source of truth; the server re-validates against live
 * lists on submit. Availability bands are Notion-owned (officer action):
 * the `Availability` select column must carry exactly these values.
 */

export const MEMBERSHIP_COLLEGES = [
  "College of Engineering and Architecture",
  "College of Industrial Technology",
  "College of Education",
  "College of Arts and Sciences",
  "College of Computing and Informatics",
  "College of Global Business and Enterprise",
] as const;

export const MEMBERSHIP_YEAR_LEVELS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
] as const;

export const MEMBERSHIP_SEXES = ["Male", "Female"] as const;

export const MEMBERSHIP_ROLES = [
  "Hound",
  "Hacker",
  "Hipster",
  "Hustler",
] as const;

export const MEMBERSHIP_AVAILABILITY_BANDS = [
  "Less than 2 hours",
  "2-5 hours",
  "6-10 hours",
  "More than 10 hours",
] as const;
