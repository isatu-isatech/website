import {
  ISATechDecorationCenter,
  ISATechDecorationLeft,
  ISATechDecorationRight,
} from "@/components/assets/decorations";
import { ISATechLogoMark } from "@/components/assets/logos";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import { RocketIcon, TargetIcon } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import AboutUsAdvisersSection, { AdviserProps } from "./carousel";
import { HomepageContactSection } from "../page";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "ISATech Society - About Us",
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
    title: "ISATech Society - About Us",
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
      className="flex w-full items-center justify-center px-6 py-12 md:px-16 md:py-6"
      id="hero"
    >
      <div className="relative flex w-full max-w-6xl items-center justify-between py-8 lg:py-16">
        {/* Text Content */}
        <div className="flex w-full gap-8">
          {/* Divider */}
          <div className="from-primary to-secondary w-0.5 bg-gradient-to-bl"></div>
          {/* Text Container */}
          <div className="">
            <h1>About</h1>
            <h1 className="text-secondary">ISATech Society</h1>
          </div>
        </div>
        {/* 4H Decoration */}
        <div className="hidden w-fit items-center justify-center sm:flex sm:w-full">
          <Image
            src="/assets/decorations/4h-vertical.png"
            alt="4H Vertical Pose"
            width={279}
            height={329}
            className="h-32 w-fit md:h-64"
            sizes="(min-width: 780px) 217px, 109px"
          />
        </div>
        {/* ISATech Logo Decoration */}
        <ISATechDecorationCenter
          className="absolute top-0 right-0 -z-1 h-full w-auto"
          color="#203C90"
        />
      </div>
    </section>
  );
}

function AboutUsDescriptionSection() {
  return (
    <section
      className="relative flex w-full items-center justify-center px-6 py-6 md:px-16"
      id="description"
    >
      <div className="absolute flex h-full w-full justify-center">
        {/* Decorations */}
        <ISATechDecorationLeft className="absolute top-0 left-0 hidden h-auto w-fit opacity-10 lg:block" />
        <ISATechDecorationRight className="absolute right-0 bottom-0 h-auto w-fit opacity-10" />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* Text Content */}
        <div className="bg-accent relative flex w-full max-w-6xl flex-col items-center justify-between gap-4 overflow-hidden rounded-3xl px-6 lg:px-20">
          <Image
            src="/assets/decorations/tradeanovate-grouphoto.jpg"
            alt="Tradeanovate Group Photo"
            width={1695}
            height={706}
            sizes="(min-width: 1360px) 1153px, (min-width: 1040px) calc(80.33vw + 78px), (min-width: 960px) 709px, (min-width: 740px) 751px, (min-width: 600px) calc(-47.5vw + 1091px), (min-width: 400px) calc(-63.89vw + 1179px), calc(-298.75vw + 2054px)"
            className="absolute h-full w-auto rounded-3xl object-cover opacity-30 lg:h-auto lg:w-full"
          />
          <div className="flex flex-col items-center justify-center gap-4 py-16 lg:py-32">
            <ISATechLogoMark className="h-24 w-auto" />
            <p className="body text-center">
              ISATech Society (ISAT U Innovators and Technopreneurs Society) is
              a student-led organization at Iloilo Science and Technology
              University dedicated to nurturing innovation, creativity, and
              entrepreneurship.
            </p>
          </div>
        </div>
        {/* Mission and Vission */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 py-5 lg:grid-cols-2 lg:py-8">
          <div className="flex flex-col justify-start gap-4">
            <TargetIcon size={42} />
            <div className="flex flex-col gap-2">
              <h3>Mission</h3>
              <p className="body text-justify">
                To empower ISAT U students with the mindset, skills, and
                opportunities to become future-ready innovators and
                technopreneurs. We provide a platform for students to grow
                through training, mentorship, and community engagement —
                connecting them with industry leaders and supporting their
                journey from ideas to impactful ventures.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-start gap-4">
            <RocketIcon size={42} />
            <div className="flex flex-col gap-2">
              <h3>Vision</h3>
              <p className="body text-justify">
                Our Vision is to be the premier platform for students across
                ISAT U system wide, raising awareness about startups, providing
                skills and resources for innovations, producing student
                technopreneurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutUsEmpowermentSection() {
  return (
    <section
      className="bg-primary relative flex w-full items-center justify-center px-6 py-14 md:py-6 lg:px-16"
      id="empowerment"
    >
      <PerlinNoiseTexture
        color="#FFAC03"
        className="absolute h-full w-full opacity-20"
      />
      <div className="flex w-full max-w-6xl grid-cols-1 flex-col-reverse gap-6 py-5 lg:grid lg:grid-cols-2 lg:py-8">
        <div className="w-fill flex items-center justify-center">
          <h5 className="text-justify text-white">
            We empower students with practical skills, an entrepreneurial
            mindset, and a passion for innovation. Through workshops, training,
            and mentorship, ISATech fosters idea generation, design thinking,
            and startup development. We connect members with mentors, industry
            experts, and potential investors, while also serving as a gateway to
            ISAT U’s technology business incubator, Kwadra TBI.
          </h5>
        </div>
        <div className="w-fill flex items-center justify-center">
          <Image
            src="/assets/decorations/poststamp-sticker.png"
            alt="ISATech Society Reseach Hub Stamp"
            width={436}
            height={346}
            sizes="(min-width: 1040px) 403px, calc(100vw - 48px)"
            className="z-1 h-auto w-full lg:h-80 lg:w-auto"
          />
        </div>
      </div>
    </section>
  );
}

function AboutUsInitiativesSection() {
  return (
    <section
      className="flex w-full items-center justify-center px-6 py-14 md:py-6 lg:px-16"
      id="initiatives"
    >
      <div className="flex w-full max-w-6xl grid-cols-1 flex-col gap-6 py-5 lg:grid lg:grid-cols-2 lg:py-8">
        <div className="w-fill flex items-center justify-center">
          <Image
            src="/assets/decorations/tagline-sticker.png"
            alt="Dream Innovate Succeed Sticker"
            width={436}
            height={303}
            sizes="(min-width: 1040px) 436px, calc(100vw - 48px)"
            className="z-1 h-auto w-full lg:h-80 lg:w-auto"
          />
        </div>
        <div className="w-fill flex items-center justify-center">
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
      <AboutUsHeroSection />
      <AboutUsDescriptionSection />
      <AboutUsEmpowermentSection />
      <AboutUsInitiativesSection />
      <AboutUsAdvisersSection advisers={advisers} />
      <HomepageContactSection />
    </div>
  );
}
