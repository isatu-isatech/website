# Contract: OG Quiz Banner — `GET /api/og/quiz`

Renders the 1200×630 result-share banner for a canonical quiz outcome.

## Query parameters

| Param        | Required | Rules                                                                                                                                                                                                |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `role`       | no       | Must be a canonical outcome (one of the 17 keys of `archetypes` in `quiz-data.ts`). Unknown/missing → `302` to the canonical invite banner URL (this endpoint with no params). Never rendered as-is. |
| `archetype`  | no       | `ArchetypeKey`. Unknown → default color pair (Hacker pair).                                                                                                                                          |
| `generalist` | no       | `"true"` enables the gold Generalist banner. Also detected when `role === "Generalist"`.                                                                                                             |

## Behavior

- **Canonical role** → `200`, `image/png` banner: archetype color pair,
  archetype icon art (same PNG as the in-app result), Poppins typography,
  auto-fit role title.
- **Generalist** → gold pair (`COLORS.quiz.generalist`) with `4h-vertical.png`
  art.
- **Unknown / forged / oversized `role`** → `302` to the canonical invite
  banner URL. No unbounded image variants are ever created (SC-003).
- **Missing params** → `200` invite banner (default look).
- **Any request** → no cookies required, no server-side store consulted
  (FR-016). Social crawlers fetch this URL cookie-less and still get a banner.

## Response headers

```
Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800
Content-Type: image/png
```

Bounded content set (17 outcomes + 1 invite) makes this cache effective:
repeated shares of the same outcome are served from cache, not regenerated
(FR-016, SC-004).

## Invariants

- Only 18 distinct renderable URLs exist (17 canonical + invite default).
- The URL is built identically by the share button, the result metadata, and
  the OG metadata (R7).
- Runtime: `nodejs` (needed for `fs.readFile` of bundled font + icon assets).
