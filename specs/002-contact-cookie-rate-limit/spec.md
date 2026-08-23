# Feature Specification: Contact Page Cookie-Based Rate Limiting

**Feature Branch**: `002-contact-cookie-rate-limit`

**Created**: 2026-08-23

**Status**: Draft

**Input**: User description: "Let's update how Contact Page works. We will still use Notion as our primary data store, but we will completely drop the KV for rate limiting and instead use browser cookies for it."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - A visitor submits a contact message (Priority: P1)

A visitor fills in the contact form (name, email, message), passes the security
check, and submits. Their message is stored in the org's records (Notion) and
they immediately see a confirmation on the page.

**Why this priority**: Storing and confirming the message is the core purpose of
the Contact page; the rate-limiting change must not regress it.

**Independent Test**: Submit a valid message on the Contact page; the
confirmation shows and the message appears in the org's records.

**Acceptance Scenarios**:

1. **Given** a visitor with fewer than 5 successful submissions in the last
   hour from the same browser, **When** they submit a valid message and pass the
   security check, **Then** they see a success confirmation and the message is
   stored in the org's records.
2. **Given** any submission, **When** the security check fails, **Then** the
   submission is refused with the existing friendly message and nothing is
   stored.

---

### User Story 2 - A visitor is rate limited (Priority: P1)

A visitor who has already sent 5 messages within the last hour from the same
browser is blocked from sending more and sees the existing friendly "please try
again in about an hour" message.

**Why this priority**: Rate limiting is a standing abuse-defense requirement
(constitution P5); keeping the visitor-facing behavior familiar avoids
confusion.

**Independent Test**: Submit 5 valid messages from the same browser in under an
hour; a 6th attempt is refused with the friendly message.

**Acceptance Scenarios**:

1. **Given** a browser with 5 successful submissions in the last hour, **When**
   the visitor submits again, **Then** the submission is refused with the
   friendly rate-limit message and nothing is stored.
2. **Given** a visitor who was blocked, **When** the hour window passes or the
   browser's record is cleared, **Then** they can submit again.

---

### User Story 3 - No regression for other surfaces (Priority: P2)

The change is scoped to the Contact page; other public surfaces keep working
unchanged.

**Why this priority**: The server-side limiter remains in use elsewhere; this
feature must not disturb it.

**Independent Test**: The quiz image feature still renders and still applies its
own server-side rate limiting.

**Acceptance Scenarios**:

1. **Given** a public surface other than the Contact page that uses server-side
   rate limiting, **When** it is used, **Then** its behavior is unchanged by
   this feature.

---

### Edge Cases

- What happens when the visitor's browser cannot store or returns a cleared
  record (cookies disabled, blocked, or cleared)? → Treated as a first-time
  submitter; the security check still applies. This is the accepted tradeoff of
  browser-held state.
- What happens when a submission fails (validation, security check, or service
  error)? → The failed attempt must not count toward the limit; only successful
  submissions do.
- What happens when the browser-held record grows large (many timestamps)? →
  Only entries within the recent window are retained; older entries are
  discarded so the record stays small.
- What happens when the service that stores messages is temporarily
  unavailable? → The visitor sees the existing friendly error; nothing is
  stored and the attempt does not count toward the limit.
- What happens on repeated blocked attempts? → The visitor keeps seeing the
  friendly rate-limit message; no further penalty is applied.
- What happens if the browser-held record is malformed or tampered with? →
  Treated as an empty record (first-time submitter); the security check still
  applies.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The Contact page MUST continue to store submitted messages in
  Notion (the org's primary data store); no other storage MUST be introduced.
- **FR-002**: The Contact page MUST stop using the server-side rate-limiting
  service for contact submissions.
- **FR-003**: Contact submission frequency MUST be limited per browser, using
  state held in the browser itself.
- **FR-004**: The limit MUST match the current policy: at most 5 successful
  submissions per rolling 60-minute window per browser.
- **FR-005**: When the limit is reached, submission MUST be refused and the
  visitor MUST see the existing friendly "please try again in about an hour"
  message.
- **FR-006**: A successful submission MUST update the browser-held record so
  later submissions within the window count against the limit.
- **FR-007**: Failed submissions (validation, security check, or service error)
  MUST NOT update the browser-held record.
- **FR-008**: The security check (Cloudflare Turnstile) MUST remain mandatory
  for every submission before it is stored.
- **FR-009**: Browsers without a storable or readable record (cookies disabled,
  cleared, or tampered) MUST be treated as first-time submitters; this
  limitation MUST be documented as an accepted tradeoff.
- **FR-010**: The change MUST NOT affect other surfaces that use the
  server-side rate limiter (e.g. the quiz image route).
- **FR-011**: The Contact page MUST no longer depend on any rate-limit status
  helper tied to the server-side service.

### Key Entities _(include if feature involves data)_

- **Inquiry**: a non-application contact message submitted through the Contact
  form (canonical glossary term — see CONTEXT.md; the submission carries the
  visitor's name, email address, and message), stored in the org's records
  (Notion). Unchanged by this feature.
- **Browser Submission Record**: held in the visitor's browser; timestamps of
  successful submissions within the rolling window, used to decide whether a
  new submission is allowed. It is not a record of org data.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A visitor can submit a valid contact message and see a
  confirmation in under 2 minutes (unchanged behavior).
- **SC-002**: A visitor who submits 5 messages within an hour from the same
  browser is blocked from a 6th with the friendly message, and the block lifts
  within 1 hour of the first counted submission (or when the browser's record
  is cleared).
- **SC-003**: Every accepted message appears in the org's records within 1
  minute of submission (unchanged).
- **SC-004**: The Contact page functions without the server-side rate-limiting
  service (verified by disabling it); acceptance and blocking still behave per
  FR-004/FR-005.
- **SC-005**: Other surfaces using the server-side rate limiter are unchanged
  and still enforced.

## Assumptions

- The org has ratified the constitution P5 amendment (v1.1.0) making the
  rate-limiting mechanism an org decision, documented in this spec.
- Cloudflare Turnstile remains mandatory on the Contact page (constitution P5).
- The rate-limit policy (5 per rolling hour) is carried over unchanged; only
  the mechanism changes.
- The quiz image route keeps its server-side rate limiter; its behavior is out
  of scope for this feature.
- Browser-held state is client-controllable (clearing cookies resets the
  window) — accepted tradeoff per org decision, surfaced in FR-009.
- Rate-limit messaging copy stays as-is today.
- The server-side rate-limiter dependencies and environment configuration
  remain in the project for other surfaces; only the Contact page stops using
  them.
- No user-visible layout, copy, or accessibility changes beyond the
  rate-limiting mechanism are in scope.
