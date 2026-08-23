# Quickstart: Contact Cookie-Based Rate Limiting — validation guide

**Date**: 2026-08-23 | **Spec**: [spec.md](spec.md) | **Contracts**: [contracts/contact-submission.md](contracts/contact-submission.md) | **Data model**: [data-model.md](data-model.md)

## Prerequisites

- Node 20+; `npm install`.
- `.env.local` with: `NOTION_API_KEY`, `NOTION_CONTACT_FORM_DATABASE_ID`,
  `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`.
  KV vars are optional for the contact path (no longer used there); the quiz
  OG route still needs them if exercised.

## 1. Static verification

```bash
npm run type-check   # expect: clean
npm run lint         # expect: clean (eslint --max-warnings 0)
npm run build        # expect: success — /contact static, sitemap generated
```

## 2. Limiter logic assertions (no browser needed)

```bash
node --input-type=module -e "…import { parseSubmissionTimes, isRateLimited,
appendSubmissionTimestamp } from './src/lib/services/cookie-rate-limit.ts'…"
```

Expected (all PASS): empty / malformed / non-array payload ⇒ `[]`; stale
(> 1h) timestamps pruned; junk entries filtered; 5 in window ⇒ limited, 4 ⇒
allowed; append caps the payload at 64; JSON round-trip preserves timestamps.

## 3. Manual E2E (dev server, real credentials)

1. `npm run dev` → open `/contact`.
2. Submit a valid Inquiry (pass Turnstile) → confirmation shown; verify the
   record appears in the Notion contact database.
3. Repeat 4 more times within the hour → the 6th submit is refused with
   "You've sent quite a few messages this hour — please try again in about an
   hour…".
4. Clear cookies (or fresh private window) → submit accepted again.
5. Submit an invalid Inquiry (e.g. too-short message) → validation message;
   the failure does not count (still need 5 _successful_ submits to block).
6. DevTools → Application → Cookies: confirm `contact_rate_limit` is HttpOnly
   and holds a JSON array of timestamps.

## 4. Regression checks

- `/quiz` and the quiz result OG image still work (KV limiter intact).
- `/privacy#manage-cookies` and the consent banner unchanged (the new cookie
  is strictly necessary, not consent-gated).

## 5. Known accepted limitation

Same-browser concurrent submits (two tabs) can overshoot by the number of
concurrent requests (cookie read-modify-write race) — see research.md R-004;
Turnstile remains the primary gate.
