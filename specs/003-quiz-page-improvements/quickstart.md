# Quickstart — Validation Guide (003 Quiz Page Improvements)

End-to-end validation scenarios for the quiz improvement feature. Contracts:
[contracts/](contracts/) · data model: [data-model.md](data-model.md) · spec:
[spec.md](spec.md).

## Prerequisites

- Node.js (see `package.json` engines) + `npm install` at repo root.
- No environment variables are required for this feature (the key-value
  store variables are removed — see SC-005). Other surfaces may still need
  their own env vars for full testing (e.g. Notion/contact); the quiz flows
  below run without any.

## Setup commands

```bash
npm install          # one-time; removes nothing manually — @vercel/kv/@upstash/ratelimit are dropped from package.json by this feature
npm run dev          # local dev (webpack)
```

## Validation scenarios

### 1. Quiz is fully reachable on short viewports — SC-002, FR-001

1. Open `http://localhost:3000/quiz`.
2. Use devtools responsive mode at ~568 px height (landscape phone).
3. Walk intro → all questions → result (answer `Hustler`-weighted choices).
4. On the result screen, scroll through badge, description, breakdown,
   Share/Retake buttons, membership link.

- **Expected**: no permanently clipped content, no horizontal scroll; the
  page scrolls where needed. Repeat once in dark theme.

### 2. In-progress quiz survives refresh — SC-008, FR-008

1. Start the quiz, answer 3–4 questions (remember which).
2. Refresh the page (and separately: navigate away and back).
3. **Expected**: you resume at the same question with prior answers intact.
4. Finish the quiz; then start a new attempt and refresh mid-quiz — the
   record from the previous run must not leak in.
5. Close the tab, reopen, start quiz → **expected**: fresh quiz (session
   scope).

### 3. Accessibility posture — SC-006, FR-002

1. Keyboard-only: Tab through the quiz — focus is visible on every control.
2. Select an answer with Enter/Space — selection and progress are announced
   by a screen reader (check `aria-pressed`/progress semantics).
3. Enable "prefers-reduced-motion" (OS setting or devtools emulation) — no
   confetti storm on the result; transitions are non-motion.

- **Expected**: full keyboard completion succeeds in light and dark themes.

### 4. Share flow renders a correct banner for every outcome — SC-001, FR-009…FR-016

For each of the 17 canonical roles (e.g. `True Hacker`,
`Ingenious Hustler`, `Generalist`):

```bash
# Banner directly
curl -s -o /tmp/og.png -w "%{http_code} %{content_type}\n" \
  "http://localhost:3000/api/og/quiz?role=True%20Hacker&archetype=Hacker"
# Metadata of a shared link
curl -s "http://localhost:3000/quiz/result?role=True%20Hacker&archetype=Hacker" | grep -o '<meta[^>]*og:image[^>]*>'
```

- **Expected**: `200 image/png`; the PNG shows the Hacker color pair, the
  Hacker icon art (not an emoji), and Poppins typography; the metadata
  `og:image` matches the banner URL. Generalist shares render the gold pair
  with `4h-vertical.png` art.

### 5. Forged params never create unbounded variants — SC-003, FR-009

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  "http://localhost:3000/api/og/quiz?role=%3Cscript%3Ealert(1)%3C%2Fscript%3E"
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://localhost:3000/api/og/quiz?role=$(python -c 'print("A"*200)')"
```

- **Expected**: `302` to the canonical invite banner URL in both cases; the
  role text is never rendered raw; no new image variants are created.

### 6. Caching and repeated shares — SC-004, FR-016

```bash
curl -sI "http://localhost:3000/api/og/quiz?role=True%20Hound&archetype=Hound"
```

- **Expected**: `Cache-Control: public, max-age=86400, s-maxage=86400,
stale-while-revalidate=604800`; repeated identical requests return the
  cached image, no rate-limit or store errors.

### 7. The site runs with no key-value store — SC-005, FR-018…FR-021

1. Confirm `src/lib/env.ts` and `.env.example` no longer reference
   `KV_URL`/`KV_REST_API_URL`/`KV_REST_API_TOKEN`.
2. `grep -rn "vercel/kv\|upstash" src package.json` → no hits.
3. Run `npm run type-check`, `npm run lint`, `npm run build` → all pass with
   no KV variables set.
4. Contact page: submit messages and confirm the 5-per-hour browser-held
   limit still applies (unchanged, spec 002).

## Gate commands (run before considering the feature done)

```bash
npm run type-check
npm run lint
npm run build
```

All three must pass with zero errors/warnings (lint uses `--max-warnings 0`).
