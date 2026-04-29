"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Share2, RotateCcw } from "lucide-react";
import {
  archetypeGradients,
  archetypeIcons,
  type ArchetypeKey,
} from "@/lib/quiz-data";
import type { FinalResult } from "./types";

export function ResultScreen({
  result,
  onReset,
  onShare,
}: {
  result: FinalResult;
  onReset: () => void;
  onShare: () => void;
}) {
  const primaryColor = result.isGeneralist
    ? "from-violet-500 to-purple-600"
    : archetypeGradients[result.primaryArchetype];

  const primaryImage = result.isGeneralist
    ? "/assets/decorations/4h-vertical.png"
    : archetypeIcons[result.primaryArchetype];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full px-4 py-4 text-center md:py-6"
    >
      {/* Result badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className={`mb-4 inline-flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br md:mb-6 md:h-32 md:w-32 ${primaryColor} p-3 shadow-2xl md:p-4`}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-muted-foreground mb-1 text-sm md:text-base">
          You are a...
        </p>
        <h2
          className={`mb-2 bg-gradient-to-r text-2xl font-bold md:mb-3 md:text-3xl lg:text-4xl ${primaryColor} bg-clip-text text-transparent`}
        >
          {result.role}
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-muted-foreground mx-auto mb-4 max-w-xl text-sm md:mb-6 md:text-base"
      >
        {result.description}
      </motion.p>

      {/* Score breakdown */}
      {!result.isGeneralist && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card mx-auto mb-4 max-w-md rounded-xl border p-3 shadow-lg md:mb-6 md:rounded-2xl md:p-4"
        >
          <h3 className="mb-2 text-sm font-bold md:mb-3 md:text-base">
            Your Archetype Breakdown
          </h3>
          <div className="space-y-2">
            {(Object.entries(result.breakdown) as [ArchetypeKey, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([archetype, percentage]) => (
                <div key={archetype} className="flex items-center gap-2">
                  <div className="relative h-5 w-5 flex-shrink-0 md:h-6 md:w-6">
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
                    <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          archetypeGradients[archetype as ArchetypeKey]
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-row justify-center gap-3"
      >
        <Button
          onClick={onShare}
          variant="secondary"
          size="default"
          className="gap-2"
        >
          <Share2 className="size-4" />
          Share
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          size="default"
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          Retake
        </Button>
      </motion.div>
    </motion.div>
  );
}
