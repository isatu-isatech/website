# Data Model — Resolve Latest Critique Issues

**Phase 1 output** · entities introduced or touched by this effort. Canonical terms per `CONTEXT.md` (constitution P1).

## Membership Application _(new — the only new data surface)_

The submission record produced when a prospective member completes the native Standard Application Form on the site (replaces external Google Form; ADR 0002). Stored in Notion (single store, P6); officers review and act directly in Notion — no admin UI.

### Fields (mirror the Standard Application Form per `CONTEXT.md`)

| Section                   | Field                            | Type    | Validation / rules                                                                 |
| ------------------------- | -------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| Personal Information      | Full Name                        | string  | required, 2–100 chars (title)                                                      |
|                           | Nickname                         | string  | optional, ≤ 50                                                                     |
|                           | Student ID                       | string  | required, 3–30                                                                     |
|                           | Email                            | email   | required, well-formed                                                              |
|                           | Mobile                           | string  | required, 7–20 digits/`+`                                                          |
|                           | Birthdate                        | date    | required, ISO date, not in the future                                              |
|                           | Sex                              | select  | required (org-defined options)                                                     |
|                           | Facebook Profile URL             | url     | optional, http(s)                                                                  |
| Academic Information      | College                          | select  | required (org catalog)                                                             |
|                           | Program                          | string  | required, ≤ 100                                                                    |
|                           | Year Level                       | select  | required (org catalog)                                                             |
| Role Preferences          | Primary 4H Archetype             | select  | required — one of Hustler / Hacker / Hipster / Hound (canonical per clarify Q4)    |
|                           | Secondary 4H Archetype           | select  | required — differs from primary                                                    |
|                           | Related Skills                   | string  | optional, ≤ 1000                                                                   |
|                           | Related Experiences/Involvements | string  | optional, ≤ 1000                                                                   |
| Availability & Commitment | Hours per Week                   | number  | required, 0–60                                                                     |
|                           | Event-Attendance Willingness     | select  | required (org-defined: e.g. Yes / Maybe / No)                                      |
|                           | Other-Org Memberships            | string  | optional, ≤ 1000                                                                   |
| Consent & Declaration     | Privacy Notice Consent           | boolean | required = true (else reject)                                                      |
|                           | Declaration of Accuracy          | boolean | required = true (else reject)                                                      |
| System                    | Status                           | select  | default `New` — maintained by officers in Notion afterwards; not set by applicants |

### Relationships

- **Membership Application** uses **Standard Application Form** (base shared with Core Membership — Core pipeline is **out of scope** here, ADR 0002 / P6).
- **4H Archetype** selections are applicant self-report; the **Quiz Result** is informational only and never overrides or gates the form (FR-008).
- No relationship to **Contact Inquiry** (separate device; unchanged).

### Lifecycle / state transitions

```
Draft (client-side only, in-session — not persisted)
  → Submitted     (write to Notion succeeds; applicant sees confirmation)
  → Invalid       (client or server validation failure — applicant corrects in session, data retained)
  → Submission error (transient write failure — human-readable message + retry, data retained; FR-024)
  → Rate-limited  (abuse defense hit — human-readable message + recovery path; no data lost)
Notion-side (officer-managed): New → Reviewing → Accepted / Declined (no code involvement)
```

Client-side wizard state lives only in the browser during the session — **no persistence, no accounts, no drafts/resumes** (explicit H2 boundary, clarify Q3).

## Contact Inquiry _(unchanged — referenced)_

Existing record written by `submitMessage` (contact action) to the contact-form Notion database. Touched only by: humanized rate-limit copy (server-side strings) and the contact identity sourced from site config on the page. No model change.

## Quiz Result _(referenced, informational)_

Deterministic archetype outcome (Hustler / Hacker / Hipster / Hound) rendered client-side after the 20-question quiz; also drives the quiz OG image route. Out-of-brand generalist violet realigned to gold (R-3). **Not** an application input; no record stored.

## Validation rules (from requirements / constitution)

- All server-action input Zod-validated before use (P4) — see `contracts/membership-application.md`.
- Consent checkboxes must be explicitly true for submission; declaring consent is part of the Standard Application Form.
- 4H archetype values use the canonical names (Hound — clarify Q4) across form, quiz, OG route, and any Notion property options.
- Duplicate-submit guard: one submission action creates exactly one record (FR-007); officers de-dupe at review (CONTEXT boundary).
