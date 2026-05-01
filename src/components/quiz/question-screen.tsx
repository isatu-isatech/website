"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Question, Choice } from "@/lib/quiz-data";

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
  isSubmitting,
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
  isSubmitting: boolean;
}) {
  return (
    <div className="relative w-full px-4 py-4 md:py-6">
      {/* Progress bar */}
      <div className="mb-4 md:mb-6">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium md:text-sm">
            {isTieBreaker ? (
              <span className="text-secondary">⚡ Tiebreaker Round</span>
            ) : (
              `Question ${questionNumber} of ${totalQuestions}`
            )}
          </span>
          <span className="text-muted-foreground text-xs font-medium md:text-sm">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="bg-muted h-1.5 overflow-hidden rounded-full md:h-2">
          <motion.div
            className="from-primary to-secondary h-full rounded-full bg-gradient-to-r"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question and Choices */}
      <motion.div
        layout
        initial={{ opacity: 0, x: 0, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative"
      >
        {/* Question */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center text-lg font-bold md:mb-6 md:text-xl lg:text-2xl"
        >
          {question.question}
        </motion.h2>

        {/* Choices */}
        <div className="space-y-2 md:space-y-3">
          {shuffledChoices.map((choice, index) => (
            <motion.button
              key={`${choice.choice}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(index)}
              disabled={isSubmitting}
              className={`w-full rounded-lg border-2 p-3 text-left transition-all duration-300 md:rounded-xl md:p-4 ${
                selectedChoice === index
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : isSubmitting
                    ? "border-muted bg-muted/30 opacity-50"
                    : "border-border hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]"
              } `}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold md:h-8 md:w-8 md:text-sm ${
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
