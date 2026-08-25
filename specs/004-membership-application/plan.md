# Implementation Plan: Native Membership Application

**Branch**: `004-membership-application` | **Date**: 2026-08-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-membership-application/spec.md`

## Summary

Reopen the deferred US1 membership slice (spec 001, ADR 0002/0001) as a standalone feature, now verified against the live `Membership Application Dashboard` (`3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`): replace the external Google Form (`https://forms.gle/ViNChagDv6Xcfp3bA`) with a native, brand-shell multi-step wizard on `/membership`. The wizard collects the full Standard Application Form (~20 fields across 5 sections + review), validates client- and server-side with Zod **against live Notion option sets** (College/Year Level/Sex/Primary/Secondary — Notion is source of truth per 2026-08-25 verification, R-010), gates submissions with Cloudflare Turnstile + `membership_rate_limit` cookie rate limiting (P5, documented in spec Assumptions), and **routes each accepted submission to the currently `In progress` Membership Campaign** (Academic Year, `Status` Draft/In progress/Closed) via a `Campaign` relation on the `Form Submissions` DB. Campaigns are created/administered via the Notion dashboard (`Membership Campaigns` `3c7f42d3-fa72-8095-b5a7-000bc5bec8d2`) and an optional web admin that PATCHes `Status`; the form blocks when no campaign is active. Writes use two required DBs (`NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID`, `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID`) via the existing `createPage` helper with retry. Design uses the impeccable skill (FR-024) and preserves accessibility/theme parity (P3).

## Technical Context

**Language/Version**: TypeScript 5, Next.js 16 (App Router, `next dev/build --webpack`), React 19

**Primary Dependencies**: Next.js, React, Tailwind CSS v4, Radix UI primitives, Motion, React Hook Form 7 + `@hookform/resolvers` 5 + Zod 4, `@notionhq/client` 5, `react-turnstile` 1, `sonner` 2 (toasts), `next-themes` (light/dark)

**Storage**: Notion — primary data store per ADR 0001 / P6. **Verified** via MCP 2026-08-25: `Membership Application Dashboard` (`3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`) owns `Membership Campaigns` (`collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2`, fields `Academic Year` title / `Campaign ID` auto / `Status` Draft-In progress-Closed) and `Form Submissions` (`collection://3c7f42d3-fa72-8049-9d58-000badfe03e9`, fields `Student ID` title, `Full Name` text, `College`/`Year Level`/`Sex`/`Primary`/`Secondary` selects (live Notion options), `Mobile Number` number, `Availability` text, `Event-Attendance Willingness` checkbox, `Campaign` relation **to be added**). Two env-promoted DB IDs required: `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID`, `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID`. Option sets are Notion-sourced (R-010). No mirrored external DB, no KV.

**Testing**: `npm run type-check` (`tsc --noEmit`) + `npm run lint` (`eslint --max-warnings 0`) are the hard gates (Husky pre-commit). Manual browser validation per `quickstart.md` (happy path, failure modes, abuse defenses, accessibility/theme checks). No automated test runner is configured in the repo; do not introduce one in this feature.

**Target Platform**: Web — Vercel hosting at `https://isatech.club`. Modern evergreen browsers, light + dark themes. No native/mobile target.

**Project Type**: Web application (marketing site + data-capturing form surface)

**Performance Goals**: Wizard step transitions feel instant (<100 ms perceived); submission round-trip (client submit → server validation → Turnstile verify → Notion write → confirmation) completes in <2.5 s on typical 4G when Notion is healthy; transient Notion failures retry with backoff (existing `helpers.ts` pattern: up to 3 attempts). No new bundle-size regression beyond form assets.

**Constraints**: Forms are server actions (`"use server"`) with Zod validation (P4); expected failures return `{ success, error }` (never throw). Rate limiting must never be silently disabled (P5). Public env vars are `NEXT_PUBLIC_*` and Zod-validated in `src/lib/env.ts` + `.env.example` (P4). Security headers/CSP in `src/proxy.ts` must be preserved. No accounts, no cross-session draft persistence (H2 boundary).

