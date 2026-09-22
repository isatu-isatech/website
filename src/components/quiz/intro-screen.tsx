"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { useMountedReducedMotion } from "@/lib/hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { archetypeIcons, questions, ARCHETYPE_KEYS } from "@/lib/quiz";
import { COLORS } from "@/lib/constants/design-tokens";

export const IntroScreen = memo(function IntroScreen({
  onStart,
}: {
  onStart: () => void;
}) {
  const reduceMotion = useMountedReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={reduceMotion ? { duration: 0 } : undefined}
      // Portrait arrival claims viewport height and centers within itself;
      // lg portrait collapses back to top-anchored like every other phase.
      className="flex flex-col items-center justify-center p-4 text-center md:py-6 portrait:min-h-[60svh] lg:portrait:min-h-0"
    >
      {/* Floating 4H images */}
      <div className="relative mb-4 md:mb-6">
        <motion.div
          animate={reduceMotion ? undefined : { y: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center gap-3 md:gap-6"
        >
          {ARCHETYPE_KEYS.map((archetype) => (
            <div
              key={archetype}
              className="relative h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
            >
              <Image
                src={archetypeIcons[archetype]}
                alt={archetype}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <h1 className="from-primary via-secondary to-primary mb-2 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent md:mb-3 md:text-3xl lg:text-4xl">
        4H Personality Quiz
      </h1>

      <p className="text-muted-foreground mb-4 max-w-xl text-base md:mb-6 md:text-lg">
        Discover your founder archetype!
        <br />
        Are you a{" "}
        {ARCHETYPE_KEYS.map((archetype, index) => (
          <span key={archetype}>
            {index > 0 && (index === ARCHETYPE_KEYS.length - 1 ? " or " : ", ")}
            <strong className={COLORS.quiz.archetypes[archetype].text}>
              {archetype}
            </strong>
          </span>
        ))}
        ?
      </p>

      <Button
        type="button"
        onClick={onStart}
        size="lg"
        className="group from-primary hover:from-primary/90 to-secondary hover:to-secondary/90 relative overflow-hidden bg-linear-to-r px-6 py-4 text-base text-white shadow-xl transition-all duration-300 hover:shadow-2xl active:scale-[0.98] md:px-8 md:py-5 md:text-lg"
      >
        <Sparkles className="mr-2 size-4 md:size-5" />
        Start the Quiz
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </Button>

      <p className="text-muted-foreground mt-3 text-xs md:text-sm">
        {questions.length} questions · at your own pace{" "}
        {/* TODO(org-copy): org may provide wording for the intro time/count string */}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        New here?{" "}
        <Link href="/about" className="text-primary underline">
          What the 4H roles mean
        </Link>
      </p>
    </motion.div>
  );
});
