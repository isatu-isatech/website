import { ISATechDecoration } from "@/components/assets/decorations";
import LanyardComponent from "@/components/lanyard";
import PerlinNoiseTexture from "@/components/shaders/perlin";
import { BlobsAnimatedBackground, BlobsConfig } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
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

          <div className="debug relative flex w-full items-start justify-end">
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
              className="debug h-auto w-full object-contain"
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
      className="debug bg-primary relative flex w-full items-center justify-center overflow-hidden px-6 lg:px-16"
    >
      <PerlinNoiseTexture
        color="#FFAC03"
        className="absolute h-full w-full opacity-20"
      />
      <LanyardComponent
        position={[0, 0, 11]}
        className="debug absolute h-full w-full -translate-x-1/2 touch-none md:h-[calc(100%+45%)] md:w-[calc(200%)] md:-translate-x-1/12 md:-translate-y-[15%]"
      />
      <div className="z-1 flex w-full max-w-6xl items-center justify-center gap-8 py-20 md:justify-end">
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
    </div>
  );
}
