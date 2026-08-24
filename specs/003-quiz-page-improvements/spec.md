# Feature Specification: Quiz Page Improvements — Polish, Hardening, OG Banner, KV Refactor

**Feature Branch**: `003-quiz-page-improvements`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Let's improve the quiz page. From UI polish and hardening to SEO OG Banner Logic Improve and refactoring KV usage. Use the impeccable skill for UI."

## Clarifications

### Session 2026-08-24

- Q: Should an in-progress quiz survive an accidental refresh or browser back/forward? → A: Yes — persist quiz progress for the browser session; refresh or back/forward resumes at the same question with answers intact, and the record is discarded when the tab closes.
- Q: Should the result-share OG banner use the archetype icon artwork instead of emoji? → A: Yes — the banner shows the archetype's icon art (same art as the in-app result), not emoji.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - A visitor takes the quiz on any device and reaches their result without friction (Priority: P1)

A visitor lands on the quiz, reads the intro, answers the questions (and any
tiebreaker), and reaches a clear, celebratory result — regardless of screen
size or motion preferences. The quiz looks deliberately polished within the
site's ISATech identity, and nothing is ever clipped or unreachable.

**Why this priority**: The quiz is a flagship engagement surface; its
presentation and robustness are the visitor-facing core of this feature.

**Independent Test**: Complete the full quiz on a short mobile viewport (e.g.
landscape phone) and on desktop; every element is reachable and readable, in
both light and dark themes.

**Acceptance Scenarios**:

1. **Given** a short viewport (e.g. ~568px tall, landscape phone), **When** the
   visitor reaches the result screen, **Then** every part of the result
   (badge, description, breakdown, buttons, membership link) is reachable by
   scrolling, with no permanently clipped content and no horizontal scroll.
2. **Given** a visitor who has requested reduced motion, **When** they take the
   quiz, **Then** all transitions and celebrations are non-motion (no flashing,
   no long animations, no confetti storm).
3. **Given** a keyboard-only visitor, **When** they take the quiz, **Then** they
   can select answers, go back, share, and retake with visible focus, and their
   current selection and progress are announced by assistive technology.
4. **Given** the current quiz, **When** a visitor answers a question, **Then**
   the quiz advances promptly with no artificial waiting period.
5. **Given** a visitor mid-quiz, **When** they refresh the page or navigate
   back, **Then** they resume at the same question with their prior answers
   intact, for the duration of the browser session.

---

### User Story 2 - A visitor shares a result and the shared link shows a correct branded banner (Priority: P1)

After finishing the quiz, a visitor shares their result. On social platforms
and chat apps, the shared link renders a branded banner that matches the
in-app result: the right archetype colors, the site's typography, the correct
role name, and a Generalist gold banner when applicable. Odd, forged, or
missing parameters never produce a broken or misleading banner. The result
share pages stay out of search-engine indexes.

**Why this priority**: The share link is the quiz's organic growth loop; a
wrong or ugly banner undermines both the share and the brand.

**Independent Test**: Share each of the 17 canonical outcomes and verify the
generated banner (direct fetch + metadata inspection) shows the correct role,
colors, typography, and archetype icon art; forge an invalid role and verify a
canonical safe banner renders instead.

**Acceptance Scenarios**:

1. **Given** a visitor shares a result (e.g. "True Hacker"), **When** a
   platform or link preview fetches the share URL, **Then** the metadata and
   banner show the correct role with the Hacker color pair and brand
   typography, and the URL redirects a human visitor to the quiz.
2. **Given** a Generalist result, **When** the share URL is fetched, **Then**
   the banner uses the gold pair and the metadata round-trips the
   generalist flag correctly.
3. **Given** a forged or oversized role value (e.g. markup or 200+ characters),
   **When** the banner endpoint is fetched, **Then** a canonical safe banner
   renders — never raw text, an error, or a blank image — and no new
   unbounded banner variants are created.
4. **Given** the result share pages, **When** a search engine crawls them,
   **Then** they are excluded from indexing.

---

### User Story 3 - The site runs without the server-side key-value store (Priority: P2)

The quiz OG banner is the last surface still depending on the server-side
key-value store. After this feature, the site has no dependency on it at all:
the environment requires no store variables, the contact page keeps its
browser-held rate limiting, and the OG banner is protected instead by a
bounded canonical content set plus long-lived caching.

**Why this priority**: Removes an infrastructure dependency and the last
spoofable per-request limiter, per the org-accepted abuse-defense decision
(constitution P5) recorded in this spec.

