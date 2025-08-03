import {
  ISATechDecoration,
  ISATechDecorationCenter,
} from "@/components/assets/decorations";
import LanyardComponent from "@/components/lanyard";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import { GraduationCap, NotepadText, Rocket, Users } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/**
 * ################################################################################
 * ################################### METADATA ###################################
 * ################################################################################
 */
export const metadata: Metadata = {
  title: "Membership | ISATech Society",
  description:
    "Join ISATech Society to enhance your skills, network with peers, and contribute to innovative projects.",
  openGraph: {
    title: "Membership | ISATech Society",
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

function MembershipPageReasonSection() {
  return (
    <section
      id="reason"
      className="bg-primary relative flex w-full items-center justify-center overflow-hidden px-6 lg:px-16"
    >
      <PerlinNoiseTexture
        color="#FFAC03"
        className="absolute h-full w-full opacity-20"
      />
      <LanyardComponent
        position={[0, 0, 11]}
        className="absolute h-full w-full -translate-x-1/2 touch-none md:h-[calc(100%+45%)] md:w-[calc(200%)] md:-translate-x-1/12 md:-translate-y-[15%]"
      />
      <div className="flex w-full max-w-6xl items-center justify-center gap-8 py-20 md:justify-end">
        <div className="bg-accent/25 flex items-center justify-center rounded-3xl px-4 py-12 backdrop-blur-md md:w-1/2 md:px-8 md:py-20">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <h4 className="text-secondary text-center">Why choose ISATech?</h4>
            <p className="body text-center text-white">
              ISATech encourages students on participating events, competitions,
              and hackathons, teaches students on innovations, start-ups and
              intellectual property, and connects students with mentors and
              experts in the field.
            </p>
          </div>
        </div>
      </div>
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

  return (
    <section className="flex w-full items-center justify-center px-6 py-16 lg:px-8 xl:px-16">
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
                  <div className="flex w-full flex-col items-center justify-start gap-4 rounded-2xl px-2 py-6 backdrop-blur-2xl md:rounded-4xl lg:py-8">
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
                      <h6>Meet the {member.role}!</h6>
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
    <section className="flex w-full items-center justify-center px-6 py-16 lg:px-8 xl:px-16">
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
    </div>
  );
}
