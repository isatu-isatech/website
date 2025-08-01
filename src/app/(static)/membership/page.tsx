import { ISATechDecoration } from "@/components/assets/decorations";
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
      className="relative flex w-full items-center justify-center px-6 lg:px-16"
      id="hero"
    >
      {/* Decorations */}
      <div className="debug absolute top-0 left-0 -z-1 h-full w-full">
        <BlobsAnimatedBackground blobs={blobsConfig} />
      </div>
      <div className="flex w-full max-w-6xl items-center">
        <div className="debug grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="debug flex flex-col items-start justify-center gap-4">
            {/* Hero Text Container */}
            <div className="flex w-full flex-col">
              <h1 className="text-secondary">Do You Have It Takes to Lead?</h1>
              <h5 className="font-mono">
                We&apos;re looking for passionate, purpose-driven students to
                lead our society and bring technopreneurship to life.
              </h5>
            </div>
            <Button variant={"default"} size={"lg"}>
              <Link href="#apply" className="text-caption">
                Apply Now
              </Link>
            </Button>
          </div>

          <div className="debug relative flex w-full items-center justify-center">
            {/* Decoration */}
            <ISATechDecoration
              color="#FFAC03"
              className="absolute top-0 right-0 -z-1 h-full w-auto translate-x-1/2"
            />

            <Image
              src="/assets/isatech-decoration-membership-1.png"
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

/**
 * ################################################################################
 * ##################################### PAGE #####################################
 * ################################################################################
 */
export default function MembershipPage() {
  return (
    <div>
      <MembershipPageHeroSection />
    </div>
  );
}
