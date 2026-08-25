"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealOnViewProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds; cap a list's total delay at ~0.4s. */
  delay?: number;
}

/**
 * The site's one quiet reveal: an opacity + short rise the first time the
 * element enters the viewport, using the shared duration/ease so every page
 * reads with the same rhythm. Use it for lists appearing as lists (sibling
 * stagger via `delay`), not as a blanket section entrance — the single
 * authored moment belongs to the homepage hero. Reduced motion renders the
 * children statically (viewport-driven motion is entirely skipped).
 */
export function RevealOnView({
  children,
  className,
  delay = 0,
}: RevealOnViewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
