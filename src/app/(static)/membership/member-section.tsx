"use client";

import {
  GradientBlob1Decoration,
  GradientBlob2Decoration,
} from "@/components/assets/decorations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * ################################################################################
 * #################################### CONFIG ####################################
 * ################################################################################
 */
const membershipFormLink = "https://forms.gle/ViNChagDv6Xcfp3bA";
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
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  useEffect(() => {
    pausedRef.current = false;
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setActiveIndex((index) => (index + 1) % benefits.length);
      }
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
          <div className="bg-accent/50 border-border/60 relative aspect-[4/3] w-full overflow-hidden rounded-2xl border lg:aspect-auto">
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
        <Link
          href={membershipFormLink}
          target="_blank"
          className="text-caption"
        >
          <Button variant={"default"} size={"lg"}>
            Apply as Member
          </Button>
        </Link>
      </div>
    </section>
  );
}