**Independent Test**: Deploy (or run) the site with the key-value store
variables absent everywhere; the quiz OG banner still renders, contact
submissions still enforce the 5-per-hour cookie limit, and the build passes.

**Acceptance Scenarios**:

1. **Given** a deployment with no key-value store configured, **When** the
   site builds and runs, **Then** all surfaces work, including the OG banner
   route and the contact page.
2. **Given** repeated shares of the same outcome, **When** the banner is
   fetched, **Then** it is served from cache (public, long-lived, with
   stale-while-revalidate) rather than regenerated, and no rate-limit errors
   occur.
3. **Given** the contact page, **When** a visitor submits messages, **Then**
   the existing 5-per-hour browser-held limit still applies and is unchanged.

---

### Edge Cases

- Short or landscape viewports: the quiz container must scroll rather than
  clip (intro, question, tiebreaker, and result screens are all taller than a
  short viewport allows).
- Reduced motion: celebrations and transitions degrade to non-motion; content
  is never conveyed by motion alone.
- Unknown or forged role values in the share URL: coerced to the canonical
  safe banner; never rendered as raw text.
- Oversized role strings: auto-fit/truncate so the banner canvas never
  overflows.
- Missing parameters on the banner endpoint: canonical default (quiz invite)
  banner, never an error or blank image.
- Generalist shares: gold banner and the generalist flag survive the full
  share → metadata → banner round trip.
- Both themes (light and dark): banner and quiz legibility preserved; the
  banner itself renders on its dark canvas regardless of site theme.
- Crawlers without cookies: the banner renders (no cookie dependency).
- Repeated shares of the same outcome: served from cache, not regenerated.
- Search engines crawling result share pages: excluded from indexing.
- A visitor clicking a shared link: redirected to the quiz (existing behavior
  unchanged).
- The membership hand-off: unchanged; the membership page keeps its current
  form (deferred US1).
- Refresh or back/forward mid-quiz: the visitor resumes at the same question
  with answers intact (session-scoped); closing the tab discards the record
  and the quiz starts fresh.

## Requirements _(mandatory)_

### Functional Requirements

**Quiz UI polish & hardening**

- **FR-001**: The quiz MUST be fully reachable and readable on common mobile
  and desktop viewports in both themes; when content exceeds the viewport the
  quiz area MUST scroll instead of clipping (intro, question, tiebreaker, and
  result screens included).
- **FR-002**: The quiz MUST preserve or improve the current accessibility
  posture (constitution P3): full keyboard operability, selection and progress
  state announced to assistive technology, visible focus, and reduced-motion
  honored for every new or changed animation.
- **FR-003**: Answering a question MUST advance the quiz promptly with no
  artificial waiting period perceptible to the visitor.
- **FR-004**: The visual polish MUST stay within the incumbent identity
  (ISATech blue `#203C90`, gold `#FFAC03`, existing archetype colors);
  presentation may be refined, but quiz content and scoring MUST remain
  unchanged.
- **FR-005**: Intro copy MUST remain org-owned: the existing
  `TODO(org-copy)` markers stay in place; no invented wording for the
  question-count/pace line.
- **FR-006**: The quiz MUST NOT rely on motion to convey meaning; all states
  remain comprehensible with animations reduced or disabled.
- **FR-007**: Retaking the quiz and the membership hand-off MUST keep working
  unchanged.
- **FR-008**: An in-progress quiz MUST survive an accidental page refresh or
  browser back/forward within the same browser session: the visitor resumes at
  the same question with prior answers intact; the record MUST be discarded
  when the session ends (tab closed).

**OG banner (result share)**

- **FR-009**: The result-share banner MUST only render for the canonical set
  of quiz outcomes (the 16 adjective+archetype combinations and Generalist);
  any other role value MUST be coerced to a canonical safe banner rather than
  rendered as given.
- **FR-010**: The banner MUST display the archetype's icon artwork — the same
  art shown in the in-app result — rather than emoji or other substitutes.
- **FR-011**: Role text in the banner MUST always fit within the banner
  canvas — no overflow at the maximum canonical role length.
- **FR-012**: The banner MUST use the site's brand typography and the
  archetype's color pair from the same single source of truth used by the
  in-app result, so the shared image matches the site.
- **FR-013**: The Generalist outcome MUST render its gold banner and
  round-trip correctly through share → metadata → banner.
