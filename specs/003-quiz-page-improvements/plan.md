# Implementation Plan: Quiz Page Improvements — Polish, Hardening, OG Banner, KV Refactor

**Branch**: `003-quiz-page-improvements` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-quiz-page-improvements/spec.md`

## Summary

Polish and harden the 4H quiz (unclipped scrolling on short viewports,
session-scoped progress persistence, accessibility guarantees), improve the
result-share OG banner (canonical-role validation with bounded caching,
bundled Poppins typography, archetype icon art instead of emoji, noindexed
share pages), and remove the last server-side key-value store dependency
(Vercel KV) from the site — replacing the OG route's spoofable per-IP rate
limiter with a bounded canonical-content + long-lived-caching defense,
recorded as the constitution P5 org decision. See [research.md](./research.md)
for the resolved technical decisions (R1–R9).

## Technical Context

**Language/Version**: TypeScript; Next.js 16.3.1 (App Router, `next dev/build --webpack`), React 19.2.8

**Primary Dependencies**: `next/og` (`ImageResponse`), `motion` (Framer), Tailwind CSS v4, Radix UI, `next/font` (Poppins/Chivo). **Removed**: `@vercel/kv`, `@upstash/ratelimit`

**Storage**: N/A (no server storage). Browser-held `sessionStorage` for quiz progress (FR-008); existing cookie-based contact limiter untouched

**Testing**: No automated test framework in the repo — validation is `npm run type-check`, `npm run lint` (`--max-warnings 0`), `npm run build`, plus the manual scenarios in [quickstart.md](./quickstart.md)

**Target Platform**: Web — Vercel deployment (https://isatech.club), desktop-first marketing site, mobile-aware; OG route runs on the Node.js runtime

**Project Type**: Web application (marketing site + interactive quiz surface)

**Performance Goals**: Quiz answer → advance with no artificial waiting period (FR-003); OG banner generation fast (< ~1 s p95) and cached (repeated shares served from cache, SC-004)

**Constraints**: No new third-party dependencies (spec assumption); site must build/run with no KV variables (FR-019/SC-005); accessibility and both-theme support preserved (P3, SC-006); incumbent ISATech blue/gold identity kept (FR-004, SC-007); org-owned intro copy placeholders preserved (FR-005)

**Scale/Scope**: 18 renderable banner variants (17 canonical outcomes + invite default); quiz ≈ 18 questions + 3 tiebreakers; per-visitor session record ≈ small JSON in `sessionStorage`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                  | Status  | Evidence                                                                                                                                                                                                                    |
| ------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 Domain Language Discipline              | ✅ Pass | Uses canonical glossary terms: **Archetype**, **Quiz Outcome**, 4H roles ("Hound" canonical). No term reuse.                                                                                                                |
| P2 Org-Truth Copy                          | ✅ Pass | No invented copy; intro `TODO(org-copy)` markers preserved (FR-005); descriptions come from `quiz-data.ts`.                                                                                                                 |
| P3 Accessibility Is a Standing Requirement | ✅ Pass | FR-002/SC-006: keyboard, announced selection/progress, visible focus, reduced-motion; scroll fix improves reachability (FR-001).                                                                                            |
| P4 Type Safety & Input Validation          | ✅ Pass | `env.ts` Zod schema updated (KV vars removed); OG route validates params against the canonical whitelist (derived, typed); expected failures logged via `console.error`; no new server actions.                             |
| P5 Security & Abuse Hardening              | ✅ Pass | KV removal + canonical-set/caching defense is the **recorded org decision** in the spec (Assumptions); Turnstile + cookie limiter on Contact untouched; no secrets in client bundles; `src/proxy.ts` CSP/headers untouched. |
| P6 Scope & Boundary Discipline             | ✅ Pass | No Notion/DB changes, no new stores; membership page untouched (deferred US1); landing-page OG out of scope; quiz content/scoring unchanged (FR-004).                                                                       |
| P7 Human-Reviewed Commit Discipline        | ✅ Pass | No automated commits; git add + commit titles provided at completion.                                                                                                                                                       |

## Project Structure

### Documentation (this feature)

```text
specs/003-quiz-page-improvements/
├── plan.md              # This file
├── research.md          # Phase 0 output (R1–R9 decisions)
├── data-model.md        # Phase 1 output (entities: Archetype, QuizOutcome, QuizProgress, ResultShareLink, OGBanner)
├── quickstart.md        # Phase 1 output (validation scenarios SC-001…SC-008)
├── contracts/           # Phase 1 output
│   ├── og-quiz-banner.md
│   ├── result-share-link.md
│   └── quiz-progress-session.md
└── tasks.md             # Phase 2 output (NOT created by this command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/og/quiz/
│   │   ├── route.tsx        # Rewrite: canonical validation + 302 redirect, Poppins font, icon art, cache headers, no KV/ratelimit
│   │   └── fonts/           # Bundled Poppins woff2 (400, 700) — OFL, read via fs
│   ├── quiz/
│   │   ├── page.tsx         # Scroll-safe container (min-h + scrollable) — fixes clipping
│   │   ├── layout.tsx       # Unchanged (simplified header)
│   │   └── result/
│   │       └── page.tsx     # Metadata: noindex, encoded params, generalist round-trip
│   └── proxy.ts             # Unchanged (CSP/security headers)
├── components/quiz/
│   ├── quiz-container.tsx   # Session persistence: restore on mount, save per transition, clear on result/retake
│   ├── intro-screen.tsx     # Polish only (identity-preserving)
│   ├── question-screen.tsx  # Polish + progress/selection a11y semantics
│   └── result-screen.tsx    # Polish only
└── lib/
    ├── env.ts               # Remove KV_URL / KV_REST_API_URL / KV_REST_API_TOKEN
    ├── quiz-data.ts         # Unchanged (canonical outcome source: Object.keys(archetypes))
    └── quiz/                # NEW shared helpers
        ├── canonical.ts     # CANONICAL_ROLES, isCanonicalRole, banner URL builder
        └── progress.ts      # sessionStorage schema: load/save/clear/version-check
```

**Structure Decision**: Single Next.js project — the feature is contained in
the existing app tree. New shared logic lives in `src/lib/quiz/` (canonical
helpers + progress session) so the OG route, the result page, and the quiz
container all consume the same single source of truth; bundled fonts sit next
to the OG route that reads them.

## Complexity Tracking

> No constitution violations — table intentionally omitted (gate passed).
