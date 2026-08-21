# Design Brief — ISATech Website Polish

> Source: `$impeccable shape` — confirmed **planning only** (no implementation).
> Status: **Approved brief · not yet built**.
> Date: 2026-08-21 · Owner: ISATech website design workstream.

---

## 1. Decision at a glance

| Dimension   | Decision                                                                 |
| ----------- | ------------------------------------------------------------------------ |
| Scope       | Refine / polish the **incumbent** ISATech visual world                   |
| Target      | **Whole site** (Home centerpiece + About / Membership / Quiz / Contact)  |
| Primary job | **Visual impact / distinctiveness**                                      |
| Theme lean  | **Balanced** — strengthen both light & dark, keep current toggle/default |
| Mode        | Persuade (whole site)                                                    |

The ISATech Blue `#203C90` + Gold `#FFAC03` identity is **kept**. This is polish _within_ the identity — **not** a redesign. An earlier init answer recorded "redesign/rebrand"; the user explicitly corrected this to refine/polish, and that correction is reflected in `PRODUCT.md`.

---

## 2. Job & audience

Four overlapping audiences arrive, all in a _deciding / awareness_ state:

1. **Prospective / new members** (ISAT U students) — deciding whether to join.
2. **Event attendees & competition participants** — already engaged (e.g. Codelympics).
3. **Current members & officers** — the org's insiders.
4. **The public / sponsors / industry** — evaluating credibility and reach.

The site must earn attention and make the org feel like a serious, distinctive student technopreneurship community — not a default template.

---

## 3. Outcome & proof

Make the incumbent identity feel **bolder, more owned, and unmistakably theirs** — so the design does the "distinctive" work the brand claims.

Success = a visitor registers on the first viewport that this is a real, high-energy, tech-startup-minded community, and moves toward **Membership / Contact**.

**Product truth carried throughout:**

- The **4H roles** (Hustler, Hound, Hacker, Hipster) — also the basis of the quiz.
- **KWADRA TBI** partnership.
- **Codelympics** and the office/space showcase.
- Advisers (university faculty/staff).
- The "Which 4H role are you?" quiz.

---

## 4. Selected direction (refinement, not redesign)

Keep the identity, content, layout bones, and Radix/token system. Push distinctiveness _inside_ it:

- **Blue → hero of the palette**, not a background wash. Own a deep-navy `#1A1F35`-based dark world with blue as the primary light and **gold as a sharp, disciplined accent** at eye-anchoring moments (stats, primary CTAs, key numerals) — not scattered.
- **Typography gets real hierarchy.** Poppins headings are present; add display scale, tighter tracking, and stronger size/weight contrast between hero, section titles, and body.
- **Texture & motion that feel engineered, not decorative.** Reframe the existing scroll-velocity marquee ("DREAM • INNOVATE • SUCCEED"), YouTube hero, and 3D as a deliberate system: consistent section rhythm, purposeful reveals, blue/gold applied consistently (gradients, borders, glows).
- **Consistency pass across About / Membership / Quiz / Contact** so every surface reads as the same org (shared section headers, cards, buttons, spacing scale).

---

## 5. Scope & boundaries

**In:**

- Home (hero, stats, about, kwadra, team, offer, contact)
- About advisers
- Membership
- Quiz
- Contact
- Shared Header / Footer / Button / Card / tokens

**Out / untouched:**

- Product copy (mission, taglines, factual content — no invented claims)
- Brand colors themselves
- Functionality, forms, quiz logic
- Technical stack, SEO/security layers

**Anti-goals:**

- No drift toward a different palette or a rebrand
- No new gimmick per section
- No performance regression (heavy 3D stays scoped)
- No reduction in accessibility

---

## 6. States & ranges

- **Realistic content:** 4 4H roles, ~5 adviser cards, handful of partners, stats (5 startups / 25 members), rotating YouTube hero videos.
- **States to get right:** hero load (video + text), empty/loading skeletons (already exist), responsive (desktop → mobile: hero centers, nav collapses), quiz intro/question/result on both themes (light + dark).

---

## 7. Interaction & layout

- Consistent section topology.
- Clear primary path: Home → Membership / Contact.
- One dominant CTA per section.
- Strong but restrained motion (smooth scroll, fade/slide reveals, hover on cards/buttons).
- **Gold = action color; Blue = identity color.**

_Intent only — final CSS belongs to the builder._

---

## 8. Constraints & open decisions

**Binding:** web platform · Next.js 16 + Tailwind v4 + Radix + Motion + React Three Fiber · light/dark theming already implemented · a11y is a standing requirement · keep existing tokens · no performance regression.

**Open (not to be invented silently):**

