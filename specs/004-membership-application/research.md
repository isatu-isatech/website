# Research: Native Membership Application

**Phase 0 output** · Resolves Technical Context ambiguities and documents the P5 rate-limiting discrepancy found during constitution check.

## R-001 Rate-limiting mechanism (P5 documentation correction)

- **Decision**: Reuse the **browser-cookie pattern** `src/lib/services/cookie-rate-limit.ts` proven by spec 002, with a **dedicated cookie `membership_rate_limit`** (same policy: 5 successful submissions per rolling 60-min window, HttpOnly, `sameSite: lax`, `maxAge = 2 × window`, cap 64 entries, prune-on-read, graceful fallback to empty record when unreadable). Membership and contact surfaces are **isolated by cookie name** so one surface's submissions do not count against the other.

- **Rationale**:
  - `package.json` on `main` has **zero** `@vercel/kv` / `@upstash/ratelimit` dependencies; `AGENTS.md` notes "No Vercel KV anywhere: the site is KV-free since 003; contact rate limiting is cookie-based". The only live rate limiter in the codebase is the cookie helper used by `src/app/(static)/contact/actions.ts`.
  - The spec Assumption's claim — "existing server-side limiter retained by the quiz image route" — is **factually inaccurate**: `src/app/api/og/quiz/route.tsx` has no limiter (it bounds renderability via 17 canonical roles + cache, not per-requester KV).
  - Installing `@vercel/kv` + `@upstash/ratelimit` + provisioning a Vercel KV store would be new infra with new env vars (`KV_REST_API_URL`, etc.), new failure modes, and a Vercel dashboard step the org does not currently have — disproportionate for hundreds of submissions/semester.
  - Cookie pattern is already **audited and shipped** for contact: `parseSubmissionTimes`/`isRateLimited`/`appendSubmissionTimestamp` are pure, unit-friendly, and fail-open safely (malformed → empty record; KV-unavailable equivalent is just "no cookie").
  - Turnstile remains the **primary** abuse gate on every submission; the cookie is the secondary rolling-window backstop.

- **Constitution P5 implication**: Browser-held state is a **weaker** mechanism than a server-side store. Per P5 v1.1.0 a weaker mechanism "MUST be accepted explicitly by the org as a recorded decision" and "MUST be documented in the feature spec". This plan records the decision here and the spec Assumption must be **amended** (replace server-side claim with cookie-based `membership_rate_limit`; note org acceptance) before the feature ships — otherwise the implementation would diverge from the spec's documented mechanism. Treat this research note as the amendment proposal.

- **Alternatives considered**:
  - **A. Install server-side limiter (Upstash/KV)** — would match the spec Assumption literally and be the strongest gate, but requires adding two deps, provisioning a Vercel KV store, adding `KV_*` env vars to `env.ts` + `.env.example`, and updating build/runtime to handle KV unavailability (skip-with-warning). Rejected: new infra for low scale, and would re-introduce the KV dependency the project deliberately removed in spec 002/003.
  - **B. No rate limiting beyond Turnstile** — rejected: violates P5 "MUST be rate limited".
  - **C. IP-keyed server-side limiter via `next/headers` + in-memory map** — rejected: not durable across serverless invocations / edge instances; gives false sense of server-side strength.

- **Telemetry**: Cookie refuses return the same human-readable message shape as contact: `"You've submitted quite a few applications this hour — please try again in about an hour."` with data retained in-session for retry (FR-019). Only **successful** submissions are appended to the cookie (R-002's post-write set), so failed/rate-limited attempts never count.

## R-002 Multi-step wizard UX pattern

- **Decision**: **React Hook Form** (`useForm` + `FormProvider`) with **`zodResolver(membershipFormSchema)`** for client guidance, **section-local `trigger()` validation** on "Next", global `safeParse` again on final "Submit" (server re-validates via same Zod schema — P4). Steps: 1 Personal → 2 Academic → 3 Role Preferences → 4 Availability & Commitment → 5 Consent & Declaration → 6 Review → (on success) Confirmation screen. A `Progress` component shows `Step X of 6` and a subtle bar (brand tokens; `motion` for non-jarring motion, `useReducedMotion` gate).

- **Rationale**: Matches the established pattern (`src/components/ui/form.tsx` is already Radix + Hook Form + Zod with `FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage` and `aria-invalid`/`aria-describedby`). Wizard reduces perceived friction for ~20 fields (spec clarification Q1); per-step validation gives fast feedback without overwhelming the applicant. Server re-validation ensures P4 even if client is bypassed.

- **Alternatives considered**:
  - **Single scrollable page with anchor nav** — rejected per clarification Q1 (wizard chosen); longer page hurts mobile completion.
  - **Accordion collapsing** — rejected: harder to enforce linear progress + review-as-final-step invariant.
  - **Separate route `/membership/apply`** — not needed; spec says "fully integrated into the membership page" and AGENTS.md expects the application experience inside `src/app/(static)/membership/`. An anchor `#apply` + in-page wizard satisfies "primary join action" (FR-001) without a new route.

- **State retention**: Wizard form state lives in React state (Hook Form). **In-session** persistence across accidental refresh/back-forward is handled by **not** destroying data on unmount: the review step requirement (FR-003/FR-013) implies entered values survive in-session navigations via Hook Form's `defaultValues` + component staying mounted on the same page (no route change). A full browser refresh naturally resets React state — to survive refresh, mirror the pattern from quiz progress (`src/lib/quiz/progress.ts`'s `sessionStorage` `4h-quiz-progress-v1`) is **not** needed for membership: the spec says mid-form back/refresh _within the same session_ MUST retain values, but there is no cross-session draft requirement (H2). Simplest meeting of that is keeping the wizard mounted and relying on `sessionStorage` only if refresh survival is explicitly required in QA; otherwise document that closing the tab discards data (Edge Cases). If refresh survival is demanded in QA, add a lightweight `sessionStorage` draft (tab-scoped, cleared on submit/close) — but do **not** build a resume/draft UI.

