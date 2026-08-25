# Feature Specification: Resolve Latest Critique Issues

**Feature Branch**: `001-resolve-critique-issues`

**Created**: 2026-08-21

**Status**: Draft

**Input**: User description: "Resolve all issues specified on the latest critique document. Re-run impeccable critique after implementation."

## Clarifications

### Session 2026-08-21

- Q: What hero media strategy replaces the random-per-load hero video? → A: One fixed background video on every visit — ambient, muted, autoplays on load, all player controls hidden, no user play-control; a designed static fallback frame is shown while media loads.
- Q: How is the "3–5 min" quiz claim resolved (copy-only vs shortening vs deferral)? → A: Copy-only fix — keep the 20-question quiz, make the stated time/number honest with org-approved wording.
- Q: How does the membership application recover when the submission fails at the recording step? → A: Human-readable error + retry with all entered data retained within the session (no cross-session draft persistence).
- Q: Which term is canonical for the 4th 4H archetype — glossary "Hypeman" or shipped-product "Hound"? → A: "Hound" becomes canonical — matches the shipped product, quiz data, OG images, and the critique/shape brief; CONTEXT.md glossary is amended via the constitution's amendment path (recorded as a dependency).

## User Scenarios & Testing _(mandatory)_

The authoritative issue set is the latest impeccable critique snapshot, `.impeccable/critique/2026-08-21T03-43-36Z__src-app.md` (score 6/10; 2×P0, 2×P1, plus P2/P3 items, detector findings, persona red flags, and minor items), folded with the approved build order in `docs/shape-brief.md`. Every story below maps to a prioritized slice of that issue set; each slice is independently shippable and verifiable.

### User Story 1 - Apply for membership without leaving the site (Priority: P1)

A prospective member who clicks the join action stays on the site: the bare external form in a new tab is replaced by the native Standard Application Form, organized into clear sections with a review step before submit and a confirmation on completion. This resolves the critique's P0 "membership application abandons the brand shell" and Riley's "membership chain dead-ends in a new-tab form."

**Why this priority**: The critique rates this the strongest ask on the site delivered through its least-designed moment — the single biggest trust and conversion loss. Per ADR 0002, the native Membership pipeline is pulled into this effort so the join surface is built once in final form.

**Independent Test**: From the homepage, a user clicks the join action and completes a full membership application entirely on the site — never opening a new tab — and the submission appears in the org's records. This slice delivers the full membership value on its own.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on the homepage, **When** they activate the join action, **Then** the application opens inside the site with no new tab or external window.
2. **Given** an applicant halfway through the application, **When** they navigate back to correct a field, **Then** every previously entered value is retained.
3. **Given** a completed application, **When** the applicant submits, **Then** they see a confirmation on the site and the full submission appears in the org's records for officer review without any manual re-entry.
4. **Given** an applicant who takes the quiz beforehand, **When** they reach the role-preferences step, **Then** the quiz result is informational only and never overrides or gates their own 4H selections.

---

### User Story 2 - A steady, credible first impression (Priority: P1)

The homepage hero stops presenting a different random video on every visit. The first viewport becomes deterministic — a single fixed background video (ambient, muted, autoplay on load, player controls hidden) with a designed static frame while media loads, and a credibility lane showing the org's motto and founding year above the fold. The 4H archetype story leads the recruitment narrative instead of being buried behind the quiz funnel. This resolves the critique's P0 "random hero video," P3 "motto + Est. 2021 absent," and Jordan's unexplained acronyms; the deliberate muted-autoplay hero (an org-authored choice) replaces the random-video surprise.

**Why this priority**: The first viewport sets the entire credibility thesis; the critique calls the random-video behavior proof that the homepage has "no single authored thesis" (provocative question 3).

**Independent Test**: On-device, a visitor loads the homepage twice and sees the same primary presentation every time; the motto and founding year are visible without scrolling; before the media loads, a designed frame (never a blank dark box) is visible. This slice is a complete, shippable first-impression improvement on its own.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage repeatedly, **When** the first viewport renders, **Then** the primary media selection is stable across visits (not randomized per load).
2. **Given** a slow connection or blocked media, **When** the hero is rendering, **Then** a designed static frame with the brand identity is shown — never a blank black area.
3. **Given** a visitor on the homepage, **When** the first viewport loads, **Then** the fixed hero video autoplays muted on load with all player controls hidden (no visible play, pause, or scrub controls).
4. **Given** a first-time visitor, **When** they view the first viewport, **Then** the org's motto and founding year are visible above the fold, and any acronym on the page has its org-approved full name on first use.
5. **Given** a visitor who has not taken the quiz, **When** they browse the homepage, **Then** the 4H archetype story (Hustler, Hacker, Hipster, Hound) is visibly presented as the org's recruitment story — not hidden behind the quiz funnel.

