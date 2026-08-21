<!--
  SYNC IMPACT REPORT

  Version change: (none — initial bootstrap) → v1.0.0
  Modified principles: n/a (new constitution)
  Added sections: Preamble; Principles 1–7; Governance
  Removed sections: n/a
  Templates requiring updates:
    - .specify/templates/plan-template.md          ✅ installed (copied from bundled core pack)
    - .specify/templates/spec-template.md          ✅ installed (copied from bundled core pack)
    - .specify/templates/tasks-template.md         ✅ installed (copied from bundled core pack)
    - .specify/templates/constitution-template.md  ✅ installed (structure aligned to this doc on 2026-08-21)
    - .specify/templates/commands/*.md             ✅ n/a (Reasonix layout uses .reasonix/commands/)
    - .reasonix/commands/speckit.*.md              ✅ updated (all load constitution via "IF EXISTS"; no
                                                     hardcoded principle names — no edits required)
    - README.md / AGENTS.md / CONTEXT.md           ✅ no changes required (principles derived verbatim from
                                                     CONTEXT.md and AGENTS.md; phrase matches)
    - docs/shape-brief.md, docs/adr/*.md           ✅ informational only; no principle conflicts
  Follow-up TODOs: none (all governance fields resolved: ratification 2026-08-21)
-->

# ISATech Website Constitution

## Preamble

The ISATech Society Website is the public, credibility-bearing surface of ISAT U
Innovators and Technopreneurs Society. This constitution defines the non-negotiable
principles that govern how we plan, specify, build, and review the site. It exists to
keep the product truthful to the org, the domain language unambiguous, and the
engineering discipline verifiable. Every spec, plan, and task produced by this project
MUST be validated against these principles before it is considered acceptable.

## Core Principles

### P1. Domain Language Discipline

The project uses a canonical, single-source glossary (currently `CONTEXT.md`) as the
ubiquitous language shared by the product and the implementation.

- Core terms MUST be used exactly as defined and MUST NOT be conflated: **Membership**
  vs **Core Membership** (independent on-ramps, not an upgrade path), **Committee** /
  **Position** / **4H archetype** (three distinct taxonomies), **Event** / **RSVP** /
  **Inquiry** (three distinct devices).
- A term MUST NOT be reused to mean something else, and a concept MUST NOT be silently
  renamed in a spec, plan, task, or UI without amending the glossary first.
- When an implementation detail would blur a product term (e.g. the form's "4H Role"
  label), the product term remains canonical and the ambiguity is resolved in the
  glossary, not by renaming the feature.

**Rationale:** The org's operational reality is precise; conflated terms create
specifications that officers cannot act on directly (see P6).

### P2. Org-Truth Copy

The site is the org's public face; content MUST state only what ISATech officers
actually do, and MUST NOT invent process, timeline, or outcome claims.

- "What happens next" / review-pipeline copy MUST reflect the org's real process, not a
  hypothetical one.
- Developers MUST NOT promise a specific completion time for application work.
- Product copy (mission, taglines, facts, quotes) MUST NOT be invented or rewritten by
  implementers without an explicit org decision recorded in an ADR or brief.

**Rationale:** The site recruits members and builds credibility; fabricated claims
damage trust and cannot be honored by the org.

### P3. Accessibility Is a Standing Requirement

Accessibility is not a polish item; it is a baseline acceptance criterion for every
surface.

- All shipped UI MUST preserve or improve on the current accessibility posture (Radix
  UI primitives, semantic HTML, keyboard operability, contrast).
- New or redesigned surfaces MUST be validated in both supported themes (light and
  dark) and MUST NOT regress focus, labels, or heading order.
- Interactive components MUST expose their state to assistive technology.

**Rationale:** Inclusivity is both a value and part of the brand; regression here is a
release blocker, not a follow-up.

### P4. Type Safety & Input Validation

The codebase treats types and runtime validation as a hard guardrail, not a style
choice.

- Every runtime environment variable MUST be Zod-validated in `src/lib/env.ts`; all
  public vars MUST be prefixed `NEXT_PUBLIC_*`; every new var MUST be added to both
  `env.ts` and `.env.example`.
- Server actions (`"use server"`) MUST validate their input with Zod schemas before use.
- Expected failures MUST be surfaced as `{ success, error }` results, not thrown
  exceptions, and logged with `console.error`.

**Rationale:** This prevents misconfigurations and invalid data from reaching the org's
Notion records and the production site.

### P5. Security & Abuse Hardening

Public-facing and data-capturing surfaces MUST be defended against abuse and
misconfiguration by default.

- Public forms MUST be protected (Cloudflare Turnstile) and rate limited
  (Upstash / Vercel KV).
- Secrets MUST NOT be placed in client bundles; security headers and CSP in
  `src/middleware.ts` MUST be maintained.
- The contact path MUST resolve to an owned domain and human-readable messages; broken
  or unverified trust signals (e.g. dangling privacy links) MUST be fixed or removed
  before release.

**Rationale:** The site is public and anonymous; abuse handling is the standing defense
in the absence of accounts (H2 boundary).

### P6. Scope & Boundary Discipline

The roadmap boundaries recorded in project context (H1 / H2 / H3a / H3b) are binding
for any given effort and MUST NOT be silently exceeded.

- Features explicitly out of scope for the current effort MUST NOT be added during
  implementation; a boundary change is an org decision recorded in an ADR or brief.
- **Notion is the primary data store** for Membership / Core Membership applications,
  Events, and RSVPs; a mirrored write to an external DB MUST NOT be introduced unless a
  new ADR explicitly adopts it.
- Officially "open" status (committees, positions, events) comes from the org's data,
  not from hard-coded site state.

**Rationale:** Prevents creeping scope and prevents the site from diverging from the
org's real operational model, which officers manage without code changes.

### P7. Human-Reviewed Commit Discipline

Automated agents MUST NOT commit or push directly.

- Agents MUST leave the exact `git add` command and a conventional, scope-grouped
  commit title for a human to review and execute.
- Atomic, single-purpose commits are preferred; large generated or 3D-heavy asset
  files MUST NOT be reformatted wholesale.

**Rationale:** The human retains control of repository history and review quality;
unreviewed automated writes are out of scope for agent work.

## Governance

### Amendment Procedure

- Amendments are made through the `/constitution` workflow, which updates this document
  and re-validates dependent templates.
- A change that alters, removes, or redefines a principle MUST go through this explicit
  amendment process — never through a silent edit inside a spec, plan, or task.
- Conflicting specs, plans, or tasks MUST be adjusted to the principle; a principle MUST
  NOT be diluted to accommodate an out-of-scope requirement.

### Versioning Policy

This constitution follows semantic versioning:

- **MAJOR**: backward-incompatible governance change — principle removed, renamed, or
  redefined.
- **MINOR**: a principle or materially expanded guidance section added.
- **PATCH**: clarification, wording, or non-semantic refinement of existing principles.

Every bump MUST record the version, ratification date, and last-amended date above, and
MUST include the Sync Impact Report at the top of this file.

### Compliance Review

- Each spec, plan, and task MUST be checked against these principles by the `analyze`
  and `checklist` workflows.
- Any requirement conflicting with a MUST principle is a CRITICAL finding and blocks
  acceptance until the spec, plan, or task is adjusted.
- If a principle itself is believed to be wrong, that change MUST be proposed as a
  separate, explicit constitution amendment — not folded into feature work.

**Version**: 1.0.0 | **Ratified**: 2026-08-21 | **Last Amended**: 2026-08-21
