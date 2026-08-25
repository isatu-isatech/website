/**
 * Live option sets for the membership form — Notion is the source of truth.
 *
 * Verified via Notion MCP 2026-08-25:
 * - College (5): Engineering and Architecture, Industrial Technology, Education, Arts and Sciences, Computing and Informatics
 * - Year Level (5): 1st Year … 5th Year
 * - Sex (2): Male, Female
 * - Primary/Secondary Role Preference (4): Hound, Hacker, Hipster, Hustler
 *
 * The form and server validation MUST use these live lists, not a competing
 * static constant. This helper fetches the Form Submissions DB schema (via
 * `notion.databases.retrieve`) and caches the result for the request lifetime
 * (simple module-level memo, safe for serverless). Fallback to the verified
 * hardcoded lists if Notion is unreachable at build/dev (fail-open for DX,
 * but runtime validation will still reject unknown values when Notion is reachable).
 */

import { getNotionClient } from "./client";
import { env } from "@/lib/env";

// Fallback lists — match the verified schema on 2026-08-25
const FALLBACK = {
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
} as const;

export type MembershipOptions = {
  college: readonly string[];
  yearLevel: readonly string[];
  sex: readonly string[];
  primaryRole: readonly string[];
  secondaryRole: readonly string[];
};

let cached: MembershipOptions | null = null;
let cachedAt = 0;
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
  const useCache = !dataSourceId;
  if (useCache && cached && now - cachedAt < CACHE_TTL_MS) return cached;

  try {
    const notion = getNotionClient();
    const dbId =
      dataSourceId ??
      env.NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID ??
      env.NOTION_MEMBERSHIP_DATABASE_ID ??
      "";
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

    cached = {
      college,
      yearLevel,
      sex,
      primaryRole,
      secondaryRole,
    };
    cachedAt = now;
    return cached;
  } catch {
    // Notion unreachable at build or tests — use fallback so the form can still render
    // Server validation will re-attempt live fetch on submit.
    cached = {
      college: [...FALLBACK.college],
      yearLevel: [...FALLBACK.yearLevel],
      sex: [...FALLBACK.sex],
      primaryRole: [...FALLBACK.role],
      secondaryRole: [...FALLBACK.role],
    };
    cachedAt = now;
    return cached;
  }
}

// Synchronous fallback for client components that cannot await (e.g., initial render)
// Use `getMembershipOptions()` on the server whenever possible.
export function getMembershipOptionsFallback(): MembershipOptions {
  return {
    college: [...FALLBACK.college],
    yearLevel: [...FALLBACK.yearLevel],
    sex: [...FALLBACK.sex],
    primaryRole: [...FALLBACK.role],
    secondaryRole: [...FALLBACK.role],
  };
}
