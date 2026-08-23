import {
  ISATechDecorationCenter,
  ISATechDecorationLeft,
  ISATechDecorationRight,
} from "@/components/assets/decorations";
import {
  OptimizedImage,
  RevealOnView,
  SectionErrorBoundary,
} from "@/components/common";
import { HomepageContactSection } from "@/components/home/contact-section";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { TopographyTexture } from "@/components/texture/topography";
import { RocketIcon, TargetIcon } from "lucide-react";
import { Metadata } from "next";
import AboutHeroLockup from "./hero-lockup";
import AboutUsAdvisersSection, { AdviserProps } from "./carousel";
import AboutDescriptionBand from "./description-band";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about ISATech Society, our mission, vision, and the team behind the innovation.",
  keywords: [
    "philippines",
    "about",
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
    title: "About ISATech Society",
    description:
      "Learn more about ISATech Society, our mission, vision, and the team behind the innovation.",
    url: "https://isatech.club/about",
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
 * #################################### CONFIG ####################################
 * ################################################################################
 */
const advisers: AdviserProps[] = [
  {
    name: "Carmello V. Ambut, Ed. D.",
    title: "VP for Research and Extension",
    image: "/assets/advisers/ambut.png",
    imageWidth: 903,
    imageHeight: 1430,
    imageSize:
      "(min-width: 1640px) calc(1.1vw + 281px), (min-width: 1280px) calc(3.53vw + 258px), (min-width: 1040px) calc(40.45vw - 56px), (min-width: 980px) 47.5vw, (min-width: 780px) calc(55vw - 31px), (min-width: 680px) 82.5vw, calc(111.39vw - 55px)",
  },
  {
    name: "Naci John C. Trance",
    title: "Director, Intellectual Property Management Office",
    image: "/assets/advisers/trance.png",
    imageWidth: 1116,
    imageHeight: 1430,
    imageSize:
      "(min-width: 1280px) 399px, (min-width: 1040px) calc(68.18vw - 265px), (min-width: 980px) 62.5vw, (min-width: 780px) calc(72.78vw - 50px), (min-width: 680px) 106.25vw, calc(143.06vw - 57px)",
  },
  {
    name: "Karlo S. Sira",
    title: "Chair, Creative Works Section - IPMO",
    image: "/assets/advisers/sira.png",
    imageWidth: 1116,
    imageHeight: 1430,
    imageSize:
      "(min-width: 1280px) 370px, (min-width: 1040px) calc(63.18vw - 244px), (min-width: 980px) 57.5vw, (min-width: 780px) calc(67.78vw - 47px), (min-width: 680px) 101.25vw, calc(133.06vw - 53px)",
  },
  {
    name: "Rayjand T. Gellamucho",
    title: "General Manager, KWADRA TBI",
    image: "/assets/advisers/gellamucho.png",
    imageWidth: 1116,
    imageHeight: 1430,
    imageSize:
      "(min-width: 1280px) 370px, (min-width: 1040px) calc(63.18vw - 244px), (min-width: 980px) 57.5vw, (min-width: 780px) calc(67.78vw - 47px), (min-width: 680px) 101.25vw, calc(133.06vw - 53px)",
  },
  {
    name: "John Joseph L. Tabladillo",
    title: "Project Technical Assistant I, UMWAD Western Visayas",
    image: "/assets/advisers/tabladillo.png",
    imageWidth: 813,
    imageHeight: 1430,
    imageSize:
      "(min-width: 1660px) calc(1.04vw + 252px), (min-width: 1280px) 279px, (min-width: 1040px) calc(36.36vw - 49px), (min-width: 980px) 42.5vw, (min-width: 780px) calc(50vw - 32px), (min-width: 680px) 75vw, calc(100vw - 48px)",
  },
];

/**
 * ################################################################################
 * ################################## COMPONENTS ##################################
 * ################################################################################
 */
function AboutUsHeroSection() {
  return (
    <section
      className="flex w-full items-center justify-center px-4 py-12 sm:px-6 md:px-8 md:py-6 lg:px-12 xl:px-16 2xl:px-20"
      id="hero"
    >
      <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-8 py-8 sm:grid-cols-2 lg:gap-12 lg:py-16">
        {/* Text Content */}
        <div className="flex w-full gap-4 md:gap-8">
          {/* Divider — bolder brand accent */}
          <div className="from-primary to-secondary w-1 shrink-0 rounded-full bg-linear-to-bl"></div>
          {/* Text Container */}
          <div className="">
            <AboutHeroLockup />
          </div>
        </div>
        {/* Decorations — right column, centered */}
        <div className="relative hidden w-full flex-col items-center justify-center gap-6 sm:flex">
          <OptimizedImage
            src="/assets/decorations/4h-vertical.png"
            alt="4H Vertical Pose"
            width={279}
            height={329}
            className="h-32 w-fit md:h-64"
            sizes="(min-width: 780px) 217px, 109px"
            priority
            brandPlaceholder
          />
          <ISATechDecorationCenter
            className="pointer-events-none absolute -z-1 h-auto w-32 md:w-40 lg:w-64"
            color="#203C90"
          />
        </div>
      </div>
    </section>
  );
}

function AboutUsDescriptionSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center py-6 md:py-10"
      id="description"
    >
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        {/* Decorations */}
        <ISATechDecorationLeft className="absolute top-0 left-0 hidden h-auto w-fit opacity-10 lg:block" />
        <ISATechDecorationRight className="absolute right-0 bottom-0 h-auto w-fit opacity-10" />
      </div>
      {/* Full-bleed description photo band (parallax) */}
      <AboutDescriptionBand />
      {/* Mission and Vision */}
      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-5 md:px-16 lg:grid-cols-2 lg:py-8">
        <RevealOnView className="flex flex-col justify-start gap-4">
          <TargetIcon size={42} className="text-primary" />
          <div className="flex flex-col gap-2">
            <h3 className="text-primary">Mission</h3>
            <p className="body text-justify">
              To empower ISAT U students with the mindset, skills, and
              opportunities to become future-ready innovators and
              technopreneurs. We provide a platform for students to grow through
              training, mentorship, and community engagement — connecting them
              with industry leaders and supporting their journey from ideas to
              impactful ventures.
            </p>
          </div>
        </RevealOnView>
        <RevealOnView
          className="flex flex-col justify-start gap-4"
          delay={0.08}
        >
          <RocketIcon size={42} className="text-primary" />
          <div className="flex flex-col gap-2">
            <h3 className="text-primary">Vision</h3>
            <p className="body text-justify">
              Our Vision is to be the premier platform for students across ISAT
              U system wide, raising awareness about startups, providing skills
              and resources for innovations, producing student technopreneurs.
            </p>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}

