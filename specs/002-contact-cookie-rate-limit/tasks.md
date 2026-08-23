# Tasks: Contact Page Cookie-Based Rate Limiting

**Input**: Design documents from `/specs/002-contact-cookie-rate-limit/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated test runner exists in this project; the feature spec did
not request tests. Validation is via the node-based logic assertions and the
manual E2E scenarios in quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

**Status note (2026-08-23)**: Implementation tasks T001–T014, T017, T018, T020
landed in-session and passed static verification (type-check, lint, build,
Prettier, 11/11 logic assertions). Tasks left unchecked are the remaining
browser-based validation and final handoff steps — verify, don't re-implement.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (Next.js App Router)**: `src/app/` (routes + server actions), `src/lib/services/` (pure helpers), `specs/002-contact-cookie-rate-limit/` (docs)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Governance + feature documentation baseline

- [x] T001 [P] Amend constitution P5 to v1.1.0 (rate-limiting mechanism org-decided) in `.specify/memory/constitution.md`
- [x] T002 [P] Propagate mechanism-neutral rate-limiting wording to `AGENTS.md` and `README.md`
- [x] T003 Create spec + quality checklist in `specs/002-contact-cookie-rate-limit/` (spec.md, checklists/requirements.md) and point `.specify/feature.json` at it
- [x] T004 Create plan artifacts in `specs/002-contact-cookie-rate-limit/` (plan.md, research.md, data-model.md, quickstart.md, contracts/contact-submission.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure limiter module + terminology alignment that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create pure cookie-limiter module `src/lib/services/cookie-rate-limit.ts` (constants: `RATE_LIMIT_COOKIE_NAME`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_SUBMISSIONS`; functions: `parseSubmissionTimes`, `isRateLimited`, `appendSubmissionTimestamp`)
- [x] T006 Export the limiter via the services barrel `src/lib/services/index.ts`
- [x] T007 Align spec terminology to the canonical glossary term **Inquiry** (P1) in `specs/002-contact-cookie-rate-limit/spec.md` (replace "Contact Submission" entity name)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - A visitor submits an Inquiry (Priority: P1) 🎯 MVP

**Goal**: `submitMessage` accepts a valid Inquiry (Zod → Turnstile → Notion) and the KV-backed limiter is fully removed from the contact path.

**Independent Test**: quickstart.md §3 steps 1–2 — submit a valid Inquiry on `/contact`, see confirmation, verify the record in Notion.

### Implementation for User Story 1

- [x] T008 [US1] Remove Upstash/Vercel KV imports, `Ratelimit` init, IP-header logic, and the `getRateLimitStatus` helper from `src/app/(static)/contact/actions.ts`
- [x] T009 [US1] Wire the cookie-based limiter into `submitMessage` in `src/app/(static)/contact/actions.ts` (read + prune cookie via `next/headers` `cookies()`; keep Zod → Turnstile → Notion order)
- [x] T010 [US1] Keep Cloudflare Turnstile `siteverify` and the Notion `createPage` write unchanged in `src/app/(static)/contact/actions.ts` (FR-001, FR-008)
- [ ] T011 [US1] Manual E2E: valid Inquiry → confirmation + Notion record (quickstart.md §3 steps 1–2)

**Checkpoint**: User Story 1 fully functional — Inquiry submit works with no server-side limiter

---

## Phase 4: User Story 2 - A visitor is rate limited (Priority: P1)

**Goal**: 5 successful Inquiries per rolling 60-min window per browser → 6th refused with the friendly message; only successful submissions count.

**Independent Test**: quickstart.md §3 steps 3–6 — 6th submit blocked; clear cookies → allowed again; an invalid submit does not count; cookie is HttpOnly JSON.

### Implementation for User Story 2

