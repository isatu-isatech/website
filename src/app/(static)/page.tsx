import {
  ISATechDecorationCenter,
  ISATechDecorationLeft,
  ISATechDecorationRight,
} from "@/components/assets/decorations";
import { ISATechLogoMark } from "@/components/assets/logos";
import CountUpComponent from "@/components/count-up";
import ScrollVelocityComponent from "@/components/scroll-velocity";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import VoronoiTexture from "@/components/shaders/voronoi";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import YouTubePlayer from "@/components/ui/youtube-player";
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
  title: "ISATech Society - Homepage",
  description:
    "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
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
    title: "ISATech Society - Homepage",
    description:
      "Empowering student founders to achieve their dreams through innovation, collaboration, and community.",
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
 * #################################### CONFIG ####################################
 * ################################################################################
 */
const HeroYoutubeVideos: string[] = [
  // List of YouTube video IDs for the hero section
  "Hy5PPhihZZc",
  "ahHdHX80lYQ",
  "qPGHid_8q2Q",
  "k1vucCBXty8",
  "wZgTdPMMve8",
  "qUC_RJRLAnE",
  "Z9VmqP2JvXA",
];
const heroStats: { quantity: string; description: string }[] = [
  { quantity: "5+", description: "Startups Established" },
  { quantity: "25+", description: "Awards Earned" },
  { quantity: "50+", description: "Events Participated" },
];
const homepagePartners = [
  {
    src: "/assets/logos/isatu.png",
    alt: "ISATU Logo",
    width: 500,
    height: 500,
    className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
  {
    src: "/assets/logos/kwadra-tbi.png",
    alt: "KWADRA TBI Logo",
    width: 500,
    height: 500,
    className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
  {
    src: "/assets/logos/umwad.png",
    alt: "UMWAD Logo",
    width: 816,
    height: 690,
    className: "h-[75px] w-[90px] lg:h-[100px] lg:w-[120px]",
    sizes: "(min-width: 1040px) 120px, 90px",
  },
  {
    src: "/assets/logos/cci.png",
    alt: "CCI Logo",
    width: 500,
    height: 500,
    className: "h-[75px] w-[75px] lg:h-[100px] lg:w-[100px]",
    sizes: "(min-width: 1040px) 100px, 75px",
  },
];

/**
 * ################################################################################
 * ################################## COMPONENTS ##################################
 * ################################################################################
 */
function HomepageHeroSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-black/50"
      id="hero"
    >
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <YouTubePlayer
          videoId={
            HeroYoutubeVideos[
              Math.floor(Math.random() * HeroYoutubeVideos.length)
            ]
          }
          autoPlay
          loop
          mute
          hideControls
          playerVars={{
            disablekb: 1,
            rel: 0,
            autohide: 1,
            fs: 0,
            showinfo: 0,
          }}
          className="pointer-events-none absolute aspect-video h-auto w-5xl lg:w-lvw"
        />
      </div>
      <div className="flex w-full items-center justify-center px-6 py-28 md:px-16">
        <div className="flex w-full max-w-6xl">
          <div className="flex w-full flex-col items-center gap-6 text-center lg:items-start lg:justify-start lg:text-start">
            <div className="gap-2 px-4 md:px-0">
              <div>
                <h1 className="leading-tight text-white">Welcome to</h1>
                <h1 className="text-secondary leading-tight">
                  ISATech Society
                </h1>
              </div>
              <h5 className="text-white">
                Empowering student founders to achieve their dreams.
              </h5>
            </div>
            <Link href="/about" className="text-caption">
              <Button variant={"secondary"} size={"lg"}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageStatsSection() {
  return (
    <section
      className="flex w-full flex-col items-center justify-center px-6 py-6 lg:py-16 xl:px-16"
      id="stats"
    >
      <div className="flex w-full max-w-6xl flex-wrap items-center justify-center gap-y-4 lg:gap-y-6">
        {heroStats.map((stat, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center justify-center sm:w-1/2 md:w-1/3"
          >
            <h1>
              <CountUpComponent from={0} to={parseInt(stat.quantity)} />+
            </h1>
            <h3>{stat.description}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomepageAboutSection() {
  // Configuration for the animated blobs in the background
  const blobsConfig: BlobsConfig[] = [
    {
      id: "default-blob-2",
      top: "-10rem",
      left: "-10rem",
      animateX: [0, -30, 0],
      animateY: [0, -40, 0],
      duration: 6,
      colorClass: "bg-secondary/60",
      sizeClass: "h-96 w-96",
      blurClass: "blur-[100px]",
    },
  ];

  return (
    <section
      className="relative flex w-full flex-col items-center justify-center px-6 py-16 lg:px-16 lg:py-28"
      id="about"
    >
      {/* Decorations */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <BlobsAnimatedBackground
          className="absolute h-full w-full"
          blobs={blobsConfig}
        />
        <ISATechDecorationRight className="absolute top-0 right-0 h-full w-auto opacity-10" />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 md:flex-row-reverse">
        {/* Main Image Container */}
        <div className="flex w-full items-center justify-center md:w-1/2">
          <ISATechLogoMark className="z-1 h-[150px] w-[100px] md:h-[270px] md:w-[185px]" />
        </div>
        {/* Section Content Container */}
        <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 md:gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:items-end md:text-end">
            <h2>What is ISATech Society?</h2>
            <h5 className="text-center lg:text-right">
              ISATech is a special interest organization operating under the
              Intellectual Property Management Office (IPMO) and the Kwadra
              Technology Business Incubator (Kwadra-TBI).
            </h5>
          </div>
          <div className="flex w-full items-center justify-center md:justify-end">
            <Link href="/about" className="text-caption">
              <Button variant={"default"} size={"lg"}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepagePartnersSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center px-6 lg:px-16"
      id="partners"
    >
      <PerlinNoiseTexture
        color={"#ececec"}
        className="absolute top-0 left-0 -z-1 h-full w-full opacity-30"
      />
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16 lg:px-8 xl:px-16">
        <h3 className="text-primary">Our Partners</h3>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-10 md:justify-center md:gap-20">
          {homepagePartners.map((partner, key) => (
            <div className="w-fit justify-center" key={key}>
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className={partner.className}
                sizes={partner.sizes}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageKwadraSection() {
  // Configuration for the animated blobs in the background
  const blobsConfig: BlobsConfig[] = [
    {
      id: "default-blob-2",
      top: "-10rem",
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
    <section
      className="relative flex w-full flex-col items-center justify-center px-6 py-16 lg:px-16 lg:py-28"
      id="kwadra"
    >
      {/* Decorations */}
      <div className="absolute -z-1 flex h-full w-full items-center justify-center">
        <BlobsAnimatedBackground
          className="absolute h-full w-full"
          blobs={blobsConfig}
        />
        <ISATechDecorationLeft className="absolute top-0 left-0 h-auto w-full opacity-10 md:h-full md:w-auto" />
      </div>
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 md:flex-row">
        {/* Main Image Container */}
        <div className="flex w-full items-center justify-center md:w-1/2">
          <Image
            src="/assets/logos/kwadra-tbi.png"
            alt="KWADRA TBI Icon"
            width={1080}
            height={1080}
            className="h-[150px] w-[150px] md:h-[290px] md:w-[290px]"
            sizes="(min-width: 780px) 290px, 150px"
          />
        </div>
        {/* Section Content Container */}
        <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 md:gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:items-start md:text-start">
            <h2>What is Kwadra-TBI?</h2>
            <h5>
              The Kwadra-TBI functions as a technology business incubator,
              aiming to commercialize university research into startups and to
              nurture deep technology startups.
            </h5>
          </div>
          <div className="flex w-full items-center justify-center md:justify-start">
            <Link
              href="https://www.facebook.com/KwadraTBI"
              target="_blank"
              className="text-caption"
            >
              <Button variant={"default"} size={"lg"}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageTeamSection() {
  const Team4HMembers = [
    {
      role: "Hustler",
      path: "/assets/decorations/hustler.png",
    },
    {
      role: "Hacker",
      path: "/assets/decorations/hacker.png",
    },
    {
      role: "Hipster",
      path: "/assets/decorations/hipster.png",
    },
    {
      role: "Hound",
      path: "/assets/decorations/hound.png",
    },
  ];

  return (
    <section
      className="bg-primary relative flex w-full flex-col items-center justify-center"
      id="4h"
    >
      {/* Decorations */}
      <div className="absolute flex h-full w-full items-center justify-center">
        <PerlinNoiseTexture
          color={"#ececec"}
          className="absolute h-full w-full opacity-5"
        />
      </div>
      <div className="flex w-full max-w-6xl flex-col px-6 py-20 lg:px-8 xl:px-16">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          {/* Header Container */}
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-secondary">Are You One of the 4H?</h2>
            <h5 className="text-primary-foreground flex lg:w-5/6 xl:w-2/3">
              At ISATech Society, we believe every great innovation starts with
              a diverse team. Whether you&apos;re a creative, a coder, a
              go-getter, or a researcher — there&apos;s a place for you here.
              Which one are you?
            </h5>
          </div>
          {/* Cards Container */}
          <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:justify-center sm:gap-6">
            {Team4HMembers.map((member, key) => (
              <div
                key={key}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border-white bg-gradient-to-b from-white to-gray-500 p-[1px] backdrop-blur-md lg:rounded-4xl"
              >
                <div className="bg-primary flex flex-col items-center justify-center gap-4 rounded-2xl lg:rounded-4xl">
                  <div className="bg-card/25 flex flex-col flex-wrap items-center justify-center gap-4 rounded-2xl px-6 py-8 lg:rounded-4xl lg:px-8 lg:py-10">
                    <div className="bg-secondary flex items-center justify-center rounded-2xl p-2 lg:rounded-3xl lg:p-6 xl:size-40">
                      <Image
                        src={member.path}
                        alt={member.role}
                        width={1000}
                        height={1000}
                        className="size-20 rounded-2xl sm:size-16 md:size-24 lg:size-28"
                        sizes="(min-width: 1040px) 112px, (min-width: 780px) 96px, (min-width: 640px) 64px, (min-width: 380px) 80px, calc(46.67vw - 90px)"
                      />
                    </div>
                    <h6 className="text-primary-foreground font-bold">
                      {member.role}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/membership" className="text-caption z-1">
            <Button variant={"secondary"} size={"lg"}>
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomepageOfferSection() {
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

export function HomepageContactSection() {
  return (
    <section
      className="flex w-full flex-col items-center justify-center px-6 py-16 lg:px-16 lg:py-28"
      id="contact"
    >
      <div className="bg-primary relative flex w-full max-w-6xl flex-col items-center justify-center gap-4 rounded-2xl px-4 py-8 sm:gap-6 sm:rounded-3xl">
        {/* Decorations */}
        <div className="absolute flex h-full w-full items-center justify-center">
          <VoronoiTexture className="absolute inset-0 h-full w-full opacity-10" />
        </div>
        <div className="text-primary-foreground flex flex-col text-center">
          <h2>Let&apos;s dream big!</h2>
          <h6>Got an idea? Let&apos;s make it happen.</h6>
        </div>
        <Link href="/contact" className="text-caption z-1">
          <Button variant={"secondary"} size={"lg"}>
            Contact Us
          </Button>
        </Link>
      </div>
    </section>
  );
}

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
