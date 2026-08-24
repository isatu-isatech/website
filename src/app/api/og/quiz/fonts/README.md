# Poppins (SIL Open Font License 1.1)

The `Poppins-400.ttf` and `Poppins-700.ttf` files in this directory are
latin versions of the **Poppins** typeface, downloaded from Google Fonts
(fonts.gstatic.com) for use by the OG banner renderer
(`src/app/api/og/quiz/route.tsx`).

- Copyright: 2020 The Poppins Project Authors (https://github.com/itfoundry/Poppins)
- License: SIL Open Font License 1.1 — https://openfontlicense.org
- Full license text: https://scripts.sil.org/OFL

Notes:

- TTF is used (not woff2) because the `ImageResponse` renderer (Satori)
  requires OpenType/TrueType data — woff2 is rejected at render time.
- The site's app fonts (Poppins + Chivo) are already loaded via
  `next/font/google` in `src/app/layout.tsx`; these bundled copies exist
  solely so `ImageResponse` can embed brand typography deterministically
  without a runtime network fetch (research R1).
