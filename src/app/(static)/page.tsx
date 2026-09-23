import { HomepageHeroSection } from "@/components/home/hero-section";
import { HomepageAboutSection } from "@/components/home/about-section";
import { HomepageContactSection } from "@/components/home/contact-section";
import { HomepageKwadraSection } from "@/components/home/kwadra-section";
import { HomepageOfferSection } from "@/components/home/offer-section";
import { HomepagePartnersSection } from "@/components/home/partners-section";
import { HomepageTeamSection } from "@/components/home/team-section";
import {
  ScrollVelocityComponent,
  SectionErrorBoundary,
} from "@/components/common";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";

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
    url: `${SITE_CONFIG.url}/`,
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
      {/* Hero (YouTube player) isolated so a player failure can't take the page */}
      <SectionErrorBoundary sectionName="Hero">
        <HomepageHeroSection />
      </SectionErrorBoundary>

      {/* About section with error boundary */}
      <SectionErrorBoundary sectionName="About">
        <HomepageAboutSection />
      </SectionErrorBoundary>

      {/* Partners section with error boundary */}
      <SectionErrorBoundary sectionName="Partners" compact>
        <HomepagePartnersSection />
      </SectionErrorBoundary>

      {/* Kwadra section with error boundary */}
      <SectionErrorBoundary sectionName="Kwadra TBI">
        <HomepageKwadraSection />
      </SectionErrorBoundary>

      {/* 4H archetype story — leads the recruitment narrative before the quiz funnel (FR-012) */}
      <SectionErrorBoundary sectionName="4H Archetypes">
        <HomepageTeamSection />
      </SectionErrorBoundary>

      {/* Scroll velocity - decorative, hidden on mobile to avoid lag */}
      <SectionErrorBoundary compact>
        <div className="hidden w-full items-center justify-center overflow-hidden md:flex">
          <ScrollVelocityComponent
            texts={["DREAM • INNOVATE • SUCCEED •"]}
            velocity={50}
            numCopies={5}
            className="opacity-10"
          />
        </div>
      </SectionErrorBoundary>

      {/* Offer section with error boundary */}
      <SectionErrorBoundary sectionName="What We Offer">
        <HomepageOfferSection />
      </SectionErrorBoundary>

      {/* Contact section with error boundary */}
      <SectionErrorBoundary sectionName="Contact">
        <HomepageContactSection />
      </SectionErrorBoundary>
    </div>
  );
}
