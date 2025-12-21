"use client";

import { TopographyTexture } from "@/components/texture/topography";
import dynamic from "next/dynamic";
import Image from "next/image";

const LanyardComponent = dynamic(() => import("@/components/lanyard"), {
  ssr: false,
});

export default function MembershipPageReasonSection() {
  return (
    <section
      id="reason"
      className="bg-primary relative flex w-full items-center justify-center overflow-hidden px-6 lg:px-16"
    >
      <TopographyTexture
        color="#ececec"
        className="absolute h-full w-full opacity-10"
      />
      <LanyardComponent
        position={[0, 0, 11]}
        className="absolute hidden h-full w-[calc(200%)] -translate-x-1/12 -translate-y-[15%] touch-none md:block md:h-[calc(100%+45%)]"
      />
      <Image
        src="/assets/decorations/idfallback.png"
        alt="ISATech Member ID"
        width={328}
        height={511}
        className="absolute top-0 left-0 h-[calc(100%+30%)] w-auto -translate-x-1/2 -translate-y-1/5 md:hidden"
      />
      <div className="flex w-full max-w-6xl items-center justify-center gap-8 py-20 md:justify-end">
        <div className="bg-accent/50 flex items-center justify-center rounded-3xl px-4 py-12 backdrop-blur-md md:w-1/2 md:px-8 md:py-20">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <h4 className="text-secondary text-center">Why choose ISATech?</h4>
            <p className="body text-center text-black md:text-white">
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
