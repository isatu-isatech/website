/**
 * Canonical quiz outcome helpers (spec 003-quiz-page-improvements).
 *
 * The shareable outcome set is derived — never hardcoded — from the quiz
 * data: the keys of `archetypes` are exactly the 17 canonical roles (16
 * adjective+archetype combinations plus Generalist). The result-share URLs
 * and the OG banner only ever carry canonical values (FR-009); anything
 * else is coerced to the canonical invite banner by the route.
 */

import { archetypes, archetypeIcons, type ArchetypeKey } from "@/lib/quiz-data";
import { SITE_CONFIG } from "@/lib/constants/site";

/** The 17 canonical shareable outcomes, derived from quiz-data. */
export const CANONICAL_ROLES: readonly string[] = Object.keys(archetypes);

/** The four archetype keys, derived from the icon map (single source). */
export const ARCHETYPE_KEYS: readonly ArchetypeKey[] = Object.keys(
  archetypeIcons,
) as ArchetypeKey[];

/** The generalist outcome — not an archetype; it has its own gold banner. */
export const GENERALIST_ROLE = "Generalist";

/** True when `role` is one of the 17 canonical outcomes. */
export function isCanonicalRole(
  role: string | null | undefined,
): role is string {
  return typeof role === "string" && CANONICAL_ROLES.includes(role);
}

/** Type guard for the `archetype` query param. */
export function isArchetypeKey(
  value: string | null | undefined,
): value is ArchetypeKey {
  return (
    typeof value === "string" &&
    (ARCHETYPE_KEYS as readonly string[]).includes(value)
  );
}

/**
 * Derive the archetype from a canonical role. Every adjective+archetype
 * combination ends with its archetype name; Generalist has none.
 */
export function deriveArchetype(role: string): ArchetypeKey | null {
  if (role === GENERALIST_ROLE) return null;
  const candidate = role.split(" ").pop() ?? "";
  return isArchetypeKey(candidate) ? candidate : null;
}

export interface ShareParams {
  role: string;
  archetype: ArchetypeKey;
  isGeneralist: boolean;
}

function applyShareParams(url: URL, params: ShareParams): URL {
  url.searchParams.set("role", params.role);
  url.searchParams.set("archetype", params.archetype);
  if (params.isGeneralist) {
    url.searchParams.set("generalist", "true");
  }
  return url;
}

/**
 * The result share link (`/quiz/result?...`). `base` is the site origin;
 * defaults to the canonical site URL for server-side metadata (result page).
 */
export function buildShareUrl(params: ShareParams, base?: string | URL): URL {
  return applyShareParams(
    new URL("/quiz/result", base ?? SITE_CONFIG.url),
    params,
  );
}

/** The OG banner URL (`/api/og/quiz?...`) rendered by the share flow. */
export function buildBannerUrl(params: ShareParams, base?: string | URL): URL {
  return applyShareParams(
    new URL("/api/og/quiz", base ?? SITE_CONFIG.url),
    params,
  );
}
