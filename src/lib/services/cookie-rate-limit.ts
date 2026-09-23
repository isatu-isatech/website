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

export interface CookieRateLimitPolicy {
  cookieName: string;
  windowMs: number;
  maxSubmissions: number;
  maxStored?: number;
}

export interface CookieRateLimiter {
  cookieName: string;
  windowMs: number;
  maxSubmissions: number;
  parseSubmissionTimes(raw: string | undefined): number[];
  isRateLimited(timestamps: number[]): boolean;
  appendSubmissionTimestamp(timestamps: number[], now?: number): number[];
}

/**
 * Factory for browser-cookie rate limiters. Each surface gets its own
 * adapter (own cookie name) over the shared implementation so the two
 * surfaces never count against each other.
 */
export function createCookieRateLimit(
  policy: CookieRateLimitPolicy,
): CookieRateLimiter {
  const maxStored = policy.maxStored ?? 64;
  return {
    cookieName: policy.cookieName,
    windowMs: policy.windowMs,
    maxSubmissions: policy.maxSubmissions,
    parseSubmissionTimes(raw: string | undefined): number[] {
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
        .filter((timestamp) => now - timestamp < policy.windowMs)
        .toSorted((a, b) => a - b);
    },
    isRateLimited(timestamps: number[]): boolean {
      return timestamps.length >= policy.maxSubmissions;
    },
    appendSubmissionTimestamp(
      timestamps: number[],
      now: number = Date.now(),
    ): number[] {
      // Prune expired entries before appending so the cookie never carries
      // up to maxStored stale timestamps.
      const fresh = timestamps.filter((t) => now - t < policy.windowMs);
      return [...fresh, now].slice(-maxStored);
    },
  };
}

/** Contact surface adapter: 5 successful submissions per rolling 60-min window. */
export const contactRateLimit = createCookieRateLimit({
  cookieName: "contact_rate_limit",
  windowMs: 60 * 60 * 1000,
  maxSubmissions: 5,
});

/** Membership surface adapter: isolated cookie, identical policy. */
export const membershipRateLimit = createCookieRateLimit({
  cookieName: "membership_rate_limit",
  windowMs: 60 * 60 * 1000,
  maxSubmissions: 5,
});
