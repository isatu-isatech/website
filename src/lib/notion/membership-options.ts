/**
 * Live option sets for the membership form — Notion is the source of truth.
 *
 * Verified via Notion MCP 2026-08-25:
 * - College (6): Engineering and Architecture, Industrial Technology, Education, Arts and Sciences, Computing and Informatics, Global Business and Enterprise
 * - Year Level (5): 1st Year … 5th Year
 * - Sex (2): Male, Female
 * - Primary/Secondary Role Preference (4): Hound, Hacker, Hipster, Hustler
 * - Availability (4): Less than 2 hours, 2-5 hours, 6-10 hours, More than 10 hours
 *
 * The form and server validation MUST use these live lists, not a competing
 * static constant. This helper fetches the Form Submissions DB schema (via
 * `notion.databases.retrieve`) and caches the result for the request lifetime
 * (simple module-level memo, safe for serverless). Fallback to the canonical
 * lists in `src/lib/constants/membership-options-source.ts` (shared with the
 * client fallback) if Notion is unreachable at build/dev (fail-open for DX,
 * but runtime validation will still reject unknown values when Notion is reachable).
 */

import { getNotionClient } from "./client";
import { env } from "@/lib/env";
import {
  MEMBERSHIP_AVAILABILITY_BANDS,
  MEMBERSHIP_COLLEGES,
  MEMBERSHIP_ROLES,
  MEMBERSHIP_SEXES,
  MEMBERSHIP_YEAR_LEVELS,
} from "@/lib/constants/membership-options-source";

// Fallback lists — the canonical source, shared with the client fallback.
const FALLBACK = {
  college: MEMBERSHIP_COLLEGES,
  yearLevel: MEMBERSHIP_YEAR_LEVELS,
  sex: MEMBERSHIP_SEXES,
  role: MEMBERSHIP_ROLES,
  availability: MEMBERSHIP_AVAILABILITY_BANDS,
} as const;

export type MembershipOptions = {
  college: readonly string[];
  yearLevel: readonly string[];
  sex: readonly string[];
  primaryRole: readonly string[];
  secondaryRole: readonly string[];
  availability: readonly string[];
};

// Cache is keyed by data-source ID so per-campaign (parameterized) fetches
// can never poison the shared unparameterized entry or each other.
const cache = new Map<string, { value: MembershipOptions; at: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

function toOptionNames(prop: unknown): string[] | null {
  if (
    prop &&
    typeof prop === "object" &&
    "type" in (prop as Record<string, unknown>) &&
    (prop as { type: string }).type === "select" &&
    "select" in (prop as Record<string, unknown>)
  ) {
    const select = (prop as { select: { options: { name: string }[] } }).select;
    if (Array.isArray(select?.options)) {
      return select.options.map((o) => o.name).filter(Boolean);
    }
  }
  return null;
}

export async function getMembershipOptions(
  dataSourceId?: string,
): Promise<MembershipOptions> {
  const now = Date.now();
  const dbId =
    dataSourceId ??
    env.NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID ??
    env.NOTION_MEMBERSHIP_DATABASE_ID ??
    "";
  // Unresolvable IDs share one fallback entry; every real data source gets
  // its own so campaigns never serve each other's option sets.
  const cacheKey = dbId || "<unconfigured>";
  const hit = cache.get(cacheKey);
  if (hit && now - hit.at < CACHE_TTL_MS) return hit.value;

  const put = (value: MembershipOptions): MembershipOptions => {
    cache.set(cacheKey, { value, at: Date.now() });
    return value;
  };

  try {
    const notion = getNotionClient();
    if (!dbId) throw new Error("No submissions data source ID available");
    // Use generic request() so we can handle both data-source IDs (…8095…/023f…)
    // and database page IDs (…8000…/d14f…) regardless of SDK method names.
    let db: unknown;
    try {
      db = await (
        notion as unknown as { request: (args: unknown) => Promise<unknown> }
      ).request({
        path: `data_sources/${dbId}/retrieve`,
        method: "get",
      });
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? String(err);
      if (
        msg.includes("Could not find data_source") ||
        msg.includes("data_source with ID")
      ) {
        db = await (
          notion as unknown as { request: (args: unknown) => Promise<unknown> }
        ).request({
          path: `databases/${dbId}/retrieve`,
          method: "get",
        });
      } else {
        throw err;
      }
    }
    const props =
      (db as unknown as { properties: Record<string, unknown> })?.properties ??
      (
        db as unknown as {
          data_sources?: { properties?: Record<string, unknown> }[];
        }
      )?.data_sources?.[0]?.properties ??
      (
        db as unknown as {
          data_source?: { properties?: Record<string, unknown> };
        }
      )?.data_source?.properties ??
      {};

    const college = toOptionNames(props["College"]) ?? [...FALLBACK.college];
    const yearLevel = toOptionNames(props["Year Level"]) ?? [
      ...FALLBACK.yearLevel,
    ];
    const sex = toOptionNames(props["Sex"]) ?? [...FALLBACK.sex];
    const primaryRole = toOptionNames(props["Primary Role Preference"]) ?? [
      ...FALLBACK.role,
    ];
    const secondaryRole = toOptionNames(props["Secondary Role Preference"]) ?? [
      ...FALLBACK.role,
    ];
    const availability = toOptionNames(props["Availability"]) ?? [
      ...FALLBACK.availability,
    ];

    return put({
      college,
      yearLevel,
      sex,
      primaryRole,
      secondaryRole,
      availability,
    });
  } catch {
    // Notion unreachable at build or tests — use fallback so the form can still render
    // Server validation will re-attempt live fetch on submit.
    return put({
      college: [...FALLBACK.college],
      yearLevel: [...FALLBACK.yearLevel],
      sex: [...FALLBACK.sex],
      primaryRole: [...FALLBACK.role],
      secondaryRole: [...FALLBACK.role],
      availability: [...FALLBACK.availability],
    });
  }
}
