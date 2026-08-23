"use client";

import { ISATechLogoMark } from "@/components/assets/logos";
import { OptimizedImage } from "@/components/common";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

/**
 * Full-bleed description photo band. The group photo fills the whole band —
 * edge to edge, viewport-wide ("the white is full") — and parallaxes with
 * scroll (image drifts ±8% while the band stays put). Under
 * prefers-reduced-motion the photo simply sits cover-filled, no transform.
 */
export default function AboutDescriptionBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  // Sized 120% tall with a 10% top overhang so the ±8% drift never exposes
  // the band edges.
  const photo = (
    <OptimizedImage
      src="/assets/decorations/tradeanovate-grouphoto.jpg"
      alt="Tradeanovate Group Photo"
      width={1695}
      height={706}
      sizes="100vw"
      className="absolute top-[-10%] left-0 h-[120%] w-full object-cover opacity-25"
      priority
    />
  );

  return (
    <div
      ref={bandRef}
      className="bg-foreground relative w-full overflow-hidden"
    >
      {reduceMotion ? (
        photo
      ) : (
        <motion.div className="absolute inset-0" style={{ y }}>
          {photo}
        </motion.div>
      )}
      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-6 py-16 md:px-16 lg:py-32">
        <ISATechLogoMark className="h-24 w-auto" />
        <p className="body text-background max-w-4xl text-center">
          ISATech Society (ISAT U Innovators and Technopreneurs Society) is a
          student-led organization at Iloilo Science and Technology University
          dedicated to nurturing innovation, creativity, and entrepreneurship.
        </p>
      </div>
    </div>
  );
}
