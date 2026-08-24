"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share2, RotateCcw } from "lucide-react";
import { archetypeIcons, type ArchetypeKey } from "@/lib/quiz-data";
import { COLORS } from "@/lib/constants/design-tokens";
import type { FinalResult } from "@/lib/quiz";

export function ResultScreen({
  result,
  onReset,
  onShare,
}: {
  result: FinalResult;
  onReset: () => void;
  onShare: () => void;
}) {
  const reduceMotion = useReducedMotion();

  // Generalist renders in the brand gold pair (from design tokens);
  // archetypes use their canonical gradient classes (COLORS.quiz.archetypes).
  const secondaryColor = result.isGeneralist
    ? undefined
    : COLORS.quiz.archetypes[result.primaryArchetype].gradient;
  const generalistGradient = result.isGeneralist
    ? `linear-gradient(135deg, ${COLORS.quiz.generalist.from}, ${COLORS.quiz.generalist.to})`
    : undefined;

  const primaryImage = result.isGeneralist
    ? "/assets/decorations/4h-vertical.png"
    : archetypeIcons[result.primaryArchetype];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full px-4 py-3 text-center md:py-4"
    >
      {/* Result badge */}
      <motion.div
        initial={reduceMotion ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={reduceMotion ? undefined : { type: "spring", delay: 0.2 }}
        className={`mb-2.5 inline-flex h-16 w-16 flex-col items-center justify-center rounded-full bg-linear-to-br md:mb-3 md:h-20 md:w-20 ${secondaryColor ?? ""} p-1.5 shadow-2xl md:p-2`}
        style={
          generalistGradient
            ? { backgroundImage: generalistGradient }
            : undefined
        }
      >
        <div className="relative h-full w-full">
          <Image
            src={primaryImage}
            alt={result.role}
            fill
            className="object-contain"
          />
        </div>
      </motion.div>

      <motion.div
        aria-live="polite"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-muted-foreground mb-0.5 text-xs">You are a...</p>
        <h2
          className={`mb-1.5 bg-linear-to-r text-lg font-bold md:mb-2 md:text-xl lg:text-2xl ${secondaryColor ?? ""} bg-clip-text text-transparent`}
          style={
            generalistGradient
              ? { backgroundImage: generalistGradient }
              : undefined
          }
        >
          {result.role}
        </h2>
      </motion.div>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground mx-auto mb-2 max-w-md text-xs md:mb-3 md:text-sm"
      >
        {result.description}
      </motion.p>

      {/* Score breakdown — bordered divider rows instead of a card */}
      {!result.isGeneralist && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mb-3 max-w-md md:mb-4"
        >
          <h3 className="mb-1 text-sm font-bold md:mb-1.5 md:text-base">
            Your Archetype Breakdown
          </h3>
          <div className="divide-border divide-y">
            {(Object.entries(result.breakdown) as [ArchetypeKey, number][])
              .toSorted(([, a], [, b]) => b - a)
              .map(([archetype, percentage]) => (
                <div
                  key={archetype}
                  className="flex items-center gap-2 py-1 first:pt-0.5 last:pb-0.5 md:py-1.5"
                >
                  <div className="relative h-4 w-4 shrink-0 md:h-5 md:w-5">
                    <Image
                      src={archetypeIcons[archetype as ArchetypeKey]}
                      alt={archetype}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex justify-between text-xs md:text-sm">
                      <span className="font-medium">{archetype}</span>
                      <span className="text-muted-foreground">
                        {percentage}%
                      </span>
                    </div>
                    <div className="bg-muted h-1 overflow-hidden rounded-full">
                      <motion.div
                        initial={reduceMotion ? false : { width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className={`h-full rounded-full bg-linear-to-r ${
                          COLORS.quiz.archetypes[archetype as ArchetypeKey]
                            .gradient
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-row justify-center gap-3"
      >
        <Button
          type="button"
          onClick={onShare}
          variant="secondary"
          size="sm"
          className="gap-2"
        >
          <Share2 className="size-4" />
          Share
        </Button>
        <Button
          type="button"
          onClick={onReset}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          Retake
        </Button>
      </motion.div>

      {/* Funnel hand-off — the quiz peak leads into membership (FR-014) */}
      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-2 text-center"
      >
        <Link
          href="/membership"
          className="text-muted-foreground hover:text-primary text-sm underline-offset-4 transition-colors hover:underline"
        >
          Your {result.primaryArchetype} energy belongs at ISATech — join us →
        </Link>
      </motion.p>
    </motion.div>
  );
}