---

### User Story 3 - One clear next step (Priority: P1)

CTA clutter is removed: the landing page presents a single dominant join action above the fold, each section carries at most one dominant call to action, and the duplicated, vague "Learn More" paths are resolved so the primary action is never starved. This resolves the critique's P1 "competing/vague CTAs starve the primary action" and Jordan's "no join path above the fold."

**Why this priority**: The shape brief's outcome is a visitor who moves toward Membership / Contact from the first viewport; a starved primary action blocks that outcome across every persona.

**Independent Test**: On the homepage, a first-time visitor can identify and reach a join action from the first viewport in one glance without scrolling; each section offers exactly one dominant action. This slice stands alone as a navigation-improvement release.

**Acceptance Scenarios**:

1. **Given** the homepage first viewport, **When** a first-time visitor scans it, **Then** they can immediately see a single dominant join action — no scrolling required.
2. **Given** any homepage section, **When** a visitor looks for next steps, **Then** at most one dominant call to action is present, and it leads forward in the funnel (not back to a generic about page).
3. **Given** the duplication flagged in the critique (two "Learn More" paths to the same destination), **When** a visitor encounters them, **Then** each visual section has labels that describe its actual destination, with no two sections presenting identical labels for different intents.

---

### User Story 4 - One brand, every surface (Priority: P2)

The whole site renders as one org: hardcoded gray washes that break dark mode are replaced by the brand token system, the quiz's out-of-brand purple result is realigned to the blue/gold world, quiz intro and result palettes match, the browser loading indicator uses the brand palette, navigation shows an active state with no empty anchors, and the footer stops reading as a cluttered ad band. This resolves the critique's P1 "semantic/color token violations," the detector's AI-color and gradient-text findings, and the listed minor items.

**Why this priority**: Consistency is what makes the authored 4H/lanyard assets read as a real identity instead of "interchangeable scaffolding" (assessment verdict); it also fixes Riley's dark-mode breakage.

**Independent Test**: A visitor toggles between light and dark themes across Home, About, Membership, Quiz, and Contact and sees the same brand palette on every surface; the quiz result for every archetype stays within brand colors. This slice is a complete consistency release on its own.

**Acceptance Scenarios**:

1. **Given** any public page in dark mode, **When** a visitor views it, **Then** no hardcoded light-gray wash or unreadable contrast remains (the flagged offer cards render correctly in both themes).
2. **Given** the quiz result screen, **When** any archetype result is shown, **Then** the result colors come from the blue/gold brand world — the out-of-brand purple is gone.
3. **Given** the quiz intro and result screens, **When** a visitor moves through the quiz, **Then** the accent palettes match each other and the site's brand tokens.
4. **Given** the site navigation, **When** a visitor is on a page, **Then** the current page is visibly indicated and every navigation link resolves to a real page — no empty anchor destinations.
5. **Given** the browser loading indicator and the site footer, **When** they are displayed, **Then** both use only the shared brand palette and the footer no longer reads as a stacked-decorations ad band.

---

### User Story 5 - Trust in the contact funnel (Priority: P2)

The contact path earns trust: public contact identity uses the org's owned domain, every privacy/trust link resolves to a verified destination or is removed, rate-limit and error messages are human-readable with a recovery path, and the logo behaves as a normal element (right-click opens the standard browser menu instead of hijacking to a redirect). This resolves the critique's P2 items and Riley's trust red flags, and lands the "Contact trust hardening" boundary item (H1).

**Why this priority**: Constitution P5 makes verified trust signals a standing requirement; a mismatched email domain and a hijacked context menu actively erode credibility at the strongest ask.

**Independent Test**: A visitor walks the full contact path (contact page, privacy link, submit-with-rate-limit state) and every step shows owned, working, human-readable signals; right-clicking the logo shows the normal browser menu. This slice is a complete trust-hardening release on its own.

**Acceptance Scenarios**:

1. **Given** the contact page, **When** a visitor reads the contact identity, **Then** the address uses the org's owned domain — the mismatched public address is gone.
2. **Given** the privacy path, **When** a visitor follows every link from the contact surface, **Then** each link resolves to a real, verified destination, or is removed.
3. **Given** an applicant or inquirer hitting the rate limit, **When** they are blocked, **Then** they see a human-readable message explaining what happened and how to proceed — not bare error text.
4. **Given** the site logo, **When** a visitor right-clicks it, **Then** the standard browser context menu appears; no redirect or interception occurs.

---

### User Story 6 - Honest, comfortable motion and framing (Priority: P3)

