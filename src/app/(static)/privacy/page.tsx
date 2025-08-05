import { Metadata } from "next";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "ISATech Society - Privacy Policy",
  description:
    "This Privacy Policy outlines how ISATech Society collects, uses, and protects your information.",
  keywords: [
    "philippines",
    "privacy policy",
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
    title: "ISATech Society - Privacy Policy",
    description:
      "This Privacy Policy outlines how ISATech Society collects, uses, and protects your information.",
    url: "https://isatech.club/privacy",
    siteName: "ISATech Society",
    images: [
      {
        url: "/assets/seo/ogimage-privacy.jpg",
        width: 1200,
        height: 630,
        alt: "ISATech Society Privacy Header Image",
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
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy outlines how ISATech Society collects, uses, and
        protects your information.
      </p>
    </div>
  );
}
