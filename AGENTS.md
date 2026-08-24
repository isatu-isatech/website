# ISATech Website

Official site for ISATech Society (ISAT U Innovators and Technopreneurs Society), a student org at Iloilo Science and Technology University. Deployed to Vercel at https://isatech.club.

## Project

- **Stack:** Next.js 16 (App Router, webpack — `next dev/build --webpack` in package.json) + TypeScript, Tailwind CSS v4, Radix UI, Motion (Framer), React Three Fiber, React Hook Form + Zod, Notion API (data), rate limiting (per-surface mechanism; see constitution P5), Serwist (service worker/PWA), next-sitemap.
- **Entry point:** `src/app/layout.tsx` (root), pages under `src/app/`.
- **Path alias:** `@/*` → `src/*`.

## Commands

- `npm run dev` — dev server (webpack) (port 3000).
- `npm run build` — production build + generate sitemap.
- `npm run start` — serve production build.
- `npm run lint` — ESLint (`eslint . --max-warnings 0`; no auto-fixing).
- `npm run type-check` — `tsc --noEmit`.
- `npm run analyze` — bundle analysis (needs `ANALYZE=true`).
- Husky git hooks + `lint-staged` run `prettier --write`, `eslint --fix`, and `oxlint --fix` on staged `*.{js,jsx,ts,tsx}`.

## Architecture

- `src/app/(static)/` — public pages (home, about, contact, membership, privacy); co-located route components, server actions (`actions.ts`), and schemas (`schema.ts`).
- `src/app/api/og/` — OpenGraph image routes (e.g. OG quiz image).
- `src/app/quiz/` — the interactive quiz feature (pages + `src/components/quiz/`).
- `src/components/` — UI: `ui/` (Radix-based primitives), `home/` (homepage sections), `layout/` (header/footer), `common/` (shared utilities like `optimized-image`, `error-boundary`), `seo/`, `texture/`, `assets/` (SVG logos/decorations).
- `src/lib/` — `notion/` (Notion API client + helpers), `services/` (feature services), `quiz/` (quiz canonical-role helpers + session progress), `constants/` (site config + design tokens), `hooks/` (custom hooks), `env.ts` (Zod-validated env), `utils.ts` (`cn`), `quiz-data.ts`.
- `src/proxy.ts` — security headers & CSP (Next 16 renamed middleware → proxy).
- `src/app/sw.ts` — service worker (Serwist), output `public/sw.js`.

## Conventions

- **Styling:** Tailwind v4 via `@import` in `src/app/globals.css`; use the `cn()` helper from `src/lib/utils.ts` to merge class strings (clsx + tailwind-merge). Design tokens live in `src/lib/constants/design-tokens.ts`.
- **Formatting:** Prettier with semicolons, double quotes, trailing commas, `tailwindcss` plugin.
- **Env config:** All runtime env vars are validated in `src/lib/env.ts` (Zod); public ones are `NEXT_PUBLIC_*`. Add new vars there AND in `.env.example`.
- **Data/forms:** Server actions (`"use server"`) validate with Zod schemas; rate-limiting mechanism is org-decided per surface (see constitution P5) — documented in each feature spec; Cloudflare Turnstile on public forms.
- **Imports/export:** Package directories re-export via an `index.ts` barrel (e.g. `lib/constants/index.ts`, `components/common/index.ts`).
- **Charts/3D-heavy assets:** Some generated asset files are huge (`components/assets/decorations.tsx` ~300KB, `texture/topography.tsx`) — edit carefully and avoid reformatting wholesale.
- **Errors:** Server actions return `{ success, error }` objects rather than throwing for expected failures; use `console.error` for logging.

## Notes

<!-- Add project-specific quick-notes here as they come up. -->

- **Quiz OG banner (spec 003):** `/api/og/quiz` renders only the 17 canonical outcomes (derived from `Object.keys(archetypes)` in `quiz-data.ts` via `src/lib/quiz/canonical.ts`); non-canonical roles 302 to the invite banner. Bundled Poppins TTF lives in `src/app/api/og/quiz/fonts/` (Satori rejects woff2 — keep TTF/OTF). No Vercel KV anywhere: the site is KV-free since 003; contact rate limiting is cookie-based (`src/lib/services/cookie-rate-limit.ts`).
- **Quiz progress (FR-008):** in-progress quizzes persist to `sessionStorage` (`4h-quiz-progress-v1` via `src/lib/quiz/progress.ts`) — refresh/back-forward resumes; discarded when the tab closes.

- Do not manually commit any changes on my behalf. Instead, provide the appropriate git add commands along with one or more commit titles, grouped logically by scope or feature, so that I can manually review the staged changes and execute the commits myself. Each commit title should follow our conventional commit format and clearly reflect the specific area of work so that the commit history remains clean, meaningful, and easy to navigate. Once I've reviewed the proposed commands and titles, I'll stage and commit the changes at my own discretion, ensuring full visibility and control over what gets included in each commit.
- Do not create the pull request directly. Instead, simply provide me with the proposed pull request title and a detailed description of the changes, so I can review them first before proceeding with the actual PR creation. The title should be concise and follow our conventional commit format, while the description should clearly outline what was changed, why it was done, and any relevant context or testing notes that would help with the review process. Once I've had a chance to review and approve the content, I'll take care of creating the PR myself.

<!-- SPECKIT START -->

**Active plan**: `specs/003-quiz-page-improvements/plan.md`
<!-- SPECKIT END -->

- **US1 membership deferred (2026-08-21, user decision):** native membership application parked — see `specs/001-resolve-critique-issues/tasks.md` scope note. The membership page keeps its Google Form until the scope reopens; re-enable T002/T004/T006–T011 as one slice (Notion membership DB provisioning + `NOTION_MEMBERSHIP_DATABASE_ID` come with it).
- **Quiz copy dependencies (organ-supplied):** intro shows a dynamic question count (`{questions.length}`) with `TODO(org-copy)` markers — quiz-time wording awaits the org; canonical contact email is `SOCIAL_LINKS.email` (isatech@isatu.edu.ph).
- **4H glossary:** "Hound" is canonical (no "Hypeman" anywhere). Archetype hex pairs live in `design-tokens.ts` `COLORS.quiz` — they mirror `quiz-data.ts` `archetypeGradients` Tailwind classes; keep the two in sync.
- **Hero video:** one video is picked per visit from a curated `HeroYoutubeVideos` list in `hero-section.tsx` (variety for returning visitors). Always ambient — muted autoplay, controls/fullscreen/keyboard all disabled; the section uses `isolate` so the negative-z iframe paints above `bg-primary`, and a branded frame fades on iframe `onLoad`. Hero is `min-h-svh` and embeds the stats band (HERO_STATS + CountUp) at its bottom.
- **Header:** `fixed` overlay — blends into the hero on the homepage at the top (`overHero` state: transparent, white text/logo), then detaches into the solid bar on scroll (`scrolled`). Non-home pages get an in-flow `HeaderOffset` spacer; anchor scrolling is covered by the existing `scroll-padding-top: 4rem` in `globals.css`.
- **Gold contrast:** light-surface gold headings use the `text-secondary-dark` token (`#9A6C00`, AA-safe) with `dark:text-secondary`; keep that pairing when adding gold text on light surfaces.
