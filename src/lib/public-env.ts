import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY is required"),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY:
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
});
