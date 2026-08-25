# Research: Contact Page Cookie-Based Rate Limiting

**Date**: 2026-08-23 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

Resolves all technical unknowns for the feature. Every decision is recorded in
Decision / Rationale / Alternatives form.

## R-001 Rate-limiting mechanism: browser-held cookie (org decision)

- **Decision**: Replace the Upstash/Vercel KV sliding-window limiter on the
  Contact page with a browser-held record: an HttpOnly `contact_rate_limit`
  cookie storing a JSON array of successful-Inquiry epoch-ms timestamps,
  checked and updated by the server action.
- **Rationale**: Org decision (spec Assumptions; constitution P5 amended to
  v1.1.0 making the mechanism org-decided). Removes a server-side dependency
  for the contact path, keeps the exact same 5-per-rolling-hour policy, and
  degrades gracefully when cookies are unavailable (FR-009).
- **Alternatives considered**:
  - Keep KV (rejected — org decision to drop; P5 v1.1.0 permits the change).
  - Server-side in-memory map (rejected — not shared across serverless
    instances; would introduce a stateful store).
  - Database-backed limiter (rejected — P6 forbids a mirrored external DB; the
    Notion write path is not a limiter).
  - Turnstile only, no rate limit (rejected — P5 mandates rate limiting).
  - Client-side localStorage check (rejected — the server action cannot read
    localStorage; a cookie is the only browser-held channel the server can
    enforce).

## R-002 Cookie shape and attributes

- **Decision**: name `contact_rate_limit`; value = JSON array of epoch-ms
  numbers, capped at 64 entries; HttpOnly, SameSite=Lax, `path=/`,
  `maxAge` = 2 × window (7200 s, stale entries pruned on read), `secure` in
  production.
- **Rationale**: HttpOnly keeps the record server-only; SameSite=Lax is
  appropriate for a same-site form action; a 2× window maxAge preserves the
  last hour of activity across idle gaps; the 64-entry cap keeps the payload
  far under the browser's 4KB cookie budget.
- **Alternatives considered**: rolling count + window-start timestamp
  (rejected — less precise than timestamps for a rolling window); maxAge
  shorter than the window (rejected — would lose recent activity).

## R-003 Only successful submissions count (behavioral delta vs. old limiter)

- **Decision**: the cookie is appended only after the Notion write succeeds;
  Zod, Turnstile, or service failures never update it (FR-007).
- **Rationale**: Failed attempts are user error or transient outages, not
  abuse signals. Note: this is a deliberate, spec'd behavior change — the old
  KV sliding window counted every attempt, so a failed attempt previously
  consumed budget; it no longer does.
- **Alternatives considered**: count every attempt (rejected — punishes
  legitimate users for transient failures); count security-check failures
  separately (rejected — Turnstile already gates; extra state for no gain).

## R-004 Multi-tab / concurrent submissions (accepted race)

- **Decision**: accept the read-modify-write race. Two simultaneous submits
  from the same browser can both read the pre-write cookie and both succeed;
  last write wins, so the record may undercount by at most the number of
  concurrent requests.
- **Rationale**: The race needs same-browser concurrency (unusual for a
  human), the overshoot is bounded, and Turnstile remains the primary gate.
  Fixing it would require server-side coordination, defeating the purpose of
  dropping the server store.
- **Alternatives considered**: server-side atomicity/locking (rejected —
  reintroduces the stateful dependency being removed).

## R-005 Observability of refusals

- **Decision**: no per-refusal logging; keep the existing P4 convention
  (`console.error` for unexpected errors). Rate-limit refusals return the
  standard `{ success: false, error }` result like other expected failures.
- **Rationale**: Refusals are expected failures, not errors; logging each one
  adds noise with no dashboard owner. If the org later wants abuse metrics,
  the cookie contract is stable and logging can be added without redesign.
- **Alternatives considered**: `console.warn` per refusal (rejected — noise);
  structured metrics (rejected — no metrics pipeline in the project).

## R-006 Cookie consent / GDPR posture

- **Decision**: no consent-banner change and no privacy-page change. The
  cookie is strictly necessary (anti-abuse for the form's own operation), set
  server-side, HttpOnly, and stores only timestamps — no tracking, no personal
  data.
- **Rationale**: The site's `vanilla-cookieconsent` config treats "necessary"
  as enabled-by-default and consent-exempt; a server-set HttpOnly cookie is
  not blocked by the client-side consent tooling.
- **Alternatives considered**: disclose in the privacy policy (org-copy per
  P2 — only if the org supplies wording); make it consent-gated (rejected —
  necessary cookies are exempt and gating would disable abuse defense).

## R-007 Quiz OG route / KV dependencies

- **Decision**: `src/app/api/og/quiz/route.tsx`, the `KV_*` env vars, and the
  `@vercel/kv` / `@upstash/ratelimit` packages are untouched; only the contact
  path stops using them (FR-010).
- **Rationale**: Scope discipline (P6): this feature is the Contact page; the
  quiz route keeps its own server-side limiter.

## R-008 Canonical terminology (P1)

- **Decision**: contact-form submissions are **Inquiries** per the CONTEXT.md
  glossary. The spec's Key Entity was aligned from "Contact Submission" →
  "Inquiry"; the plan, data model, contracts, and quickstart all use
  "Inquiry".
- **Rationale**: P1 forbids silently renaming glossary concepts; the canonical
  term already exists, so no glossary amendment is needed.
- **Note**: the glossary describes Inquiries as categorized by inquiry type
  (General / Membership / Sponsorship & Partnership / Media); the current form
  has no type selector — a pre-existing divergence, out of scope here.