Remaining friction is smoothed: loading indicators respect reduced-motion preferences, the quiz's stated time/count is corrected to honestly match the real 20-question experience (org-approved copy only — the quiz itself is unchanged), and the low-priority detector items (bounce-easing loaders) are confirmed acceptable or softened — while the quiz remains the same device, never required and never a vetting criterion. This resolves the critique's minor items and Casey's "20-question serial commitment" flag.

**Why this priority**: Small honesty and comfort fixes; lowest severity, but cheap and visible once the higher-priority slices land.

**Independent Test**: With reduced motion enabled, a visitor sees no bouncing/springy loading animation; the quiz's stated time and count match what a user experiences. This slice ships as a small, complete release.

**Acceptance Scenarios**:

1. **Given** a visitor with reduced-motion enabled, **When** any loading indicator or entrance animation runs, **Then** it is calm or disabled — no strong bounce/spring easing.
2. **Given** the quiz entry, **When** a visitor reads the stated length, **Then** the stated time and number of steps honestly match the actual 20-question experience — corrected via org-approved copy only, with the quiz itself unchanged.
3. **Given** the quiz journey, **When** a visitor completes it, **Then** the result is clearly informational and the site never implies the quiz is a required or vetting step.

---

### Edge Cases

- **Rate-limited applicant**: receives a human-readable explanation plus a recovery path (e.g. retry later), with no data lost.
- **Double submit**: a single submission action cannot create duplicate records in the org's records.
- **Transient submission failure**: the applicant sees a human-readable error and can retry; all entered data stays intact within the session — no restart and no cross-session draft persistence.
- **Media blocked / slow connection on hero**: designed static frame shown; never a blank black box.
- **Mid-form navigation (back/refresh)**: entered values are retained; no silent data loss.
- **Missing or invalid fields**: inline, human-readable guidance; the applicant can correct without restarting.
- **Theme switch mid-flow**: application and quiz render correctly in the newly selected theme.
- **Quiz taken before applying**: quiz result is informational context only; the applicant's own 4H selections remain authoritative.
- **Right-click on logo**: normal browser menu; nothing intercepts or redirects.
- **Unverifiable privacy anchor**: the link is removed rather than left dangling.
- **Loaders on low-end devices**: indicate progress without motion-sickness or performance impact (reduced-motion respected).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST let a prospective member begin the membership application from the primary join action without opening a new tab or leaving the site.
- **FR-002**: The application MUST collect the full Standard Application Form information set — personal information, academic information, role preferences (Primary/Secondary 4H archetype), availability & commitment, and consent & declaration — in clearly separated steps.
- **FR-003**: The applicant MUST see a review step before submission and MUST be able to go back and correct any field without losing entered data.
- **FR-004**: On submit, the system MUST show an on-site confirmation and MUST record the full submission in the org's application records for officer review without manual re-entry.
- **FR-005**: Public form submissions MUST be protected by the site's standard abuse defenses; a blocked applicant MUST receive a human-readable message and a recovery path.
- **FR-006**: Required vs optional fields MUST be clearly distinguishable, and the system MUST NOT promise any specific review timeline (review-pipeline copy is org-owned).
- **FR-007**: The system MUST prevent duplicate records from a single submission action.
- **FR-008**: The applicant's own 4H archetype selections MUST be authoritative for the application; any quiz result MUST be informational only and never gate or override the application.
- **FR-009**: The homepage first viewport MUST present a single fixed background video on every visit — identical media selection, never randomized per load.
- **FR-010**: The hero MUST show a designed static frame while media loads (never a blank black area), and the hero video MUST autoplay muted on load with all player controls hidden.
- **FR-011**: The org's motto and founding year MUST be visible above the fold on the homepage.
- **FR-012**: The 4H archetype story (Hustler, Hacker, Hipster, Hound) MUST be visibly presented on the homepage rather than only inside the quiz.
- **FR-013**: Acronyms in visible copy MUST show their org-approved full name on first use.
- **FR-014**: The landing page MUST present a single dominant join action above the fold, and each section MUST offer at most one dominant call to action.
- **FR-015**: All public surfaces (Home, About, Membership, Quiz, Contact, shared header/footer) MUST render with the org's blue/gold brand palette in both light and dark themes, with no non-brand hardcoded color washes that break dark mode.
- **FR-016**: Quiz intro, question, and result surfaces MUST share the same brand palette, and every archetype result MUST stay within the blue/gold brand world.
- **FR-017**: The browser loading indicator and all visible accents MUST come from the shared brand palette.
- **FR-018**: Navigation MUST indicate the current page and MUST NOT present empty anchor destinations.
- **FR-019**: All motion, including loading indicators, MUST respect the visitor's reduced-motion preference.
- **FR-020**: Public contact identity MUST use the org's owned domain; no mismatched public address MAY remain.
- **FR-021**: Every link on the contact/privacy trust path MUST resolve to a verified destination or be removed.
- **FR-022**: The org logo MUST behave as a normal element — the standard browser context menu MUST appear on right-click, with no interception or redirect.
- **FR-023**: Any stated quiz length or time MUST match the actual experience, corrected with org-approved copy only — the 20-question quiz itself MUST remain unchanged (no quiz-logic change).
- **FR-024**: If a submission fails at the recording step, the applicant MUST receive a human-readable error and MUST be able to retry without losing any entered data (retention within the current session only; no cross-session draft persistence).

