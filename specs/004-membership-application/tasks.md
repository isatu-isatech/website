# Tasks: Native Membership Application

**Input**: Design documents from `/specs/004-membership-application/` (verified via Notion MCP 2026-08-25: dashboard + two DBs)
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Tests**: No automated test runner — manual validation per `quickstart.md` (scenarios 1–9, now campaign-aware). No test tasks generated.
**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (Next.js App Router, per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold structure for the membership wizard without touching product logic

- [x] T001 Create wizard directory structure `src/app/(static)/membership/components/steps/` per `plan.md` Project Structure
- [x] T002 Verify current membership shell and Google Form anchor points in `src/app/(static)/membership/page.tsx` and `src/app/(static)/membership/member-section.tsx` (locate `membershipFormLink = "https://forms.gle/ViNChagDv6Xcfp3bA"` and `#apply` targets)
- [x] T003 [P] Inventory reusable primitives in `src/components/ui/` (`button.tsx`, `input.tsx`, `label.tsx`, `form.tsx`, `turnstile-widget.tsx`, `textarea.tsx`) and helpers `src/lib/notion/helpers.ts`, `src/lib/services/cookie-rate-limit.ts`, `src/lib/constants/site.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core env, Notion option sourcing, rate-limit, schema, and campaign primitives that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Promote env vars to required in `src/lib/env.ts` — add `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID` (`3c7f42d3-fa72-8095-b5a7-000bc5bec8d2`) and `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID` (`3c7f42d3-fa72-8049-9d58-000badfe03e9`) as `z.string().min(1)` (keep `NOTION_MEMBERSHIP_DATABASE_ID` as deprecated alias or remove)
- [x] T005 Update `.env.example` with the two campaign/submissions DB IDs (and note dashboard page `3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`)
- [x] T006 Create live option helper `src/lib/notion/membership-options.ts` that fetches `Form Submissions` schema via Notion API and exposes `getMembershipOptions()` (College 5, Year Level 5 incl. 5th Year, Sex 2, Primary/Secondary Role 4 each) with request-memoization/caching and fallback — Notion is source of truth per R-010 (supersedes static `src/lib/constants/membership.ts`)
- [x] T007 Create isolated rate-limit helpers `src/lib/services/membership-rate-limit.ts` (`membership_rate_limit` cookie, `RATE_LIMIT_WINDOW_MS=60*60*1000`, `RATE_LIMIT_MAX_SUBMISSIONS=5`, cap 64, `parseSubmissionTimes`/`isRateLimited`/`appendSubmissionTimestamp` mirroring `src/lib/services/cookie-rate-limit.ts`) per `research.md` R-001
- [x] T007b Create campaign helper `src/lib/notion/membership-campaigns.ts` (`getActiveCampaign()` queries `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID` for `Status = "In progress"`; returns campaign page URL/ID or null; handles 0 or multiple active edge case) per `research.md` R-009
- [x] T007c Create `Campaign` relation on `Form Submissions` DB `collection://3c7f42d3-fa72-8049-9d58-000badfe03e9` linking to `Membership Campaigns` `collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2` via `notion_notion-update-data-source` `ADD COLUMN "Campaign" RELATION('collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2')` and verify inline view on campaign template filters by relation per `contracts/notion-database.md` §3
- [x] T008 Create Zod schema `membershipFormSchema` and inferred type `MembershipFormValues` in `src/app/(static)/membership/schema.ts` (all ~20 fields aligned to live Notion types: `Student ID` title 3–30, `Full Name` text 2–100, `Mobile Number` number, `Birthdate` ISO past-date, `Sex`/`College`/`Year Level`/`Primary`/`Secondary` via live options from T006, `Availability` text 0–60, `Event-Attendance Willingness` checkbox boolean, `Campaign` relation hidden, `primary !== secondary` refine, `privacyConsent`/`declarationConsent` `z.literal(true)`, `turnstileToken` min(1)) per `research.md` R-004 (updated for live types) and `contracts/membership-application.md` §2

**Checkpoint**: Foundation ready — `npm run type-check` and `npm run lint` pass with new campaign/options/rate-limit modules importable; Notion relation exists

---

## Phase 3: User Story 1 — A prospective member applies entirely on-site (Priority: P1) 🎯 MVP

**Goal**: Replace the external Google Form with a native multi-step wizard on `/membership` (Progress → 5 sections → Review → Confirmation) that routes to the active campaign via `Campaign` relation and writes to `Form Submissions`

**Independent Test**: During an active campaign (`Status = In progress`), from `/membership` click the hero **Apply Now** and member-section **Apply as Member** CTA — both scroll to wizard at `#apply`, complete 5 sections + Review + Submit with no new tab, see on-site **Confirmation**, and find the submission in the `Form Submissions` DB **with `Campaign` linked to the active `A.Y.` campaign** (per `quickstart.md` scenario 1, campaign-aware)

### Implementation for User Story 1

- [x] T009 Implement server action `submitMembershipApplication` in `src/app/(static)/membership/actions.ts` (pipeline: cookie `membership_rate_limit` read/prune → `membershipFormSchema.safeParse` (live options via T006) → Turnstile `siteverify` → **campaign resolve** `getActiveCampaign()` → if none/closed → `{ success: false, error: "Applications are currently closed — please check back when the next campaign opens." }` → else `createPage(NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID, properties)` with `Campaign` relation to active campaign URL/ID via `src/lib/notion/helpers.ts` (`MEMBERSHIP_PROPERTIES` constant, omit empty optionals, `Mobile Number` as number, `Availability` as text, checkbox willingness) → on success `appendSubmissionTimestamp` and `cookieStore.set` with `httpOnly/lax` attrs; all failures return `{ success, error }` human-readable) per `contracts/membership-application.md` §1/§3
- [x] T010 [P] [US1] Create progress indicator in `src/app/(static)/membership/components/progress.tsx` ( `Step X of 6`, subtle bar using brand tokens `--primary`/`--secondary`, `motion` with `useReducedMotion` gate, `text-secondary-dark dark:text-secondary` for gold, respects both themes) per `research.md` R-002/R-007
- [x] T011 [P] [US1] Create `src/app/(static)/membership/components/steps/personal-step.tsx` (Full Name text, Nickname text optional, Student ID title, Email, Mobile Number number input with `+`/space normalization, Birthdate date not-future, Sex select live options, Facebook URL http(s) optional) using `src/components/ui/form.tsx` primitives and options from T006
- [x] T012 [P] [US1] Create `src/app/(static)/membership/components/steps/academic-step.tsx` (College select live, Program text, Year Level select live) using `src/components/ui/form.tsx` and T006
- [x] T013 [P] [US1] Create `src/app/(static)/membership/components/steps/role-preferences-step.tsx` (Primary/Secondary Role Preference live 4 options, `primary !== secondary` live feedback, Related Skills text ≤1000, Related Experiences text ≤1000) per FR-006 and live options
- [x] T014 [P] [US1] Create `src/app/(static)/membership/components/steps/availability-step.tsx` (Availability text 0–60, Event-Attendance Willingness checkbox boolean, Other Orgs text ≤1000)
- [x] T015 [P] [US1] Create `src/app/(static)/membership/components/steps/consent-step.tsx` (Privacy Notice Consent checkbox, Declaration checkbox both `z.literal(true)`-gated, `TurnstileWidget` from `src/components/ui/turnstile-widget.tsx` wired to `turnstileToken` field)
- [x] T016 [US1] Create `src/app/(static)/membership/components/steps/review-step.tsx` (render all answers by section with **Edit** jumps, show linked campaign Academic Year, no data loss on back)
- [x] T017 [US1] Create `src/app/(static)/membership/components/confirmation.tsx` (on-site success screen showing campaign Academic Year, org-supplied copy per FR-015, no timeline promise)
- [x] T018 [US1] Create wizard orchestrator `src/app/(static)/membership/components/membership-wizard.tsx` (`FormProvider` + `useForm<MembershipFormValues>` + `zodResolver(membershipFormSchema)` with live options, per-step `trigger(fields)` on **Next**, `Progress` integration, campaign closed-state branch (fetch active campaign on mount; if null show closed/not-yet-open message and disable submit), Review as final step, submit calls `submitMembershipApplication`, disables button while pending, maps `{ success, error }` to banner + `FormMessage`, `sonner` toast on success, preserves values for retry)
- [x] T019 [US1] Mount wizard in `src/app/(static)/membership/page.tsx` at anchor `#apply` inside existing shell (keep hero/team/reason/offer/requirements sections, add wizard section after `MembershipPageRequirementsSection` with `id="apply"`, fetch active campaign server-side to decide initial open/closed rendering)
- [x] T020 [US1] Remove/repoint `membershipFormLink` Google Form URL in `src/app/(static)/membership/member-section.tsx` (CTA now `href="#apply"` without `target="_blank"`, no external form reference remains)

**Checkpoint**: US1 fully functional standalone — build succeeds, wizard completes end-to-end to the active campaign's relation, no Google Form link remains

---

## Phase 4: User Story 2 — An applicant recovers gracefully from mistakes and failures (Priority: P1)

**Goal**: Inline human-readable guidance, transient failure retry with data retained, and in-session back/refresh without loss

**Independent Test**: Submit with invalid values and simulate a Notion write failure or closed campaign mid-form — every case shows a human-readable message, entered data survives, and a subsequent valid retry (or campaign reopened) succeeds without re-entering (per `quickstart.md` scenarios 2 and 3)

### Implementation for User Story 2

- [x] T021 [US2] Harden validation UX in `src/app/(static)/membership/components/membership-wizard.tsx` (per-step `trigger()` shows field-specific `FormMessage` for missing/malformed, `secondary` conflict when `primary===secondary`, unchecked consents block submit, Birthdate future-date rejection, live option mismatch) per FR-011/FR-006/FR-008
- [x] T022 [US2] Implement transient Notion failure and closed-campaign retry paths in `src/app/(static)/membership/components/membership-wizard.tsx` (map write-failure and no-active-campaign `{ success: false, error }` to human-readable banners + **Retry** preserving all `getValues()` in-session; no restart, no cross-session draft claim) per FR-012/FR-019 and `contracts/membership-application.md` §6
- [x] T023 [US2] Ensure in-session back/refresh retention in `src/app/(static)/membership/components/membership-wizard.tsx` (wizard stays mounted on same page, Hook Form `defaultValues` persist across step navigation and **Back**, document that tab close discards data per Edge Cases/H2; if QA demands refresh survival, add lightweight `sessionStorage` draft tab-scoped, cleared on submit/close — no resume UI) per FR-013 and `research.md` R-002
- [x] T024 [US2] Add double-submit guard in `src/app/(static)/membership/components/membership-wizard.tsx` (disable submit button + `aria-busy` while `isSubmitting`, single record per action per FR-014)

**Checkpoint**: US1 + US2 both work — a broken submission can be corrected and retried with zero data loss within the session

---

## Phase 5: User Story 3 — Abuse attempts are stopped without harming honest applicants (Priority: P2)

**Goal**: Turnstile and `membership_rate_limit` cookie gating with friendly recovery, zero records for abuse, data preserved for honest retry

**Independent Test**: Send 5 successful submissions in one browser (distinct emails) during an active campaign then a 6th within the hour → friendly hourly-limit message, zero Notion page, data retained; bot POST without Turnstile token creates zero records; single honest submit succeeds (per `quickstart.md` scenarios 4 and 5)

### Implementation for User Story 3

- [x] T025 [US3] Wire `TurnstileWidget` token lifecycle in `src/app/(static)/membership/components/steps/consent-step.tsx` and `src/app/(static)/membership/components/membership-wizard.tsx` (`onVerify` sets `turnstileToken`, `onExpire`/`onError` clears it and surfaces "security check didn't go through — please re-verify", token required in schema and verified server-side before campaign resolve/write) per `contracts/membership-application.md` §1 step 3 and FR-017
- [x] T026 [US3] Verify `membership_rate_limit` isolation in `src/lib/services/membership-rate-limit.ts` and `src/app/(static)/membership/actions.ts` (distinct cookie name from `contact_rate_limit`, same 5/60-min policy, `isRateLimited` refuse with `"You've submitted quite a few applications this hour — please try again in about an hour."`, no Notion write, no append, data retained per FR-019) per `data-model.md` cookie table
- [x] T027 [US3] Preserve form data on abuse refusals in `src/app/(static)/membership/components/membership-wizard.tsx` (rate-limited and Turnstile-failed and closed-campaign responses keep all Hook Form values for later retry) per FR-019
- [x] T028 [US3] Add `membership_rate_limit` `HttpOnly` cookie write verification (on success set with `sameSite:lax`, `path:/`, `maxAge≈2×window`, `secure:production`, cap 64; on failure do not append) in `src/app/(static)/membership/actions.ts`

**Checkpoint**: US3 gates verifiable in DevTools → Application → Cookies (`membership_rate_limit` vs `contact_rate_limit` isolated) and Notion shows exactly 5 pages after 5 successes + zero for the 6th

---

## Phase 6: User Story 4 — Officers receive review-ready applications (Priority: P2)

**Goal**: Every `Form Submissions` page arrives complete with documented labels, blank/absent optionals, linked to its campaign, officer-only transitions

**Independent Test**: Submit one fully-filled and one minimal-optionals application during an active campaign — both appear in `Form Submissions` **under that campaign** with correct labels, consent true, `Campaign` relation set, empty optionals absent (not `" "`), and manual campaign-level review works (per `quickstart.md` scenario 9)

### Implementation for User Story 4

- [x] T029 [US4] Implement omit-if-empty for optional `text`/`url` in `src/app/(static)/membership/actions.ts` (Nickname, Facebook URL, Related Skills/Experiences, Other Orgs → omit property payload when trimmed empty per FR-004 and `contracts/membership-application.md` §3)
- [x] T030 [US4] Pin Notion property keys in `MEMBERSHIP_PROPERTIES` constant in `src/app/(static)/membership/actions.ts` and ensure `Campaign` relation is always set to the active campaign's page ID/URL on write per `contracts/membership-application.md` §3
- [x] T031 [US4] Cross-check `MEMBERSHIP_PROPERTIES` mapping and live select options against `contracts/notion-database.md` (verify `Student ID` title vs `Full Name` text swap, `Mobile Number` number, `Availability` text, `Event-Attendance Willingness` checkbox, and live option lists) and document any DB-side rename as a single-constant change

**Checkpoint**: US4 mapping is stable — renaming a Notion property is one find/replace in `MEMBERSHIP_PROPERTIES`, and campaign linkage is auditable in Notion's inline campaign view

---

## Phase 7: User Story 5 — Admin manages the yearly campaign (Priority: P1)

**Goal**: Officers create the campaign for the current academic year and manage `Status` to open/close acceptance; the form automatically follows the active campaign

**Independent Test**: Create campaign `A.Y. 2025-2026` via dashboard (or admin page) with `Status=Draft` — form shows closed; PATCH to `In progress` — form opens and routes new submissions to that campaign; PATCH to `Closed` — form blocks again; a second campaign for a new year can be added without code changes

### Implementation for User Story 5

- [x] T032 [US5] Implement campaign status query on page load and on submit in `src/app/(static)/membership/page.tsx` and `src/app/(static)/membership/actions.ts` (call `getActiveCampaign()` from T007b; if null show `MembershipCampaignClosed` closed state with human-readable message and disabled form per FR-009a/FR-026) per `data-model.md` campaign lifecycle
- [x] T033 [US5] Build optional web admin UI `src/app/admin/membership/page.tsx` (protected — simple `ADMIN_SECRET` env check or Notion auth; lists `Membership Campaigns` with Academic Year and Status, create campaign form, and Status transition buttons that PATCH `Status` via `notion.pages.update` / `notion.databases.query`); if web admin is deferred, document that Notion dashboard itself is the admin interface and seed a test `In progress` campaign via `notion_notion-create-pages` for QA per `research.md` R-009
- [x] T034 [US5] Add `ADMIN_SECRET` (if web admin built) to `src/lib/env.ts` (`z.string().optional()`) and `.env.example`, and gate `src/app/admin/membership/*` with server-side check (return 404 or redirect if secret missing/incorrect) per constitution P5

**Checkpoint**: US5 campaign lifecycle works end-to-end — no code change needed to roll over to a new academic year

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Brand fidelity, accessibility, link hygiene, and build gates across all stories

- [x] T035 Run impeccable-skill design pass on the wizard, closed states, and confirmation in `src/app/(static)/membership/components/` and `src/app/(static)/membership/page.tsx` (brand tokens via `cn` + Tailwind v4, no hardcoded grays, gold headings `text-secondary-dark dark:text-secondary`, `bg-accent/50 border-border/60` card pattern, `motion` gated by `useReducedMotion`, confirm no `forms.gle` widget appearance) per FR-022/FR-024 and `research.md` R-007
- [x] T036 Audit keyboard + screen-reader + theme parity in `src/app/(static)/membership/components/membership-wizard.tsx` (Tab through every step/field/select/checkbox/Turnstile/Next/Back/Submit, visible focus, `aria-invalid`/`aria-describedby` via `src/components/ui/form.tsx`, heading order, both light/dark themes, reduced-motion honored) per FR-023 and SC-006
- [x] T037 Remove all remaining Google Form refs site-wide (grep `forms.gle`/`ViNChagDv6Xcfp3bA` and repoint every former CTA to `#apply` on `/membership`) per FR-001/SC-007
- [x] T038 Run gates `npm run type-check` and `npm run lint` with both `NOTION_MEMBERSHIP_*` vars set, fix all issues (no `--max-warnings` bypass)
- [x] T039 Run `npm run build` (requires both campaign/submissions DB IDs) and verify sitemap + no KV dependency introduced (site stays KV-free per `AGENTS.md` and `research.md` R-001)
- [x] T040 Execute `quickstart.md` scenarios 1–9 (now campaign-aware) in both themes (wizard happy path during active campaign, invalid input, transient failure retry, closed campaign block, rate-limit 5→6, Turnstile expiry, double-submit, a11y, dead-link audit, Notion campaign-linked record fidelity) and record results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories (includes relation creation T007c and live options T006)
- **User Stories (Phases 3–7)**: All depend on Foundational
  - P1 stories (US1, US2, US5) should land first for MVP (US5's active campaign is a runtime prerequisite for US1's happy path, but US1 UI can be developed against a seeded test campaign)
  - P2 stories (US3, US4) can proceed after or in parallel with P1s if Foundational is done, but assume the wizard exists (US1)
- **Polish (Phase 8)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1) — applies entirely on-site**: Can start after Foundational — no other story dependency; delivers standalone MVP **when an `In progress` campaign exists** (seed one in Notion for local QA)
- **US2 (P1) — graceful recovery**: Depends on Foundational + US1 wizard existing — enhances the same wizard
- **US3 (P2) — abuse defenses**: Depends on Foundational + US1 — gates the same `submitMembershipApplication` pipeline
- **US4 (P2) — officer-ready records**: Depends on Foundational + US1 — concerns the Notion mapping and `Campaign` relation
- **US5 (P1) — campaign management**: Depends on Foundational — can be built in parallel with US1, but US1's submit path calls `getActiveCampaign()` from T007b, so T007b must be done first

