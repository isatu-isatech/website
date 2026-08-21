---
description: "Task list for Resolve Latest Critique Issues (US1 Membership deferred)"
---

# Tasks: Resolve Latest Critique Issues

**Input**: Design documents from `/specs/001-resolve-critique-issues/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No formal test tasks are generated — this repo has no unit-test runner and the spec did not request TDD. Validation is the quickstart.md manual scenarios, the static gates (type-check / lint / lint:ox / build), and the final impeccable critique re-run (SC-001). "Verify" tasks below run the quickstart scenario(s) named for each story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**⚡ SCOPE — user decision 2026-08-21**: **User Story 1 (membership application) is DEFERRED.** Tasks **T002, T004, T006–T011** are parked and MUST NOT be implemented until the scope is reopened. The membership page keeps its current Google Form during the interim. Active scope = **US2 → US3 → US4 → US5 → US6 → Polish**. The critique gate (T035) records the membership P0 as _intentionally deferred with reason_ — it cannot be silently dropped.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (Next.js App Router single repo — the app is the backend via server actions)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline and shared config groundwork — the repo already exists; no project init needed

- [ ] T001 Establish baseline: run `npm run type-check`, `npm run lint`, `npm run lint:ox`, `npm run build` and record they pass before any changes (snapshot for the critique gate)
- [ ] T002 [P] ~~Promote `NOTION_MEMBERSHIP_DATABASE_ID` to required in `src/lib/env.ts` and uncomment it in `.env.example`~~ — **DEFERRED with US1** (making it required would break builds until the membership DB exists)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared infrastructure for the ACTIVE stories

**⚠️ CRITICAL**: US2 needs T003 (token frame); US4 needs T003; US6 needs T005 (quiz wording)

- [ ] T003 [P] Add JS-consumed color exports to `src/lib/constants/design-tokens.ts` — single source for: NextTopLoader gradient pair, quiz confetti palette, quiz-generalist gold pair (replaces violet), and the 4-archetype hex pairs shared by `result-screen.tsx` and the OG route — **blocks US2 + US4**
- [ ] T004 [P] ~~Provision the Notion membership database per `contracts/membership-application.md` §3 (21 properties + Status select) and set `NOTION_MEMBERSHIP_DATABASE_ID` in `.env.local`~~ — **DEFERRED with US1**
- [ ] T005 [P] Collect the org-supplied copy dependencies — acronym expansions (KWADRA TBI, IPMO), quiz time wording (FR-023), application review-pipeline/confirmation wording (on hold with US1), canonical contact email — recorded in the feature dir; where unavailable, leave an explicit `TODO(org-copy)` marker. NEVER invent copy (constitution P2)

**Checkpoint**: Foundation ready — active user stories can now begin in parallel

---

## ⏸️ Phase 3: User Story 1 - Apply for membership without leaving the site — **DEFERRED**

**Goal**: Replace the external Google Form with the native Standard Application Form (progressive sections, review step, on-site confirmation, Notion write, Turnstile + rate limiting, in-session retry). **Parked by user decision 2026-08-21 — do not implement.**

**Independent Test when reopened**: From `/`, complete a full application on-site (no new tab); record lands in Notion membership DB with `Status: New` (quickstart scenarios 1–3)

### Implementation for User Story 1 (parked — do not implement)

- [ ] T006 [US1] ~~Create `src/app/(static)/membership/schema.ts` — `membershipFormSchema` per `data-model.md` field table + `contracts/membership-application.md` §2~~ — **DEFERRED**
- [ ] T007 [P] [US1] ~~Create `src/app/(static)/membership/actions.ts` — `submitMembershipApplication` server action~~ — **DEFERRED**
- [ ] T008 [P] [US1] ~~Create `src/app/(static)/membership/application-form.tsx` — progressive-section wizard~~ — **DEFERRED**
- [ ] T009 [US1] ~~Add review step + submission UX to `src/app/(static)/membership/application-form.tsx`~~ — **DEFERRED**
- [ ] T010 [US1] ~~Rework `src/app/(static)/membership/page.tsx` to replace the Google Form links with the native flow~~ — **DEFERRED**
- [ ] T011 [US1] ~~Verify quickstart scenarios 1–3~~ — **DEFERRED**

**Checkpoint**: US1 parked; resume from T002/T004 when the scope reopens

---

## Phase 4: User Story 2 - A steady, credible first impression (Priority: P1) 🎯 MVP

**Goal**: Deterministic ambient hero — one fixed background video, muted autoplay, hidden controls, designed loading frame — plus motto/Est. 2021 credibility lane and the 4H story surfaced before the quiz funnel. **Now the lead slice** (US1 deferred)

**Independent Test**: Load `/` five times → identical video every time, no blank black frame while loading, no visible player controls; motto + "Est. 2021" visible without scrolling; 4H archetype story visible on the homepage (quickstart scenarios 4–5)

### Implementation for User Story 2

- [ ] T012 [US2] Refactor `src/components/home/hero-section.tsx` — pin to the single curated video (remove the `Math.random()` selection in the `useEffect`), keep `autoplay/mute/controls=0/loop/playsinline`, remove `loading="lazy"`, replace the flat `bg-black/50` overlay with a designed brand frame from `design-tokens.ts` and add a branded poster layer that fades on player ready — never a blank black box (FR-009, FR-010) (depends on T003)
- [ ] T013 [US2] Add the credibility lane + primary CTA to `src/components/home/hero-section.tsx` — motto kicker ("DREAM • INNOVATE • SUCCEED" from existing copy) + "Est. 2021" (from `src/lib/constants/site.ts`); one dominant join action (FR-011; FR-014 for the hero) (depends on T012)
- [ ] T014 [P] [US2] Create the 4H archetype story section (new `src/components/home/archetype-section.tsx`) surfacing Hustler / Hacker / Hipster / Hound from existing 4H content (`src/components/home/team-section.tsx`, `src/lib/quiz-data.ts`) with exactly one dominant CTA (FR-012)
- [ ] T015 [US2] Wire the archetype section into `src/app/(static)/home/page.tsx` between hero and stats (depends on T014)
- [ ] T016 [US2] Show org-approved full names on first use for acronyms in visible hero/home copy (KWADRA TBI, IPMO) using T005 strings; leave `TODO(org-copy)` if unavailable (FR-013)

**Checkpoint**: US2 functional and testable independently — MVP slice complete

---

## Phase 5: User Story 3 - One clear next step (Priority: P1)

**Goal**: Every section offers exactly one dominant CTA; duplicated/vague "Learn More" paths resolved so the join action is never starved

**Independent Test**: Scan `/` — a single dominant join action above the fold, one dominant CTA per section, no duplicate "Learn More → /about" (quickstart scenario 6)

**⚠️ File-ownership notes**: `hero-section.tsx` CTA shipped in US2 (T013) — run US3 after US2 when parallel. `membership/page.tsx` CTA work defers with US1 — skip it here.

### Implementation for User Story 3

- [ ] T017 [US3] Verify the hero join path: `/` first viewport shows exactly one dominant action (post-US2 hero) (FR-014)
- [ ] T018 [P] [US3] Remove the redundant second "Learn More" → `/about` in `src/components/home/offer-section.tsx`; keep the section's single dominant action (FR-014)
- [ ] T019 [US3] CTA audit on `src/components/quiz/intro-screen.tsx` — exactly one dominant, forward-leading action to the quiz. **Membership-page CTA hierarchy defers with US1** (depends on US2 if parallel; shares `intro-screen.tsx` with US4 T024 — hand off or run sequentially)

**Checkpoint**: US3 functional and testable independently

---

## Phase 6: User Story 4 - One brand, every surface (Priority: P2)

**Goal**: Brand-token consistency everywhere — hardcoded grays replaced (dark-mode safe), quiz violet → gold, intro/result palettes aligned, loader/confetti from tokens, nav active state + no empty anchors, footer decluttered

**Independent Test**: Toggle light/dark across Home/About/Membership/Quiz/Contact — no gray washes break dark mode; quiz generalist result is gold; every nav link resolves with the current page active; footer reads as one band (quickstart scenarios 7–8; detector 0 AI-color)

### Implementation for User Story 4

- [ ] T020 [P] [US4] Replace hardcoded grays with token classes in `src/components/home/offer-section.tsx` and the offer cards in `src/app/(static)/membership/page.tsx` (`bg-gray-300/50`, `from-white to-gray-500`, `text-gray-700`) — verify both themes (R-4). Note: the membership page stays live (Google Form until US1); the token fix survives the later rework
- [ ] T021 [P] [US4] Replace remaining flagged hardcodes: team border trick + lanyard `text-black md:text-white` in `src/components/home/team-section.tsx` and `src/components/lanyard.tsx` (→ `text-foreground` token), gray dot in `src/app/(static)/about/carousel.tsx` — verify dark mode (R-4)
- [ ] T022 [US4] Header hygiene in `src/components/layout/header.tsx`: remove the logo `onContextMenu` hijack → plain `Link`; remove the `border-b-grey-100` no-op; strip trailing `#` from nav hrefs (`src/lib/constants/site.ts` `NAV_LINKS` + header/mobile); add active-state indicator via `usePathname` (FR-018, FR-022)
- [ ] T023 [P] [US4] Declutter `src/components/layout/footer.tsx` — keep at most one brand decoration (drop/soften the stacked decoration cluster), strip trailing `#` links, token colors (R-10)
- [ ] T024 [US4] Quiz palette realignment in `src/components/quiz/result-screen.tsx` — generalist `from-violet-500 to-purple-600` → gold pair from tokens (T003); align `src/components/quiz/intro-screen.tsx` archetype badge colors with the result-screen archetype gradient starts (FR-016). Shares `intro-screen.tsx` with US3 T019 — hand off or run sequentially
- [ ] T025 [US4] Realign `src/app/api/og/quiz/route.tsx` — generalist hex pair to gold; archetype hex pairs from `design-tokens.ts` (share the T003 exports so result + OG never diverge) (FR-016)
- [ ] T026 [US4] Read `NextTopLoader` colors in `src/app/layout.tsx` and quiz confetti colors in `src/components/quiz/quiz-container.tsx` from `design-tokens.ts` instead of literals (FR-017)

