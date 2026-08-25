import { z } from "zod";

const envSchema = z.object({
  // Notion API Configuration
  NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY is required"),
  NOTION_CONTACT_FORM_DATABASE_ID: z
    .string()
    .min(1, "NOTION_CONTACT_FORM_DATABASE_ID is required"),
  // Membership applications — campaign-gated (verified via Notion MCP 2026-08-25)
  // Dashboard: Membership Application Dashboard (3c7f42d3-fa72-80d2-86ad-ddcc19b555e0)
  // Campaigns DB: Membership Campaigns (3c7f42d3-fa72-8095-b5a7-000bc5bec8d2)
  // Submissions DB: Form Submissions (3c7f42d3-fa72-8049-9d58-000badfe03e9)
  NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID: z
    .string()
    .min(1, "NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID is required"),
  // Per-campaign Form Submissions DB — dynamic per active campaign (extracted from campaign page's inline DB).
  // Kept optional as fallback for campaigns created without template (blank pages) and for local build without Notion.
  NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID: z.string().optional(),
  // Deprecated single-DB alias — kept optional for migration, remove after 004 ships
  NOTION_MEMBERSHIP_DATABASE_ID: z.string().optional(),

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
