# Contract: Result Share Link — `/quiz/result`

SEO/social surface for a shared result. Server-rendered; redirects humans.

## Query parameters

`role` (canonical), `archetype` (`ArchetypeKey`), `generalist` (`"true"`).
All percent-encoded in every constructed URL.

## Behavior

- **Metadata** (for crawlers/preview fetchers): `og:title` `I'm a {role}!`,
  `og:description`, `og:image` →
  `/api/og/quiz?role=…&archetype=…[&generalist=true]`,
  `twitter:card = summary_large_image`, `robots: noindex, nofollow`
  (FR-017).
- **Humans**: `redirect("/quiz")` — visitors take the quiz themselves
  (unchanged).

## Invariants

- Metadata `og:url`, `og:image` URL, and the share button's URL are
  byte-identical per outcome, including the `generalist` flag (FR-014).
- The page is excluded from search-engine indexing.
