import { z } from "zod";

const envSchema = z.object({
  // Notion API Configuration
  NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY is required"),
  NOTION_CONTACT_FORM_DATABASE_ID: z
    .string()
    .min(1, "NOTION_CONTACT_FORM_DATABASE_ID is required"),

  // Cloudflare Turnstile Configuration
  CLOUDFLARE_TURNSTILE_SECRET_KEY: z
    .string()
    .min(1, "CLOUDFLARE_TURNSTILE_SECRET_KEY is required"),
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY is required"),

  // Optional: Add other environment variables as needed
  // RESEND_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
