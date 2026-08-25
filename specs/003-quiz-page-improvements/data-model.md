# Data Model — Quiz Page Improvements (003)

Entities for the quiz improvement feature. Derived from spec
`003-quiz-page-improvements`. No server-side storage is introduced; all
records below are either derived from existing quiz data, browser-held
session state, or transient request/response contracts.

## Entities

### Archetype

Canonical glossary term: one of the four 4H roles.

| Field                   | Type                                            | Notes                                                                                                                      |
| ----------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `key`                   | `"Hustler" \| "Hacker" \| "Hipster" \| "Hound"` | Glossary term; unique.                                                                                                     |
| `colorFrom` / `colorTo` | hex                                             | Single source of truth: `COLORS.quiz.archetypes` in `design-tokens.ts`, mirrored by `archetypeGradients` Tailwind classes. |
| `iconPath`              | string                                          | `public/assets/decorations/{key}.png` — used by the in-app result **and** the OG banner (FR-010).                          |

### QuizOutcome

The canonical result of the quiz.

| Field                | Type                   | Notes                                                                                                                                                          |
| -------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `role`               | string                 | One of 17 canonical values: 16 adjective+archetype combinations + `Generalist`. Canonical set = `Object.keys(archetypes)` in `quiz-data.ts` (never hardcoded). |
| `primaryArchetype`   | `ArchetypeKey`         | Top-scoring archetype.                                                                                                                                         |
| `secondaryArchetype` | `ArchetypeKey \| null` | Present when score gap < threshold.                                                                                                                            |
| `isGeneralist`       | boolean                | All four scores tied.                                                                                                                                          |
| `description`        | string                 | Org-written copy from `quiz-data.ts`; never invented (P2).                                                                                                     |

Invariant: a `role` is shareable **iff** it is in the canonical set; the
banner renders only canonical roles (FR-009).

### QuizProgress (browser session record)

Session-scoped in-progress quiz state, held in `sessionStorage` (FR-008).
Discarded when the tab closes; per-tab isolated.

| Field                            | Type                                            | Notes                                                                                                         |
| -------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `version`                        | string                                          | Derived from quiz-data shape (e.g. question/tiebreaker counts); mismatched stored records are discarded (R4). |
| `phase`                          | `"intro" \| "quiz" \| "tiebreaker" \| "result"` | Restored position.                                                                                            |
| `currentQuestionIndex`           | number                                          |                                                                                                               |
| `usedTieBreakers`                | number                                          |                                                                                                               |
| `scores`                         | `Record<ArchetypeKey, number>`                  | Per-archetype totals.                                                                                         |
| `answers`                        | `Choice[]`                                      | Chosen answers in order (enables back/undo restore).                                                          |
| `questionOrder` / `choiceOrders` | shuffled orders                                 | Exact shuffle restore; payload is small (~21 questions × 4 choices).                                          |

Lifecycle:

- **create**: on quiz start (after intro) — replaces any prior record.
- **update**: after every committed state transition (answer, undo).
- **clear**: when the result phase is reached and on explicit retake.
- **invalidate**: on `version` mismatch (quiz data changed).

Restore happens once on mount (client-only, post-hydration) so there is no
SSR mismatch.

### ResultShareLink

The URL that renders a banner for platforms and redirects humans to the quiz.

| Param        | Value                 | Rule                                                                   |
| ------------ | --------------------- | ---------------------------------------------------------------------- |
| `role`       | canonical role string | Percent-encoded; must be canonical (else banner 302 → invite default). |
| `archetype`  | `ArchetypeKey`        | Percent-encoded; unknown → default color pair.                         |
| `generalist` | `"true"` (optional)   | Round-trips through share → metadata → banner (FR-013/FR-014).         |

Metadata URL, OG image URL, and the share button's URL must be byte-identical
per outcome (R7).

### OGBanner

The generated 1200×630 share image.

- Bounded content set: 17 canonical outcomes + 1 invite default (no-params).
- Renders: brand font (bundled Poppins woff2), archetype color pair, archetype
  icon art (same PNG as the in-app result), auto-fit role title (no overflow).
- Cache: `Cache-Control: public, max-age=86400, s-maxage=86400,
stale-while-revalidate=604800`.
- No cookies required; no server-side store (FR-016).

## Relationships

- `QuizOutcome` → 1 `primaryArchetype` (and optional `secondaryArchetype`).
- `QuizOutcome.role` ↔ `ResultShareLink.role` (canonical set membership).
- `ResultShareLink` → renders `OGBanner` (via `/api/og/quiz`) and redirects
  humans to `/quiz`.
- `OGBanner` uses `Archetype.colorFrom/To` + `Archetype.iconPath`.
- `QuizProgress` is independent of all server-side records; it never touches
  Notion or any external store.
