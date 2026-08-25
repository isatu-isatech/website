import { Metadata } from "next";
import { Poppins, Chivo } from "next/font/google";
import "@/app/globals.css";
import { CookieConsentProvider } from "@/components/providers/cookie-consent";
import { ConsentGatedAnalytics } from "@/components/providers/consent-gated-analytics";
import { PageTransition } from "@/components/common/page-transition";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
});

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "ISATech Society",
    template: "%s | ISATech Society",
  },
  description:
    "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
  keywords: [
    // Core brand keywords
    "ISATech Society",
    "ISATech",
    "ISAT U",
    "ISATU",
    "Iloilo Science and Technology University",
    // Location keywords
    "Iloilo",
    "Iloilo City",
    "Western Visayas",
    "Philippines",
    // Activity keywords
    "technopreneurship",
    "student founders",
    "student entrepreneurship",
    "innovation",
    "startups",
    "startup incubator",
    "technology business incubator",
    "student organization",
    // Program keywords
    "hackathons",
    "coding competitions",
    "tech seminars",
    "workshops",
    "training programs",
    "tech community",
    // Partnerships
    "KWADRA TBI",
    "Kwadra Technology Business Incubator",
    "UMWAD",
    "university research",
    // Target audience
    "students",
    "tech enthusiasts",
    "aspiring entrepreneurs",
    "innovators",
    // 4H Quiz keywords
    "4H personality quiz",
    "founder archetype",
    "Hustler Hacker Hipster Hound",
    "startup team roles",
    "entrepreneur personality test",
    "team building quiz",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: "ISATech Creatives Team",
  publisher: "ISATech Society",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/assets/seo/favicon-light.ico",
        type: "image/x-icon",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/assets/seo/favicon-dark.ico",
        type: "image/x-icon",
      },
    ],
  },
  openGraph: {
    title: "ISATech Society",
    description:
      "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
    siteName: "ISATech Society",
    type: "website",
    locale: "en_PH",
    images: [
      {
        url: "/assets/seo/ogimage.jpg",
        width: 1200,
        height: 630,
        alt: "ISATech Society Header Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ISATech",
    creator: "@ISATech",
    title: "ISATech Society",
    description:
      "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
    images: {
      url: "/assets/seo/ogimage.jpg",
      alt: "ISATech Society - Empowering Student Founders",
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  manifest: "/manifest.json",
  other: {
    preload: ["/assets/seo/favicon-light.ico", "/assets/seo/favicon-dark.ico"],
  },
};

/**
 * ################################################################################
 * #################################### LAYOUT ####################################
 * ################################################################################
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-overlayscrollbars-initialize
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://challenges.cloudflare.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com" />
      </head>
      <body
        className={`${poppins.variable} ${chivo.variable} antialiased`}
        data-overlayscrollbars-initialize
      >
        <CookieConsentProvider>
          <PageTransition>{children}</PageTransition>
          <ConsentGatedAnalytics />
        </CookieConsentProvider>
        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ISATech Society",
              alternateName: "ISATech",
              url: SITE_CONFIG.url,
              logo: `${SITE_CONFIG.url}/assets/seo/logo.png`,
              description:
                "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
              foundingDate: "2021",
              address: {
                "@type": "PostalAddress",
                addressCountry: "PH",
                addressLocality: "Iloilo City",
                addressRegion: "Western Visayas",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: `${SITE_CONFIG.url}/contact`,
                availableLanguage: ["English", "Filipino"],
              },
              sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.linkedin],
              knowsAbout: [
                "Technopreneurship",
                "Innovation",
                "Startups",
                "Student Entrepreneurship",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
