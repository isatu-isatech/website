# Data Model — Native Membership Application

**Phase 1 output** · entities verified via Notion MCP (2026-08-25). Canonical terms per `CONTEXT.md` (constitution P1). Live Notion schemas are source of truth for option sets and types.

## Membership Campaign _(verified, dashboard-owned)_

The yearly container for submissions. Backed by `Membership Campaigns` DB `collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2` on `Membership Application Dashboard` (`3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`).

| Property                | Type              | Notes                                                                                                                                                                                                                |
| ----------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Academic Year           | title             | e.g., `A.Y. 2025-2026` (human label for auditability)                                                                                                                                                                |
| Campaign ID             | auto_increment_id | system-managed, unique                                                                                                                                                                                               |
| Status                  | status            | `Draft` (to_do) / `In progress` (in_progress) / `Closed` (complete) — controls whether new submissions are accepted. Exactly 0 or 1 rows should be `In progress` at a time (enforced by admin convention, not code). |
| Form Submissions (view) | inline DB view    | Campaign template `A.Y 2XXX-2XXX` contains an inline `Form Submissions` view filtered to this campaign via `Campaign` relation (after relation is added).                                                            |

**Lifecycle**

```
Draft → In progress → Closed
  • Draft: campaign exists but form shows closed/not-yet-open, submissions blocked
  • In progress: active campaign — form open, submissions linked to this campaign
  • Closed: campaign closed, form blocked again, historical submissions remain auditable
```

No code creates campaigns in the MVP — admin creates them via the Notion dashboard (or future web admin that PATCHes `Status`). The web form only **reads** the active campaign (`WHERE Status = "In progress"`).

## Membership Application / Form Submissions _(live schema, Notion is source of truth)_

Backed by `Form Submissions` DB `collection://3c7f42d3-fa72-8049-9d58-000badfe03e9` (child of campaign template). **All option-based fields read live options from this schema** — code must fetch `College`, `Year Level`, `Sex`, `Primary Role Preference`, `Secondary Role Preference` option lists from Notion and validate against them (reverses earlier static-constants decision).

### Fields (actual Notion types as fetched 2026-08-25)

| Section       | Field                         | Notion Type                       | Validation / rules                                                                                                                                                                                                                                |
| ------------- | ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personal      | Student ID                    | title                             | required, 3–30                                                                                                                                                                                                                                    |
|               | Full Name                     | text                              | required, 2–100                                                                                                                                                                                                                                   |
|               | Nickname                      | text                              | optional, ≤ 50                                                                                                                                                                                                                                    |
|               | Email                         | email                             | required, well-formed                                                                                                                                                                                                                             |
|               | Mobile Number                 | number (FLOAT)                    | required, 7–20 digits (stored as number; UI accepts `+`/spaces but normalizes to digits)                                                                                                                                                          |
|               | Birthdate                     | date                              | required, ISO date, not future (`date:Birthdate:start`)                                                                                                                                                                                           |
|               | Sex                           | select                            | required — options live from Notion (`Male`, `Female`)                                                                                                                                                                                            |
|               | Facebook Profile URL          | url                               | optional, http(s)                                                                                                                                                                                                                                 |
| Campaign link | Campaign                      | relation → `Membership Campaigns` | **to be added** — required on write, points to active `In progress` campaign                                                                                                                                                                      |
| Academic      | College                       | select                            | required — live options (`College of Engineering and Architecture`, `College of Industrial Technology`, `College of Education`, `College of Arts and Sciences`, `College of Computing and Informatics`)                                           |
|               | Program                       | text                              | required, ≤ 100                                                                                                                                                                                                                                   |
|               | Year Level                    | select                            | required — live options (`1st Year` … `5th Year`)                                                                                                                                                                                                 |
| Role          | Primary Role Preference       | select                            | required — live options (`Hound`, `Hacker`, `Hipster`, `Hustler`), must differ from secondary                                                                                                                                                     |
|               | Secondary Role Preference     | select                            | required — same live options, must differ from primary                                                                                                                                                                                            |
|               | Related Skills                | text                              | optional, ≤ 1000                                                                                                                                                                                                                                  |
|               | Related Experiences           | text                              | optional, ≤ 1000                                                                                                                                                                                                                                  |
| Availability  | Availability                  | text                              | required — hours/week range `0–60` (Notion is `text`, not `number`; code validates 0–60 and writes as text)                                                                                                                                       |
|               | Event-Attendance Willingness  | checkbox                          | required — `__YES__` = true / `__NO__` = false; maps to willingness Yes/Maybe/No? Actual Notion is boolean — code will map `Yes/Maybe`→ true, `No`→ false or keep as checkbox true/false per org clarification; for now treat as required boolean |
|               | Other Orgs Membership         | text                              | optional, ≤ 1000                                                                                                                                                                                                                                  |
| Consent       | Privacy Consent / Declaration | (implied)                         | `z.literal(true)` on form; Notion checkboxes if added, else omitted (consent is form gate, not necessarily stored)                                                                                                                                |

**Notes on divergences from earlier `specs/001` draft**

- `Full Name` is `text` not `title`; `Student ID` is `title` (swapped).
- `Mobile Number` is `number` (`FLOAT`) — earlier draft was `rich_text`.
- `Availability` is `text` not `number`.
- `Event-Attendance Willingness` is `checkbox` not `select`.
- Option sets are Notion-sourced; code must not hardcode a competing list.

### Relationships

- **Form Submissions → Membership Campaign** via `Campaign` relation (to be created via `notion_notion-update-data-source` `ADD COLUMN "Campaign" RELATION('…campaigns DS…')`). This is how yearly auditability is encoded.
- **Form Submissions** uses **Standard Application Form** base (Core Membership out of scope per ADR 0002).
- **4H Role** selections are applicant self-report; **Quiz Result** is informational only (FR-016).
- No relation to **Contact Inquiry** (separate surface, separate cookie).

### Lifecycle / state transitions

```
Client wizard (in-session, no persistence — H2)
  Steps 1–5 → Review (6) → submit:
    • No active campaign → blocked, human-readable closed message, no record
    • Active campaign `In progress` + Turnstile + Zod + rate-limit pass → createPage with Campaign relation → { success: true } → Confirmation
    • Zod fail / Turnstile fail / rate-limited / transient Notion fail → { success: false, error } + retry with data retained

Notion-side: Form Submissions remain linked to their campaign; no code-managed submission status. Campaign: Draft → In progress → Closed (admin PATCHes Status).
```

Double-submit guard (FR-014) via disabled button; repeat submissions from same student over time are allowed (clarification Q2) — officers de-duplicate by year/campaign.

### Browser rate-limit record (not org data)

| Aspect      | Value                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------- |
| Cookie name | `membership_rate_limit` (isolated from `contact_rate_limit`)                                  |
| Value       | JSON array of epoch-ms of successful submissions in rolling window                            |
| Window      | 60 min                                                                                        |
| Policy      | ≤ 5 per window                                                                                |
| Attrs       | `httpOnly: true`, `sameSite: lax`, `path: /`, `maxAge≈2×window`, `secure: production`, cap 64 |

## Contact Inquiry _(unchanged)_

Written by `submitMessage` to `NOTION_CONTACT_FORM_DATABASE_ID` via same `createPage` helper. Separate cookie.

## Quiz Result _(referenced)_

Client-side archetype outcome; not stored. Form's Primary/Secondary selections remain authoritative.
