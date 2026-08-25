/**
 * Browser-cookie-based rate limiting for the membership form — isolated from contact.
 *
 * Mirrors `src/lib/services/cookie-rate-limit.ts` (contact) but uses a
 * dedicated cookie name `membership_rate_limit` so the two surfaces do not
 * count against each other. Policy is identical (5 successful submissions per
 * rolling 60-min window) per spec Assumptions and research R-001.
 *
 * Browser-held state is a weaker mechanism than a server-side store and is
 * explicitly accepted by the org for this surface per constitution P5 v1.1.0.
 * Turnstile remains the primary gate on every submission.
 */

export const MEMBERSHIP_RATE_LIMIT_COOKIE_NAME = "membership_rate_limit";
export const MEMBERSHIP_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const MEMBERSHIP_RATE_LIMIT_MAX_SUBMISSIONS = 5;
const MEMBERSHIP_RATE_LIMIT_MAX_STORED = 64;

export function parseMembershipSubmissionTimes(
  raw: string | undefined,
): number[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const now = Date.now();
  return parsed
    .filter(
      (entry): entry is number =>
        typeof entry === "number" && Number.isFinite(entry),
    )
    .filter((timestamp) => now - timestamp < MEMBERSHIP_RATE_LIMIT_WINDOW_MS)
    .toSorted((a, b) => a - b);
}

export function isMembershipRateLimited(timestamps: number[]): boolean {
  return timestamps.length >= MEMBERSHIP_RATE_LIMIT_MAX_SUBMISSIONS;
}

export function appendMembershipSubmissionTimestamp(
  timestamps: number[],
  now: number = Date.now(),
): number[] {
  return [...timestamps, now].slice(-MEMBERSHIP_RATE_LIMIT_MAX_STORED);
}
