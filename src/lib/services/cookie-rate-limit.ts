/**
 * Browser-cookie-based rate limiting for public forms.
 *
 * The visitor's browser holds the submission record (a JSON array of
 * successful-submission timestamps inside the rolling window). Browser-held
 * state is client-controllable, so this is not a hard anti-abuse boundary —
 * clearing cookies resets the window. This is an org-accepted tradeoff
 * (constitution P5 v1.1.0; spec 002-contact-cookie-rate-limit): the Cloudflare
 * Turnstile check remains the primary gate on every submission, and the
 * mechanism itself is documented in the feature spec as P5 requires.
 */

export const RATE_LIMIT_COOKIE_NAME = "contact_rate_limit";
/** Rolling window: 1 hour. */
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
/** Max successful submissions per window (unchanged from the previous policy). */
export const RATE_LIMIT_MAX_SUBMISSIONS = 5;
/** Cap the stored payload so the cookie stays small. */
const RATE_LIMIT_MAX_STORED = 64;

/**
 * Parse a cookie payload into the successful-submission timestamps still inside
 * the rolling window. Malformed, non-array, or unreadable payloads are treated
 * as an empty record (first-time submitter).
 */
export function parseSubmissionTimes(raw: string | undefined): number[] {
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
    .filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
    .toSorted((a, b) => a - b);
}

/** True when the rolling window already holds the maximum number of submissions. */
export function isRateLimited(timestamps: number[]): boolean {
  return timestamps.length >= RATE_LIMIT_MAX_SUBMISSIONS;
}

/** Append a successful-submission timestamp and cap the stored payload. */
export function appendSubmissionTimestamp(
  timestamps: number[],
  now: number = Date.now(),
): number[] {
  return [...timestamps, now].slice(-RATE_LIMIT_MAX_STORED);
}