- **FR-014**: Share URLs and metadata MUST be internally consistent
  (complete and correctly encoded: role, archetype, generalist) so every
  platform renders the same banner as the in-app result.
- **FR-015**: Missing parameters MUST produce the canonical default (quiz
  invite) banner, never an error or blank image.
- **FR-016**: Canonical banners MUST be cacheable such that repeated shares of
  the same outcome do not regenerate the image (public, long-lived, with
  stale-while-revalidate); the banner MUST render for cookie-less crawlers.
- **FR-017**: The result share pages MUST be excluded from search-engine
  indexing (they exist only to render banners and redirect visitors to the
  quiz).

**Key-value store refactor**

- **FR-018**: The site MUST stop using the server-side key-value store on
  every surface; the banner route's per-requester rate limit is replaced by
  the bounded canonical set plus long-lived caching as the abuse defense
  (org decision per constitution P5, recorded in this spec).
- **FR-019**: The environment MUST no longer require key-value store
  variables anywhere (validation and example configuration updated); the site
  MUST build and run without them.
- **FR-020**: The Contact page's browser-held rate limiting MUST remain
  unchanged and functional.
- **FR-021**: The change MUST NOT regress other surfaces: build, lint, and
  type-check pass; contact, home, and other pages behave unchanged.

### Key Entities _(include if feature involves data)_

- **Quiz Outcome**: the canonical result string — one of 16
  adjective+archetype combinations or Generalist; the only values a result
  share may carry. Drives the banner and the in-app result.
- **Archetype**: one of the 4H roles (Hustler, Hacker, Hipster, Hound —
  canonical glossary terms), each with a fixed color pair; shared source of
  truth for in-app result styling and the banner.
- **Result Share Link**: the URL carrying role, archetype, and generalist
  flags; renders the banner for platforms and redirects human visitors to the
  quiz.
- **OG Banner**: the generated 1200×630 share image for an outcome.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 17 canonical outcomes render a correct banner via the share
  flow (verified by direct fetch + metadata inspection); each shows the right
  role, color pair, typography, and archetype icon art.
- **SC-002**: A visitor can complete the quiz end-to-end on a ~568px-tall
  viewport (mobile landscape) with all content reachable — no permanent
  clipping, no horizontal scroll.
- **SC-003**: Forged or oversized role values (e.g. markup, 200+ characters)
  produce the canonical safe banner — never raw text or an error — and do not
  expand the number of cacheable banner variants beyond the canonical set.
- **SC-004**: Repeated shares of the same outcome do not regenerate the image:
  the banner response carries public, long-lived caching with
  stale-while-revalidate, and no rate-limit errors occur.
- **SC-005**: The site builds and serves with the server-side key-value store
  fully absent (no store variables required in any environment); contact
  submissions still enforce the 5-per-hour browser-held limit.
- **SC-006**: Accessibility posture is preserved: keyboard-only completion
  succeeds, selection and progress are announced, and focus is visible —
  validated in both light and dark themes.
- **SC-007**: The refinement keeps the incumbent identity: quiz content and
  scoring are unchanged, and the visual presentation stays within the
  ISATech blue/gold identity.
- **SC-008**: A visitor who refreshes or navigates back mid-quiz resumes at
  the same question with prior answers intact, for the duration of the browser
  session; closing the tab resets the quiz.

## Assumptions

- The work is a refinement of the incumbent visual world (PRODUCT.md scope
  decision), not a redesign or rebrand.
- Quiz questions, choices, weights, and result logic remain unchanged; only
  presentation and robustness are in scope.
- The canonical outcome set is defined by the quiz data (16
  adjective+archetype combinations plus Generalist); "4H Personality Quiz" is
  not a shareable outcome — it is only the no-parameters default banner.
- **Org decision (constitution P5 v1.1.0)**: the banner route's per-requester
  rate limit is removed and the abuse defense becomes the bounded canonical
  content set plus long-lived public caching. Browser-held limiting cannot
  apply to the banner because social crawlers fetch it without cookies; this
  spec records the org's acceptance of this mechanism.
- The `/quiz` landing page keeps its static social image; the dynamic banner
  work covers the result-share flow only (org scope decision).
- The deployment environment may drop the key-value store variables after
  this feature ships; nothing in the app requires them.
- The membership hand-off is unchanged: the membership page keeps its current
  form (deferred US1).
- No new third-party dependencies are introduced.
- Intro copy remains org-supplied; `TODO(org-copy)` markers persist until the
  org provides wording.
