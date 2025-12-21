# ISATech Society Website

The official website for ISATech Society (ISAT U Innovators and Technopreneurs Society) - a student-led organization at Iloilo Science and Technology University.

🌐 **Live Site:** [https://isatech.club](https://isatech.club)

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
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

- Node.js 18.17 or later
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

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_KEY` | Yes | Notion integration API key |
| `NOTION_CONTACT_FORM_DATABASE_ID` | Yes | Notion database ID for contact form submissions |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile site key (public) |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile secret key |
| `KV_URL` | No | Vercel KV connection URL (for rate limiting) |
| `KV_REST_API_URL` | No | Vercel KV REST API URL |
| `KV_REST_API_TOKEN` | No | Vercel KV REST API token |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (static)/           # Static pages (home, about, etc.)
│   ├── globals.css         # Global styles & design tokens
│   └── layout.tsx          # Root layout with metadata
├── components/
│   ├── assets/             # SVG components (logos, decorations)
│   ├── common/             # Shared utility components (CountUp, ScrollVelocity)
│   ├── home/               # Homepage section components
│   ├── layout/             # Header, Footer components
│   ├── seo/                # SEO-related components
│   ├── texture/            # Background texture components
│   └── ui/                 # Reusable UI primitives (Button, Input, etc.)
├── lib/
│   ├── constants/          # Site configuration & design tokens
│   ├── hooks/              # Custom React hooks
│   ├── notion/             # Notion API client & helpers
│   ├── services/           # Service exports
│   └── utils.ts            # Utility functions
├── types/                  # Shared TypeScript types
└── middleware.ts           # Security headers & CSP
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production + generate sitemap |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint + Prettier |
| `npm run type-check` | Run TypeScript type checking |
| `npm run analyze` | Analyze bundle size |

## Key Features

- ✅ **SEO Optimized** - Meta tags, OpenGraph, JSON-LD structured data
- ✅ **Security Hardened** - Strict CSP, security headers, HSTS
- ✅ **Performance** - Image optimization, code splitting, Turbopack
- ✅ **Accessible** - Radix UI primitives, semantic HTML
- ✅ **Bot Protection** - Cloudflare Turnstile on forms
- ✅ **Rate Limiting** - Vercel KV-based rate limiting
- ✅ **Cookie Consent** - GDPR-compliant cookie banner
- ✅ **Analytics** - Privacy-focused Vercel Analytics

## Deployment

The site is automatically deployed via Vercel. Push to `main` for production, or create a PR for preview deployments.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run `npm run lint` and `npm run type-check`
4. Create a pull request

## License

© 2021-present ISATech Society. All rights reserved.
