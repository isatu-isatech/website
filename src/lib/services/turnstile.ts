import { env } from "@/lib/env";

export type TurnstileResult =
  { ok: true } | { ok: false; reason: "failed" | "unreachable" };

/**
 * Shared Cloudflare Turnstile verifier for public write surfaces.
 *
 * Single seam for the siteverify call: typed response, bounded wait via
 * `AbortSignal.timeout`, one log line. Callers map the result to their own
 * user-facing copy.
 */
export async function verifyTurnstile(
  token: string,
  opts?: { timeoutMs?: number },
): Promise<TurnstileResult> {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
          response: token,
        }),
        signal: AbortSignal.timeout(opts?.timeoutMs ?? 8000),
      },
    );
    const data = (await response.json()) as { success?: boolean };
    if (!data.success) return { ok: false, reason: "failed" };
    return { ok: true };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { ok: false, reason: "unreachable" };
  }
}
