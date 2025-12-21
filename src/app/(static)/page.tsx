import { HomepageHeroSection } from "@/components/home/hero-section";
import { HomepageAboutSection } from "@/components/home/about-section";
import { HomepageContactSection } from "@/components/home/contact-section";
import { HomepageKwadraSection } from "@/components/home/kwadra-section";
import { HomepageOfferSection } from "@/components/home/offer-section";
import { HomepagePartnersSection } from "@/components/home/partners-section";
import { HomepageStatsSection } from "@/components/home/stats-section";
import { HomepageTeamSection } from "@/components/home/team-section";
import ScrollVelocityComponent from "@/components/scroll-velocity";
import { Metadata } from "next";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Empowering the Next Generation of Innovators",
  description:
    "ISATech Society is a student-led organization at ISAT U dedicated to empowering student founders through innovation, collaboration, and community.",
  keywords: [
    "philippines",
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
    title: "Empowering the Next Generation of Innovators",
    description:
      "ISATech Society is a student-led organization at ISAT U dedicated to empowering student founders through innovation, collaboration, and community.",
    url: "https://isatech.club/",
    siteName: "ISATech Society",
    images: [
      {
        url: "/assets/seo/ogimage.jpg",
        width: 1200,
        height: 630,
        alt: "ISATech Society Header Image",
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
export default function Homepage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <HomepageHeroSection />
      <HomepageStatsSection />
      <HomepageAboutSection />
      <HomepagePartnersSection />
      <HomepageKwadraSection />
      <HomepageTeamSection />
      <div className="flex w-full items-center justify-center overflow-hidden">
        <ScrollVelocityComponent
          texts={["DREAM • INNOVATE • SUCCEED •"]}
          velocity={50}
          numCopies={5}
          className="opacity-10"
        />
      </div>
      <HomepageOfferSection />
      <HomepageContactSection />
    </div>
  );
}