### Key Entities _(include if feature involves data)_

- **Membership Application**: the submission record created through the Standard Application Form (personal, academic, 4H archetype selections, availability, consent). Written to the org's records; the unit officers review.
- **Standard Application Form**: the shared base form used by the Membership pipeline in this effort; Core Membership extensions are out of scope here.
- **4H Archetype**: the applicant's self-selected Primary/Secondary frame within the form; authoritative for the record, never overridden by quiz results.
- **Contact Inquiry**: a categorized message (General, Membership, Sponsorship & Partnership, Media) submitted through the single contact form.
- **Quiz Result**: the informational archetype outcome of the quiz; not an application input, must render inside the brand palette.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A re-run of the impeccable critique scores the site **≥ 8/10** (from 6/10) with **zero open P0 and P1 findings** in both the design review and the automated detector pass; every listed P2/P3 item is closed or explicitly accepted with a recorded reason.
- **SC-002**: A first-time visitor can reach a join action from the first viewport **without scrolling**, and can complete a full membership application **without ever leaving the site**; **100%** of completed submissions appear in the org's records.
- **SC-003**: The homepage first viewport is **deterministic across repeated visits**, shows a designed frame **before media loads**, and renders visible content **in under ~2.5 seconds** on a mid-range phone over a typical 4G connection.
- **SC-004**: **Zero** non-brand palette violations remain in visible UI: Home, About, Membership, Quiz, and Contact all pass in both light and dark themes (manual check across both themes plus the automated detector = 0 findings).
- **SC-005**: **No accessibility regression**: all touched surfaces remain keyboard-operable and readable in both themes, and reduced-motion preference is honored throughout.
- **SC-006**: **Zero** dead or mismatched trust signals on the contact/privacy path: owned-domain identity, verified links, and human-readable error states (manual walkthrough of the full contact funnel passes).

## Assumptions

- The critique snapshot at `.impeccable/critique/2026-08-21T03-43-36Z__src-app.md` is the authoritative "latest critique"; its priority list (P0–P3), detector findings, persona red flags, and minor items together define the issue set for this effort.
- The native Membership application replaces the external Google Form per ADR 0002 (already ratified); this effort does not re-decide that mechanism.
- The quiz "generalist" result realigns to the blue/gold brand world — the earlier "keep as deliberate exception" option is closed (shape brief, user-confirmed 2026-08-21).
- All copy additions or expansions (acronym full names, motto/founding usage, quiz length claims, review-pipeline wording) come from org-owned sources (`CONTEXT.md`, `PRODUCT.md`, officers) — implementers will not invent or rewrite copy (constitution P2).
- The detector's bounce-easing findings in loaders/spinners are likely intentional; the requirement is reduced-motion compliance, not removal.
- Muted, on-load autoplay of the single fixed hero video is an intentional org-authored choice (the video is produced specifically as a no-music background); the critique's mobile data-use concern (Casey) is consciously accepted rather than removed. Mitigations: one fixed video, a designed loading frame, and deterministic first viewport.
- The quiz remains at its current 20-question length; only the stated time/number copy is corrected with org-approved wording, leaving quiz logic entirely untouched.
- Scope covers the surfaces named in the shape brief (Home, About, Membership, Quiz, Contact, shared header/footer/components/tokens). Quiz logic, application logic, brand colors, and technical/SEO/security layers change only where a critique item or ratified decision requires it.
- Boundaries from `CONTEXT.md` hold for the pulled-forward Membership pipeline: no user accounts, no draft/resume, no payments, no officer admin UI, and the org's records are the single store.
- Verification may rely on source-based review plus the automated detector plus a production build where live-browser visualization is unavailable (the same method the critique itself used).

## Dependencies

- Org-supplied copy definitions (acronym expansions, quiz time claims, motto placement approval) before those copy surfaces ship.
- The real officer review pipeline statement, so "what happens next" copy on the membership surface matches the org's actual process.
- A production build + the impeccable critique re-run as the final verification gate (per the user request).
- Amending the CONTEXT.md glossary so the canonical 4th archetype is "Hound" (via the constitution's amendment path) — required so constitution P1 terminology matches the shipped product, quiz data, and this spec.
