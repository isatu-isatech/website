"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMountedReducedMotion } from "@/lib/hooks";

const LanyardComponent = dynamic(() => import("@/components/three/lanyard"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute hidden min-h-[60svh] w-full md:block"
      aria-hidden="true"
    />
  ),
});

export default function MembershipPageReasonSection() {
  // Reduced-motion desktop gets the static composition instead of WebGL.
  const reduceMotion = useMountedReducedMotion();
  return (
    <section
      id="reason"
      className="bg-primary relative flex w-full items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
    >
      <div
        aria-hidden
        className="mask-topography pointer-events-none absolute h-full w-full bg-[#ececec] opacity-10"
      />
      {!reduceMotion && (
        <LanyardComponent
          position={[0, 0, 11]}
          className="absolute hidden h-full w-[calc(200%)] -translate-x-1/12 translate-y-[-15%] touch-none md:block md:h-[145%]"
        />
      )}
      <Image
        src="/assets/decorations/idfallback.png"
        alt="ISATech Member ID"
        width={328}
        height={511}
        sizes="(max-width: 768px) 50vw, 0px"
        loading="lazy"
        className="pointer-events-none absolute top-0 left-0 h-[130%] w-auto -translate-x-1/2 -translate-y-1/5 md:hidden"
      />
      <div className="pointer-events-none relative z-10 flex w-full max-w-7xl items-center justify-center gap-8 py-20 md:justify-end">
        <div className="bg-accent/50 flex items-center justify-center rounded-3xl px-4 py-12 backdrop-blur-md md:w-1/2 md:px-8 md:py-20">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <h4 className="text-secondary-dark dark:text-secondary text-center">
              Why choose ISATech?
            </h4>
            <p className="body text-foreground text-center">
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
