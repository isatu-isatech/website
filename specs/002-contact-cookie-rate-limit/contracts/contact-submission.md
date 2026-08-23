# Contract: Contact Submission (Inquiry) — server action & cookie

**Date**: 2026-08-23 | **Spec**: [spec.md](../spec.md) | **Data model**: [data-model.md](../data-model.md)

## 1. Server action `submitMessage`

- Location: `src/app/(static)/contact/actions.ts` (server action, `"use server"`).
- Input: `formData: unknown`, validated by `contactFormSchema` (Zod):
  - `name`: string, 2–50 chars
  - `email`: string, valid email
  - `message`: string, 10–1000 chars
  - `turnstileToken`: string, non-empty
- Output: `{ success: true }` | `{ success: false, error: string }` — never
  throws for expected failures (P4).

### Execution order

1. Read + prune the `contact_rate_limit` cookie → if ≥ 5 entries in the
   rolling 60-min window, refuse with the friendly rate-limit message; no
   write.
2. `contactFormSchema.safeParse(formData)` → refuse on invalid.
3. Cloudflare Turnstile `siteverify` (secret from env) → refuse on failure.
4. `createPage(NOTION_CONTACT_FORM_DATABASE_ID, { Name, Email, Message })` →
   refuse with the generic error message on failure.
5. Append `Date.now()` to the cookie (cap 64), set it on the response.

## 2. Rate-limit cookie `contact_rate_limit`

| Aspect   | Value                                            |
| -------- | ------------------------------------------------ |
| Name     | `contact_rate_limit`                             |
| Value    | JSON array of epoch-ms numbers, ascending        |
| Cap      | 64 entries (pruned to the 60-min window on read) |
| HttpOnly | true                                             |
| SameSite | Lax                                              |
| Path     | `/`                                              |
| Max-Age  | 7200 s (2 × window)                              |
| Secure   | true in production                               |

Semantics: count = entries with `now - t < 3_600_000`; limit = 5. Cleared,
disabled, or malformed cookie ⇒ empty record (first-time submitter).

## 3. Notion write shape

- Database: `NOTION_CONTACT_FORM_DATABASE_ID` (env).
- Properties: `Name` (title), `Email` (email), `Message` (rich_text).
- No other properties are written (unchanged).

## 4. Out of scope (unchanged interfaces)

- Quiz OG route `GET /api/og/quiz` — keeps its own Upstash/Vercel KV limiter.
- Contact page UI (`form.tsx`) — consumes `submitMessage` exactly as before.
