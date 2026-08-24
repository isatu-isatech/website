# ISATech Society Website

The official website for ISATech Society (ISAT U Innovators and Technopreneurs Society) - a student-led organization at Iloilo Science and Technology University.

🌐 **Live Site:** [https://isatech.club](https://isatech.club)

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Motion](https://motion.dev/) (Framer Motion)
- **3D Graphics:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Database:** [Notion API](https://developers.notion.com/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 20+ (the repo pins `24` in `.nvmrc`)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/isatech-website.git
   cd isatech-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:

   ```bash
   cp .env.example .env.local
   ```

4. Fill in the required environment variables (see below).

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable                                    | Required | Description                                     |
| ------------------------------------------- | -------- | ----------------------------------------------- |
| `NOTION_API_KEY`                            | Yes      | Notion integration API key                      |
| `NOTION_CONTACT_FORM_DATABASE_ID`           | Yes      | Notion database ID for contact form submissions |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Yes      | Cloudflare Turnstile site key (public)          |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`           | Yes      | Cloudflare Turnstile secret key                 |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (static)/           # Static pages (home, about, contact, …)
│   ├── quiz/               # Interactive 4H quiz + result pages
│   ├── api/og/quiz/        # Quiz share-image (OpenGraph) route
│   ├── globals.css         # Global styles & design tokens
│   ├── proxy.ts            # Security headers & CSP (Next 16 proxy)
│   └── layout.tsx          # Root layout with metadata
├── components/
│   ├── assets/             # SVG components (logos, social icons)
│   ├── common/             # Shared utilities (OptimizedImage, CountUp, …)
│   ├── home/               # Homepage section components
│   ├── layout/             # Header, Footer components
│   ├── seo/                # SEO-related components
│   └── ui/                 # Reusable UI primitives (Button, blobs, …)
├── lib/
│   ├── constants/          # Site configuration & design tokens
│   ├── hooks/              # Custom React hooks
│   ├── notion/             # Notion API client & helpers
│   ├── services/           # Feature services (cookie rate limiting)
│   ├── quiz/               # Quiz data, scoring, canonical helpers
│   └── utils.ts            # Utility functions
└── env.ts                  # Zod-validated environment variables
```

## Available Scripts

| Command                | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Start development server (webpack — Serwist requires it) |
| `npm run build`        | Build for production + generate sitemap                  |
| `npm run start`        | Start production server                                  |
| `npm run lint`         | Run ESLint (`eslint . --max-warnings 0`)                 |
| `npm run lint:eslint`  | Run ESLint (authoritative, fail on warnings)             |
| `npm run lint:ox`      | Run oxlint (fast pass)                                   |
| `npm run format:check` | Check formatting with Prettier                           |
| `npm run type-check`   | Run TypeScript type checking                             |
| `npm run analyze`      | Analyze bundle size                                      |
| `npm run commitlint`   | Validate the last commit message (Conventional)          |

## Key Features

- ✅ **SEO Optimized** - Meta tags, OpenGraph, JSON-LD structured data
- ✅ **Security Hardened** - Strict CSP, security headers, HSTS
- ✅ **Performance** - Image optimization, code splitting, static SVG assets
- ✅ **Accessible** - Radix UI primitives, semantic HTML
- ✅ **Bot Protection** - Cloudflare Turnstile on forms
- ✅ **Rate Limiting** - per-browser cookie on the contact form (KV-free)
- ✅ **Cookie Consent** - GDPR-compliant cookie banner
- ✅ **Analytics** - Privacy-focused Vercel Analytics

## Deployment

The site is automatically deployed via Vercel. Push to `master` for production, or create a PR for preview deployments.

## CI & Build Secrets

GitHub Actions (`.github/workflows/ci.yml`) runs three jobs on every push/PR to `master`/`dev`:

- **Lint & Format** — ESLint (`npm run lint:eslint`), oxlint (`npm run lint:ox`), Prettier (`npm run format:check`)
- **Type Check** — `npm run type-check`
- **Production Build** — `npm run build`, gated on lint + typecheck passing

The **Production Build** job runs `next build` (which parses the Zod `envSchema` in `src/lib/env.ts`), so it needs the following **GitHub Actions repository secrets** configured under `Settings → Secrets and variables → Actions`:

| Secret                                      | Required | Notes                      |
| ------------------------------------------- | -------- | -------------------------- |
| `NOTION_API_KEY`                            | Yes      | Same value as `.env.local` |
| `NOTION_CONTACT_FORM_DATABASE_ID`           | Yes      | Same value as `.env.local` |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`           | Yes      | Same value as `.env.local` |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Yes      | Same value as `.env.local` |

Until these secrets are set, the `build` job will fail (`envSchema.parse` requires them) even though lint/typecheck pass — this is expected.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run `npm run lint` and `npm run type-check`
4. Create a pull request

## License

© 2021-present ISATech Society. All rights reserved.