function AboutUsEmpowermentSection() {
  return (
    <section
      className="bg-primary relative flex w-full items-center justify-center px-4 py-14 sm:px-6 md:px-8 md:py-6 lg:px-12 xl:px-16 2xl:px-20"
      id="empowerment"
    >
      <TopographyTexture
        color="#FFAC03"
        className="pointer-events-none absolute h-full w-full opacity-20"
      />
      <div className="flex w-full max-w-7xl flex-col-reverse gap-6 py-5 lg:grid lg:grid-cols-2 lg:py-8">
        <div className="flex w-full items-center justify-center">
          <h5 className="text-justify text-white">
            We empower students with practical skills, an entrepreneurial
            mindset, and a passion for innovation. Through workshops, training,
            and mentorship, ISATech fosters idea generation, design thinking,
            and startup development. We connect members with mentors, industry
            experts, and potential investors, while also serving as a gateway to
            ISAT U’s technology business incubator, Kwadra TBI.
          </h5>
        </div>
        <div className="flex w-full items-center justify-center">
          <OptimizedImage
            src="/assets/decorations/poststamp-sticker.png"
            alt="ISATech Society Research Hub Stamp"
            width={436}
            height={346}
            sizes="(min-width: 1040px) 403px, (min-width: 540px) 448px, calc(89.09vw - 15px)"
            className="z-1 h-auto w-full max-w-md lg:h-80 lg:w-auto"
            brandPlaceholder
          />
        </div>
      </div>
    </section>
  );
}

function AboutUsInitiativesSection() {
  return (
    <section
      className="flex w-full items-center justify-center px-4 py-14 sm:px-6 md:px-8 md:py-6 lg:px-12 xl:px-16 2xl:px-20"
      id="initiatives"
    >
      <div className="flex w-full max-w-7xl flex-col gap-6 py-5 lg:grid lg:grid-cols-2 lg:py-8">
        <div className="flex w-full items-center justify-center">
          <OptimizedImage
            src="/assets/decorations/tagline-sticker.png"
            alt="Dream Innovate Succeed Sticker"
            width={436}
            height={303}
            sizes="(min-width: 540px) 448px, calc(89.09vw - 15px)"
            className="z-1 h-auto w-full max-w-md lg:h-80 lg:w-auto"
            brandPlaceholder
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <h5 className="text-justify">
            Our initiatives emphasize community impact, continuous learning, and
            sustainable growth. From interdisciplinary problem-solving and IP
            protection to hosting project showcases and supporting ethical
            innovation, ISATech Society is building a future-ready community of
            student innovators and technopreneurs.
          </h5>
        </div>
      </div>
    </section>
  );
}

/**
 * ################################################################################
 * ##################################### PAGE #####################################
 * ################################################################################
 */
export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ]}
      />
      <AboutUsHeroSection />

      <SectionErrorBoundary sectionName="Description">
        <AboutUsDescriptionSection />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Empowerment">
        <AboutUsEmpowermentSection />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Initiatives">
        <AboutUsInitiativesSection />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Advisers">
        <AboutUsAdvisersSection advisers={advisers} />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Contact">
        <HomepageContactSection />
      </SectionErrorBoundary>
    </div>
  );
}
