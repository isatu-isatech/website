---
description: "Task list for quiz page improvements (003)"
---

# Tasks: Quiz Page Improvements — Polish, Hardening, OG Banner, KV Refactor

**Input**: Design documents from `/specs/003-quiz-page-improvements/`

**Prerequisites**: plan.md (required), spec.md (user stories), research.md (R1–R9 decisions), data-model.md (entities), contracts/ (3 contracts), quickstart.md (validation scenarios)

**Tests**: No automated test framework exists in this repo. Validation is manual via `quickstart.md` scenarios plus the `npm run type-check` / `npm run lint` / `npm run build` gates. No TDD test tasks are generated (not requested).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 = quiz UX, US2 = share/banner, US3 = KV removal)
- Exact file paths included in every description

## Path Conventions

- Single Next.js project: `src/` at repository root. Shared quiz logic: `src/lib/quiz/`. OG route: `src/app/api/og/quiz/`.

---

## Phase 1: Setup

**Purpose**: Baseline + feature assets before any code changes

- [x] T001 Establish a green baseline: run `npm run type-check`, `npm run lint`, `npm run build` and confirm all pass with zero errors before touching any file
- [x] T002 [P] Bundle Poppins TTF (weights 400 and 700, matching `--font-poppins`) into `src/app/api/og/quiz/fonts/` (e.g. `Poppins-400.ttf`, `Poppins-700.ttf`) with an OFL license note file — per research R1

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared quiz library that US1 (progress) and US2 (canonical) both consume

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create `src/lib/quiz/canonical.ts`: canonical outcome set derived from `Object.keys(archetypes)` in `src/lib/quiz-data.ts` (17 roles), `isCanonicalRole(role)`, `ArchetypeKey` type guard, and `buildBannerUrl(role, archetype, isGeneralist)` that percent-encodes all params — per research R3
- [x] T004 [P] Create `src/lib/quiz/progress.ts`: sessionStorage schema for `4h-quiz-progress-v1` — `loadProgress()`, `saveProgress(state)`, `clearProgress()`, plus a `version` token derived from quiz-data shape and integrity/version validation that discards mismatched records — per research R4 and `contracts/quiz-progress-session.md`
- [x] T005 Create `src/lib/quiz/index.ts` barrel re-exporting both helpers (depends on T003, T004)

**Checkpoint**: `src/lib/quiz/` compiles (`npm run type-check`) — user story implementation can begin

---

## Phase 3: User Story 1 - A visitor takes the quiz on any device and reaches their result without friction (Priority: P1) 🎯 MVP

**Goal**: Quiz is fully reachable on short viewports (no clipping), survives refresh/back-forward (session-scoped), preserves a11y, and advances without artificial delay — all within the incumbent ISATech identity.

**Independent Test**: Complete the full quiz on a ~568px-tall viewport in light and dark themes (everything scrollable, no horizontal scroll); refresh mid-quiz and resume at the same question with answers intact; keyboard-only completion with announced selection/progress; reduced-motion honored (quickstart scenarios 1–3).

### Implementation for User Story 1

- [x] T006 [P] [US1] Replace the fixed-height `h-[calc(100vh-60px)]` + `overflow-hidden` container in `src/app/quiz/page.tsx` with a scroll-safe layout (`min-h` + scrollable quiz area) that keeps the ambient background decorations — per research R8 / FR-001
- [x] T007 [US1] Integrate session persistence into `src/components/quiz/quiz-container.tsx` using `src/lib/quiz/progress.ts` (depends on T004, T005): restore once on mount via `useEffect` (client-only), save after every committed state transition, clear on reaching the result and on retake; discard invalid/version-mismatched records — FR-008
- [x] T008 [P] [US1] Expose selection and progress to assistive technology in `src/components/quiz/question-screen.tsx` (progress rendered with `role="progressbar"` + `aria-valuenow`; choice buttons announce selected state; visible focus preserved; reduced-motion respected) — FR-002
- [x] T009 [P] [US1] Identity-preserving visual polish pass on `src/components/quiz/intro-screen.tsx` (hierarchy, spacing, motion polish within ISATech blue/gold; keep the `TODO(org-copy)` marker and the dynamic `{questions.length}` count) — FR-004/FR-005
- [x] T010 [P] [US1] Identity-preserving visual polish pass on `src/components/quiz/result-screen.tsx` (layout rhythm, breakdown card, action buttons; keep membership hand-off link and the reduced-motion confetti gate) — FR-004/FR-006/FR-007
- [x] T011 [US1] Remove the artificial 600ms answer-advance delay in `src/components/quiz/quiz-container.tsx` so the quiz advances promptly (same file as T007 — run after it) — FR-003