## R-003 Static option catalogs (clarification Q3) — SUPERSEDED by R-010

- **Original decision** (Q3): static `src/lib/constants/membership.ts`. **Superseded** 2026-08-25 after Notion verification — see R-010. Kept for audit trail; do not implement.

  Original rationale was "simplest, no Notion fetch" — reversed because verified `Form Submissions` schema is now source of truth per user direction and officers must be able to add options (e.g., new College) without a deploy.

## R-004 Zod schema & field-level validation (updated for live Notion types)

- **Decision**: `src/app/(static)/membership/schema.ts` exports `membershipFormSchema` and `MembershipFormValues` (inferred type). Highlights (aligned to verified `Form Submissions` types 2026-08-25):

  - `studentId: z.string().min(3).max(30)` (Notion `title`)
  - `fullName: z.string().min(2).max(100)` (Notion `text`)
  - `nickname: z.string().max(50).optional().or(z.literal(""))`
  - `email: z.email()`
  - `mobileNumber: z.coerce.number()` — Notion is `number` (FLOAT); UI accepts `+`/spaces but normalizes to digits before coerce; alternatively keep as string then coerce to number on write
  - `birthdate: z.string().refine(ISO date, not future)` (`date:Birthdate:start`)
  - `sex / college / yearLevel / primaryArchetype / secondaryArchetype: z.enum(live Notion options)` fetched via `src/lib/notion/membership-options.ts` (R-010) + `.refine(primary !== secondary)`
  - `availability: z.string().min(1).max(60)` — Notion is `text` (earlier `hoursPerWeek` number); validate `0–60` range then write as text
  - `eventAttendanceWillingness: z.boolean()` — Notion is `checkbox` (`__YES__`/`__NO__`)
  - `privacyConsent / declarationConsent: z.literal(true, { error: "… must be checked" })`
  - `turnstileToken: z.string().min(1)` + `campaignId: z.string().min(1)` (hidden, server-resolved active campaign)
  - Related Skills/Experiences/Other-Orgs/Program: `z.string().max(1000).optional()`

- **Rationale**: Directly implements data-model field table (spec 001, mirrored here). `hoursPerWeek 0–60` is the org-defined range from that table. Coercion for `hoursPerWeek` handles form string inputs. Optional text fields allow empty string (form sends `""`) and are normalized to `omit` on Notion write.

- **Alternatives considered**: Separate per-step schemas — rejected: one schema with per-step `trigger(fields)` keeps single source and final `safeParse` authoritative.

## R-005 Notion write & retry

