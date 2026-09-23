import { z } from "zod";

// Client-safe env subset. Deliberately separate from `src/lib/env.ts`:
// `env.ts` validates server-only secrets (NOTION_API_KEY, Turnstile secret)
// and must never be imported into the client bundle. This module owns the
// `NEXT_PUBLIC_*` vars consumed by client components (e.g. Turnstile widget).
const publicEnvSchema = z.object({
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY: z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY is required"),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY:
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
});