**Checkpoint**: US1 is fully functional — run quickstart scenarios 1–3 (viewport reachability, refresh persistence, a11y)

---

## Phase 4: User Story 2 - A visitor shares a result and the shared link shows a correct branded banner (Priority: P1)

**Goal**: Result-share banners render only canonical outcomes with brand typography + archetype icon art, forge-safe (302 to invite default), cached, and the share pages are noindexed.

**Independent Test**: Fetch `/api/og/quiz` for all 17 canonical roles — correct color pair, icon art, Poppins text (quickstart scenario 4); forged/oversized roles return 302 to the invite banner with no new variants (scenario 5); repeated shares served from cache with the documented `Cache-Control` (scenario 6); result page metadata carries `noindex` and byte-identical URLs.

### Implementation for User Story 2

- [x] T012 [US2] Rewrite `src/app/api/og/quiz/route.tsx` (depends on T002, T003): validate `role` against the canonical set — unknown/forged/missing → `302` to the canonical invite banner URL; detect Generalist from `role === "Generalist"` or `generalist === "true"`; embed Poppins woff2 (fs) and archetype icon PNGs (`public/assets/decorations/{hustler,hacker,hipster,hound}.png`, `4h-vertical.png` for Generalist — same mapping as the result screen) as data URIs; keep 1200×630, `runtime = "nodejs"`, and the `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800` header; **delete the `Ratelimit`/`kv` block and `x-forwarded-for` parsing** — per research R1/R2/R3/R6 and `contracts/og-quiz-banner.md`
- [x] T013 [P] [US2] Update metadata in `src/app/quiz/result/page.tsx` (depends on T003): `robots: { index: false, follow: false }`; percent-encode `role` and `archetype` in every constructed URL; append `generalist=true` to `og:url` when applicable so metadata/OG/share URLs are byte-identical per outcome — FR-014/FR-017, per research R7 and `contracts/result-share-link.md`
- [x] T014 [US2] Refactor the share-URL builder in `src/components/quiz/quiz-container.tsx` (`shareResult`) to use `buildBannerUrl` from `src/lib/quiz/canonical.ts` (depends on T003, T013) so the share button, metadata, and OG image URLs are byte-identical, including the `generalist` flag

**Checkpoint**: US2 is fully functional — run quickstart scenarios 4–6

---

## Phase 5: User Story 3 - The site runs without the server-side key-value store (Priority: P2)

**Goal**: No Vercel KV dependency anywhere; environment requires no KV variables; contact's cookie limiter untouched.

**Independent Test**: Grep for `vercel/kv` / `upstash` → no hits in `src/` or `package.json`; `npm run build` passes with no KV variables set; contact page still enforces the 5-per-hour browser-held limit (quickstart scenario 7).

### Implementation for User Story 3

- [x] T015 [US3] Remove `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` from `src/lib/env.ts` (keep the Zod schema valid) and from `.env.example` — FR-019
- [x] T016 [P] [US3] Remove `@vercel/kv` and `@upstash/ratelimit` from `dependencies` in `package.json` and run `npm install` to prune the lockfile — FR-018
- [x] T017 [US3] Verify removal completeness (depends on T015, T016): `grep -rn "vercel/kv\|upstash\|KV_REST\|KV_URL" src/ package.json .env.example` returns no hits; confirm `src/lib/services/cookie-rate-limit.ts` and the Contact flow are unchanged — FR-020

**Checkpoint**: US3 is complete — run quickstart scenario 7

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and documentation across all stories