**Scale/Scope**: Student-org scale — hundreds of submissions per semester, low concurrent load. Rate limit 5 successful submissions / rolling hour per visitor is the abuse backstop, not a throughput target.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                           | Status          | Evidence / Mitigation                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 Domain Language Discipline       | PASS            | Uses glossary-canonical terms: **Membership** (this feature) vs **Core Membership** (explicitly out of scope per spec Assumptions), **4H archetype** = Hustler/Hacker/Hipster/Hound (clarified; "Hound" canonical), Standard Application Form base. No conflation of Membership/Core, Committee/Position/4H.                                   |
| P2 Org-Truth Copy                   | PASS            | Confirmation / "what happens next" is org-supplied (FR-015, spec Dependencies). No timeline promises. Section intros derive verbatim from approved sources. The `TODO(org-copy)` pattern from quiz applies if any copy is pending.                                                                                                             |
| P3 Accessibility                    | PASS            | New wizard uses Radix primitives + `components/ui/form` (accessible form field pattern), semantic steps, visible focus, aria-invalid/describedby already in `form.tsx`. Must be validated in both themes and with reduced-motion; SC-006 gates it. No regression.                                                                              |
| P4 Type Safety & Input Validation   | PASS            | `NOTION_MEMBERSHIP_DATABASE_ID` promoted from `optional()` → `string().min(1)` in `src/lib/env.ts` and un-commented in `.env.example` (new required var). Server action `submitMembershipApplication` validates with `membershipFormSchema` via `safeParse`; env checked via Zod at startup. Errors as `{ success, error }` + `console.error`. |
| P5 Security & Abuse Hardening       | PASS — see note | Turnstile required on every submission (FR-017). Rate limiting `membership_rate_limit` cookie (R-001, org-accepted weaker mechanism per P5 v1.1.0) documented in spec Assumptions; KV-free since 003 remains true. Notion secrets never in client bundle. No KV.                                                                               |
| P6 Scope & Boundary Discipline      | PASS            | Membership pipeline only; Core Membership, accounts, draft/resume, portal, mirrored DB out of scope (ADRs 0001/0002). Notion is sole store. Campaigns are **in-scope** per verified dashboard design — not scope creep — and are admin-managed via the dashboard (option sets Notion-sourced per R-010).                                       |
| P7 Human-Reviewed Commit Discipline | PASS            | No auto-commit/push; agent will emit `git add` commands + conventional titles for human review (per AGENTS.md).                                                                                                                                                                                                                                |

**Post-design re-check**: After Phase 1, re-confirmed P1–P7 remain PASS with the R-001 amendment (cookie-based limiter + org acceptance) carried into contracts/data-model/quickstart. No new violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-membership-application/
├── plan.md              # This file
├── research.md          # Phase 0 output — decisions & trade-offs
├── data-model.md        # Phase 1 output — Membership Application entity
├── quickstart.md        # Phase 1 output — manual validation guide
├── contracts/           # Phase 1 output — server action + Notion DB contracts
│   ├── membership-application.md
│   └── notion-database.md
└── tasks.md             # Phase 2 output — NOT created by plan
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (static)/
│       └── membership/
│           ├── page.tsx                 # existing shell + new wizard mount (replaces Google Form link) — now campaign-aware (closed state when no In progress)
│           ├── member-section.tsx       # remove/repoint membershipFormLink
│           ├── schema.ts                # NEW Zod membershipFormSchema (live Notion options via membership-options helper, Availability text 0-60, checkbox willingness)
│           ├── actions.ts               # NEW submitMembershipApplication (cookie → Zod → Turnstile → campaign resolve → createPage with Campaign relation)
│           └── components/              # NEW wizard UI
│               ├── membership-wizard.tsx
│               ├── steps/ ...
│               ├── confirmation.tsx
│               └── progress.tsx
│   └── admin/
│       └── membership/
│           └── page.tsx                # OPTIONAL admin UI — lists campaigns, PATCHes Status via Notion API (if web admin chosen; else Notion dashboard is admin)
├── components/ ...
├── lib/
│   ├── env.ts                          # promote NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID + NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID to required
│   ├── notion/
│   │   ├── client.ts
│   │   ├── helpers.ts                  # createPage with retry
│   │   ├── membership-campaigns.ts     # NEW — getActiveCampaign() queries Membership Campaigns for Status=In progress
│   │   └── membership-options.ts       # NEW — fetches Form Submissions select options from live schema (Notion source of truth, R-010, cached)
│   └── services/
│       └── membership-rate-limit.ts    # NEW — membership_rate_limit cookie helpers
└── .env.example                         # two IDs: CAMPAIGNS + SUBMISSIONS
```

**Structure Decision**: Single Next.js project (existing layout). No new top-level app needed. Membership wizard lives co-located under `src/app/(static)/membership/` following the contact pattern (`schema.ts` + `actions.ts` beside the page). Shared constants live under `src/lib/constants/`. Rate-limit helpers live under `src/lib/services/` (isolated cookie name per surface).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed                                                                                          | Simpler Alternative Rejected Because |
| --------- | --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| —         | No violations; P5 cookie-weakness is an org-accepted documented trade-off (R-001), not a violation. | —                                    |