- How aggressively to push the dark-navy hero vs. a brighter light theme → resolved to **balanced (keep default)**.
- How much gold to introduce → resolved to **disciplined accent** (stats, primary CTAs, key numerals, gold kickers; blue carries body/hero; no full gold surfaces).

**Closed by user (2026-08-21, planning session):**

- Quiz "generalist" result `from-violet-500` → **realign to the blue/gold brand world** (no out-of-brand exception).
- Membership capture mechanism → **superseded by ADR 0002** (`docs/adr/0002-membership-application-overlap.md`): the native Membership application is built during the H1 polish, replacing the external Google Form (see §9 P0-a). The earlier planning-session decision here — keep the external Google Form and wrap it in the brand shell — was reversed in the roadmap grilling session; the shape brief is not yet the authority on membership capture, the ADR and `CONTEXT.md` are.

---

## 9. Execution plan (when approved to build)

Build order is critique-driven: fix the two P0s first, then the consistency pass that carries the 4H/specificity story.

1. **P0 fixes first** — (a) membership: build the native Membership application (ADR 0002) — the branded Standard Application Form with progressive sections, Notion write for immediate officer review, Turnstile + rate limiting — replacing the external Google Form (the earlier "wrap the GForm in a brand shell" plan is superseded); (b) hero: replace random-video-on-every-load with a curated hero set or static premium frame + play control, add poster/LCP fallback.
2. **Home first for the polish pass** — hero, stats, about, kwadra, team, offer, contact get the hierarchy / blue-gold-disciplined / motion pass; surface the 4H archetype story earlier (it is currently buried behind the quiz funnel).
3. **Consistency rollout** — About, Membership, Quiz (incl. realign `from-violet-500` generalist result to brand), Contact + shared Header/Footer/Card/Button/tokens align to the same system; clear the token violations flagged in §10 (hardcoded grays, lanyard text hack, header border no-op, logo context-menu hijack, email-domain mismatch).
4. **Verify** — one batched desktop + mobile round; fix everything it shows in one batch; confirm with at most one more round; stop.

---

## 10. Critique findings (folded from the critique run, 2026-08-21)

> Outcome of Assessment A (design review) + Assessment B (detector, re-run in writer context; browser visualization unavailable this session). Persisted snapshot: `.impeccable/critique/2026-08-21T03-43-36Z__src-app.md`. Drives the build order below.

**Design-specificity verdict: ~6/10 — "authored content, interchangeable scaffolding."** Ownable = 4H archetype system + 3D lanyard member-ID render; the surrounding hero→stats→about→offer→partners→team→contact skeleton is category-generic. Refine-toward-specific is the right lever.

**Priority issues (ordered — these become the build order):**

| Sev | Issue                                                                                                                                | Fix command         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| P0  | Membership join drops to a bare Google Form in a new tab (least-designed moment at the strongest ask)                                | `onboard`           |
| P0  | Random hero video every load → non-deterministic first impression, LCP risk, flat overlay, no poster fallback                        | `distill`           |
| P1  | Competing/vague CTAs starve the primary action (two "Learn More" → /about; no direct join above the fold)                            | `clarify`           |
| P1  | Token violations: hardcoded `bg-gray-300/50` offer cards, `text-black md:text-white` lanyard hack, header `border-b-grey-100` no-op  | `colorize`/`harden` |
| P2  | Logo `onContextMenu` hijacks right-click → redirect /about (hostile, undiscoverable)                                                 | `harden`            |
| P2  | Contact trust: `info@isatech.com` vs owned `isatech.club`; unverified `/privacy#manage-cookies`; bare "Too many requests" rate-limit | `harden`            |
| P3  | Hero lacks its credibility lane (motto + "Est. 2021" live two scrolls down)                                                          | `typeset`           |

**Detector (exit 2, 7 warnings):** bounce-easing ×4 in loaders/spinners (likely intentional, low priority); gradient-text ×2 in quiz screens; **AI-color ×1 — `from-violet-500` on the quiz "generalist" result** — sits outside the blue/gold brand world (align to gold or keep as deliberate exception).

**Persona red flags:** Jordan — no join path above fold, unexplained acronyms (KWADRA TBI, IPMO), motto hidden; Riley — gray cards break dark mode, domain mismatch, join dead-ends in GForms; Casey — 3 stacked header controls, autoplay video burns mobile data, 20-question serial quiz, apply leaves the site on mobile.

**Cross-cutting build signal:** the 4H story is the most distinctive asset and is buried behind the 20-question funnel — surface it as the hero recruitment story. Balance gold as disciplined accent, not wash; strengthen hierarchy.
