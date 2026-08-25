# Feature Specification: Native Membership Application

**Feature Branch**: `004-membership-application`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Let's implement a new membership application feature directly on the website, allowing users to apply without being redirected to external tools like Google Forms. The application form should be fully integrated into the membership page and capture all necessary details through a clean and user‑friendly interface. Upon submission, the form data should be automatically sent to a Notion database via their API, enabling the team to review and manage applications centrally within our existing Notion workspace. The integration should handle validation, error handling, and success feedback gracefully, and the submission process should be secure and reliable, with appropriate rate limiting or CAPTCHA protection to prevent abuse. For frontend design, use the impeccable skill." + Follow-up via Notion MCP (2026-08-25): verified `Membership Application Dashboard` page exists as central store for multiple academic years; dashboard must support yearly campaigns where admin creates a campaign for the current academic year, sets Status (Draft/In progress/Closed) to control acceptance, campaign creation/status via admin interface, form routes to currently active campaign, submissions auditable by year; option-based fields use Notion as source of truth.

## Clarifications

### Session 2026-08-25

- Q: How is the ~20-field Standard Application Form presented on the page? → A: Multi-step guided wizard — one section per step with a progress indicator, review as the final step before submit.
- Q: What happens when the same student submits more than one application over time? → A: Repeat submissions are allowed with no automated warning or block; duplicate applications are identified and resolved by officers during review.
- Q: Where do select-field option catalogs (Sex, College, Year Level, willingness, 4H Roles) live? → A: **Superseded by Session 2026-08-25 (second) — see below; Notion is now source of truth.**

### Session 2026-08-25 (Notion verification — campaign structure)

- Q: Does the central store `Membership Application Dashboard` already exist? → A: Yes — verified via Notion MCP: page `Membership Application Dashboard` (`3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`) with inline `Membership Campaigns` DB (`collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2`) and child `Form Submissions` DB (`collection://3c7f42d3-fa72-8049-9d58-000badfe03e9`); template `A.Y 2XXX-2XXX` exists; current data 0 rows (no active campaign).
- Q: How are submissions organized across academic years? → A: Via `Membership Campaign` entity (Academic Year title, auto `Campaign ID`, `Status` Draft/In progress/Closed) — one campaign per academic year. Each `Form Submissions` page is linked to its campaign via a `Campaign` relation; routing targets the currently `In progress` campaign.
- Q: Where do select-field option catalogs live after Notion verification? → A: **Notion is the source of truth** — `College`, `Year Level`, `Sex`, `Primary`/`Secondary Role Preference` (and any future selects) are read from the `Form Submissions` DB schema options at request/build time; Zod validation rejects values outside those live Notion option sets. Code must not hardcode a competing static list.
- Q: How is campaign lifecycle controlled? → A: Admin creates a campaign for the current academic year and manages `Status` via the dashboard/admin interface. Only `In progress` accepts new submissions; `Draft`/`Closed`/no-active-campaign shows a closed/not-yet-open state and blocks writes. Status management is available via the Notion dashboard directly and, if a web admin is built, via an admin interface that PATCHes the same DB.

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - A prospective member applies entirely on-site (Priority: P1)

A student interested in joining ISATech clicks the join action on the membership page (or any join hand-off elsewhere on the site) and completes the full Standard Application Form without ever leaving the site or opening a new tab. The form replaces today's external Google Form and is presented inside the site's brand shell as a clean, guided experience: a multi-step wizard moving through the Standard Application Form's sections (Personal Information, Academic Information, Role Preferences, Availability & Commitment, Consent & Declaration), required vs optional fields distinguishable at a glance, a review step before submitting, and an on-site confirmation when done. Each completed submission is automatically routed to the currently active membership campaign (academic year) and lands in the org's application records, ready for officer review with no manual re-entry.

**Why this priority**: This is the strongest ask on the site — the entire reason the membership surface exists. It resolves the recorded P0 critique ("membership application abandons the brand shell for a bare external form in a new tab") and reopens the deliberately deferred US1 of spec 001 as its own slice. Without it, the org keeps routing its best prospects off-site at their moment of highest intent.

