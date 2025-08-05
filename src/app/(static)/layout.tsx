import { Metadata } from "next";
import { Poppins, Chivo } from "next/font/google";
import "@/app/globals.css";
import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentProvider } from "@/components/cookie-consent";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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
  icons: {
    icon: [
      {
        url: "/assets/seo/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
  openGraph: {
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
          <SpeedInsights />
          <Analytics />
        </CookieConsentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollegeOrUniversity",
              name: "ISATech Society",
              url: "https://isatech.club",
              logo: "https://isatech.club/assets/logos/isatech.png",
              contactPoint: {
                "@type": "ContactPoint",
                email: "isatech@isatu.edu.ph",
                contactType: "customer support",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