### Within Each User Story

- Live options helper (T006) before schema (T008) → schema before actions (T009) → actions before wizard (T018) → steps before orchestrator → page mount after orchestrator
- Disable-submit guard before abuse tests
- Omit-if-empty before officer mapping verification

### Parallel Opportunities

- All `[P]` tasks in Phase 1/2 can run in parallel (different files)
- Step components T011–T015 can run in parallel (different files, no inter-dependency)
- T010 (progress) runs in parallel with steps
- US3 cookie isolation checks and US4 mapping polish can run in parallel by different developers once US1 wizard is mounted

---

## Parallel Example: User Story 1

```bash
# Launch all US1 step components together (different files):
Task: "Create src/app/(static)/membership/components/steps/personal-step.tsx"
Task: "Create src/app/(static)/membership/components/steps/academic-step.tsx"
Task: "Create src/app/(static)/membership/components/steps/role-preferences-step.tsx"
Task: "Create src/app/(static)/membership/components/steps/availability-step.tsx"
Task: "Create src/app/(static)/membership/components/steps/consent-step.tsx"
Task: "Create progress indicator in src/app/(static)/membership/components/progress.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + US5 seed)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories; includes Campaign relation T007c)
3. Seed a test `A.Y. 2025-2026` campaign with `Status = In progress` in Notion (via dashboard or `notion_notion-create-pages` for T007c verification)
4. Complete Phase 3: US1 (T009–T020) — wizard routes to that active campaign
5. **STOP and VALIDATE**: `quickstart.md` scenario 1 (wizard → campaign-linked Notion page, no Google Form link), `npm run type-check` + `npm run lint` + `npm run build`
6. Deploy/demo if Notion relation and env are set (KV-free, no extra infra)

### Incremental Delivery

1. Setup + Foundational → foundation ready (relation exists, live options helper ready)
2. US1 → wizard MVP independently testable (requires seeded active campaign)
3. US2 → validation/retry/retention without breaking US1
4. US3 → abuse gates (Turnstile + `membership_rate_limit` + closed-campaign block) without breaking US1/US2
5. US4 → officer mapping polish (`omit-if-empty`, `Campaign` relation, single-constant rename)
6. US5 → campaign admin UI/status transitions (or document Notion dashboard as admin)
7. Polish → a11y/theme/impeccable pass, dead-link audit, full `quickstart.md` run
8. Each increment validates independently via `quickstart.md` scenarios

### Parallel Team Strategy

With multiple developers after Foundational:

- Developer A: US1 wizard orchestration + page mount (T016–T020)
- Developer B: Step components T011–T015 in parallel
- Developer C: Server action T009 + campaign helper T007b + relation T007c + options helper T006
  Once US1 lands, one developer each can own US2, US3, US4, US5 in parallel (respecting the US1 dependency).

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable via `quickstart.md`
- Commit after each task or logical group; do not auto-commit (P7)
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
- Spec amendments (Notion dashboard verification, campaign relation, Notion-sourced options superseding static constants) are already reflected in tasks; do not reintroduce static `membership.ts` as source of truth without a spec amendment
