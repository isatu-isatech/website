import { ISATechDecoration } from "@/components/assets/decorations";
import { HomepageOfferSection } from "@/components/home/offer-section";
import { HomepageContactSection } from "@/components/home/contact-section";
import { OptimizedImage, RevealOnView } from "@/components/common";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { Check } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import MembershipPageMemberSection from "./member-section";

const MembershipPageReasonSection = dynamic(() => import("./lanyard-section"));

/**
 * ################################################################################
 * #################################### CONFIG ####################################
 * ################################################################################
 */

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Become a Member",
  description:
    "Join the ISATech Society to enhance your skills, network with peers, and contribute to innovative projects that shape the future.",
  keywords: [
    "philippines",
    "membership",
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
    title: "Become a Member of ISATech Society",
    description:
      "Join the ISATech Society to enhance your skills, network with peers, and contribute to innovative projects that shape the future.",
    url: "https://isatech.club/membership",
    siteName: "ISATech Society",
    type: "website",
  },
};

/**
 * ################################################################################
 * ################################## COMPONENTS ##################################
 * ################################################################################
 */
function MembershipPageHeroSection() {
  const blobsConfig: BlobsConfig[] = [
    {
      id: "default-blob-1",
      top: "-10rem",
      left: "-10rem",
      animateX: [0, -30, 0],
      animateY: [0, -40, 0],
      duration: 6,
      colorClass: "bg-primary/60",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
    {
      id: "default-blob-2",
      bottom: "-10rem",
      right: "-10rem",
      animateX: [0, -30, 0],
      animateY: [0, -40, 0],
      duration: 6,
      colorClass: "bg-primary/60",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
  ];

  return (
    <section
      className="relative flex w-full items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
      id="hero"
    >
      {/* Decorations */}
      <div className="absolute top-0 left-0 -z-1 h-full w-full">
        <BlobsAnimatedBackground blobs={blobsConfig} />
      </div>
      <div className="flex w-full max-w-7xl items-center">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col items-start justify-center gap-4 py-8">
            {/* Hero Text Container */}
            <div className="flex w-full flex-col">
              <h1 className="text-secondary-dark dark:text-secondary text-center md:text-left md:text-4xl lg:text-4xl xl:text-5xl">
                Do You Have What It Takes to Lead?
              </h1>
              <h5 className="text-center font-mono text-sm md:text-left lg:text-lg xl:text-xl">
                We&apos;re looking for passionate, purpose-driven students to
                lead our society and bring technopreneurship to life.
              </h5>
            </div>
            <div className="flex w-full justify-center gap-2 md:justify-start">
              <Link href="#apply" className="text-caption">
                <Button variant={"default"} size={"lg"}>
                  Apply Now
                </Button>
              </Link>
              <Link href="/quiz" className="text-caption">
                <Button variant={"ghost"} size={"lg"}>
                  Take the Quiz
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex w-full items-start justify-end">
            {/* Decoration */}
            <ISATechDecoration
              color="#FFAC03"
              className="absolute top-0 right-0 -z-1 h-full w-auto translate-x-1/2"
            />

            <Image
              src="/assets/decorations/speaker-collage.png"
              alt="Hero Decorative Image"
              width={1168}
              height={1260}
              sizes="(min-width: 1360px) 562px, (min-width: 1040px) calc(40.33vw + 22px), calc(99.86vw - 51px)"
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
      {/* Content */}
    </section>
  );
}

function MembershipPageTeamSection() {
  const members = [
    {
      role: "Hustler",
      path: "/assets/decorations/hustler.png",
      subtitle:
        "The strategic brain who drives momentum and turns vision into action.",
    },
    {
      role: "Hacker",
      path: "/assets/decorations/hacker.png",
      subtitle: "The builder, coder, and architect who makes ideas real.",
    },
    {
      role: "Hipster",
      path: "/assets/decorations/hipster.png",
      subtitle:
        "The creative who shapes innovation with design, branding, and vibe.",
    },
    {
      role: "Hound",
      path: "/assets/decorations/hound.png",
      subtitle:
        "The researcher and analyst who keeps the team grounded and informed.",
    },
  ];

  const blobsConfig: BlobsConfig[] = [
    {
      id: "blob-1",
      top: "-10rem",
      left: "-10rem",
      animateX: [0, -30, 0],
      animateY: [0, -40, 0],
      duration: 6,
      colorClass: "bg-secondary/60",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
    {
      id: "blob-2",
      bottom: "-10rem",
      right: "-10rem",
      animateX: [0, -30, 0],
      animateY: [0, -40, 0],
      duration: 6,
      colorClass: "bg-secondary/60",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
  ];

  return (
    <section className="relative flex w-full items-center justify-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 lg:py-16 xl:px-16 2xl:px-20">
      {/* Decorations */}
      <div className="pointer-events-none absolute flex h-full w-full items-center justify-center">
        <BlobsAnimatedBackground
          blobs={blobsConfig}
          className="absolute h-full w-full"
        />
      </div>
      <div className="flex w-full max-w-7xl flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center text-center lg:w-2/3">
          <h2 className="text-secondary-dark dark:text-secondary">
            Meet the 4H:<br></br>The Core of Every Great Team!
          </h2>
          <h5>
            Whether you&apos;re a creative, a coder, a strategist, or a
            researcher—<br></br>there&apos;s a role for you in ISATech Society.
          </h5>
        </div>
        <div className="divide-primary/10 grid w-full grid-cols-1 divide-y md:grid-cols-4 md:divide-x md:divide-y-0">
          {members.map((member, key) => (
            <RevealOnView
              key={member.role}
              delay={key * 0.08}
              className="flex w-full flex-col items-center justify-start gap-3 px-4 py-6"
            >
              <div className="bg-secondary flex aspect-square w-24 items-center justify-center rounded-3xl p-4 md:w-28">
                <OptimizedImage
                  src={member.path}
                  alt={member.role}
                  height={1000}
                  width={1000}
                  className="h-full w-full object-contain"
                  brandPlaceholder
                />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <h5 className="font-bold">Meet the {member.role}!</h5>
                <p className="text-micro">{member.subtitle}</p>
              </div>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  );
}

function MembershipPageRequirementsSection() {
  const requirements = [
    {
      title: "Requirements to Apply:",
      items: [
        "Must be a bonafide ISAT-U student",
        "Have working knowledge of preferred role",
        "Submit updated CV/resume",
        "Be committed to participate in org activities",
      ],
    },
    {
      title: "Prepare the following:",
      items: [
        "Updated CV/Resume (PDF or DOCX)",
        "Formal 2x2 ID Photo (JPG/PNG)",
      ],
    },
  ];

  return (
    <section
      className="flex w-full items-center justify-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
      id="apply"
    >
      <div className="flex w-full max-w-7xl flex-col items-center gap-8">
        <h2 className="text-secondary-dark dark:text-secondary text-center">
          Requirements for Membership Application
        </h2>
        <div className="bg-accent/50 border-border/60 flex w-full flex-col gap-6 rounded-3xl border p-6 md:p-10">
          <div className="md:divide-primary/10 flex w-full flex-col gap-8 md:flex-row md:gap-0 md:divide-x">
            {requirements.map((requirement) => (
              <div
                key={requirement.title}
                className="flex w-full flex-col gap-4 md:px-8 md:first:pl-0"
              >
                <h4>{requirement.title}</h4>

                <ul className="flex list-none flex-col">
                  {requirement.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 py-2.5">
                      <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <p className="text-label">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-caption text-foreground/70">
            Note: All data is confidential and used only for official onboarding
          </p>
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
export default function MembershipPage() {
  return (
    <div>
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Membership", path: "/membership" },
        ]}
      />
      <MembershipPageHeroSection />
      <MembershipPageReasonSection />
      <MembershipPageTeamSection />
      <HomepageOfferSection />
      <MembershipPageRequirementsSection />
      <MembershipPageMemberSection />
      <HomepageContactSection />
    </div>
  );
}
