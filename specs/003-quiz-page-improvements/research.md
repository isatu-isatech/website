# Research — Quiz Page Improvements (003)

Resolves the technical unknowns for spec `003-quiz-page-improvements`. Each
item records Decision / Rationale / Alternatives.

## R1 — Brand typography in the OG banner

- **Decision**: Bundle a Poppins woff2 (weights 400 + 700, matching the site's
  `--font-poppins` usage) into the repo under `src/app/api/og/quiz/fonts/`
  and read it with `fs.readFile` in the Node.js-runtime route, passing it to
  `ImageResponse` via the `fonts` option. Poppins is OFL-licensed, so
  redistributing the file is permitted.
- **Rationale**: Deterministic brand typography in every banner; no runtime
  network dependency (no flaky cold-start fetches); independent of the app
  CSP (`font-src` only governs browser rendering, not server-side image
  generation). The role title uses Poppins 700 (the site's bold weight); the
  small branding lines use Poppins 400.
- **Alternatives considered**:
  - Runtime `fetch` of `fonts.gstatic.com` with a static UA: no bundled
    asset, but adds a network call per cold instance and can fail/flake.
  - `system-ui` (status quo): renders inconsistently across platforms and
    does not match the brand — rejected per FR-012.
  - `next/font/google` binary reuse: `next/font` does not expose the font
    binary to `ImageResponse` — not viable.

## R2 — Archetype icon art in the OG banner

- **Decision**: Embed the existing archetype icon PNGs
  (`public/assets/decorations/{hustler,hacker,hipster,hound}.png`, and
  `4h-vertical.png` for Generalist — the exact same mapping the in-app result
  screen uses) as base64 data URIs read with `fs.readFile` on the Node.js
  runtime.
- **Rationale**: The banner then shows the same art as the in-app result
  (FR-010), renders identically on every platform (no emoji font variance),
  and requires no new assets or dependencies.
- **Alternatives considered**:
  - Emoji markers (status quo): inconsistent cross-platform rendering and a
    mismatch with the in-app result — rejected by clarification Q2.
  - Remote URLs inside `ImageResponse`: requires network fetch at render
    time and depends on the asset host — rejected.
  - New/optimized icon assets: out of scope; existing PNGs (74–618 KB) are
    acceptable. Response size is ~<1 MB, which is fine for an OG image.
    (Optional follow-up, not required: ship compressed variants.)

## R3 — Canonical outcome whitelist and unknown-role handling

- **Decision**: The canonical set is `Object.keys(archetypes)` from
  `src/lib/quiz-data.ts` — exactly the 17 outcomes (16
  adjective+archetype combinations plus Generalist). A shared helper
  (`src/lib/quiz/canonical.ts`) exposes: `CANONICAL_ROLES`, `isCanonicalRole`,
  and a banner-URL builder. In the OG route, any `role` not in the set →
  `302` redirect to the canonical invite banner URL (`/api/og/quiz` with no
  params). `archetype` must be an `ArchetypeKey`; unknown archetype falls
  back to the default color pair. Generalist is detected from
  `role === "Generalist"` **or** `generalist === "true"`.
- **Rationale**: Bounds the rendered image set to 17 + 1 invite banner (the
  abuse defense per the recorded P5 org decision, FR-009/SC-003). Redirecting
  (instead of rendering in place) means unknown URLs never create new cache
  entries at all. Social platforms and link previews follow 302s on `og:image`
  URLs. The whitelist is derived, never hardcoded, so it cannot drift from
  the quiz data.
- **Alternatives considered**:
  - Render the default banner in place at the unknown URL: works, but each
    unknown URL string becomes a distinct (unbounded) cache key — weaker for
    the abuse story.
  - `404` for unknown roles: breaks link previews that pass slightly
    malformed params — rejected.
  - Hardcoded list of 17 strings: duplicates the source of truth — rejected.

## R4 — In-progress quiz persistence (session-scoped)

- **Decision**: Persist the quiz state to `sessionStorage` under a versioned
  key (e.g. `4h-quiz-progress-v1`) in the client `QuizContainer`: save after
  every committed state transition, restore once on mount via `useEffect`
  (client-only, so no hydration mismatch), and clear on reaching the result
  and on explicit retake. The stored payload includes a data `version` token
  (derived from the quiz-data shape, e.g. question/tiebreaker counts) so a
  future quiz-data change invalidates stale progress instead of restoring an
  inconsistent state.
- **Rationale**: Refresh and back/forward navigation in the same tab share
  `sessionStorage`, so restoring on mount covers both (clarification Q1 /
  FR-008 / SC-008). Session scope matches the "discarded when the tab
  closes" requirement exactly, and per-tab isolation avoids cross-tab
  interference. Storing the full state (including shuffled orders) is
  simplest and exact — the payload is small (~21 questions × 4 choices).
- **Alternatives considered**:
  - Seeded PRNG to regenerate the shuffle from stored answers: less
    payload, but adds a bespoke PRNG dependency and risk of desync — rejected.
  - `localStorage`: survives tab close, violating the session-only decision — rejected.
  - No persistence (status quo): the hardening gap this feature closes — rejected.

## R5 — Key-value store removal

- **Decision**: Remove `@vercel/kv` and `@upstash/ratelimit` from
  `package.json`, delete the module-level `Ratelimit` block and the
  `x-forwarded-for` IP extraction from `src/app/api/og/quiz/route.tsx`, and
  remove `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` from
  `src/lib/env.ts` and `.env.example`. Grep confirms the OG route is the only
  consumer. The Contact page cookie limiter (`src/lib/services/
cookie-rate-limit.ts`) is untouched.
- **Rationale**: The site becomes KV-free (FR-018/SC-005); the spoofable
  per-IP limiter is gone; the recorded P5 org decision (bounded canonical
  set + long-lived caching) becomes the OG route's abuse defense.
- **Alternatives considered**:
  - Keep + harden the limiter (fix IP parsing): rejected by clarification
    Q1 — the org chose full KV removal.
  - Cookie-based limiting on the OG route: impossible — crawlers fetch
    without cookies (recorded in the spec).

## R6 — Banner caching

- **Decision**: Keep the response header
  `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800`
  on the OG route. Because only 18 canonical URLs can render (17 outcomes +
  invite default), this yields an effective, bounded public cache; repeated
  shares of the same outcome are served from cache, not regenerated.
- **Rationale**: Satisfies FR-016/SC-004 with no store of any kind.
- **Alternatives considered**: shorter max-age (more renders, no benefit);
  per-URL `Vary`/no-store (defeats the defense) — rejected.

## R7 — Result page SEO and share URL consistency

- **Decision**: In `src/app/quiz/result/page.tsx` metadata: set
  `robots: { index: false, follow: false }` (share pages are for social
  rendering, not search results — FR-017); percent-encode **all** query
  params (`role`, `archetype`) in every constructed URL; append
  `generalist=true` to the metadata `og:url` when applicable so the URL
  round-trips the flag exactly as the share button builds it (FR-014).
- **Rationale**: Keeps the metadata URL, the OG image URL, and the share
  button's URL byte-identical per outcome; closes the current
  generalist/encoding inconsistencies; excludes near-duplicate redirect
  pages from the index.
- **Alternatives considered**: a canonical tag pointing at `/quiz` — the page
  already server-redirects, so `noindex` is the meaningful signal; optional
  `alternates.canonical` may be added but is not required.

## R8 — Quiz page scroll safety (no clipping)

- **Decision**: Replace the fixed-height `h-[calc(100vh-60px)]` +
  `overflow-hidden` page container with a layout that grows with content
  (`min-h` + scrollable quiz area), keeping the ambient background
  decorations. Screens (intro, question, tiebreaker, result) then scroll
  naturally on short viewports instead of clipping (FR-001/SC-002).
- **Rationale**: The result screen (badge + description + breakdown +
  buttons + membership link) is taller than a ~568 px viewport; the current
  fixed-height container with `overflow-hidden` permanently clips it — the
  highest-impact hardening fix.
- **Alternatives considered**: per-screen internal scrolling panels —
  worse a11y and complexity — rejected.

## R9 — Runtime and platform constraints

- **Decision**: Keep `runtime = "nodejs"` on the OG route (required for
  `fs.readFile` of fonts/icons and `ImageResponse`). The app targets web
  (Vercel, desktop-first, mobile-aware); Next.js 16 with webpack build
  (`next dev --webpack` per package.json scripts). No new third-party
  dependencies are introduced anywhere (spec assumption) — only bundled
  OFL font files and existing PNGs.
- **Rationale**: The route is deterministic, cacheable, and dependency-light;
  everything else in the plan reuses existing project infrastructure.
