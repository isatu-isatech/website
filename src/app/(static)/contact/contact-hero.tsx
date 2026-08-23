"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Contact page header — intentionally minimal: just the page title, nothing
 * else. Keeps a focused tone and lets the partner → form → socials → map flow
 * carry the page.
 */
export default function ContactHeroLockup() {
  const reduceMotion = useReducedMotion();

  const content = (
    <h1 className="text-center">
      Contact{" "}
      <span className="text-secondary-dark dark:text-secondary">Us</span>
    </h1>
  );

  if (reduceMotion) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}
