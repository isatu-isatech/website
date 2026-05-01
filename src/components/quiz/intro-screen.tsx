"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { archetypeIcons } from "@/lib/quiz-data";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center px-4 py-4 text-center md:py-6"
    >
      {/* Floating 4H images */}
      <div className="relative mb-4 md:mb-6">
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center gap-3 md:gap-6"
        >
          {(["Hustler", "Hacker", "Hipster", "Hound"] as const).map(
            (archetype) => (
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
            ),
          )}
        </motion.div>
      </div>

      <h1 className="from-primary via-secondary to-primary mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent md:mb-3 md:text-3xl lg:text-4xl">
        4H Personality Quiz
      </h1>

      <p className="text-muted-foreground mb-4 max-w-xl text-base md:mb-6 md:text-lg">
        Discover your founder archetype!
        <br />
        Are you a <strong className="text-amber-500">Hustler</strong>,{" "}
        <strong className="text-blue-500">Hacker</strong>,{" "}
        <strong className="text-pink-500">Hipster</strong>, or{" "}
        <strong className="text-emerald-500">Hound</strong>?
      </p>

      <Button
        onClick={onStart}
        size="lg"
        className="group from-primary hover:from-primary/90 relative overflow-hidden bg-gradient-to-r to-blue-600 px-6 py-4 text-base text-white shadow-xl transition-all duration-300 hover:to-blue-500 hover:shadow-2xl md:px-8 md:py-5 md:text-lg"
      >
        <Sparkles className="mr-2 size-4 md:size-5" />
        Start the Quiz
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </Button>

      <p className="text-muted-foreground mt-3 text-xs md:text-sm">
        ⏱️ Takes about 3-5 minutes
      </p>
    </motion.div>
  );
}
