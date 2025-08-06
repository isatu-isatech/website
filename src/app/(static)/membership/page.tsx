import {
  GradientBlob1Decoration,
  GradientBlob2Decoration,
  ISATechDecoration,
  ISATechDecorationCenter,
} from "@/components/assets/decorations";
import ImageCycleComponent, { ImageCycleProps } from "@/components/image-cycle";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Handshake,
  NotepadText,
  Rocket,
  Target,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MembershipPageReasonSection from "./lanyard-section";

/**
 * ################################################################################
 * #################################### CONFIG ####################################
 * ################################################################################
 */
const membershipFormLink = "https://forms.gle/ViNChagDv6Xcfp3bA";
const coreCommitteeFormLink = "https://forms.gle/n9XHgAm4SYZ7edMR8";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join ISATech Society to enhance your skills, network with peers, and contribute to innovative projects.",
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
    title: "ISATech Society - Membership",
    description:
      "Join ISATech Society to enhance your skills, network with peers, and contribute to innovative projects.",
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
      className="relative flex w-full items-center justify-center overflow-hidden px-6 lg:px-16"
      id="hero"
    >
      {/* Decorations */}
      <div className="absolute top-0 left-0 -z-1 h-full w-full">
        <BlobsAnimatedBackground blobs={blobsConfig} />
      </div>
      <div className="flex w-full max-w-6xl items-center">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col items-start justify-center gap-4 py-8">
            {/* Hero Text Container */}
            <div className="flex w-full flex-col">
              <h1 className="text-secondary text-center md:text-left">
                Do You Have It Takes to Lead?
              </h1>
              <h5 className="text-center font-mono md:text-left">
                We&apos;re looking for passionate, purpose-driven students to
                lead our society and bring technopreneurship to life.
              </h5>
            </div>
            <div className="flex w-full justify-center md:justify-start">
              <Button variant={"default"} size={"lg"}>
                <Link href="#apply" className="text-caption">
                  Apply Now
                </Link>
              </Button>
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
    <section className="relative flex w-full items-center justify-center px-6 py-16 lg:px-8 xl:px-16">
      {/* Decorations */}
      <div className="absolute flex h-full w-full items-center justify-center">
        <BlobsAnimatedBackground
          blobs={blobsConfig}
          className="absolute h-full w-full"
        />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center text-center lg:w-2/3">
          <h2 className="text-primary">
            Meet the 4H:<br></br>The Core of Every Great Team!
          </h2>
          <h5>
            Whether you&apos;e a creative, a coder, a strategist, or a
            researcher—<br></br>there&apos;s a role for you in ISATech Society.
          </h5>
        </div>
        <div className="grid w-full grid-cols-2 gap-6 sm:flex sm:items-center sm:justify-center sm:gap-6">
          {members.map((member, key) => (
            <div
              key={key}
              className="flex w-full rounded-2xl bg-gradient-to-b from-white to-gray-500 p-0.25 md:rounded-4xl"
            >
              <div className="bg-card flex w-full rounded-2xl md:rounded-4xl">
                <div className="w-full rounded-2xl bg-gray-300/50 md:rounded-4xl">
                  <div className="flex w-full flex-col items-center justify-start gap-4 rounded-2xl px-4 py-6 backdrop-blur-2xl md:rounded-4xl lg:py-8">
                    <div className="bg-secondary flex aspect-square w-3/4 items-center justify-center rounded-2xl p-4 md:rounded-3xl">
                      <Image
                        src={member.path}
                        alt={member.role}
                        height={1000}
                        width={1000}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <h5 className="font-bold">Meet the {member.role}!</h5>
                      <p className="text-micro min-h-[6em]">
                        {member.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MembershipPageOfferSection() {
  const isatechOffers = [
    {
      icon: Rocket,
      title: "Hackathons",
      description:
        "A race of innovation where ideas thrive and take shape. Hackathons challenge students to build creative tech solutions under pressure.",
    },
    {
      icon: NotepadText,
      title: "Seminars",
      description:
        "Insightful talks from industry leaders. Seminars offer fresh perspectives, discuss emerging trends, and share valuable knowledge beyond the classroom.",
    },
    {
      icon: GraduationCap,
      title: "Trainings",
      description:
        "Skill-up sessions to help you stay ahead. Whether it's coding, design, or entrepreneurship — our trainings empower members with hands-on experience and practical tools.",
    },

    {
      icon: Users,
      title: "Cohorts",
      description:
        "Focused learning communities designed for growth. Cohorts bring members together to explore specific skills, to build real-world projects, and to support one another in a collaborative environment.",
    },
  ];

  return (
    <section
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-16 lg:px-16 lg:py-28"
      id="offers"
    >
      {/* Decoration */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <ISATechDecorationCenter className="translate absolute top-1/2 left-1/2 h-11/12 w-auto -translate-x-1/2 -translate-y-1/2 opacity-5 lg:opacity-10" />
      </div>
      <div className="flex max-w-6xl flex-col items-center justify-center gap-6 text-center">
        <h2 className="text-primary">What do we offer?</h2>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
          {isatechOffers.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-2xl bg-gray-300/50 px-6 py-4 backdrop-blur-xs"
            >
              <item.icon size={32} />
              <div className="flex flex-col gap-2 text-start">
                <p className="text-body-bold">{item.title}</p>
                <p className="text-label">{item.description}</p>
              </div>
            </div>
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
      className="bg-accent/50 flex w-full items-center justify-center px-6 py-16 lg:px-8 xl:px-16"
      id="apply"
    >
      <div className="flex w-full max-w-6xl flex-col items-center gap-8">
        <h2 className="text-primary text-center">
          Requirements for Membership Application
        </h2>
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-wrap gap-6">
            {requirements.map((requirement, index) => (
              <div
                key={index}
                className="flex w-full flex-col md:w-[calc(50%-12px)]"
              >
                <h4>{requirement.title}</h4>

                {requirement.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </div>
            ))}
          </div>
          <p className="text-caption text-gray-700">
            Note: All data is confidential and used only for official onboarding
          </p>
        </div>
      </div>
    </section>
  );
}

function MembershipPageMemberSection() {
  const benefits = [
    {
      title: "Connect with Industry Leaders",
      subtitle:
        "Gain direct access to seasoned mentors, startup founders, and business leaders who can guide your journey in innovation and technopreneurship.",
    },
    {
      title: "Represent ISAT U in Local and National Events",
      subtitle:
        "Be part of a select group of students who travel to compete and collaborate in hackathons, startup competitions, and pitching events.",
    },
    {
      title: "Unlock Startup Grants and Incubation Support",
      subtitle:
        "Get a chance to turn your ideas into real ventures through exclusive access to funding opportunities, pitch training, and startup incubation programs like Kwadra TBI.",
    },
    {
      title: "Grow in a Community of Innovators",
      subtitle:
        "Join a dynamic, like-minded network of student technopreneurs and creatives — where collaboration, learning, and growth never stop.",
    },
  ];
  const images: ImageCycleProps["images"] = [
    {
      src: "/assets/decorations/seminar.jpg",
      alt: "ISATech Member Benefits Image 1",
    },
    {
      src: "/assets/decorations/competitions.jpg",
      alt: "ISATech Member Benefits Image 2",
    },
    {
      src: "/assets/decorations/leaders.jpg",
      alt: "ISATech Member Benefits Image 3",
    },
    {
      src: "/assets/decorations/community.jpg",
      alt: "ISATech Member Benefits Image 4",
    },
  ];
  return (
    <section
      className="relative flex w-full items-center justify-center overflow-hidden px-6 py-16 lg:px-8 xl:px-16"
      id="member"
    >
      {/* Decorations */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center opacity-80">
        <GradientBlob1Decoration className="absolute right-0 bottom-0 h-full w-full translate-x-1/2 translate-y-1/2" />
        <GradientBlob2Decoration className="absolute top-0 right-0 h-full w-full -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-2 text-center lg:w-2/3">
          <h2 className="text-primary">What&apos;s in Store for You?</h2>
          <h5>
            By joining ISATech, you&apos;ll gain access to exclusive
            opportunities all while being part of a vibrant, 4H-powered
            community.
          </h5>
        </div>
        <div className="grid w-full gap-6 xl:grid-cols-2">
          <div className="flex w-full flex-col gap-2">
            {benefits.map((benefit, key) => (
              <div
                key={key}
                className="bg-accent/50 flex w-full flex-col gap-2 rounded-2xl px-6 py-4 backdrop-blur-md"
              >
                <p className="text-body-bold">{benefit.title}</p>
                <p className="text-label">{benefit.subtitle}</p>
              </div>
            ))}
          </div>
          <ImageCycleComponent
            images={images}
            className="hidden size-full rounded-2xl backdrop-blur-md xl:flex"
          />
          {/* <div className="bg-accent/50 hidden size-full rounded-2xl backdrop-blur-md xl:flex"></div> */}
        </div>
        <Button variant={"default"} size={"lg"}>
          <Link
            href={membershipFormLink}
            target="_blank"
            className="text-caption"
          >
            Apply as Core Member
          </Link>
        </Button>
      </div>
    </section>
  );
}

function MembershipPageCoreSection() {
  const benefits = [
    {
      icon: NotepadText,
      title: "Facilitate ISATech Events",
      description:
        "Co-create workshops, hackathons, and speaker sessions to gain real-world event management and project execution skills, impacting hundreds of peers.",
    },
    {
      icon: Users,
      title: "Be Part of the ISATech Leadership Team",
      description:
        "Join our innovator circle: your ideas shape strategy through high-trust collaboration with faculty and industry.",
    },
    {
      icon: Target,
      title: "Drive the ISATech Mission Forward",
      description:
        "Own initiatives to advance campus technopreneurship, creating measurable impact in our tech ecosystem.",
    },
    {
      icon: Handshake,
      title: "Build Strategic Networks",
      description:
        "Gain exclusive access to student organizations and industry pros, fostering meaningful connections through collaborations.",
    },
    {
      icon: GraduationCap,
      title: "Master Leadership in Action",
      description:
        "Lead hands-on teams with personalized mentorship, honing crisis management, communication, and agile decision-making.",
    },
  ];

  return (
    <section
      className="relative flex w-full items-center justify-center px-6 py-16 lg:px-8 xl:px-16"
      id="core"
    >
      {/* Decorations */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center opacity-80">
        <PerlinNoiseTexture
          color="#E6E6E7"
          className="absolute h-full w-full opacity-20"
        />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-2 text-center lg:w-2/3">
            <h2 className="text-primary">How about as a Core Member?</h2>
            <h5>
              By joining ISATech as a core member, you gain access to more
              opportunities to develop leadership and creativity while
              contributing to our mission of innovation and entrepreneurship.
            </h5>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            {benefits.map((benefit, key) => (
              <div
                key={key}
                className="bg-accent/50 flex w-full flex-col items-start gap-2 rounded-2xl px-4 py-4 md:px-6 lg:min-h-[18em] lg:w-[calc(33.33%-16px)] xl:min-h-auto"
              >
                <benefit.icon size={32} />
                <p className="text-body-bold">{benefit.title}</p>
                <p className="text-label">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        <Button variant={"default"} size={"lg"}>
          <Link
            href={coreCommitteeFormLink}
            target="_blank"
            className="text-caption"
          >
            Apply as Core Member
          </Link>
        </Button>
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
      <MembershipPageHeroSection />
      <MembershipPageReasonSection />
      <MembershipPageTeamSection />
      <MembershipPageOfferSection />
      <MembershipPageRequirementsSection />
      <MembershipPageMemberSection />
      <MembershipPageCoreSection />
    </div>
  );
}
