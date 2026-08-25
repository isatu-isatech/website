# Quickstart — Native Membership Application

**Phase 1 output** · Manual validation guide for the campaign-gated membership wizard. Pair with `contracts/membership-application.md` (pipeline + campaign resolve) and `data-model.md` (live Notion types) — this file does not duplicate their property tables.

## Prerequisites

- Node 20+, `npm` (repo uses `next dev --webpack`). Deployed target is Vercel at `https://isatech.club` but all scenarios run locally.
- Notion workspace with `Membership Application Dashboard` (`3c7f42d3-fa72-80d2-86ad-ddcc19b555e0`) — verified via MCP 2026-08-25 — containing:
  - `Membership Campaigns` DB `collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2` (Academic Year title, Campaign ID auto, Status Draft/In progress/Closed; template `A.Y 2XXX-2XXX`)
  - `Form Submissions` DB `collection://3c7f42d3-fa72-8049-9d58-000badfe03e9` (live option sets for College 5, Year Level 5 incl. 5th Year, Sex 2, Primary/Secondary Role 4 each; `Campaign` relation **to be added** per `contracts/notion-database.md` §3)
  - Both DBs shared with the integration behind `NOTION_API_KEY` (Insert access).
- Cloudflare Turnstile site key/secret (same pair already used for `/contact`).

## Setup

```powershell
# 1. Install
npm ci

# 2. Env — copy and fill (env is Zod-validated at startup; missing vars fail loudly)
Copy-Item .env.example .env.local
# Edit .env.local:
# NOTION_API_KEY=secret_...
# NOTION_CONTACT_FORM_DATABASE_ID=...
# NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID=3c7f42d3-fa72-8095-b5a7-000bc5bec8d2
# NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID=3c7f42d3-fa72-8049-9d58-000badfe03e9
# CLOUDFLARE_TURNSTILE_SECRET_KEY=...
# NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=...

# 2b. One-time Notion schema change (if not already done):
# Add `Campaign` relation on Form Submissions → Membership Campaigns via
# notion_notion-update-data-source ADD COLUMN "Campaign" RELATION('collection://3c7f42d3-fa72-8095-b5a7-000bc5bec8d2')
# Verify in Notion UI that `Campaign` appears on Form Submissions.

# 2c. Seed an active campaign for QA (via Notion dashboard or API):
# Create page in Membership Campaigns: Academic Year="A.Y. 2025-2026", Status="In progress"
# (done via notion_notion-create-pages or directly in Notion)

# 3. Hard gates (must pass before any manual check)
npm run type-check   # tsc --noEmit — zero errors
npm run lint         # eslint . --max-warnings 0 — zero warnings

# 4. Dev server
npm run dev          # http://localhost:3000
# or production build
npm run build        # next build --webpack && next-sitemap  (no build errors; both NOTION_MEMBERSHIP_* IDs required)
```

## Manual validation scenarios

All navigations start at `http://localhost:3000/membership`. The wizard lives at `#apply` inside the existing membership shell (hero/team/reason/offer/requirements sections stay unchanged). Scenarios assume an `In progress` campaign exists; scenario 10 covers the closed state.

### 1. Happy path — full wizard → campaign-linked Notion → confirmation

1. Verify an active campaign exists: query `Membership Campaigns` for `Status = In progress` (should return `A.Y. 2025-2026`). If none, create one first.
2. Click **Apply Now** in the hero and **Apply as Member** at bottom — both scroll to / focus the wizard at `#apply`.
3. Step 1 Personal: Full Name (2–100 text), Nickname (optional text), Student ID title 3–30, Email, Mobile Number (number — digits, 7–20), Birthdate past date, Sex (live select Male/Female), Facebook URL (optional `https://…`). Click **Next** — per-step `trigger()` passes.
4. Step 2 Academic: College (live 5 options), Program text, Year Level live (1st–5th Year) → Next.
5. Step 3 Role Preferences: Primary `Hustler`, Secondary `Hacker` (must differ; try same → inline error), Related Skills/Experiences optional text.
6. Step 4 Availability: Availability text `10` (0–60 as text), Event-Attendance Willingness checkbox (checked = Yes), Other Orgs optional → Next.
7. Step 5 Consent: check both boxes, complete Turnstile, → **Review** (step 6) shows every answer plus `Campaign = A.Y. 2025-2026` for correction; **Edit** jumps back with values intact.
8. Review → **Submit** → on-site **Confirmation** (org-supplied copy, no timeline promise, shows campaign year).

