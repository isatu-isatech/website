import { Metadata } from "next";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "This Cookie Policy outlines how ISATech Society uses cookies and similar technologies.",
  keywords: [
    "philippines",
    "cookie policy",
    "iloilo",
    "ISATU",
    "startups",
    "technopreneurship",
    "ISATech Society",
    "student founders",
    "innovation",
    "collaboration",
    "community",
  ],
  openGraph: {
    title: "ISATech Society - Cookie Policy",
    description:
      "This Cookie Policy outlines how ISATech Society uses cookies and similar technologies.",
    url: "https://isatech.club/cookies",
    siteName: "ISATech Society",
    images: [
      {
        url: "/assets/seo/ogimage-cookie.jpg",
        width: 1200,
        height: 630,
        alt: "ISATech Society Cookie Header Image",
      },
    ],
    type: "website",
  },
};

/**
 * ################################################################################
 * ##################################### PAGE #####################################
 * ################################################################################
 */
export default function PrivacyPage() {
  return (
    <div>
      <h1>Cookie Policy</h1>
      <p>
        This Cookie Policy outlines how ISATech Society uses cookies and similar
        technologies to enhance your experience on our website.
      </p>
    </div>
  );
}
