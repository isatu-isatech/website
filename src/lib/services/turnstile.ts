import { env } from "@/lib/env";

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "failed" | "unreachable"; errorCodes?: string[] };

/**
 * Shared Cloudflare Turnstile verifier for public write surfaces.
 *
 * Single seam for the siteverify call: typed response, bounded wait via
 * `AbortSignal.timeout`, one log line. Callers map the result to their own
 * user-facing copy via `turnstileErrorMessage`.
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
    const data = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      console.error(
        "[turnstile] siteverify failed:",
        data["error-codes"] ?? [],
      );
      return { ok: false, reason: "failed", errorCodes: data["error-codes"] };
    }
    return { ok: true };
  } catch (error) {
    console.error("[turnstile] verification error:", error);
    return { ok: false, reason: "unreachable" };
  }
}

/** Shared user-facing copy so contact + membership stay consistent. */
export function turnstileErrorMessage(
  result: Extract<TurnstileResult, { ok: false }>,
): string {
  if (result.reason === "failed") {
    return "The security check didn't go through — please try once more.";
  }
  return "We couldn't reach the security check just now. Please retry in a moment.";
}
