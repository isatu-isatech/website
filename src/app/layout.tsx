import { Metadata } from "next";
import { Poppins, Chivo } from "next/font/google";
import "@/app/globals.css";
import { headers } from "next/headers";
import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentProvider } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://isatech.club"),
  title: {
    default: "ISATech Society",
    template: "%s | ISATech Society",
  },
  description:
    "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
  authors: [{ name: "ISATech Society", url: "https://isatech.club" }],
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
    title: "ISATech Society",
    description:
      "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
    images: ["/assets/seo/ogimage.jpg"],
  },
  other: {
    preload: ["/assets/seo/favicon-light.ico", "/assets/seo/favicon-dark.ico"],
  },
};

/**
 * ################################################################################
 * #################################### LAYOUT ####################################
 * ################################################################################
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the nonce set by middleware on the incoming request so we can apply
  // it to inline <script nonce="..."> tags and satisfy the CSP.
  const headersList = headers() as unknown as {
    get: (key: string) => string | null;
  };
  const nonce = headersList.get("x-nonce") ?? undefined;
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${chivo.variable} antialiased`}>
        <NextTopLoader
          showSpinner={false}
          color="linear-gradient(to right, #203c90, #ffac02)"
          height={3}
        />
        <CookieConsentProvider>
          <HeaderComponent />
          {children}
          <FooterComponent />
          <Toaster />
        </CookieConsentProvider>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ISATech Society",
              url: "https://isatech.club",
              logo: "https://isatech.club/assets/seo/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: "https://isatech.club/contact",
              },
              sameAs: [
                "https://www.facebook.com/ISATech.ISATU",
                "https://www.linkedin.com/company/isatech-society/",
                // Add other social media links here if available
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
