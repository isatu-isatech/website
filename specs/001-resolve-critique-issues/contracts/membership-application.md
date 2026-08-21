# Contract — Membership Application Submission

**Surface**: server action `submitMembershipApplication` + the Notion database it writes to. Mirrors the proven contact pipeline (`src/app/(static)/contact/actions.ts`) per R-1.

## 1. Server action

```ts
// "use server" — src/app/(static)/membership/actions.ts
submitMembershipApplication(formData: unknown): Promise<
  | { success: true }
  | { success: false; error: string }   // human-readable, safe to show
>
```

**Pipeline order** (each stage a guard; first failure returns immediately):

1. **Rate limit** — Upstash `Ratelimit.slidingWindow(5, "1 h")` keyed on IP (`x-forwarded-for` → `x-real-ip` → `"127.0.0.1"`); KV-unavailable → skip with `console.warn` (graceful, same as contact).
2. **Zod validation** — `membershipFormSchema.safeParse(formData)`; failure → `{ success: false, error: "…" }` with a safe generic message.
3. **Turnstile** — POST `https://challenges.cloudflare.com/turnstile/v0/siteverify` with secret + token; failure/exception → `{ success: false, error }`.
4. **Notion write** — `createPage(NOTION_MEMBERSHIP_DATABASE_ID, properties)`; success → `{ success: true }`; throw → `console.error` + `{ success: false, error: "An unexpected error occurred…" }`.

All expected failures return `{ success, error }`, never thrown (AGENTS.md convention); errors logged with `console.error`.

## 2. Input schema (`membershipFormSchema`)

Field-level types/rules in `data-model.md` (Membership Application table). Zod shape highlights:

- `z.email()` for Email; `z.date`-coercible ISO string for Birthdate (not future).
- `primaryArchetype` / `secondaryArchetype` — `z.enum(["Hustler","Hacker","Hipster","Hound"])`, `.refine(a !== b)`.
- `privacyConsent: z.literal(true, …)`, `declarationConsent: z.literal(true, …)` — explicit-gate.
- `hoursPerWeek: z.number().min(0).max(60)`.
- `turnstileToken: z.string().min(1)`.
- Selects (Sex, College, Year Level, Willingness) validated against the org-defined option sets fetched from the same sources the form uses; unknown values rejected.

## 3. Notion database contract (`NOTION_MEMBERSHIP_DATABASE_ID`)

Required properties in the Notion DB (property-name → type → value mapping at write):

| Property                     | Type      | Value                                               |
| ---------------------------- | --------- | --------------------------------------------------- |
| Name                         | title     | Full Name                                           |
| Nickname                     | rich_text | Nickname                                            |
| Student ID                   | rich_text | Student ID                                          |
| Email                        | email     | Email                                               |
| Mobile                       | rich_text | Mobile                                              |
| Birthdate                    | date      | Birthdate (ISO date)                                |
| Sex                          | select    | Sex                                                 |
| Facebook                     | url       | Facebook Profile URL (omit if empty)                |
| College                      | select    | College                                             |
| Program                      | rich_text | Program                                             |
| Year Level                   | select    | Year Level                                          |
| Primary 4H Archetype         | select    | Primary Archetype (canonical names)                 |
| Secondary 4H Archetype       | select    | Secondary Archetype                                 |
| Related Skills               | rich_text | Related Skills                                      |
| Related Experiences          | rich_text | Related Experiences/Involvements                    |
| Hours per Week               | number    | Availability (h/w)                                  |
| Event Attendance Willingness | select    | Willingness                                         |
| Other Organizations          | rich_text | Other-Org Memberships                               |
| Privacy Consent              | checkbox  | true                                                |
| Declaration                  | checkbox  | true                                                |
| Status                       | select    | `New` (set on write; officer-maintained afterwards) |

Officers maintain the actual Notion DB schema; the contract documents the exact mapping the code writes and must be kept in sync with the DB (P6: "correctness depends on officers maintaining it" applies to the select/option catalogs).

## 4. Environment contract

- `NOTION_MEMBERSHIP_DATABASE_ID` — promote from optional → required in `src/lib/env.ts` (env.ts:11); uncomment in `.env.example` (P4). Runtime failure without it → build/dev fails loudly (Zod parse).
- Reuses `NOTION_API_KEY`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`, `KV_*` — no new vars beyond the above.

## 5. Success / error semantics (FR-003, FR-004, FR-024, FR-005)

| Outcome          | Contract                    | UX                                                                                |
| ---------------- | --------------------------- | --------------------------------------------------------------------------------- |
| Success          | `{ success: true }`         | On-site confirmation screen; record in org's Notion records                       |
| Invalid data     | `{ success: false, error }` | Inline field errors (client) / safe server message; data retained                 |
| Write failure    | `{ success: false, error }` | Human-readable message + **retry with all data retained in-session** (no restart) |
| Rate limited     | `{ success: false, error }` | Human-readable hourly-limit message + recovery guidance; data retained            |
| Duplicate submit | —                           | Submit button disabled while pending (single record per action, FR-007)           |
