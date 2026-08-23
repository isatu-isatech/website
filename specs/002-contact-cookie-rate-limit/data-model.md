# Data Model: Contact Page Cookie-Based Rate Limiting

**Date**: 2026-08-23 | **Spec**: [spec.md](spec.md) | **Research**: [research.md](research.md)

## Entities

### Inquiry (Notion page — org data)

A non-application contact message submitted through the Contact form (canonical
glossary term).

- Fields:
  - `Name` (title) — visitor name, 2–50 chars (Zod: `contactFormSchema`)
  - `Email` (email) — valid email address
  - `Message` (rich_text) — 10–1000 chars
- Lifecycle: created once on successful submission; no state transitions, no
  updates, no deletion from the site (unchanged by this feature).
- Identity: Notion page id (server-managed).

### Browser Submission Record (cookie — not org data)

Per-browser rate-limit state for Inquiries.

- Storage: HTTP cookie `contact_rate_limit`; value = JSON array of epoch-ms
  timestamps of successful submissions, ascending.
- Attributes: HttpOnly, SameSite=Lax, `path=/`, `maxAge` 7200 s, `secure` in
  production.
- Invariants:
  - Only timestamps within the rolling 60-minute window are counted (pruned on
    read).
  - Length ≤ 64 entries (payload cap).
  - Appended only after a successful Notion write (FR-006 / FR-007).
  - Unreadable, malformed, or absent payload ⇒ empty record (FR-009).
- Relationship: 1 Browser Submission Record per browser ⇒ N Inquiries (≤ 5 per
  rolling hour).

## Validation rules (from spec)

| Rule                                                      | Source      | Behavior                                                 |
| --------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| ≤ 5 successful submissions per rolling 60 min per browser | FR-004      | Refuse + friendly rate-limit message                     |
| No append on failure                                      | FR-007      | Zod / Turnstile / service errors never update the record |
| Empty record when cookies unavailable                     | FR-009      | First-time submitter; Turnstile still gates              |
| Notion is the only store for Inquiry data                 | FR-001 / P6 | No mirrored external DB                                  |

## State transitions

None. The Browser Submission Record is a derived, ephemeral view; Inquiries
are immutable after creation.