**Independent Test**: From `/membership`, click the primary join action and complete every section through review and submit — no new tab opens; an on-site confirmation appears; the submission is present in the org's records **linked to the active campaign** for the current academic year. Delivers the full membership value on its own.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on the membership page, **When** they click the primary join action, **Then** the native application experience begins on-site — no new tab, no redirect to an external tool.
2. **Given** an applicant progressing through the form, **When** they complete each section in order, **Then** the Standard Application Form's full information set is captured: personal information (Full Name, Nickname, Student ID, Email, Mobile, Birthdate, Sex, Facebook Profile URL), academic information (College, Program, Year Level), role preferences (Primary and Secondary 4H Role, Related Skills, Related Experiences/Involvements), availability & commitment (hours per week / Availability, event-attendance willingness, other-org memberships), and consent & declaration.
3. **Given** an applicant on the review step, **When** they inspect their answers and go back to correct any field, **Then** all previously entered data is retained and the corrected value appears at review.
4. **Given** a completed review step and an active campaign (`Status = In progress`), **When** the applicant submits, **Then** an on-site confirmation is shown and the full submission appears in the org's application records **under that campaign** for officer review without manual re-entry.
5. **Given** any visitor anywhere on the site, **When** they follow a link that used to lead to the external application form, **Then** it leads into the native on-site application instead — zero dead external-form links remain.
6. **Given** no active campaign exists or the active campaign is `Draft`/`Closed`, **When** a visitor opens the form, **Then** a closed/not-yet-open state is shown and submissions are blocked with a human-readable message; no record is created.

---

### User Story 2 - An applicant recovers gracefully from mistakes and failures (Priority: P1)

Nothing about applying is punishing. Missing or invalid fields produce inline, human-readable guidance the applicant can fix without restarting. If submission fails transiently at the recording step, the applicant sees a clear error message and can retry with every entered value intact within the session. Leaving mid-flow and returning (back/refresh) does not silently discard entered answers during the session. There are no accounts, no email-verification gate, and no cross-session draft persistence — recovery happens inside the current visit, honestly.

**Why this priority**: With ~20 fields, silent data loss is the difference between a recruited member and a lost one. Graceful failure was explicitly clarified in spec 001 (retry with data retained) and is inseparable from the form's credibility.

**Independent Test**: Submit the form with deliberately invalid values, then simulate a failed recording attempt — every case yields human-readable feedback, entered data survives, and a subsequent valid retry succeeds without re-entering anything.

**Acceptance Scenarios**:

1. **Given** an applicant who skips a required field or enters a malformed value, **When** they attempt to continue or submit, **Then** inline human-readable guidance identifies what to fix, and nothing entered is lost.
2. **Given** an applicant whose submission fails at the recording step (transient error), **When** they view the result, **Then** a human-readable error explains the failure and offers retry, with all entered data retained in-session.
3. **Given** an applicant who navigates away mid-form and returns via back/refresh within the same session, **When** the form is shown again, **Then** entered values are retained — no silent data loss.
4. **Given** an applicant whose Secondary 4H Role equals their Primary selection, **When** they validate, **Then** the conflict is rejected with clear guidance until the two selections differ.
5. **Given** an applicant who leaves a consent unchecked, **When** they attempt to submit, **Then** submission is blocked with guidance until both consents are given explicitly.

---

### User Story 3 - Abuse attempts are stopped without harming honest applicants (Priority: P2)

The public form is protected by the site's standard defenses: a human-verification challenge and rate limiting. An applicant who trips the limits gets a friendly, human-readable message with a recovery path — never a raw technical error — and their entered data is not destroyed by the refusal. Honest applicants completing one application pass the protections without noticing them. Rate limiting can never be silently disabled.

**Why this priority**: The site is public and anonymous (no accounts), so abuse defense is the standing protection for a data-capturing surface (constitution P5). It matters immediately after launch but only manifests at the boundary — hence P2 behind the core apply-and-recover journeys.

**Independent Test**: Exceed the submission allowance from one visitor in a short window and attempt automated/bot submissions without passing the verification challenge — excess attempts are refused with the friendly message and create zero records; a normal single submission succeeds untouched.

**Acceptance Scenarios**:

1. **Given** a visitor exceeding the allowed number of successful submissions per rolling hour, **When** they attempt another submission, **Then** it is refused with a human-readable hourly-limit message and a recovery path, and no record is created.
2. **Given** a submission attempt that fails the human-verification challenge, **When** it reaches the server, **Then** the submission is refused and no record is created.
3. **Given** an honest applicant submitting once, **When** the defenses evaluate the attempt, **Then** it proceeds normally with no visible friction beyond the standard verification challenge.

---

### User Story 4 - Officers receive review-ready applications (Priority: P2)

