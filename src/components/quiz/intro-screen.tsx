"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { archetypeIcons, questions, ARCHETYPE_KEYS } from "@/lib/quiz";
import { COLORS } from "@/lib/constants/design-tokens";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center px-4 py-4 text-center md:py-6"
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
        className="group from-primary hover:from-primary/90 relative overflow-hidden bg-linear-to-r to-blue-600 px-6 py-4 text-base text-white shadow-xl transition-all duration-300 hover:to-blue-500 hover:shadow-2xl active:scale-[0.98] md:px-8 md:py-5 md:text-lg"
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
    </motion.div>
  );
}
