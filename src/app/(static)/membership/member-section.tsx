"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAutoAdvance } from "@/lib/hooks";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type SVGProps } from "react";

/**
 * Decorative gradient blobs (grain-textured via feTurbulence filter).
 * Co-located here: these are only used by this section, and keeping the SVGs
 * inline avoids shipping them as client JS on other pages.
 */
function GradientBlob1Decoration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="562"
      height="593"
      viewBox="0 0 562 593"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_n_1717_2814)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M281.611 3.94148C189.72 0.313648 77.7216 -15.4249 21.682 57.4907C-33.3515 129.097 32.7932 227.454 40.686 317.42C47.3244 393.087 6.40195 485.452 63.6111 535.419C120.541 585.143 206.261 521.861 281.611 527.849C371.285 534.974 470.659 633.54 537.245 573.054C603.101 513.23 516.03 406.348 513.259 317.42C510.666 234.178 571.29 144.214 521.796 77.2351C470.08 7.25149 368.561 7.37427 281.611 3.94148Z"
          fill="url(#paint0_linear_1717_2814)"
        />
      </g>
      <defs>
        <filter
          id="filter0_n_1717_2814"
          x="-0.000488281"
          y="0"
          width="561.816"
          height="592.598"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2 2"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="3446"
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feMerge result="effect1_noise_1717_2814">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
        <linearGradient
          id="paint0_linear_1717_2814"
          x1="280.908"
          y1="0"
          x2="280.908"
          y2="592.598"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.25" stopColor="#FFAC03" />
          <stop offset="1" stopColor="#203C90" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GradientBlob2Decoration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="727"
      height="695"
      viewBox="0 0 727 695"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_n_1719_2816)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M385.905 694.974C467.387 693.858 541.126 658.78 599.842 609.071C659.881 558.242 695.736 493.155 709.656 420.885C727.141 330.106 745.885 232.116 687.123 155.922C619.254 67.9179 506.117 -10.1877 385.905 1.08766C269.607 11.9959 216.254 126.969 142.735 206.983C81.3375 273.805 -4.53915 335.067 0.186993 420.885C4.80749 504.784 90.9244 562.236 165.206 615.02C229.545 660.738 303.206 696.105 385.905 694.974Z"
          fill="url(#paint0_linear_1719_2816)"
        />
      </g>
      <defs>
        <filter
          id="filter0_n_1719_2816"
          x="0"
          y="0"
          width="727"
          height="695"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2 2"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="5484"
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feMerge result="effect1_noise_1719_2816">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
        <linearGradient
          id="paint0_linear_1719_2816"
          x1="363.5"
          y1="695"
          x2="363.5"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.25" stopColor="#203C90" />
          <stop offset="1" stopColor="#FFAC03" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * ################################################################################
 * #################################### CONFIG ####################################
 * ################################################################################
 */
const AUTO_ADVANCE_MS = 3500;

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

const images = [
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

/**
 * ###############################################################################
 * ############################## MEMBER BENEFITS SECTION ########################
 * ###############################################################################
 *
 * Screen-height benefits band with hover-driven storytelling: while the
 * visitor is idle the section automatically focuses the next benefit (card +
 * matching image advance together); hovering a card focuses that benefit and
 * pauses the auto-advance until the pointer leaves the list.
 */
export default function MembershipPageMemberSection() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = false;
  }, []);

  useAutoAdvance(AUTO_ADVANCE_MS, () => {
    if (!pausedRef.current) {
      setActiveIndex((index) => (index + 1) % benefits.length);
    }
  });

  const focusBenefit = (index: number) => {
    pausedRef.current = true;
    setActiveIndex(index);
  };

  const resumeAutoAdvance = () => {
    pausedRef.current = false;
  };

  return (
    <section
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6 md:px-8 lg:px-12 lg:py-8 xl:px-16 2xl:px-20"
      id="member"
    >
      {/* Decorations */}
      <div className="pointer-events-none absolute -z-1 flex h-full w-full items-center justify-center opacity-80">
        <GradientBlob1Decoration className="absolute right-0 bottom-0 h-full w-full translate-x-1/2 translate-y-1/2" />
        <GradientBlob2Decoration className="absolute top-0 right-0 h-full w-full -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="flex w-full max-w-7xl flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-1.5 text-center">
          <h2 className="text-secondary-dark dark:text-secondary">
            What&apos;s in Store for You?
          </h2>
          <h5>
            By joining ISATech, you&apos;ll gain access to exclusive
            opportunities all while being part of a vibrant, 4H-powered
            community.
          </h5>
        </div>
        <div className="grid w-full items-stretch gap-4 lg:grid-cols-2">
          {/* Benefit list — hover a card to focus it; idle auto-advances */}
          <div className="flex w-full flex-col gap-1">
            {benefits.map((benefit, key) => (
              <div
                key={benefit.title}
                onMouseEnter={() => focusBenefit(key)}
                onMouseLeave={resumeAutoAdvance}
                className={cn(
                  "border-border/60 bg-accent/50 flex w-full cursor-default flex-col gap-1 rounded-2xl border px-4 py-2 backdrop-blur-md transition-colors duration-300",
                  activeIndex === key && "border-secondary/60 bg-accent",
                )}
              >
                <p className="text-body-bold">{benefit.title}</p>
                <p className="text-label lg:line-clamp-3">{benefit.subtitle}</p>
              </div>
            ))}
          </div>
          {/* Focused benefit's image — crossfades on switch */}
          <div className="bg-accent/50 border-border/60 relative aspect-4/3 w-full overflow-hidden rounded-2xl border lg:aspect-auto">
            {images.map((image, key) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1280px) 640px, 100vw"
                priority={key === 0}
                className={cn(
                  "object-cover transition-opacity duration-500",
                  activeIndex === key ? "opacity-100" : "opacity-0",
                  reduceMotion && "transition-none",
                )}
              />
            ))}
          </div>
        </div>
        <Link href="/membership/apply" className="text-caption">
          <Button variant={"default"} size={"lg"}>
            Apply as Member
          </Button>
        </Link>
      </div>
    </section>
  );
}
