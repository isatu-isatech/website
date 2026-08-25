# Contract — Notion Databases for Membership Applications

**Verified via MCP 2026-08-25** — two databases on `Membership Application Dashboard` (`3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`)

## 1. Membership Campaigns

**DB**: `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID` = `collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2` (`https://app.notion.com/p/3c7f42d3fa72800091c0fc003256e7a6`)

| Property      | Type              | Notes                                                                                                                    |
| ------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Academic Year | title             | e.g., `A.Y. 2025-2026` — human yearly label                                                                              |
| Campaign ID   | auto_increment_id | read-only, unique                                                                                                        |
| Status        | status            | `Draft` (to_do) / `In progress` (in_progress) / `Closed` (complete) — single `In progress` at a time controls acceptance |

**Template**: `A.Y 2XXX-2XXX` (`3c7f42d3-fa72-8045-b072-d7d173db4d13`) contains inline `Form Submissions` view. Officers duplicate the template, set Academic Year, and PATCH `Status` to `In progress` to open.

## 2. Form Submissions

**DB**: `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID` = `collection://3c7f42d3-fa72-8049-9d58-000badfe03e9` (`https://app.notion.com/p/3c7f42d3fa7280f898feec2b7a8446f3`)

| Property                     | Notion Type                       | Source field                                                                                                                                                                             |
| ---------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Student ID                   | title                             | `studentId`                                                                                                                                                                              |
| Full Name                    | text                              | `fullName`                                                                                                                                                                               |
| Nickname                     | text                              | `nickname` (omit if empty)                                                                                                                                                               |
| Email                        | email                             | `email`                                                                                                                                                                                  |
| Mobile Number                | number                            | `mobileNumber` (FLOAT)                                                                                                                                                                   |
| Birthdate                    | date                              | `birthdate`                                                                                                                                                                              |
| Sex                          | select                            | live: `Male`, `Female`                                                                                                                                                                   |
| Facebook Profile URL         | url                               | `facebookUrl` (omit if empty)                                                                                                                                                            |
| College                      | select                            | live: 5 colleges (Engineering and Architecture, Industrial Technology, Education, Arts and Sciences, Computing and Informatics)                                                          |
| Program                      | text                              | `program`                                                                                                                                                                                |
| Year Level                   | select                            | live: `1st Year` … `5th Year`                                                                                                                                                            |
| Primary Role Preference      | select                            | live: `Hound`, `Hacker`, `Hipster`, `Hustler`                                                                                                                                            |
| Secondary Role Preference    | select                            | live: same 4                                                                                                                                                                             |
| Related Skills               | text                              | `relatedSkills`                                                                                                                                                                          |
| Related Experiences          | text                              | `relatedExperiences`                                                                                                                                                                     |
| Availability                 | text                              | `availability` (0–60 as text)                                                                                                                                                            |
| Event-Attendance Willingness | checkbox                          | `eventAttendanceWillingness`                                                                                                                                                             |
| Other Orgs Membership        | text                              | `otherOrgs`                                                                                                                                                                              |
| Campaign                     | relation → `Membership Campaigns` | **to be added** via `notion_notion-update-data-source` `ADD COLUMN "Campaign" RELATION('collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2')` — set on every write to the active campaign |

**Write behavior**

- All writes via `src/lib/notion/helpers.ts` `createPage` (`withRetry` 429/5xx, `Retry-After`, jitter, max 3 attempts).
- Empty optionals omitted (no `rich_text` with empty content).
- `Campaign` relation set to the `In progress` campaign page URL/ID resolved at submit time.
- If no active campaign, write is blocked server-side with human-readable closed error.

## 3. Relation creation (one-time)

Run once before submissions can be linked:

```
ADD COLUMN "Campaign" RELATION('collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2')
```

This is a data-source schema change via Notion API. Verify in Notion UI that `Campaign` appears as a relation property on `Form Submissions` and that the inline view on each campaign page can filter by that relation.

## 4. Environment

```env
NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID=3c7f42d3-fa72-8095-b5a7-000bc5bec8d2
NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID=3c7f42d3-fa72-8049-9d58-000badfe03e9
NOTION_API_KEY=secret_...
```

Both required (`z.string().min(1)` in `src/lib/env.ts`). Integrations must have **Insert** access to both DBs. Without either, `npm run dev` / `npm run build` fails loudly (P4).

## 5. Verification

- Share both DBs with the integration behind `NOTION_API_KEY`.
- Create a test campaign `A.Y. 2025-2026` with `Status = In progress` via dashboard or `notion_notion-create-pages`.
- Submit a test application via the site — new row appears in `Form Submissions` with `Campaign` linked to the test campaign; the campaign page's inline view shows it.
- Close the campaign (`Status = Closed`) — site form shows closed state and blocks new writes.
