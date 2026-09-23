"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { useMountedReducedMotion } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ClipboardList, Sparkles } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants/site";

/**
 * Entry gate for the membership application (quiz `IntroScreen` parity).
 *
 * The wizard starts here — never directly on step 1 — so the visitor
 * explicitly opts into the form. Closed/error states bypass this screen
 * (the section renders those instead). Exit mirrors the quiz intro
 * (`opacity` / `y: -20`) so the `AnimatePresence` handoff into the form
 * feels identical.
 */
export const ApplyIntroScreen = memo(function ApplyIntroScreen({
  academicYear,
  onStart,
}: {
  academicYear: string;
  onStart: () => void;
}) {
  const reduceMotion = useMountedReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={reduceMotion ? { duration: 0 } : undefined}
      // Margin-auto centers within the section's flex column (safe
      // centering: top stays reachable if it ever overflows). Portrait top
      // padding mirrors the quiz stack (page py-6 + container pt-2 = 2rem
      // base, 3rem at md) on top of the section's svh nudge.
      className="m-auto flex w-full max-w-2xl flex-col items-center justify-center p-4 text-center md:py-6 portrait:mt-0 portrait:mb-auto portrait:pt-[3rem] md:portrait:pt-[4.5rem]"
    >
      <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full md:mb-6 md:h-20 md:w-20">
        <ClipboardList
          className="text-primary h-8 w-8 md:h-10 md:w-10"
          aria-hidden
        />
      </div>

      <p className="border-secondary/50 bg-secondary/10 text-secondary-dark dark:text-secondary mb-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium md:mb-3 md:text-sm">
        {academicYear} · Applications open
      </p>

      <h1 className="from-primary via-secondary to-primary mb-2 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent md:mb-3 md:text-3xl lg:text-4xl">
        Membership Application
      </h1>

      <p className="text-muted-foreground mb-4 max-w-xl text-base md:mb-6 md:text-lg">
        Join a vibrant community of student innovators and technopreneurs.
      </p>

      <Button
        type="button"
        onClick={onStart}
        size="lg"
        className="group from-primary hover:from-primary/90 to-secondary hover:to-secondary/90 relative overflow-hidden bg-linear-to-r px-6 py-4 text-base text-white shadow-xl transition-all duration-300 hover:shadow-2xl active:scale-[0.98] md:px-8 md:py-5 md:text-lg"
      >
        <Sparkles className="mr-2 size-4 md:size-5" />
        Start the Application
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </Button>

      <p className="text-muted-foreground mt-3 text-xs md:text-sm">
        Need help? Reach us at{" "}
        <a
          href={`mailto:${SOCIAL_LINKS.email}`}
          className="text-primary underline"
        >
          {SOCIAL_LINKS.email}
        </a>
        .
      </p>
    </motion.div>
  );
});