**Expected**: No new tab; server action succeeds `{ success: true }`; a new page appears in `Form Submissions` with every answered field under the contract's labels, `Mobile Number` as number, `Availability` as text, `Campaign` relation linked to the active `A.Y. 2025-2026`, empty optionals blank/absent; `membership_rate_limit` cookie set (`HttpOnly`, JSON array). Repeat with same email/Student ID is allowed — second page linked to same campaign; viewed from the campaign page's inline `Form Submissions` view.

### 2. Invalid input — inline guidance, no data loss

- Leave Full Name empty → **Next** blocked, `FormMessage` "at least 2 characters".
- Email `not-an-email` → inline "Invalid email".
- Birthdate tomorrow → "not in the future".
- Primary == Secondary → "must be different" on Secondary.
- Unchecked consent → Submit blocked ("You must accept…").
- Availability `999` → "0–60" range.
- Facebook `not-a-url` → invalid URL message.
- Pick a College value not in live Notion options (tamper via devtools) → server rejects "outside live option set".

**Expected**: Human-readable inline messages; no technical throw; values retained; fixing clears error.

### 3. Transient write failure — retry retains data

Temporarily use an invalid `NOTION_MEMBERSHIP_SUBMISSIONS_DATABASE_ID` → Submit → banner `"Something went wrong..."` → fix env → **Retry** without re-entering → success. `membership_rate_limit` not appended on failure.

### 4. Rate limiting — 5 per rolling hour, isolated cookie

1. Submit 5 successes from same browser (vary Email/Name). Each succeeds and links to campaign.
2. 6th within hour → server `{ success: false, error: "You've submitted quite a few applications..." }`; zero new page; banner friendly; data retained.
3. DevTools → Application → Cookies → `membership_rate_limit` is `HttpOnly`, JSON array ≤5, `SameSite=Lax`, `Path=/`. Clear it → 6th succeeds.
4. Submit a contact inquiry on `/contact` between — `contact_rate_limit` and `membership_rate_limit` isolated.

### 5. Turnstile failure

Submit with expired Turnstile token → server security-check message, no page, data retained; re-verify → success.

### 6. Double-submit guard

On Review, double-click **Submit** rapidly → only one network request / one `Form Submissions` page (button disabled while `pending`).

### 7. Campaign gating — closed / no active campaign

1. PATCH active campaign `Status` to `Closed` (or delete it) via Notion dashboard or admin UI `POST /admin/membership` if built.
2. Reload `/membership` — wizard shows closed/not-yet-open state (e.g., "Applications are currently closed — please check back when the next campaign opens.") and submit is disabled.
3. Attempt to POST directly to the server action while closed → `{ success: false, error: closed message }`, zero page, data retained for later.
4. PATCH back to `In progress` → form reopens; pending form data can be retried and now succeeds under the reopened campaign.

### 8. Accessibility + themes + motion

- Tab through entire wizard (steps, live selects, checkboxes, Turnstile, Next/Back/Submit) — keyboard completable, visible focus, correct heading order, `aria-invalid`/`aria-describedby` via `form.tsx`.
- Toggle light/dark mid-wizard — no hardcoded grays; brand tokens via `cn`.
- With OS "Reduce motion" enabled, step transitions and progress bar respect `useReducedMotion`.

### 9. Retired Google Form links

Grep `forms.gle/ViNChagDv6Xcfp3bA` — zero hits after feature. Every CTA scrolls to native wizard; no `target="_blank"` to Google remains.

### 10. Officer readiness (data-model + campaign audit)

In Notion, open the active campaign page `A.Y. 2025-2026`:

- Inline `Form Submissions` view shows exactly the test submissions submitted during `In progress` (each with `Campaign` relation).
- Open each submission: all answered fields under exact labels from `contracts/membership-application.md` §3, live option values, `Mobile Number` as number, `Availability` text, checkbox willingness, empty optionals absent.
- Manual `Status` transitions on submissions or campaign work with no code change; a new campaign `A.Y. 2026-2027` can be added later and the form will route to it when it becomes `In progress`.

## Done when

- `npm run type-check` and `npm run lint` pass.
- `npm run build` succeeds with both `NOTION_MEMBERSHIP_*` IDs set (fails loudly without either).
- All 10 scenarios above pass in both themes, keyboard-only.
- Notion: each successful submission is linked via `Campaign` to the `In progress` campaign at submit time; rate-limited/Turnstile-failed/closed-campaign attempts create zero pages; `Campaign` relation and live option sets are respected.
