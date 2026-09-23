/**
 * Fallback option sets for the membership form — client-safe, no server env.
 *
 * Notion is the source of truth at runtime (fetched via `membership-options.ts`
 * on the server), but the client bundle cannot import `src/lib/env.ts` (which
 * validates server-only vars like NOTION_API_KEY and throws ZodError in the
 * browser). The lists below are built from the canonical
 * `membership-options-source.ts` (shared with the server fallback) and used by
 * `schema.ts` for initial `z.enum` shapes and by the step components for
 * rendering selects before the server has validated against live Notion
 * options.
 *
 * Verified live values on 2026-08-25 — keep in sync with Notion, but server
 * will re-validate against live lists on submit and reject stale values.
 */

import {
  MEMBERSHIP_AVAILABILITY_BANDS,
  MEMBERSHIP_COLLEGES,
  MEMBERSHIP_ROLES,
  MEMBERSHIP_SEXES,
  MEMBERSHIP_YEAR_LEVELS,
} from "./membership-options-source";

export const MEMBERSHIP_FALLBACK = {
  college: MEMBERSHIP_COLLEGES,
  yearLevel: MEMBERSHIP_YEAR_LEVELS,
  sex: MEMBERSHIP_SEXES,
  role: MEMBERSHIP_ROLES,
  primaryRole: MEMBERSHIP_ROLES,
  secondaryRole: MEMBERSHIP_ROLES,
  // Notion-owned hours-commitment options (Availability select column)
  availability: MEMBERSHIP_AVAILABILITY_BANDS,
} as const;

/**
 * Live option lists threaded from the server (`page.tsx` fetches via
 * `getMembershipOptions`) down to the wizard steps. Client-safe structural
 * type — the server module itself imports server-only env and must never be
 * bundled into client components.
 */
export type MembershipLiveOptions = {
  college: string[];
  yearLevel: string[];
  sex: string[];
  primaryRole: string[];
  secondaryRole: string[];
  availability: string[];
};
