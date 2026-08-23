# Research — Resolve Latest Critique Issues

**Phase 0 output** · resolves every technical unknown from the plan's Technical Context. Format: Decision / Rationale / Alternatives considered.

## R-1 Membership application pipeline (P0)

- **Decision**: Add one new server action `submitMembershipApplication` mirroring the proven contact pipeline: Upstash `Ratelimit.slidingWindow(5, "1 h")` per IP (`x-forwarded-for`/`x-real-ip`, KV-graceful) → Zod `safeParse` → Cloudflare Turnstile `siteverify` → Notion `createPage` → `{ success, error }` returns. Client = progressive-section wizard (React Hook Form + `@hookform/resolvers` + Zod, same stack as existing forms) with a review step before submit and in-session data retention when the write fails (FR-024).
- **Rationale**: `src/app/(static)/contact/actions.ts` is the established, constitutional-compliant pattern (P4/P5); reusing it minimizes new surface and keeps `{ success, error }` semantics. Notion is the single store (ADR 0002 / P6). `NOTION_MEMBERSHIP_DATABASE_ID` already exists in `env.ts` (optional) and `.env.example` (commented) — promote to required + uncomment (P4).
- **Alternatives considered**: keep external Google Form (rejected — critique P0, ADR 0002, brand-shell abandonment); use a third-party form service (rejected — Notion-only boundary); draft/resume persistence (rejected — explicit H2 boundary, clarify Q3 chose in-session retention only).

## R-2 Hero determinism + designed frame (P0)

- **Decision**: Remove the `useEffect` random pick in `src/components/home/hero-section.tsx`; always render the first curated video (`HeroYoutubeVideos[0]`, Office Showcase 2025) — one fixed video per clarify Q1 (ambient, muted autoplay, hidden controls). Keep the existing `YouTubePlayer` attributes (`autoplay=1&controls=0&mute=1&loop=1&playlist=…&playsinline=1`, `pointer-events-none`) — they already match the clarified behavior. Replace the flat `bg-black/50` overlay with a designed brand frame (token gradient + subtle vignette) that also serves as the deterministic loading backdrop; render a branded poster layer (brand gradient + ISATech handled asset) that sits behind/above the iframe until playback is ready, then fades — never a blank black area (FR-010). Remove `loading="lazy"` from the hero iframe (above the fold; lazy delays LCP). No visible player chrome, no play/pause affordance anywhere.
- **Rationale**: Deterministic first impression (SC-003), preserves the org's authored "no-music background video" intent, and the poster/frame directly closes the critique's "flat overlay, no poster fallback" finding. Fade on `onReady` is the only safe cross-info-availability approach for YouTube iframes (no poster attribute exists).
- **Alternatives considered**: curated day/month rotation (rejected — clarify Q1 chose identical every visit); static image hero with play-on-demand (rejected — user explicitly wants ambient autoplay, no controls); keep random (rejected — P0).

## R-3 Quiz palette realignment (P1/detector)

- **Decision**: Generalist result goes **gold**: `result-screen.tsx:23-25` `from-violet-500 to-purple-600` → gold brand gradient, and the same in `src/app/api/og/quiz/route.tsx:51-53` (`#8B5CF6/#7C3AED` → gold pair from design tokens). Align quiz intro badge colors (`intro-screen.tsx:49-52` amber/blue/pink/emerald) with the result-screen per-archetype gradient starts so the intro and result palettes match (minor-critique item); archetype differentiation stays (4 functional hues), but every value is a token/brand-approved hue — dark-mode contrast checked. `NextTopLoader` (`layout.tsx:175-179`) and confetti (`quiz-container.tsx:274,281`) read their hex values from `design-tokens.ts` instead of literals.
- **Rationale**: The detector flagged only the violet generalist as out-of-brand ("AI-color" rule); realigning it to gold implements the closed shape-brief decision ("realign to the blue/gold brand world — no out-of-brand exception"). Single-source hex values prevent the NextTopLoader/confetti drift the critique noted.
- **Alternatives considered**: keep violet as deliberate exception (rejected — user-closed 2026-08-21); replace all four archetype colors with blue/gold only (rejected — destroys functional archetype differentiation the quiz results depend on).