Each accepted submission arrives in the org's application records complete and correctly attributed: every answered field present under a recognizable label, consent flags visible, linked to its campaign, and the record marked with an initial status so officers can triage immediately in their existing workspace — no code changes, exports, or copy-paste. Officers own the record afterwards: status transitions (e.g., reviewing, decision outcomes) happen entirely officer-side; select-option sets reflect the live Notion option lists so officers can add options in Notion without a deploy.

**Why this priority**: The whole point of automatic delivery is officer efficiency — if records arrive incomplete or unlabeled, the manual-re-entry cost returns. But this story validates quality-of-delivery rather than unlocking user value, so it pairs with US1 rather than preceding it.

**Independent Test**: Submit one test application with every field filled and another with all optional fields empty, both during an active campaign — both appear in the org's records **under that campaign** with exactly the answered fields, correct labels, consent checkboxes ticked, and nothing else required from officers to begin review.

**Acceptance Scenarios**:

1. **Given** a fully completed submission during an active campaign, **When** officers open the record in their workspace, **Then** every answered field is present under its documented label, both consent flags are true, and the record is linked to the correct campaign.
2. **Given** a submission with optional fields left empty, **When** officers open the record, **Then** empty optionals are absent or blank rather than placeholder junk.
3. **Given** an accepted application, **When** officers advance its status in their workspace, **Then** the transition works entirely officer-side with no code involvement.

---

### User Story 5 - Admin manages the yearly campaign (Priority: P1)

An officer (admin) creates the membership campaign for the current academic year on the `Membership Application Dashboard` and sets its `Status` to control acceptance. Only a campaign with `Status = In progress` accepts new applications; `Draft` or `Closed` (or no campaign) blocks submissions site-wide. Campaigns are auditable by year — each campaign's page contains its submissions view.

**Why this priority**: Without an active campaign, the form cannot legally accept submissions; yearly isolation is the org's long-term data hygiene. This is a prerequisite for US1 in production, though US1's wizard UI can be developed against a seeded test campaign.

**Independent Test**: Create a campaign `A.Y. 2025-2026` with `Status=Draft` — form shows closed; change to `In progress` — form opens and new submissions appear under that campaign's page; change to `Closed` — form blocks again. A second campaign for a new year can be added later without code changes.

**Acceptance Scenarios**:

1. **Given** no campaign with `Status = In progress`, **When** a visitor loads the form, **Then** a human-readable closed/not-yet-open message is shown and the submit action is disabled.
2. **Given** an officer creates a campaign for the current academic year via the dashboard/admin interface, **When** they set `Status = In progress`, **Then** the site's form becomes open and routes new submissions to that campaign.
3. **Given** a campaign with submissions, **When** officers view the campaign page in Notion, **Then** those submissions are visible under that campaign (via relation) for yearly review.

---

### Edge Cases

- What happens when the applicant double-clicks submit? Only one record is created per submission action; the submit control is disabled while a submission is in flight.
- What happens when the applicant's browser session ends mid-form (tab closed)? Entered data may be discarded — recovery is in-session only; the form never pretends to save drafts (no cross-session persistence, explicit scope boundary).
- What happens when the recording service is unreachable at submit time? Human-readable error + retry with all data retained in-session; nothing is partially written.
- What happens when an applicant provides a future birthdate or an invalid email/mobile/URL? Rejected inline before submission with specific field-level guidance.
- What happens when the human-verification challenge fails or expires mid-form? The applicant is prompted to re-verify and retry; entered data is retained.
- What happens when an applicant has taken the 4H quiz beforehand? Any quiz result is informational context only; the applicant's own Primary/Secondary 4H Role selections remain authoritative and are never overridden or gated by a quiz outcome.
- What happens when the same student submits a second, separate application (correction or reapply)? Allowed — no automated warning or block; duplicates are spotted and resolved by officers during review.
- What happens when the visitor uses reduced-motion preferences, keyboard-only navigation, or switches themes mid-flow? The entire flow remains operable and correct in light and dark themes; motion respects reduced-motion settings.
- What happens when the org adds a new option (e.g., a new College) in Notion? The form offers the new option without a code change (Notion-sourced, validated against live option sets); until the schema change propagates, unknown values are rejected.
- What happens when the active campaign is switched mid-form (officer closes one, opens another)? The submission in flight is validated against the **current** active campaign at submit time; if none is active at submit, it is rejected with a human-readable closed message.
- What happens when the active campaign has no submissions yet? Its Form Submissions view is simply empty — not an error.

## Requirements _(mandatory)_

### Functional Requirements

**Application capture**