- **Decision**: Reuse `src/lib/notion/helpers.ts` `createPage` (already has `withRetry` for 429/5xx + `Retry-After` + jitter, `MAX_ATTEMPTS = 3`). Map form values to Notion properties exactly per the contract drafted in `specs/001-resolve-critique-issues/contracts/membership-application.md` §3 (22 properties). Use a `MEMBERSHIP_PROPERTIES` constant for property keys so a Notion rename is one findable change. Omit empty optionals (don't write `rich_text: [{ text: { content: "" } }]`); write `Status = "New"`.

- **Rationale**: Proven helper already handles the only real failure class (Notion rate limits). Keeps database writes consistent with contact path and avoids duplicating retry logic.

- **Alternatives considered**: Direct `notion.pages.create` without wrapper — rejected: loses retry and would diverge from contact pattern.

## R-006 Environment promotion — updated for campaign DBs

- **Decision**: In `src/lib/env.ts`, replace single optional with two required vars:

  ```ts
  NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID: z.string().min(1, "NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID is required"),
  NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID: z.string().min(1, "NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID is required"),
  // keep NOTION_MEMBERSHIP_DATABASE_ID as deprecated alias or remove after migration
  ```

  Verified IDs (2026-08-25): `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID = 3c7f42d3-fa72-8095-b5a7-000bc5bec8d2` (collection `Membership Campaigns` on `Membership Application Dashboard` `3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`), `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID = 3c7f42d3-fa72-8049-9d58-000badfe03e9` (`Form Submissions`). Add both to `.env.example` (P4). Build/dev fail loudly without either.

- **Rationale**: Single-DB assumption is superseded by campaign-gated design; two DBs are now required. Keep `NOTION_API_KEY`, `CLOUDFLARE_TURNSTILE_*` as before.

## R-007 Design & brand discipline (impeccable skill)

- **Decision**: Wizard and confirmation live inside the existing membership page shell (`src/app/(static)/membership/page.tsx` + `member-section.tsx`). Use brand tokens (`--primary`, `--primary-foreground`, `--secondary`, `--secondary-dark`, `--accent`, `--border`, design-tokens `COLORS`) via `cn()` helper; no hardcoded grays; gold headings use `text-secondary-dark dark:text-secondary` per AGENTS.md note. Progress bar + cards use `bg-accent/50 border-border/60` pattern already on the membership page. Motion via `motion` with `useReducedMotion` gate (P3, FR-022).

- **Rationale**: Per FR-024 the frontend must be reviewed with the impeccable skill. Keeping the wizard on the same page preserves the current hero/team/reason/offer/requirements sections and only replaces the Google Form CTA surface with the native wizard at `#apply`.

## R-008 Error handling & confirmation

- **Decision**: All expected failures return `{ success, error }` with a human-readable `error` string (AGENTS.md convention). Client maps `success: false` to an inline banner + per-field `FormMessage` where relevant, and keeps `react-hook-form` values intact for retry (FR-012/FR-019). Rate-limited, Turnstile, and **closed-campaign** failures also preserve form data in-session. Confirmation screen is on-site, org-supplied copy only (FR-015), no timeline promise.

- **Alternatives considered**: Throwing errors — rejected per P4/AGENTS.md. Redirect to separate success page — rejected: on-site confirmation is simpler and keeps the membership page as the hub.

## R-009 Campaign-gated submissions (Notion verification 2026-08-25)

- **Decision**: Introduce `Membership Campaign` entity (`Academic Year` title, `Campaign ID` auto, `Status` Draft/In progress/Closed) backed by `Membership Campaigns` DB `3c7f42d3-fa72-8095-b5a7-000bc5bec8d2` on dashboard `3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`. Form reads the **single `In progress` campaign** on load and re-validates at submit; if none / `Draft` / `Closed`, show closed/not-yet-open state and block writes with human-readable message. On successful submit, create `Form Submissions` page with `Campaign` relation pointing to the active campaign (requires adding `Campaign` relation property to `Form Submissions` DB via `notion_notion-update-data-source` `ADD COLUMN "Campaign" RELATION('3c7f42d3-fa72-8095-b5a7-000bc5bec8d2')`). Yearly auditability: each campaign's page `A.Y 2XXX-2XXX` contains an inline `Form Submissions` view filtered to that relation.

- **Rationale**: Verified dashboard exists with template and inline view; 0 campaigns / 0 submissions currently (so form must handle empty state). Yearly partitioning prevents multi-year table bloat and matches admin mental model; status gating gives officers a launch/close lever without a deploy.

- **Alternatives considered**:
  - Single flat submissions DB with no campaign — rejected: no yearly isolation, harder to audit.
  - Year as plain text field on submissions — rejected: no Notion-native grouping/filter view; relation enables linked views per campaign page.

- **Telemetry**: Server action pipeline now: cookie rate-limit → Zod → Turnstile → **campaign resolve** → Notion write with relation → cookie append. Campaign resolve failure returns `{ success: false, error: "Applications are currently closed — please check back when the next campaign opens." }`.

## R-010 Notion as source of truth for option fields (reverses R-003)

- **Decision**: **Notion schema is source of truth** for `College`, `Year Level`, `Sex`, `Primary Role Preference`, `Secondary Role Preference` (and any future selects). Implement `src/lib/notion/membership-options.ts` that fetches the `Form Submissions` DB schema via `notion.databases.retrieve` (or cached fetch of option lists) and exposes `getMembershipOptions()` used both to render `<select>` options and to build Zod enums at request time (or validate live on server via `safeParse` against fetched option arrays). Add caching (request-memoization or 5-min ISR) so the form render path does not hit Notion on every keystroke; fallback to last-known options if Notion is temporarily unavailable (fail-closed: unknown values still rejected).

- **Rationale**: Verified 2026-08-25: `College` 5 options, `Year Level` 5 options (incl. `5th Year`), `Sex` 2 options, `Primary`/`Secondary` 4 options each — officers can add a College in Notion without a deploy (your direction). This reverses Q3 static-constants decision which is now marked superseded.

- **Alternatives considered**:
  - Keep static `src/lib/constants/membership.ts` as source — rejected per your direction.
  - Hybrid (some static) — rejected: all option fields should be consistent.
