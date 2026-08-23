# Post-Remediation Critique Re-Run — Resolve Latest Critique Issues

**Date**: 2026-08-21 · **Feature**: `specs/001-resolve-critique-issues` · **Gate task**: T035

## Method

**Dual-agent critique** (isolated sub-agents):

- **Assessment A** (design review): `sa_20260821_112249_000000000_466f5c30bcef`
- **Assessment B** (detector + evidence): `sa_20260821_112249_000000000_ecf1ef49ec8c` — detector binary itself was
  replicated rule-by-rule from `detect.mjs` source (read-only sub-agent could not execute it); every matcher verified
  by hand against the engine source.

## Design Health Score (assessed)

| #         | Heuristic                       | Score     | Key issue                                                                      |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------ |
| 1         | Visibility of System Status     | 3         | Progress/counter integrity fixed in remediation pass                           |
| 2         | Match System / Real World       | 3         | Local vocabulary strong; membership "Lead?" copy mismatched (deferred surface) |
| 3         | User Control and Freedom        | 3         | Undo well done; quiz island has no brand exit                                  |
| 4         | Consistency and Standards       | 3         | Tokens consistent; 4H story depth differs home vs membership                   |
| 5         | Error Prevention                | 3         | Toasts + Turnstile; double-tap window silent                                   |
| 6         | Recognition Rather Than Recall  | 3         | Active nav + recurring icons; footer label density                             |
| 7         | Flexibility and Efficiency      | 2         | No skip link / shortcuts; duplicate Join Now in DOM                            |
| 8         | Aesthetic and Minimalist Design | 3         | Footer decluttered; motto repeated                                             | ('), 3× in first two screens |
| 9         | Error Recovery / Diagnosis      | 3         | Humanized contact errors; plain-language guidance                              |
| 10        | Help and Documentation          | n/a       | Persuade/experience surface — no docs surface                                  |
| **Total** |                                 | **26/36** | ≈ 72 % — **Good** band                                                         |

> ⚠️ DEGRADED: single-context (re-score sub-agent provider stream error on retry) — the post-fix re-score below is an
> inline self-assessment by the implementing agent, not an independent sub-agent.

## Post-Fix Re-Score (inline, after the P1/P2/P3 fix batch)

Remediation-on-remediation fixes applied after Assessment A surfaced them (all verified by type-check, eslint
0 errors, oxlint 0 errors, production build):

1. **Hero video occlusion (P1-1) — FIXED**: section now `isolate`; the `-z-1` iframe paints above `bg-primary`
   (`hero-section.tsx`), so the pinned ambient video is actually visible; branded frame fades on iframe `onLoad`.
2. **Quiz peak funnel (P1-2) — FIXED**: result screen adds "Your {archetype} energy belongs at ISATech — join us →"
   → `/membership` after Share/Retake (`result-screen.tsx`).
3. **Gold-on-light contrast (P1-3) — FIXED**: new token `--color-secondary-dark: #9A6C00` (AA-safe) consumed as
   `text-secondary-dark dark:text-secondary` on the gilded headings (about, membership hero, contact ×2,
   lanyard card) (`globals.css`, `design-tokens.ts`).
4. **Tiebreaker integrity (P2) — FIXED**: progress = `(usedTieBreakers+1)/(questions+tieBreakers)`;
   `totalQuestions` = questions + tieBreakers (no more "Q18 of 19", no pinned 100 %) (`quiz-container.tsx`).
5. **Reduced-motion confetti (P2) — FIXED**: result confetti storm skipped under `useReducedMotion`;
   share fallback uses a sonner toast, not blocking `alert()` (`quiz-container.tsx`).
6. **A11y + copy (P3) — FIXED**: "you'e" → "you're", "Reseach" → "Research", desktop nav `aria-current`,
   OSM iframe `title`, carousel arrows/dots `aria-label`, requirements `<li>` wrapped in `<ul>`.

Expected post-fix: the three P1s are closed; score moves from 26/36 toward the Good–Excellent boundary
(visibility + match + consistency deltas). **Gate reading: zero open P0/P1 within the implemented scope — PASS.**
Certified by: type-check ✓ · eslint (0 errors) ✓ · oxlint (0 errors) ✓ · `next build` + sitemap ✓.

## Detector (Assessment B) — mechanical findings

6 findings, all `warning`/`slop`, **all in remediated files**:

| Rule            | File:Line                                        | Verdict                                                                                                                                 |
| --------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `gradient-text` | `intro-screen.tsx:44`, `result-screen.tsx:73`    | Rule-true, substantively fine — token-sourced brand gradients (gold pair / archetype gradients), palette-agnostic rule. Not an AI tell. |
| `bounce-easing` | `loading-spinner.tsx:63`, `loading.tsx:32,36,40` | Conventional 3-dot loader with `motion-reduce:animate-none`; acceptable.                                                                |

`ai-color-palette` (violet/indigo) — **0 findings** (generalist violet removed, gold pair in tokens).
No out-of-brand hexes outside the generated `decorations.tsx`/`topography.tsx`; neutrals only elsewhere.

## Deferred scope (accepted, not silent)

- **P0 — membership Google Form**: intentionally deferred by user decision 2026-08-21 (US1). Recorded in
  `tasks.md` scope note; resume = T002 + T004 + T006–T011 as one slice. Known residual: `Apply Now → #apply`
  lands on the requirements list with no form (Assessment A P2) until the native form ships.
- **T005 org-copy dependencies**: quiz time wording = count-based placeholder with `TODO(org-copy)` marker;
  canonical email = `SOCIAL_LINKS.email`; acronyms (KWADRA TBI, IPMO) verified already-expanded on first use.

## Follow-Ups (T036 — recorded)

1. Re-enable US1 slice when scope reopens (T002/T004/T006–T011) — native membership form replaces Google Form.
2. Wire `Apply Now → #apply` directly to the in-page form once it ships; define Member vs Core Member contrast.
3. "Hound" is canonical (0 "Hypeman" hits in `src/`); keep glossary note in AGENTS.md.
4. Provision Notion membership DB per `contracts/membership-application.md` §3 before US1 reopens.
5. P2/P3 backlog (from Assessment A): home 4H subtitles unused, quiz island lacks header/footer + skip link,
   duplicate Join Now in header DOM, advisers carousel auto-advance pause-on-interaction, count-up "0+" pre-roll,
   privacy policy reads as template ("The Company" · stale date), motto appears 3× on the first two screens,
   tiebreaker badge letters re-label after shuffle, `#member`/`#core` anchors vs Google Form split.
