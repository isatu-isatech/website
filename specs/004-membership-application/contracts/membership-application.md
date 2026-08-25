# Contract — Membership Application Submission

**Surface**: server action `submitMembershipApplication` + the two Notion databases it touches (verified via MCP 2026-08-25). Mirrors the contact pipeline but with campaign gating and live Notion option sets.

**Verified DBs**

- `Membership Campaigns` `collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2` on dashboard `3c7f42d3-fa72-80d2-86ad-ddcc19b555e0` (`Status` Draft/In progress/Closed)
- `Form Submissions` `collection://3c7f42d3-fa72-8049-9d58-000badfe03e9` (applicant data, will hold `Campaign` relation)

## 1. Server action

```ts
// "use server" — src/app/(static)/membership/actions.ts
submitMembershipApplication(formData: unknown): Promise<
  | { success: true }
  | { success: false; error: string }   // human-readable, safe to show
>
```

**Pipeline order** (each stage a guard; first failure returns immediately; expected failures never throw):

1. **Rate limit (cookie)** — read `membership_rate_limit` via `next/headers` `cookies()`, `parseSubmissionTimes(raw)` (prune >60 min, cap 64, malformed → `[]`); if `isRateLimited(timestamps)` → `{ success: false, error: "You've submitted quite a few applications this hour — please try again in about an hour." }`. No record.
2. **Zod validation** — `membershipFormSchema.safeParse(formData)` where select enums are **live Notion option lists** fetched via `src/lib/notion/membership-options.ts` (College/Year Level/Sex/Primary/Secondary Role). Failure → `{ success: false, error: "A couple of details need another look — please double-check the form and resubmit." }`.
3. **Turnstile** — `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `{ secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY, response: turnstileToken }`; `data.success !== true` or exception → security-check message, no record.
4. **Campaign resolve** — `getActiveCampaign()` queries `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID` for `Status = "In progress"` (single active). If none → `{ success: false, error: "Applications are currently closed — please check back when the next campaign opens." }`, no record. If multiple, pick most recent `Academic Year` (admin convention).
5. **Notion write** — `createPage(NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID, properties)` via `src/lib/notion/helpers.ts` (`withRetry` for 429/5xx, `Retry-After` honored). `Campaign` relation is set to the active campaign page URL/ID. On success: append timestamp to `membership_rate_limit` cookie (`httpOnly: true`, `sameSite: lax`, `path: /`, `maxAge = 2×window`, `secure: production`) → `{ success: true }`. On throw: `console.error` + `{ success: false, error: "Something went wrong on our end. Please try again in a moment." }` — retry preserves data in-session.

## 2. Input schema (`membershipFormSchema`)

**File**: `src/app/(static)/membership/schema.ts`

Options for `sex`, `college`, `yearLevel`, `primaryArchetype`, `secondaryArchetype` are fetched live from `Form Submissions` schema at request time via `getMembershipOptions()` (R-010). `availability` is `text` 0–60, `eventWilligness` is `checkbox` boolean.

```ts
z.object({
  studentId: z.string().min(3).max(30), // Notion title
  fullName: z.string().min(2).max(100), // Notion text
  nickname: z.string().max(50).optional().or(z.literal("")),
  email: z.email(),
  mobileNumber: z.coerce
    .number()
    .refine(
      (n) =>
        String(n).replace(/\D/g, "").length >= 7 &&
        String(n).replace(/\D/g, "").length <= 15,
    ),
  birthdate: z.string().refine(isISODate).refine(notFuture),
  sex: z.enum(liveSexOptions), // Notion live
  facebookUrl: z
    .string()
    .refine((v) => v === "" || isHttpsUrl(v))
    .optional()
    .or(z.literal("")),
  college: z.enum(liveCollegeOptions),
  program: z.string().min(1).max(100),
  yearLevel: z.enum(liveYearLevelOptions),
  primaryArchetype: z.enum(livePrimaryOptions),
  secondaryArchetype: z.enum(liveSecondaryOptions),
  relatedSkills: z.string().max(1000).optional().or(z.literal("")),
  relatedExperiences: z.string().max(1000).optional().or(z.literal("")),
  availability: z.string().refine(
    (v) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 && n <= 60;
    },
    { message: "0–60" },
  ),
  eventAttendanceWillingness: z.boolean(), // checkbox
  otherOrgs: z.string().max(1000).optional().or(z.literal("")),
  privacyConsent: z.literal(true, {
    error: "You must accept the privacy notice.",
  }),
  declarationConsent: z.literal(true, {
    error: "You must declare the information is accurate.",
  }),
  turnstileToken: z.string().min(1),
}).refine((d) => d.primaryArchetype !== d.secondaryArchetype, {
  message: "Primary and secondary roles must be different.",
  path: ["secondaryArchetype"],
});
```

Server re-fetches live options before `safeParse` so an officer-added College in Notion is accepted without a deploy.

## 3. Notion database contracts

**Membership Campaigns** `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID` (`3c7f42d3-fa72-8095-b5a7-000bc5bec8d2`)

| Property      | Type              | Notes                                                               |
| ------------- | ----------------- | ------------------------------------------------------------------- |
| Academic Year | title             | e.g., `A.Y. 2025-2026`                                              |
| Campaign ID   | auto_increment_id | system-managed                                                      |
| Status        | status            | `Draft` / `In progress` / `Closed` — single `In progress` at a time |

**Form Submissions** `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID` (`3c7f42d3-fa72-8049-9d58-000badfe03e9`)

| Property                     | Notion Type                       | Value source                                                                                                                                   |
| ---------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Student ID                   | title                             | `studentId`                                                                                                                                    |
| Full Name                    | text                              | `fullName`                                                                                                                                     |
| Nickname                     | text                              | `nickname` (omit if empty)                                                                                                                     |
| Email                        | email                             | `email`                                                                                                                                        |
| Mobile Number                | number                            | `mobileNumber` (FLOAT)                                                                                                                         |
| Birthdate                    | date                              | `birthdate` (`date:Birthdate:start`)                                                                                                           |
| Sex                          | select                            | `sex` (live)                                                                                                                                   |
| Facebook Profile URL         | url                               | `facebookUrl` (omit if empty)                                                                                                                  |
| College                      | select                            | `college` (live)                                                                                                                               |
| Program                      | text                              | `program`                                                                                                                                      |
| Year Level                   | select                            | `yearLevel` (live)                                                                                                                             |
| Primary Role Preference      | select                            | `primaryArchetype` (live)                                                                                                                      |
| Secondary Role Preference    | select                            | `secondaryArchetype` (live)                                                                                                                    |
| Related Skills               | text                              | `relatedSkills` (omit if empty)                                                                                                                |
| Related Experiences          | text                              | `relatedExperiences` (omit if empty)                                                                                                           |
| Availability                 | text                              | `availability` (write as text)                                                                                                                 |
| Event-Attendance Willingness | checkbox                          | `eventAttendanceWillingness` (`__YES__`/`__NO__`)                                                                                              |
| Other Orgs Membership        | text                              | `otherOrgs` (omit if empty)                                                                                                                    |
| Campaign                     | relation → `Membership Campaigns` | **to be added** — `ADD COLUMN "Campaign" RELATION('collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2')` — set to active campaign page on write |

Keys pinned in `MEMBERSHIP_PROPERTIES` constant.

## 4. Rate-limit cookie contract

`membership_rate_limit` isolated from `contact_rate_limit` (same window/policy 5/60 min, `httpOnly`/`lax`, cap 64). Only successful writes append.

## 5. Environment contract

- `NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID` → `z.string().min(1)` required
- `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID` → `z.string().min(1)` required
- `NOTION_MEMBERSHIP_DATABASE_ID` (single) is **deprecated** — keep as fallback alias until migration, then remove.
- Reuses `NOTION_API_KEY`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`

## 6. Success / error semantics

| Outcome            | Contract                    | UX                                             |
| ------------------ | --------------------------- | ---------------------------------------------- |
| Success            | `{ success: true }`         | Confirmation, record linked to active campaign |
| Invalid data       | `{ success: false, error }` | Inline field messages, data retained           |
| No active campaign | `{ success: false, error }` | Closed message, no record, data retained       |
| Write failure      | `{ success: false, error }` | Retry with data retained                       |
| Rate limited       | `{ success: false, error }` | Hourly-limit message, no record, data retained |
| Turnstile fail     | `{ success: false, error }` | Security-check message, no record              |