- **FR-001**: The system MUST let a prospective member begin and complete the Membership application entirely on-site from the membership page's primary join action — no new tab and no redirect to an external tool — replacing the external form link everywhere it is referenced.
- **FR-002**: The application MUST collect the full Standard Application Form information set — Personal Information (Full Name, Nickname, Student ID, Email, Mobile, Birthdate, Sex, Facebook Profile URL), Academic Information (College, Program, Year Level), Role Preferences (Primary 4H Role, Secondary 4H Role, Related Skills, Related Experiences/Involvements), Availability & Commitment (hours per week / Availability, event-attendance willingness, other-org memberships), and Consent & Declaration (privacy notice consent, declaration of accuracy).
- **FR-003**: The form MUST be presented as a multi-step guided wizard — one Standard Application Form section per step with a visible progress indicator, and review as the final step before submission where every answer is visible and correctable without data loss. Required vs optional fields MUST be visually distinguishable throughout.
- **FR-004**: Optional fields MUST be genuinely skippable; empty optional values MUST arrive in the org's records as blank/absent rather than placeholder content.
- **FR-005**: Selection fields (Sex, College, Year Level, event-attendance willingness, 4H Roles) MUST offer only the option sets defined in the Notion Form Submissions schema at the time of render/validation; values outside those live sets MUST be rejected. Notion is the source of truth — code MUST NOT maintain a competing static list.
- **FR-006**: The Secondary 4H Role MUST differ from the Primary 4H Role; the system MUST enforce and explain this rule at input time and again at validation.
- **FR-007**: Birthdate MUST be a real calendar date not in the future; Email MUST be well-formed; Mobile MUST be a plausible phone value; Facebook Profile URL (when provided) MUST be an http(s) URL; hours per week / Availability MUST fall within the org-defined range.
- **FR-008**: Both consents (privacy notice; declaration of accuracy) MUST be explicitly given — unchecked consent blocks submission.

**Campaign-gated submission & feedback**

- **FR-009**: On successful submission **during an active campaign (`Status = In progress`)**, the system MUST show an on-site confirmation and MUST record the full submission in the org's application records **linked to that active campaign**, with no manual re-entry.
- **FR-009a**: If no campaign is `In progress` (none exists, `Draft`, or `Closed`), the system MUST show a human-readable closed/not-yet-open state and MUST refuse submissions with no record created.
- **FR-010**: Every recorded application MUST carry the initial status/campaign linkage so officers can triage by year; status changes after receipt are officer-managed in the workspace and involve no code.

**Validation & resilience**

- **FR-011**: Invalid or missing input MUST produce inline, human-readable, field-specific guidance; expected failures MUST be surfaced as safe messages rather than raw technical errors.
- **FR-012**: If submission fails at the recording step, the system MUST offer retry with all entered data retained within the current session — no restart and no silent data loss.
- **FR-013**: Mid-form back/refresh within the same session MUST retain entered values; there MUST be no claim or mechanism implying saved drafts across sessions.
- **FR-014**: The system MUST prevent duplicate records from a single submission action (submit control disabled while in flight).
- **FR-015**: The confirmation and surrounding copy MUST NOT promise any specific review timeline or outcome; "what happens next" statements reflect only the org's actual process (org-supplied copy).
- **FR-016**: The applicant's self-selected Primary/Secondary 4H Role MUST be authoritative for the record; any quiz outcome MUST remain informational and MUST NOT gate, override, or prefill-authoritatively the role selections.

**Abuse defenses**

- **FR-017**: Public submissions MUST pass the site's standard human-verification challenge before being recorded; unverifiable attempts MUST be refused without creating a record.
- **FR-018**: Submissions MUST be rate limited; a visitor exceeding the policy MUST receive a human-readable limit message with a recovery path, and excess attempts MUST create zero records. The chosen limiting mechanism is an org decision documented in Assumptions and MUST never be removed or silently disabled.
- **FR-019**: Abuse refusals (rate limit, failed verification, closed campaign) MUST preserve the applicant's entered data in-session wherever technically possible, so the refusal itself causes no data loss.

**Officer readiness**

- **FR-020**: Each recorded application MUST map every collected field to a documented, recognizable property label in the org's records, per the agreed database contract, and MUST include its campaign relation; officers MUST be able to begin review with zero additional tooling.
- **FR-021**: The option sets for select fields are defined in the Notion Form Submissions schema; adding or changing an option is done by officers in Notion and the form MUST reflect it without a code change (source-of-truth is Notion, validated live).