**Checkpoint**: US4 functional and testable independently

---

## Phase 7: User Story 5 - Trust in the contact funnel (Priority: P2)

**Goal**: Owned-domain contact identity, verified privacy link, human-readable rate-limit/error copy, normal logo behavior

**Independent Test**: Walk the contact/privacy path — canonical email shown, `/privacy#manage-cookies` resolves, rate-limit message is human-readable, right-click on logo shows the normal browser menu (quickstart scenarios 8–9)

**⚠️ File-ownership note**: The logo context-menu removal ships in US4 T022 (same `header.tsx` pass). US5 verifies it end-to-end here.

### Implementation for User Story 5

- [ ] T027 [P] [US5] Contact identity in `src/app/(static)/contact/page.tsx` — show the canonical email from `src/lib/constants/site.ts` (remove the `mailto:info@isatech.com` hardcode); verify `/privacy#manage-cookies` anchor resolves (it exists — keep) (FR-020, FR-021)
- [ ] T028 [P] [US5] Humanize rate-limit + error copy in `src/app/(static)/contact/actions.ts` — human-readable hourly-limit message + recovery guidance, never bare error text (FR-005). (The membership action's copy lands with US1 when reopened — deferred)
- [ ] T029 [US5] Verify trust walkthrough: logo right-click → normal context menu (US4 T022), owned email, resolved privacy link, humanized messages — quickstart scenarios 8–9 (FR-020..022)

**Checkpoint**: US5 functional and testable independently

---

## Phase 8: User Story 6 - Honest, comfortable motion and framing (Priority: P3)

**Goal**: Reduced-motion respected for all touched motion; quiz time claim made honest (copy-only); quiz stays 20 questions, informational, ungated

**Independent Test**: Enable OS reduced-motion → loaders calm/disabled, result badge + count-up snap; quiz intro states an honest time/count; quiz still exactly 20 questions and never implied as required (quickstart scenario 10)

### Implementation for User Story 6

- [ ] T030 [P] [US6] Reduced-motion pass on `src/app/(static)/loading.tsx` and `src/components/common/loading-spinner.tsx` — `animate-bounce`/`animate-ping`/`animate-pulse` swap to calm/disabled under `motion-reduce:` (FR-019)
- [ ] T031 [P] [US6] Springs respect reduced motion in `src/components/quiz/result-screen.tsx` (badge) and `src/components/common/count-up.tsx` — use `useReducedMotion` to snap to end values (FR-019)
- [ ] T032 [US6] Replace "Takes about 3-5 minutes" in `src/components/quiz/intro-screen.tsx` with the org-approved honest wording (T005); confirm quiz question count unchanged (still 20) and result is informational-only (FR-023; FR-008)

**Checkpoint**: US6 functional and testable independently

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Whole-feature verification and the user-requested acceptance gate

- [ ] T033 Run static gates — `npm run type-check`, `npm run lint`, `npm run lint:ox`, `npm run build` (incl. next-sitemap): all green
- [ ] T034 Run the `quickstart.md` validation for the ACTIVE scope (scenarios 4–10; scenarios 1–3 are deferred with US1) and fix any failures found (depends on T033)
- [ ] T035 Re-run the impeccable critique on `src/app/(static)` + `src/components` including the design detector — **gate: score ≥ 8/10, zero open P0/P1 within the implemented scope**. The membership P0 (Google Form) is recorded as **intentionally deferred with reason (user decision 2026-08-21)** in the critique notes — accepted deferral, not a silent drop (depends on T034)
- [ ] T036 [P] Documentation: record the deferred US1 scope, the "Hound" glossary amendment, and the membership DB provisioning as follow-ups in the feature dir / `AGENTS.md` notes (depends on T005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 active immediately; T002 **deferred with US1**
- **Foundational (Phase 2)**: T003 blocks US2 + US4; T005 blocks US2/FR-013 + US6/FR-023; T004 **deferred with US1**
- **Active stories (Phase 4+)**: US2, US3, US4, US5, US6 — all depend on Foundational
- **Polish (Phase 9)**: depends on all five ACTIVE user stories (US1 excluded)

### User Story Dependencies

- **US2 Hero (P1) — MVP**: needs T003 (token frame). Independent otherwise
- **US3 CTAs (P1)**: touches files owned by US2 (hero first viewport) → run after US2; shares `intro-screen.tsx` with US4 (hand off)
- **US4 Consistency (P2)**: needs T003 (token exports); owns `header.tsx` + `footer.tsx` wholesale — US5 verifies the header result, do not co-edit in parallel
- **US5 Trust (P2)**: logo behavior implemented in US4 T022, verified here; runs after US4 if parallel
- **US6 Motion/Framing (P3)**: needs T005 (org quiz wording); no blockers on other stories
- **US1 Membership (DEFERRED)**: all its tasks (T002, T004, T006–T011) park together; resume as one slice when scope reopens

### Within Each User Story

- Component core before integration (US2: T012/T014 → T013/T015; US4: T024/T025/T026 land together on T003 exports)
- Verification task last in each story phase

### Parallel Opportunities (active scope)

- Phase 1: T001 baseline (T002 parked)
- Phase 2: T003 + T005 run together (T004 parked)
- Phase 4 (US2): T012 + T014 (+T016) after T003
- Phase 5 (US3): T018 + T019 (after US2 complete)
- Phase 6 (US4): T020/T021/T022/T023/T024/T025/T026 — all disjoint files; the quiz trio (T024/T025/T026) share the T003 token exports
- Phase 7 (US5): T027 + T028; T029 verifies (needs US4 T022)
- Phase 8 (US6): T030 + T031 + T032
- Phase 9: T036 alongside T033–T035

### Parallel Example: User Story 2 (MVP)

```bash
Task: "Add token color exports to src/lib/constants/design-tokens.ts (T003)"
wait T003 → then:
Task: "Refactor src/components/home/hero-section.tsx (T012)"
Task: "Create src/components/home/archetype-section.tsx (T014)"
then T013 (credibility lane) → T015 (page wiring) → T016 (acronyms) → verify scenario 4–5
```

---

## Implementation Strategy

### MVP First (User Story 2 only — US1 deferred)

1. Phase 1: Setup (T001; T002 parked)
2. Phase 2: Foundational — T003 (tokens) + T005 (org copy)
3. Phase 4: User Story 2 (T012–T016)
4. **STOP and VALIDATE**: quickstart scenarios 4–5 + static gates
5. Deploy/demo if ready — deterministic hero + credibility lane + 4H story now shipped

### Recommended Full Path

1. Setup + Foundational → foundation ready
2. US2 Hero → validate (scenarios 4–5) → demo
3. US3 CTAs → validate (scenario 6)
4. US4 Consistency → validate (scenarios 7–8) + detector 0 findings
5. US5 Trust → validate (scenarios 8–9)
6. US6 Motion/Framing → validate (scenario 10)
7. Polish: full quickstart active scope (T034) → **impeccable critique re-run (T035)** with US1 P0 recorded as deferred → record follow-ups (T036)
8. **When US1 reopens**: re-enable T002 + T004, then Phase 3 tasks T006–T011 as one slice

### Parallel Team Strategy

With multiple developers after Foundation: Developer A → US2; Developer B → US4 (tokens/quiz); Developer C → US6. US3 waits for US2 (hero + intro-screen handoffs); US5 waits for US4 (`header.tsx`). Re-integrate in priority order, then Polish.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to the spec's user story for traceability
- Each ACTIVE user story is independently completable and testable via its quickstart scenario
- No test-suite tasks: repo has no unit-test runner; the acceptance instrument is the critique re-run (T035) + quickstart scenarios
- **Deferred scope (US1)**: T002, T004, T006–T011 parked — keep their files/tasks untouched; the membership page retains its Google Form and the critique's membership P0 stays open as an accepted deferral
- Org copy dependencies gathered in T005 gate surfaces showing acronyms/time claims — never invent copy (constitution P2)
- Commit after each task or logical group (human-reviewed — constitution P7)
- Stop at any checkpoint to validate a story independently
