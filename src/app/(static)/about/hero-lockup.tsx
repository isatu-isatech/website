"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * About hero lockup — one semantic <h1>: "About" with a gilded block line
 * "ISATech Society" (the same split-line lockup language as the home hero),
 * plus a supporting intro line from existing site copy.
 *
 * A single, softly curved fade/rise is the page's one authored motion moment;
 * it is disabled entirely under prefers-reduced-motion.
 */
export default function AboutHeroLockup() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-start gap-3"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1>
        About
        <span className="text-secondary-dark dark:text-secondary block">
          ISATech Society
        </span>
      </h1>
      <p className="text-body text-muted-foreground max-w-xl">
        Empowering student founders to achieve their dreams through innovation,
        collaboration, and community.
      </p>
    </motion.div>
  );
}