**Campaign administration**

- **FR-025**: The system MUST support the `Membership Campaign` entity (Academic Year title, auto `Campaign ID`, `Status` Draft/In progress/Closed) backed by the `Membership Campaigns` database on the dashboard.
- **FR-026**: An admin interface (Notion dashboard directly and, if built, a web admin page that PATCHes `Status` via the Notion API) MUST allow officers to create a campaign for the current academic year and transition its `Status` to control acceptance.
- **FR-027**: The form MUST query the currently active campaign (`Status = In progress`) on load and again at submit time; routing MUST target that campaign's linkage so submissions are auditable by year.

**Experience baseline**

- **FR-022**: The application experience MUST live inside the site's brand shell and design system (no bare embedded third-party widget appearance), render correctly in light and dark themes, and respect reduced-motion preferences throughout.
- **FR-023**: All interactive controls MUST be keyboard-operable with visible focus and correct labels/state exposed to assistive technology; heading order and accessibility posture MUST NOT regress (standing constitution requirement).
- **FR-024**: The frontend MUST be designed and reviewed with the project's impeccable design discipline (critique-driven polish, brand-token consistency, cognitive-load and emotional-journey care) as directed by the feature request.

### Key Entities _(include if feature involves data)_

- **Membership Campaign**: the yearly container for submissions. Attributes: `Academic Year` (title, e.g., `A.Y. 2025-2026`), `Campaign ID` (auto), `Status` (Draft → In progress → Closed). One `In progress` at a time. Backed by `Membership Campaigns` DB on `Membership Application Dashboard` (`collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2`). Officers create/manage campaigns via the dashboard/admin interface.
- **Membership Application (Form Submission)**: the submission record produced by this feature — the unit officers review. Carries the full Standard Application Form answer set plus two explicit consent flags, linked via `Campaign` relation to its `Membership Campaign`. Distinct from a Contact Inquiry and Event RSVP.
- **Standard Application Form**: the canonical shared base form defined in the project glossary (~20 fields in five sections). This feature implements it for the **Membership** pipeline only; Core Membership extensions are out of scope.
- **4H Role (archetype)**: the applicant's self-selected Primary and Secondary frames (Hustler / Hacker / Hipster / Hound) captured as role preferences; authoritative for the record, never overridden by Quiz Results. Options sourced from Notion `Primary Role Preference`/`Secondary Role Preference` selects.
- **Status**: the officer-owned lifecycle label on a campaign (`Draft`/`In progress`/`Closed`) and, separately, on a submission if the Notion workflow adds one; submission linkage to campaign is the primary yearly partition.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A first-time visitor can go from the membership page's join action to a submitted application **without ever leaving the site** during an active campaign, and **100%** of successfully confirmed submissions appear in the org's application records **under the active campaign**.
- **SC-002**: Most applicants who reach the review step complete successfully on their first submission attempt (**≥ 90%**); those who don't can recover — **100%** of retried submissions retain all previously entered data.
- **SC-003**: **Zero** silent failures: every failure mode (invalid input, failed verification, rate limit, recording error, closed campaign) produces a human-readable message; **zero** raw technical errors are ever shown to applicants.
- **SC-004**: **100%** of recorded applications are review-ready on arrival — every answered field present under its documented label and linked to the correct campaign — and officers require **zero** code changes or manual re-entry to begin review.
- **SC-005**: Automated flooding is contained: attempts beyond the rate-limit policy create **zero** records while honest single submissions succeed unaffected.
- **SC-006**: **Zero** accessibility regressions: the full flow is completable by keyboard alone, passes contrast checks, renders correctly in both themes, and honors reduced-motion preference end-to-end.
- **SC-007**: **Zero** remaining references to the retired external application form anywhere on the site; every former entry point leads into the native flow.
- **SC-008**: An impeccable-skill critique pass on the finished application experience reports **no open P0/P1 findings**.
- **SC-009**: Campaign auditability: **100%** of submissions are linked to the academic-year campaign that was `In progress` at submit time; campaigns with zero submissions render as empty without error.
- **SC-010**: Option freshness: adding a new option (e.g., College) in Notion is reflected in the form without a deploy; **0** hardcoded option lists compete with Notion.

## Assumptions

