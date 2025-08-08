import { Metadata } from "next";
import { Poppins, Chivo } from "next/font/google";
import "@/app/globals.css";
import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentProvider } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        url: "/assets/seo/favicon.ico",
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
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${chivo.variable} antialiased`}>
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
