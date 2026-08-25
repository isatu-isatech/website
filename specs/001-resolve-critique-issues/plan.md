# Implementation Plan: Resolve Latest Critique Issues

**Branch**: `001-resolve-critique-issues` | **Date**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-resolve-critique-issues/spec.md`

## Summary

Remediate every issue in the latest impeccable critique (`.impeccable/critique/2026-08-21T03-43-36Z__src-app.md`, score 6/10: 2×P0, 2×P1, P2/P3 items, detector findings, persona flags, minor items), then re-run the impeccable critique as the acceptance gate (SC-001: ≥ 8/10, zero open P0/P1).

Six slices (each independently shippable, per spec): **(1)** native on-site Membership application replacing the external Google Forms (P0, ADR 0002); **(2)** deterministic ambient hero — one fixed background video, muted autoplay, hidden controls, designed loading frame — plus motto/Est. 2021 credibility lane and the 4H story above the funnel (P0 + P3); **(3)** one dominant CTA per section with a direct join path above the fold (P1); **(4)** brand-token consistency across Home/About/Membership/Quiz/Contact — hardcoded grays, quiz "generalist" violet → gold, intro/result palette alignment, loader/confetti colors from tokens, nav active state, footer declutter (P1 + detector + minor); **(5)** trust hardening — owned contact identity, verified privacy link, humanized rate-limit copy, logo context-menu removal (P2); **(6)** reduced-motion compliance and honest quiz time copy, quiz logic untouched (P3 + clarify decisions).

> **Scope (2026-08-21, user decision)**: **User Story 1 (native Membership application) is deferred.** Tasks T002 / T004 / T006–T011 are parked (see tasks.md); the membership page retains its Google Form during the interim. This keeps the critique's membership P0 open — it is recorded as an _accepted deferral with reason_ in the re-run gate (T035 / SC-001), never silently dropped. Active scope = US2 → US3 → US4 → US5 → US6.

Technical spine: reuse the existing contact server-action pipeline (Zod `safeParse` → Cloudflare Turnstile `siteverify` → Upstash sliding-window rate limit on Vercel KV → Notion `createPage`, `{ success, error }` returns — `src/app/(static)/contact/actions.ts`) as the reference pattern for the new `submitMembershipApplication`; promote `NOTION_MEMBERSHIP_DATABASE_ID` from optional to required; all palette/loading/confetti colors read from `src/lib/constants/design-tokens.ts`.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.2, Next.js 16.3 (App Router; dev = Turbopack, build = `next build --webpack`), Tailwind CSS v4
**Primary Dependencies**: Radix UI, Motion v13 (Framer), React Hook Form + `@hookform/resolvers` + Zod v4, `@notionhq/client` v5, `@upstash/ratelimit` + `@vercel/kv`, `react-turnstile`, `nextjs-toploader`, `next-themes`, `canvas-confetti`, Serwist, next-sitemap, sonner
**Storage**: Notion (primary data store; existing helpers `src/lib/notion/client.ts`, `src/lib/notion/helpers.ts` incl. `createPage`, `queryDatabase`); Vercel KV (rate limiting)
**Testing**: no unit-test runner — verification = `npm run lint` (eslint `--max-warnings 0`), `npm run lint:ox` (oxlint), `npm run type-check` (`tsc --noEmit`), `npm run build` (+ next-sitemap), manual/browser checks, and the impeccable critique + design detector re-run as the final gate (SC-001)

**Target Platform**: Web (Vercel, https://isatech.club)
**Project Type**: Web application — Next.js full-stack single repo (server actions = backend)
**Performance Goals**: deterministic first viewport; visible content < ~2.5 s on mid-range phone over 4G (SC-003); **no regression** from polish (shape-brief anti-goal)
**Constraints**: keep brand identity (ISATech Blue `#203C90` + Gold `#FFAC03`); no performance regression; accessibility preserved-or-improved in both themes; reduced-motion honored; Notion-only storage; no user accounts / drafts / resets (H2 boundary); quiz logic untouched; org-owned copy only (constitution P2)
**Scale/Scope**: single org site, one deployment; six remediation slices across whole-site surfaces (Home, About, Membership, Quiz, Contact, shared header/footer/UI + tokens)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                           | Assessment                                                                                                                                                                                                                                                                                                     | Gate                     |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| P1 Domain Language Discipline       | Spec uses canonical terms (Membership, Standard Application Form, 4H archetype, Inquiry, Event/RSVP). 4th archetype = **Hound** per clarify Q4; glossary amendment is a recorded dependency (constitution amendment path, not silently edited)                                                                 | PASS (with dependency)   |
| P2 Org-Truth Copy                   | No invented copy. New visible copy limited to: engineering-owned error/rate-limit messages; existing motto ("DREAM • INNOVATE • SUCCEED") and founding year (2021, from `site.ts` / JSON-LD) moved into the hero; acronym expansions, review-pipeline wording, quiz time wording are org-supplied dependencies | PASS (with dependencies) |
| P3 Accessibility Standing           | No regression: keyboard + contrast + both themes; reduced-motion honored for all loaders/springs touched                                                                                                                                                                                                       | PASS                     |
| P4 Type Safety & Input Validation   | New `membershipFormSchema` (Zod) validates all action input; `NOTION_MEMBERSHIP_DATABASE_ID` promoted to required in `env.ts` + uncommented in `.env.example`; `{ success, error }` returns + `console.error`                                                                                                  | PASS                     |
| P5 Security & Abuse Hardening       | Membership form: Cloudflare Turnstile + Upstash/Vercel KV rate limit (mirrors contact action); secrets stay server-side; `src/proxy.ts` CSP untouched (verify only); contact identity resolves to the org's real address via site config                                                                       | PASS                     |
| P6 Scope & Boundary Discipline      | Notion = single store (ADR 0002 pulls the Membership pipeline into H1, final form, no rework); **Membership only — not Core**; no external DB mirror, no admin UI, no accounts/drafts; quiz logic untouched                                                                                                    | PASS                     |
| P7 Human-Reviewed Commit Discipline | No agent commits; exact `git add` + conventional commit titles left for human review                                                                                                                                                                                                                           | PASS                     |

