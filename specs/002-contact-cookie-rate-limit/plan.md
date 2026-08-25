# Implementation Plan: Contact Page Cookie-Based Rate Limiting

**Branch**: `002-contact-cookie-rate-limit` | **Date**: 2026-08-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-contact-cookie-rate-limit/spec.md`

## Summary

The Contact page keeps Notion as its primary data store but replaces the
server-side (Upstash/Vercel KV) rate limiter with browser-held state: the
server action reads a small HttpOnly cookie holding successful-Inquiry
timestamps, blocks at 5 submissions per rolling 60-minute window (same policy
as today), and appends the timestamp only after a fully successful Notion
write. The Cloudflare Turnstile check and the Notion write path are unchanged;
the quiz OG image route, its KV-backed limiter, and the KV dependencies remain
untouched. Constitution P5 was amended to v1.1.0 making the rate-limiting
mechanism an org decision documented in the feature spec. Status: spec
ratified and implementation in place (this plan formalizes the design for
review and task decomposition).

## Technical Context

**Language/Version**: TypeScript ^5 (strict) on Next.js ^16 (App Router, Turbopack), React 19

**Primary Dependencies**: Zod ^4 (validation); `@vercel/kv` + `@upstash/ratelimit`
(quiz OG route only — untouched); Serwist, next-sitemap (build); the limiter
uses `next/headers` `cookies()` (built-in)

**Storage**: Notion (primary, via `src/lib/notion/helpers.ts` `createPage`);
rate-limit state in a browser cookie (`contact_rate_limit`) — no server-side
store for the contact path

**Testing**: No test runner configured. Verification = `npm run type-check`,
`npm run lint`, `npm run build`, node-based logic assertions on the pure
cookie-limiter module, and manual browser E2E (see quickstart.md)

**Target Platform**: Web (Vercel serverless, production at isatech.club)

**Project Type**: Web application (Next.js App Router, server actions)

**Performance Goals**: Submission round-trip unchanged or better — the cookie
round-trip replaces the KV round-trip, adding no network hop

**Constraints**: Cookie payload ≤ 64 timestamps (well under the 4KB cookie
budget); HttpOnly, SameSite=Lax, `path=/`, `secure` in prod; graceful
degradation when cookies are unavailable (FR-009); KV/Upstash must keep
working for the quiz route

**Scale/Scope**: Public anonymous form, low volume; per-browser window of 5
Inquiries per rolling hour; Contact page only (quiz route out of scope)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle            | Assessment                                                                                                                                                                                          | Status |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| P1 Domain Language   | Canonical glossary term **Inquiry** used for contact-form submissions; spec Key Entity aligned from "Contact Submission" → "Inquiry" (no glossary amendment needed — canonical term already exists) | PASS   |
| P2 Org-Truth Copy    | No copy changes; the rate-limit message carries over unchanged (already humanized)                                                                                                                  | PASS   |
| P3 Accessibility     | Server-action logic only; no UI/theme/focus changes                                                                                                                                                 | PASS   |
| P4 Type Safety       | Zod schema + `{ success, error }` returns unchanged; no new env vars                                                                                                                                | PASS   |
| P5 Security & Abuse  | Amended v1.1.0: mechanism org-decided and documented in spec; Turnstile stays mandatory; never silently disabled                                                                                    | PASS   |
| P6 Scope & Boundary  | Notion remains the primary data store; no mirrored external DB; quiz route untouched                                                                                                                | PASS   |
| P7 Commit Discipline | No automated commits; human-reviewed `git add`/commit titles provided                                                                                                                               | PASS   |

Gate: **PASS** (no violations; P5 amendment ratified by org decision 2026-08-23).

## Project Structure

### Documentation (this feature)

```text
specs/002-contact-cookie-rate-limit/
├── plan.md                     # This file
├── research.md                 # Phase 0 output
├── data-model.md               # Phase 1 output
├── quickstart.md               # Phase 1 output
├── contracts/
│   └── contact-submission.md   # Phase 1 output
├── checklists/
│   └── requirements.md         # Spec quality checklist (16/16 passing)
└── tasks.md                    # Phase 2 output (/speckit.tasks — not created by plan)
```

### Source Code (repository root)

```text
src/
├── app/(static)/contact/
│   ├── actions.ts              # submitMessage server action (cookie limiter wired in)
│   ├── form.tsx                # unchanged consumer of submitMessage
│   ├── schema.ts               # contactFormSchema (unchanged)
│   └── page.tsx / contact-hero.tsx  # unchanged
├── lib/services/
│   ├── cookie-rate-limit.ts    # NEW pure module: parse/prune/limit/append
│   └── index.ts                # barrel re-export of cookie-rate-limit
└── app/api/og/quiz/route.tsx   # untouched (KV-backed limiter stays)
```

**Structure Decision**: Existing Next.js App Router layout. The feature adds one
pure helper module under `src/lib/services/` (barrel-exported) and rewires
`src/app/(static)/contact/actions.ts`. No new directories or scaffolding.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Not required — Constitution Check passes with no violations.
