# Quickstart — Validation Guide

> **Scope (2026-08-21, user decision)**: **US1 Membership is deferred** — Scenarios 1–3 (native application) and the `NOTION_MEMBERSHIP_DATABASE_ID` prerequisite are on hold. Validate Scenarios 4–10 only. The critique gate records the membership P0 (Google Form) as an accepted deferral with reason.

**Phase 1 output** · runnable validation scenarios proving the critique-remediation feature works end-to-end. Not a substitute for implementation detail (that lives in `tasks.md`). Spec: [spec.md](./spec.md) · Contract: [contracts/membership-application.md](./contracts/membership-application.md) · Data model: [data-model.md](./data-model.md)

## Prerequisites

- `npm install` (Node ≥ 20 per `.nvmrc`).
- `.env.local` with: `NOTION_API_KEY`, `NOTION_CONTACT_FORM_DATABASE_ID`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`, `KV_*` (optional locally). `NOTION_MEMBERSHIP_DATABASE_ID` only becomes required when US1 reopens.
- ⚠️ The membership slice (scenarios 1–3) requires the Notion membership DB + `NOTION_MEMBERSHIP_DATABASE_ID` — **deferred with US1**; re-enable when that scope reopens.

## Static gates (run first)

```bash
npm run type-check   # tsc --noEmit — must pass
npm run lint         # eslint --max-warnings 0 — must pass
npm run lint:ox      # oxlint — must pass
npm run build        # next build --webpack + next-sitemap — must pass
```

## Scenario 1 — Native membership application (happy path) _(US1 / FR-001..008, SC-002)_

1. `npm run dev`, open `/` → click the sole hero join action (`Join ISATech`).
2. Complete the Standard Application Form across its progressive sections (Personal → Academic → Role Preferences → Availability & Commitment → Consent).
3. Review step shows all entered values; go back, edit a field, return — values retained.
4. Submit (Turnstile + rate limit pass) → confirmation shown; the record appears in Notion (membership DB) with `Status: New`, no Google Form in sight, never a new tab.

## Scenario 2 — Submission failure + in-session recovery _(FR-024, US1 edge case)_

1. Temporarily point `NOTION_MEMBERSHIP_DATABASE_ID` at an invalid database id.
2. Submit a valid form → human-readable error, no crash.
3. Edit a field, resubmit — **all previously entered data is still present** (no restart, no cross-session draft; refresh loses state — expected).

## Scenario 3 — Abuse defenses _(FR-005, US5)_

- Rate limit: submit 5 messages rapidly → 6th returns the human-readable hourly-limit message ("…limit…", not bare error text).
- Turnstile: block/expire the token → "CAPTCHA" failure message; nothing written to Notion.

## Scenario 4 — Hero determinism + designed frame _(US2 / FR-009..010, SC-003)_

1. Load `/` five times → identical video (Office Showcase 2025) every time — **no random swap**, no visible player controls, muted autoplay.
2. Throttle network to Slow 3G / block `youtube-nocookie.com` → a designed brand frame (never a blank black box) is visible while the media loads, then the video appears.
3. Responsive: mobile viewport — no autoplay crash, frame fills, `playsinline` respected.

## Scenario 5 — Credibility lane + 4H story _(US2 / FR-011..013, P3)_

1. First viewport shows motto ("DREAM • INNOVATE • SUCCEED") kicker + "Est. 2021" without scrolling.
2. The 4H archetype story (Hustler, Hacker, Hipster, Hound) is visible on the homepage before the quiz funnel; acronyms in view (KWADRA TBI, IPMO once org supplies expansions) show their full name on first use.

## Scenario 6 — One clear CTA _(US3 / FR-014)_

1. Hero has exactly one dominant action ("Join ISATech" → membership). No second "Learn More" → `/about` duplication above the fold.
2. Each homepage section offers at most one dominant call to action.

## Scenario 7 — Brand consistency incl. quiz _(US4 / FR-015..017, SC-004)_

1. Toggle light/dark across Home, About, Membership, Quiz, Contact — no hardcoded gray washes break dark mode (offer cards, lanyard text, team borders all readable).
2. Quiz: take it to the end — the generalist result is **gold** (not violet); quiz intro archetype colors match the result-screen palette per archetype; gradient text uses brand tokens.
3. Browser loading bar color = brand gradient (from tokens); quiz-end confetti only brand + archetype hues.
4. Detector: re-run the impeccable design detector — **0** AI-color / token violations.

## Scenario 8 — Nav hygiene + logo behavior _(US5 / FR-018, FR-022, US4 minor)_

1. Right-click the header logo → normal browser context menu appears (no redirect to `/about`).
2. Navigate every header/footer link — no href ends in a bare `#`; the current page is visibly active in both themes; each link resolves to a real page/anchor.

## Scenario 9 — Trust walkthrough _(US5 / FR-020..021, SC-006)_

1. Contact page shows the org's canonical email (site config) — no `info@isatech.com`.
2. Follow the privacy path incl. `/privacy#manage-cookies` → anchored section exists and resolves.
3. All Contact/Privacy links resolve or are removed; no dead ends.

## Scenario 10 — Motion + quiz honesty _(US6 / FR-019, FR-023)_

1. Enable OS reduced-motion → loaders (route loading, spinner) are calm/disabled; result badge + count-up springs snap (no bounce).
2. Quiz intro states an honest time/count for 20 questions (org-approved string); quiz logic unchanged (still exactly 20 questions).

## Gate — impeccable critique re-run _(SC-001, per spec + user request)_

After all slices land on the deployment branch:

1. Run the impeccablle critique on the whole site (`src/app/(static)` + `src/components`, incl. the design detector).
2. **PASS**: score ≥ 8/10, **zero** open P0 and P1 findings; every P2/P3 item closed or explicitly accepted with a recorded reason. Otherwise iterate on the findings and re-run.