## R-4 Token consistency / dark mode (P1)

- **Decision**: Replace the flagged hardcoded classes with token-driven equivalents that resolve safely in both themes: `offer-section.tsx:50` + `membership/page.tsx:237,240,313` `bg-gray-300/50` → brand-neutral surface token (e.g. `bg-foreground/5` or token surface with border); `team-section.tsx:64` + `membership/page.tsx:237` `from-white to-gray-500` border trick → token border; `membership/page.tsx:372` `text-gray-700` → `text-foreground/70`; `about/carousel.tsx:172` `bg-gray-400` dot → foreground-muted; lanyard `text-black md:text-white` (`lanyard-section.tsx:36`) → `text-foreground` (single token, both themes); header `border-b-grey-100` no-op (`header.tsx:25`) → correct token border or removed.
- **Rationale**: Directly closes critique P1 + Riley's dark-mode breakage; `cn()` + tailwind-merge convention in AGENTS.md.
- **Alternatives considered**: leave hardcodes (rejected); full retheme (rejected — refinement, not redesign; brand colors are fixed).

## R-5 Header/nav hygiene (P2/minor)

- **Decision**: Remove the logo `onContextMenu` hijack (`header.tsx:27-33` → plain `Link`). Strip the trailing `#` from all nav hrefs (desktop + mobile header via `NAV_LINKS` `site.ts:62-68`, footer links): use real path fragments where meaningful, no path otherwise. Add an active-state indicator using the current pathname (`usePathname`) in header + footer — links point at real anchors, current page visibly indicated (FR-018).
- **Rationale**: Closes P2 hostile-context-menu finding and the minor "all nav hrefs append trailing `#` (no active state)" item. Normal Link behavior returns (P2's undiscoverable/hostile interaction gone).
- **Alternatives considered**: keep `#` + add active state (rejected — empty anchors are a navigation quality defect in the critique itself).

## R-6 Trust hardening (P2)

- **Decision**: Contact email on `contact/page.tsx:74` (`mailto:info@isatech.com`) → read the org's canonical address from site config (`src/lib/constants/site.ts` `email: "isatech.isatu@gmail.com"`), so the displayed address is always the org's real one; if the org later provisions an owned-domain alias (e.g. `contact@isatech.club`), it's a one-line config change (recorded as dependency). `/privacy#manage-cookies` **verified**: the `id="manage-cookies"` anchor exists (`privacy/cookie-section.tsx:10`) — keep the link (critique called it unverified; verification passes). Rate-limit copy `actions.ts:40` → human-readable engineering-owned message (e.g. "You've reached the hourly message limit. Please try again later."), same for the membership action (FR-005 / US5).
- **Rationale**: Truthful contact identity (P5: "resolves to an owned domain and human-readable messages"); the mismatch was the incorrect `info@isatech.com`, not the privacy anchor. Error copy is implementation-owned, not product copy (P2 safe).
- **Alternatives considered**: invent a `contact@isatech.club` alias (rejected — can't fabricate org mailboxes; recorded as dependency); keep `info@isatech.com` (rejected — mismatched domain).

## R-7 Hero credibility lane (P3)

- **Decision**: Add a credibility line to the hero: the existing motto "DREAM • INNOVATE • SUCCEED" (from the home marquee `page.tsx:94`) as a kicker and "Est. 2021" using the existing `foundingYear: 2021` (`site.ts:12`, mirrored in JSON-LD `foundingDate`) — both existing facts, no invented copy (P2). Acronym expansions (KWADRA TBI, IPMO) are org-supplied (dependency) and shown on first use (FR-013).
- **Rationale**: Closes P3 "hero lacks its credibility lane"; copy is provenance-clean.
- **Alternatives considered**: write new mission copy (rejected — P2; org copy only).

## R-8 Motion & reduced motion (P3/detector)

- **Decision**: Keep the bounce/spring aesthetics for default users (detector items are decorative, likely intentional) but honor `prefers-reduced-motion`: `loading.tsx:13-42` + `common/loading-spinner.tsx:63,89` swap `animate-bounce`/`animate-ping`/`animate-pulse` for calm or disabled variants under `motion-reduce:` (Tailwind) or `useReducedMotion`; `result-screen.tsx:42` spring badge and `common/count-up.tsx:34-40` springs respect `useReducedMotion` (snap to end value). Gradient-text usages (intro/question/result) verified to use brand tokens after R-3.
- **Rationale**: FR-019 + critique minor; no user-visible loss for the default case (spec FR-019 requires only reduced-motion compliance, per clarify assumptions).
- **Alternatives considered**: remove all bounce (rejected — spec explicitly accepts them for default users).

## R-9 4H story surfaced (cross-cutting)

- **Decision**: Add a homepage section/band presenting the four archetypes (Hustler, Hacker, Hipster, Hound) as the org's recruitment story — reusing existing 4H content/data (`team-section.tsx`, `src/lib/quiz-data.ts` archetype copy, entrance copy), positioned between hero and stats so it leads before the quiz funnel. Links toward the quiz + membership (one dominant CTA per section, US3).
- **Rationale**: Shape brief + critique provocative-question #1: the most distinctive ownable asset should lead the story; no new copy authored (P2).
- **Alternatives considered**: deepen the quiz-only funnel (rejected — buried asset).

## R-10 Footer declutter + CTA clarity (P1/minor)

- **Decision**: Footer: keep at most one brand decoration (drop/soften the stacked `ISATechDecoration` + `FooterArchDecoration` + 4H image cluster, `footer.tsx:76-94`) so the lower third stops reading as an ad band; keep link hygiene from R-5. CTAs: hero `Learn More` → `Join ISATech` (→ `/membership`); remove the second homepage "Learn More" → `/about` duplication; each section gets exactly one dominant action (US3/FR-014). 4H band CTA → quiz or membership (one only).
- **Rationale**: Shape brief's "Gold = action, Blue = identity, one dominant CTA per section"; resolves critique P1 + footer minor.
- **Alternatives considered**: keep two "Learn More"s (rejected — starved primary action).

## R-11 Quiz time claim (P3)

- **Decision**: "⏱️ Takes about 3-5 minutes" (`intro-screen.tsx:71`) → org-approved honest wording for a 20-question quiz (copy-only; quiz logic untouched — clarify Q2). Exact string is an org-supplied dependency; placeholder proposal: "20 questions • ~10 minutes" (to be confirmed by org before shipping).
- **Rationale**: FR-023 + Casey persona flag; respects P2 (org-owned copy) and the clarify decision.
- **Alternatives considered**: shorten quiz (rejected — product change beyond brief).

## R-12 Terminology — Hound canonical (P1)

- **Decision**: All new/edited visible copy and data use **Hound** as the 4th archetype (matches shipped product, `quiz-data.ts`, OG route). `CONTEXT.md` glossary amendment ("Hound", not "Hypeman") is a **dependency** executed through the constitution amendment path — never a silent edit.
- **Rationale**: Clarify Q4; prevents the spec/plan/product/glossary divergence flagged in the scan.
- **Alternatives considered**: rename product to Hypeman (rejected — data/copy churn, zero user gain).

## R-13 Verification strategy (SC-001)

- **Decision**: Gate = `npm run type-check` + `npm run lint` + `npm run lint:ox` + `npm run build`, then manual walkthroughs per `quickstart.md`, then the **impeccable critique re-run** (whole site: `src/app/(static)` + `src/components` + detector) requiring score ≥ 8/10 and zero open P0/P1 (SC-001).
- **Rationale**: No unit-test runner exists; the critique re-run is the user-requested acceptance instrument; the design detector replaces lint-style design checks.
- **Alternatives considered**: add a test framework (rejected — out of scope, no runner today).