- [x] T018 [P] Run the full gate: `npm run type-check`, `npm run lint` (zero warnings), `npm run build` — all must pass (depends on all story phases)
- [x] T019 [P] Run the complete `specs/003-quiz-page-improvements/quickstart.md` validation (scenarios 1–7): both themes, reduced motion, all 17 banners, forged params, cache headers, KV-free build, contact limit — record results (depends on all story phases)
- [x] T020 [P] Housekeeping: run `npm run lint` (prettier auto-format per repo config) over changed files; correct the stale stack facts in `AGENTS.md` notes (Next.js 16 with `--webpack` scripts, middleware at `src/proxy.ts`) and note the KV removal + bundled fonts

**Checkpoint**: All gates green; quickstart scenarios pass; docs reflect the new state

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001 (baseline) and T002 (fonts, [P]) run first
- **Foundational (Phase 2)**: Depends on Setup; T003/T004 run in parallel, T005 (barrel) after both — **blocks all user stories**
- **User Stories (Phase 3+)**: All depend on Phase 2
  - **US1 (P1)**: T007 and T011 both edit `src/components/quiz/quiz-container.tsx` — run sequentially (T011 after T007); all other US1 tasks are [P] parallel
  - **US2 (P1)**: T012 depends on T002 + T003; T013 is [P]; T014 edits the same `quiz-container.tsx` file as US1's T007/T011 — schedule after US1 completes (or coordinate)
  - **US3 (P2)**: T015/T016 parallel, T017 after both; independent of US1/US2 except that T012 (US2) deletes the OG route's KV usage — the grep in T017 covers it
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **US1**: No dependencies on other stories — the MVP slice
- **US2**: No dependencies on US1 (only shares `quiz-container.tsx` for T014 — avoid parallel edits on that file)
- **US3**: Independent (overlaps T012's KV deletion only via the verification grep)

### Within Each User Story

- Shared lib first (Phase 2) → same-file tasks sequential → [P] tasks parallel
- Story complete (checkpoint) before moving to the next priority

### Parallel Opportunities

- **Phase 1**: T001 and T002 in parallel
- **Phase 2**: T003 and T004 in parallel
- **US1**: T006, T008, T009, T010 in parallel; then T007; then T011
- **US2**: T012 and T013 in parallel (T014 follows, touching `quiz-container.tsx`)
- **US3**: T015 and T016 in parallel; T017 after
- **Phase 6**: T018, T019, T020 in parallel

---

## Parallel Example: User Story 1

```bash
# Launch the independent file-edits for US1 together:
Task: "Scroll-safe container in src/app/quiz/page.tsx (T006)"
Task: "A11y semantics in src/components/quiz/question-screen.tsx (T008)"
Task: "Polish intro-screen.tsx (T009)"
Task: "Polish result-screen.tsx (T010)"

# Then the quiz-container.tsx work sequentially:
Task: "Session persistence in quiz-container.tsx (T007)"
Task: "Remove artificial advance delay in quiz-container.tsx (T011)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (baseline + fonts)
2. Complete Phase 2: Foundational (`src/lib/quiz/`)
3. Complete Phase 3: User Story 1 (scroll safety, persistence, a11y, polish, no artificial delay)
4. **STOP and VALIDATE**: quickstart scenarios 1–3 + gates
5. Ship US1 as the MVP increment

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add US1 → validate independently → deploy/demo (MVP)
3. Add US2 (banner + share) → validate scenarios 4–6 → deploy
4. Add US3 (KV removal) → validate scenario 7 + gates → deploy
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Phase 2 is done:
   - Developer A: US1 (quiz UX + persistence)
   - Developer B: US2 (OG banner + result metadata) — avoid concurrent edits to `quiz-container.tsx` with Developer A
   - Developer C: US3 (KV removal) — fully independent
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps a task to its user story for traceability
- Same-file constraints: `src/components/quiz/quiz-container.tsx` is touched by T007, T011, T014 — never in parallel
- Verify gates after each story checkpoint (`npm run type-check`, `npm run lint`, `npm run build`)
- Commit after each logical group (see completion report for proposed commit titles)
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same-file parallel edits, cross-story dependencies that break independence