- [x] T012 [US2] Enforce the 5-per-rolling-hour block with the existing friendly message in `src/app/(static)/contact/actions.ts` (FR-004, FR-005)
- [x] T013 [US2] Append the timestamp to the cookie only after the Notion write succeeds in `src/app/(static)/contact/actions.ts` (FR-006, FR-007)
- [x] T014 [US2] Treat unreadable/malformed/absent cookies as an empty record (first-time submitter) in `src/lib/services/cookie-rate-limit.ts` (FR-009)
- [ ] T015 [US2] Manual E2E: 5 submits → 6th blocked with friendly message; clear cookies → accepted; invalid submit doesn't consume budget (quickstart.md §3 steps 3–5)
- [ ] T016 [US2] Manual E2E: confirm `contact_rate_limit` is HttpOnly and holds a JSON timestamp array (quickstart.md §3 step 6)

**Checkpoint**: User Stories 1 AND 2 both work — full limit cycle verified

---

## Phase 5: User Story 3 - No regression for other surfaces (Priority: P2)

**Goal**: The quiz OG route keeps its KV-backed limiter; KV deps/env untouched; consent banner unchanged.

**Independent Test**: quickstart.md §4 — `/quiz` and the quiz result OG image still work; `/privacy#manage-cookies` unchanged.

### Implementation for User Story 3

- [x] T017 [US3] Verify `src/app/api/og/quiz/route.tsx`, `KV_*` env vars in `src/lib/env.ts`, and the `@vercel/kv`/`@upstash/ratelimit` packages are untouched (FR-010)
- [x] T018 [US3] Run node-based logic assertions (expect 11/11 PASS) against `src/lib/services/cookie-rate-limit.ts` (quickstart.md §2)
- [ ] T019 [US3] Regression check: `/quiz` + quiz result OG image work; `/privacy#manage-cookies` and consent banner unchanged (quickstart.md §4)

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Agent-context pointer, final gates, and human-reviewed handoff

- [x] T020 [P] Update the SPECKIT active-plan pointer in `AGENTS.md` to `specs/002-contact-cookie-rate-limit/plan.md`
- [x] T021 Run full static verification on the final tree: `npm run type-check`, `npm run lint`, `npm run build`, Prettier check on changed files
- [ ] T022 Run quickstart.md §1–§4 end-to-end with real credentials (Turnstile + Notion) and record results
- [ ] T023 [P] Prepare human-reviewed commits per P7 (git add + conventional commit titles for docs + feat groups) — do NOT commit automatically

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Sequential in priority order (P1 → P1 → P2)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories
- **User Story 2 (P1)**: Depends on US1's `submitMessage` path (same file `src/app/(static)/contact/actions.ts`) — sequential after US1
- **User Story 3 (P2)**: Can start after Foundational - no dependencies on US1/US2 (different files)

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority
- Manual E2E tasks are the story's completion gate (quickstart.md scenarios)

### Parallel Opportunities

- T001/T002 (Setup) run in parallel
- US3 verification (T017–T019) can run in parallel with US1/US2 browser E2E (different files/browsers)
- T022/T023 (Polish) are independent of each other

---

## Parallel Example: User Story 1

```bash
# Launch the independent implementation edits together (single-file story, staged in one pass):
Task: "Remove KV limiter wiring from src/app/(static)/contact/actions.ts"  (T008)
Task: "Add cookie limiter wiring to src/app/(static)/contact/actions.ts"   (T009)
# Then run static gates:
Task: "npm run type-check && npm run lint"                                  (T021)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup ✅
2. Complete Phase 2: Foundational ✅
3. Complete Phase 3: User Story 1 ✅ (static verification green)
4. **STOP and VALIDATE**: quickstart.md §3 steps 1–2 (T011) — pending manual E2E
5. Deploy/demo when T011 passes

### Incremental Delivery

1. Setup + Foundational → Foundation ready ✅
2. User Story 1 → static-verified ✅; manual E2E pending (T011)
3. User Story 2 → static-verified ✅; manual E2E pending (T015, T016)
4. User Story 3 → verification-only (T017 ✅, T018 ✅, T019 pending)
5. Each story adds value without breaking previous stories

### Notes on this feature

- US1 and US2 are intentionally coupled (one server action) — the limiter's
  allow path (US1) and block path (US2) live in the same function, so they were
  implemented as one edit and split here for traceability.
- Multi-tab concurrency overshoot and refusal-logging are accepted/decided
  tradeoffs (research.md R-004, R-005) — no tasks required.