- **Scope reopening**: This feature reopens the deliberately deferred User Story 1 of `specs/001-resolve-critique-issues` (user decision recorded 2026-08-21; parked tasks T002/T004/T006–T011 noted there). The deferral note anticipated reopening as one slice — that is included here.
- **Membership pipeline only**: Per ADR 0002 and the glossary, Core Membership is a separate pipeline with its own extensions (committee/position/portfolio); it stays out of scope. Membership and Core Membership remain independent on-ramps — neither is a prerequisite for the other.
- **Storage destination — verified**: The `Membership Application Dashboard` page (`https://app.notion.com/p/3c7f42d3fa7280d286adddcc19b555e0`) is the central store for all academic years. It hosts `Membership Campaigns` (`collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2`) and, via campaign template `A.Y 2XXX-2XXX`, the `Form Submissions` database (`collection://3c7f42d3-fa72-8049-9d58-000badfe03e9`). `Membership Campaigns` verified schema: `Academic Year` (title), `Campaign ID` (auto_increment), `Status` (Draft/In progress/Closed). `Form Submissions` verified schema includes `Student ID` (title), `Full Name` (text), `Email`, `Mobile Number` (number), `Birthdate` (date), `College`/`Year Level`/`Sex`/`Primary`/`Secondary Role` (selects with live options), `Program`, `Related Skills`/`Experiences`, `Availability` (text), `Event-Attendance Willingness` (checkbox), etc. Actual types may differ from the earlier `specs/001` draft — this spec defers to the live schema as source of truth. A `Campaign` relation property will be added to `Form Submissions` linking each submission to its `Membership Campaign` so routing is encodable.
- **Campaign lifecycle**: One campaign is `In progress` at a time; `Draft`/`Closed` block writes. Admin creates the current academic-year campaign and manages `Status` via the dashboard (Notion) and, if a web admin is built, via an admin interface that PATCHes `Status` through the Notion API. The form queries `Membership Campaigns` for `Status = "In progress"` on load and re-validates at submit; only then does it accept the submission.
- **Rate-limiting mechanism (constitution P5 documentation)**: The org-decided mechanism for this surface is **browser-held state via the `membership_rate_limit` cookie** (isolated from `contact_rate_limit`), applied per visitor with a policy of **5 successful submissions per rolling hour**, degrading gracefully (missing/malformed cookie → empty record, first-time submitter). This is a weaker mechanism than a server-side store and is **explicitly accepted by the org** for this surface per P5 v1.1.0; the standing Cloudflare Turnstile check remains the primary abuse gate and only successful writes are recorded (see research R-001 — spec is KV-free since 003).
- **Human verification**: "CAPTCHA protection" is satisfied by the site's standing Cloudflare Turnstile integration, mandated for public forms by constitution P5; requirements phrase it as the site's standard human-verification challenge.
- **Validation posture**: Client-side guidance for fast feedback plus mandatory server-side revalidation of every submission against the same rules (constitution P4) — requirements describe the observable behavior, not the split. Select validation is against **live Notion option sets** fetched from `Form Submissions` schema.
- **Source of truth for options**: `College`, `Year Level`, `Sex`, `Primary`/`Secondary Role Preference` (and any future selects) are Notion-sourced; code MUST fetch the schema's option lists and MUST NOT maintain a competing static list. An officer adding an option in Notion propagates to the form without a deploy.
- **No accounts, no drafts**: Applicants are anonymous (H2 boundary): no sign-in, no email verification, no cross-session draft/resume. Confirmation is on-screen; follow-up happens over the contact channel the applicant provided.
- **Copy ownership**: Section intros, confirmation text, and any "what happens next" wording are org-supplied or derived verbatim from approved sources (`CONTEXT.md`, `PRODUCT.md`); developers do not invent process or timeline claims (constitution P2). Developers do not promise completion times for application work.
- **Field semantics** come from the glossary's Standard Application Form definition; the four 4H archetypes use canonical names (Hustler, Hacker, Hipster, Hound — "Hound" is canonical).
- **Frontend direction**: Per the feature request, planning/implementation will use the impeccable skill; UX shape (progressive sections, review step, confirmation) follows the acceptance scenarios here and the critique findings that motivated this feature.
- **Dependencies**: (1) `Campaign` relation property on `Form Submissions` (linking to `Membership Campaigns`) must exist before submissions can be linked; (2) an active campaign (`Status = In progress`) must be created by an admin before the form can accept production submissions (seed a test campaign for QA); (3) `NOTION_MEMBERSHIP_*` identifiers for campaigns and submissions become required validated settings (env, `.env.example`) per P4; (4) org-supplied copy for confirmation/"what happens next" before those surfaces ship.

<!-- /speckit.specify -->
