"use client";

import { motion } from "motion/react";
import { useMountedReducedMotion } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Question, Choice } from "@/lib/quiz";

export function QuestionScreen({
  question,
  shuffledChoices,
  selectedChoice,
  onSelect,
  progress,
  questionNumber,
  totalQuestions,
  isTieBreaker,
  onBack,
  canGoBack,
}: {
  question: Question;
  shuffledChoices: Choice[];
  selectedChoice: number | null;
  onSelect: (index: number) => void;
  progress: number;
  questionNumber: number;
  totalQuestions: number;
  isTieBreaker: boolean;
  onBack: () => void;
  canGoBack: boolean;
}) {
  const reduceMotion = useMountedReducedMotion();

  return (
    <div className="relative w-full px-4 py-4 md:py-6">
      {/* Progress bar */}
      <div className="mb-4 md:mb-6">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium md:text-sm">
            {isTieBreaker ? (
              <span className="text-secondary">
                <span aria-hidden="true">⚡</span> Tiebreaker Round
              </span>
            ) : (
              `Question ${questionNumber} of ${totalQuestions}`
            )}
          </span>
          <span className="text-muted-foreground text-xs font-medium md:text-sm">
            {Math.round(progress)}%
          </span>
        </div>
        <div
          aria-hidden="true"
          className="bg-muted h-1.5 overflow-hidden rounded-full md:h-2"
        >
          <motion.div
            className="from-primary to-secondary h-full rounded-full bg-linear-to-r"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5 }}
          />
        </div>
        {/* Semantic progress for assistive tech (visual bar is aria-hidden). */}
        <progress
          aria-label="Quiz progress"
          value={Math.round(progress)}
          max={100}
          className="sr-only"
        />
      </div>

      {/* Question and Choices */}
      <motion.div
        layout={reduceMotion ? false : true}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 0, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 0, y: -10 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }
        }
        className="relative"
      >
        {/* Question — lg capped at xl so long questions fit kiosk widths */}
        <motion.h2
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : undefined}
          className="mb-4 text-center text-lg font-bold md:mb-6 md:text-xl lg:text-xl"
        >
          {question.question}
        </motion.h2>

        {/* Choices */}
        <div className="space-y-2 md:space-y-3">
          {shuffledChoices.map((choice, index) => (
            <motion.button
              key={choice.choice}
              type="button"
              aria-pressed={selectedChoice === index}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion ? { duration: 0 } : { delay: index * 0.05 }
              }
              onClick={() => onSelect(index)}
              className={`w-full rounded-lg border-2 p-3 text-left transition-all duration-300 md:rounded-xl md:p-4 ${
                selectedChoice === index
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]"
              } `}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold md:h-8 md:w-8 md:text-sm ${
                    selectedChoice === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } `}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm font-medium md:text-base">
                  {choice.choice}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Undo Button */}
      {canGoBack && (
        <div className="mt-4 flex justify-center md:mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Undo Previous Answer
          </Button>
        </div>
      )}
    </div>
  );
}