**GATE result**: PASS — no violations requiring complexity justification. Unknowns resolved in research.md (Phase 0); re-checked after Phase 1 (see note at end).

## Project Structure

### Documentation (this feature)

```text
specs/001-resolve-critique-issues/
├── plan.md              # This file
├── research.md          # Phase 0 output — decisions R-1…R-13
├── data-model.md        # Phase 1 output — Membership Application entity model
├── contracts/
│   └── membership-application.md  # Server-action + Notion DB schema contract
├── quickstart.md        # Phase 1 output — end-to-end validation guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── spec.md              # Feature spec (clarified)
```

### Source Code (repository root)

**Structure Decision**: Option 2 — single Next.js app (the app IS the backend via server actions); no new top-level projects. New code lands beside existing feature modules, mirroring the established contact-form layout (co-located `actions.ts` / `schema.ts` / client component + Notion helpers in `src/lib/notion/`).

```text
src/
├── app/(static)/
│   ├── membership/
│   │   ├── page.tsx                # replace Google Form links w/ native application flow
│   │   ├── actions.ts              # NEW  submitMembershipApplication (mirror contact action)
│   │   ├── schema.ts               # NEW  membershipFormSchema (Standard Application Form)
│   │   └── application-form.tsx    # NEW  progressive-section wizard + review step + retry
│   ├── contact/
│   │   ├── actions.ts              # humanize rate-limit copy
│   │   └── page.tsx                # contact identity from site config
│   ├── (static)/loading.tsx        # reduced-motion for bounce/pulse rings+dots
│   └── quiz/result/page.tsx        # redirect only — no change expected
├── app/api/og/quiz/route.tsx       # generalist hex → brand gold; archetype hex from tokens
├── app/layout.tsx                  # NextTopLoader colors from design tokens
├── components/
│   ├── home/
│   │   ├── hero-section.tsx        # fixed video, designed loading frame, credibility lane, CTA
│   │   ├── offer-section.tsx       # token-safe cards (dark mode)
│   │   └── team-section.tsx        # 4H story band + token-safe border trick
│   ├── layout/
│   │   ├── header.tsx              # remove context menu hijack + trailing '#', active state, border cleanup
│   │   └── footer.tsx              # declutter decoration cluster, trailing '#' links
│   ├── quiz/
│   │   ├── intro-screen.tsx        # palette alignment + honest time copy (org-approved)
│   │   ├── result-screen.tsx       # generalist → gold gradient; reduced-motion springs
│   │   └── quiz-container.tsx      # confetti colors from tokens
│   └── common/
│       ├── loading-spinner.tsx     # reduced-motion
│       └── count-up.tsx            # reduced-motion springs
├── lib/
│   ├── env.ts                      # NOTION_MEMBERSHIP_DATABASE_ID → required
│   └── constants/design-tokens.ts  # single source for JS-consumed colors (loader, confetti)
└── proxy.ts                        # security headers/CSP — verify only, no change
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally empty. Simplest credible architecture is used: one new server action mirroring the proven contact pattern; no new projects, no new services layer, no state machine beyond a multi-step client wizard.

---

**Post-design constitution re-check (Phase 1 complete)**: unchanged from the table above — every design artifact (data model, contract, quickstart) conforms to P1–P7. Notable confirmations: data model adds no external store (P6); contract keeps Turnstile + rate limit + Zod (P4/P5); copy changes limited to engineering-owned messages + org-dependency list (P2); reduced-motion applied to all touched motion (P3). Gate remains **PASS**.
