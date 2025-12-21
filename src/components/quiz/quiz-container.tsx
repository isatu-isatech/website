"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  questions,
  tieBreakers,
  archetypes,
  adjectives,
  archetypeGradients,
  archetypeIcons,
  SCORE_THRESHOLD,
  type ArchetypeKey,
  type Question,
  type Choice,
} from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Share2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";

// Utility to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type Scores = Record<ArchetypeKey, number>;

interface QuizState {
  phase: "intro" | "quiz" | "tiebreaker" | "result";
  currentQuestionIndex: number;
  scores: Scores;
  shuffledQuestions: Question[];
  shuffledTieBreakers: Question[];
  usedTieBreakers: number;
  answers: Choice[];
}

// Result types
interface TieBreakerResult {
  needsTieBreaker: true;
}

interface FinalResult {
  needsTieBreaker: false;
  role: string;
  description: string;
  primaryArchetype: ArchetypeKey;
  secondaryArchetype: ArchetypeKey | null;
  breakdown: Record<string, number>;
  isGeneralist: boolean;
}

type QuizResult = TieBreakerResult | FinalResult | null;

function isFinalResult(result: QuizResult): result is FinalResult {
  return result !== null && !result.needsTieBreaker;
}

export function QuizContainer() {
  const [state, setState] = useState<QuizState>(() => ({
    phase: "intro",
    currentQuestionIndex: 0,
    scores: { Hustler: 0, Hacker: 0, Hipster: 0, Hound: 0 },
    shuffledQuestions: [],
    shuffledTieBreakers: [],
    usedTieBreakers: 0,
    answers: [],
  }));

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize shuffled questions when starting quiz
  const startQuiz = useCallback(() => {
    const shuffledQ = shuffleArray(questions).map((q) => ({
      ...q,
      choices: shuffleArray(q.choices),
    }));
    const shuffledTB = shuffleArray(tieBreakers).map((q) => ({
      ...q,
      choices: shuffleArray(q.choices),
    }));
    setState({
      phase: "quiz",
      currentQuestionIndex: 0,
      scores: { Hustler: 0, Hacker: 0, Hipster: 0, Hound: 0 },
      shuffledQuestions: shuffledQ,
      shuffledTieBreakers: shuffledTB,
      usedTieBreakers: 0,
      answers: [],
    });
  }, []);

  // Get current question based on phase
  const currentQuestion = useMemo(() => {
    if (state.phase === "quiz") {
      return state.shuffledQuestions[state.currentQuestionIndex];
    } else if (state.phase === "tiebreaker") {
      return state.shuffledTieBreakers[state.usedTieBreakers];
    }
    return null;
  }, [state]);

  // Restore selection when question changes
  useEffect(() => {
    if (currentQuestion) {
      setIsSubmitting(false);

      // Check if we have a previous answer for this question
      const previousAnswer = state.answers[state.currentQuestionIndex];
      if (previousAnswer) {
        // Find index of the previous answer in the STABLE choices
        const index = currentQuestion.choices.findIndex(
          (c) => c.choice === previousAnswer.choice
        );
        if (index !== -1) {
          setSelectedChoice(index);
        } else {
          setSelectedChoice(null);
        }
      } else {
        setSelectedChoice(null);
      }
    }
  }, [currentQuestion, state.answers, state.currentQuestionIndex]);

  // Calculate result
  const result = useMemo((): QuizResult => {
    const { scores } = state;
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    const sortedScores = Object.entries(scores).sort(
      ([, a], [, b]) => b - a
    ) as [ArchetypeKey, number][];

    const [top1, top2, top3, top4] = sortedScores;

    // Check for ties that need resolution
    const needsTieBreaker =
      top1[1] === top2[1] || (top2[1] === top3[1] && top1[1] - top2[1] < SCORE_THRESHOLD);

    if (needsTieBreaker && state.usedTieBreakers < state.shuffledTieBreakers.length) {
      return { needsTieBreaker: true };
    }

    // Check for generalist (all scores equal)
    const isGeneralist =
      top1[1] === top2[1] && top2[1] === top3[1] && top3[1] === top4[1];

    let role: string;
    const primaryArchetype: ArchetypeKey = top1[0];
    let secondaryArchetype: ArchetypeKey | null = null;

    if (isGeneralist) {
      role = "Generalist";
    } else if (top1[1] - top2[1] < SCORE_THRESHOLD) {
      role = `${adjectives[top2[0]]} ${top1[0]}`;
      secondaryArchetype = top2[0];
    } else {
      role = `True ${top1[0]}`;
    }

    const breakdown: Record<string, number> = {};
    for (const [key, value] of sortedScores) {
      breakdown[key] = Math.round((value / total) * 100);
    }

    return {
      needsTieBreaker: false,
      role,
      description: archetypes[role] || archetypes["Generalist"],
      primaryArchetype,
      secondaryArchetype,
      breakdown,
      isGeneralist,
    };
  }, [state]);

  // Handle answer selection
  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (!currentQuestion) return;

      setIsSubmitting(true);
      setSelectedChoice(choiceIndex);

      const choice = currentQuestion.choices[choiceIndex];
      const newScores = { ...state.scores };

      for (const [key, value] of Object.entries(choice.weight)) {
        newScores[key as ArchetypeKey] += value;
      }

      // Auto-advance after a short delay
      setTimeout(() => {
        setState((prev) => {
          const newState = {
            ...prev,
            scores: newScores,
            answers: [
              ...prev.answers.slice(0, prev.currentQuestionIndex),
              choice,
            ],
          };

          if (prev.phase === "quiz") {
            if (prev.currentQuestionIndex < prev.shuffledQuestions.length - 1) {
              return {
                ...newState,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
              };
            } else {
              // Check if we need tiebreaker
              const sortedScores = Object.entries(newScores).sort(
                ([, a], [, b]) => b - a
              ) as [ArchetypeKey, number][];
              const [top1, top2, top3] = sortedScores;
              const needsTie =
                top1[1] === top2[1] || (top2 && top2[1] === top3[1]);

              if (needsTie && prev.shuffledTieBreakers.length > 0) {
                return { ...newState, phase: "tiebreaker" };
              }
              return { ...newState, phase: "result" };
            }
          } else if (prev.phase === "tiebreaker") {
            // Check if still needs tiebreaker
            const sortedScores = Object.entries(newScores).sort(
              ([, a], [, b]) => b - a
            ) as [ArchetypeKey, number][];
            const [top1, top2, top3] = sortedScores;
            const stillNeedsTie =
              top1[1] === top2[1] || (top2 && top2[1] === top3[1]);

            if (
              stillNeedsTie &&
              prev.usedTieBreakers + 1 < prev.shuffledTieBreakers.length
            ) {
              return { ...newState, usedTieBreakers: prev.usedTieBreakers + 1 };
            }
            return { ...newState, phase: "result" };
          }

          return newState;
        });
      }, 600);
    },
    [selectedChoice, currentQuestion, state.scores]
  );

  // Handle going back
  const handleBack = useCallback(() => {
    setState((prev) => {
      if (prev.answers.length === 0) return prev;

      // Logic to determine where we are going back TO
      let newPhase = prev.phase;
      let newIndex = prev.currentQuestionIndex;
      let newUsedTieBreakers = prev.usedTieBreakers;

      if (prev.phase === "tiebreaker") {
        if (prev.usedTieBreakers > 0) {
          newUsedTieBreakers--;
        } else {
          // Go back to the last question of the main quiz
          newPhase = "quiz";
          newIndex = prev.shuffledQuestions.length - 1;
        }
      } else if (prev.phase === "quiz") {
        if (newIndex > 0) {
          newIndex--;
        }
      }

      // Calculate new scores by reverting the answer of the target question
      const answerToUndo = prev.answers[newIndex];
      const revertedScores = { ...prev.scores };

      if (answerToUndo) {
        for (const [key, value] of Object.entries(answerToUndo.weight)) {
          revertedScores[key as ArchetypeKey] -= value;
        }
      }

      return {
        ...prev,
        scores: revertedScores,
        // Keep answers in history so we can highlight them
        phase: newPhase,
        currentQuestionIndex: newIndex,
        usedTieBreakers: newUsedTieBreakers,
      };
    });
    // Don't reset selectedChoice here, let useEffect handle it based on history
  }, []);

  // Trigger confetti on result
  useEffect(() => {
    if (state.phase === "result" && result && !result.needsTieBreaker) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#203c90", "#ffac02", "#EC4899", "#10B981"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#203c90", "#ffac02", "#EC4899", "#10B981"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [state.phase, result]);

  const progress = useMemo(() => {
    if (state.phase === "quiz") {
      return ((state.currentQuestionIndex + 1) / state.shuffledQuestions.length) * 100;
    } else if (state.phase === "tiebreaker") {
      return 100;
    }
    return 0;
  }, [state]);

  const resetQuiz = useCallback(() => {
    setState({
      phase: "intro",
      currentQuestionIndex: 0,
      scores: { Hustler: 0, Hacker: 0, Hipster: 0, Hound: 0 },
      shuffledQuestions: [],
      shuffledTieBreakers: [],
      usedTieBreakers: 0,
      answers: [],
    });
  }, []);

  const shareResult = useCallback(() => {
    if (isFinalResult(result)) {
      const text = `I just took the 4H Personality Quiz and I'm a ${result.role}! 🎉\n\nDiscover your founder archetype at`;
      // Generate shareable URL with result parameters for dynamic OG image
      const shareUrl = new URL("/quiz/result", window.location.origin);
      shareUrl.searchParams.set("role", result.role);
      shareUrl.searchParams.set("archetype", result.primaryArchetype);
      if (result.isGeneralist) {
        shareUrl.searchParams.set("generalist", "true");
      }
      const url = shareUrl.toString();
      
      if (navigator.share) {
        navigator.share({ title: "4H Personality Quiz", text, url });
      } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert("Result copied to clipboard!");
      }
    }
  }, [result]);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-full flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {/* Intro Phase */}
        {state.phase === "intro" && (
          <IntroScreen key="intro" onStart={startQuiz} />
        )}

        {/* Quiz & Tiebreaker Phase */}
        {(state.phase === "quiz" || state.phase === "tiebreaker") && currentQuestion && (
          <QuestionScreen
            key={`question-${state.currentQuestionIndex}-${state.phase}`}
            question={currentQuestion}
            shuffledChoices={currentQuestion.choices}
            selectedChoice={selectedChoice}
            onSelect={handleAnswer}
            progress={progress}
            questionNumber={
              state.phase === "quiz"
                ? state.currentQuestionIndex + 1
                : state.shuffledQuestions.length + state.usedTieBreakers + 1
            }
            totalQuestions={
              state.phase === "quiz"
                ? state.shuffledQuestions.length
                : state.shuffledQuestions.length + 1
            }
            isTieBreaker={state.phase === "tiebreaker"}
            onBack={handleBack}
            canGoBack={
              state.phase === "tiebreaker" || state.currentQuestionIndex > 0
            }
            isSubmitting={isSubmitting}
          />
        )}

        {/* Result Phase */}
        {state.phase === "result" && isFinalResult(result) && (
          <ResultScreen
            key="result"
            result={result}
            onReset={resetQuiz}
            onShare={shareResult}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ====================
// Sub-components
// ====================

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center px-4 py-4 md:py-6"
    >
      {/* Floating 4H images */}
      <div className="relative mb-4 md:mb-6">
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center gap-3 md:gap-6"
        >
          {(['Hustler', 'Hacker', 'Hipster', 'Hound'] as const).map((archetype) => (
            <div key={archetype} className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
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

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
        4H Personality Quiz
      </h1>
      
      <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-4 md:mb-6">
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
        className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white px-6 py-4 md:px-8 md:py-5 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
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

      <p className="mt-3 text-xs md:text-sm text-muted-foreground">
        ⏱️ Takes about 3-5 minutes
      </p>
    </motion.div>
  );
}

function QuestionScreen({
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
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-4 md:py-6 w-full relative"
    >
      {/* Progress bar */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs md:text-sm font-medium text-muted-foreground">
            {isTieBreaker ? (
              <span className="text-secondary">⚡ Tiebreaker Round</span>
            ) : (
              `Question ${questionNumber} of ${totalQuestions}`
            )}
          </span>
          <span className="text-xs md:text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg md:text-xl lg:text-2xl font-bold text-center mb-4 md:mb-6"
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
            className={`
              w-full p-3 md:p-4 text-left rounded-lg md:rounded-xl border-2 transition-all duration-300
              ${
                selectedChoice === index
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : isSubmitting
                  ? "border-muted bg-muted/30 opacity-50"
                  : "border-border hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]"
              }
            `}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div
                className={`
                  w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0
                  ${
                    selectedChoice === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="font-medium text-sm md:text-base">{choice.choice}</span>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Undo Button */}
      {canGoBack && (
        <div className="mt-4 md:mt-6 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Undo Previous Answer
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function ResultScreen({
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
      className="px-4 py-4 md:py-6 text-center w-full"
    >
      {/* Result badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className={`
          inline-flex flex-col items-center justify-center
          w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 md:mb-6
          bg-gradient-to-br ${primaryColor}
          shadow-2xl p-3 md:p-4
        `}
      >
        <div className="relative w-full h-full">
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
        <p className="text-muted-foreground text-sm md:text-base mb-1">You are a...</p>
        <h2
          className={`
          text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3
          bg-gradient-to-r ${primaryColor} bg-clip-text text-transparent
        `}
        >
          {result.role}
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-4 md:mb-6"
      >
        {result.description}
      </motion.p>

      {/* Score breakdown */}
      {!result.isGeneralist && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-4 md:mb-6 p-3 md:p-4 bg-card rounded-xl md:rounded-2xl border shadow-lg max-w-md mx-auto"
        >
          <h3 className="font-bold mb-2 md:mb-3 text-sm md:text-base">Your Archetype Breakdown</h3>
          <div className="space-y-2">
            {(Object.entries(result.breakdown) as [ArchetypeKey, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([archetype, percentage]) => (
                <div key={archetype} className="flex items-center gap-2">
                  <div className="relative w-5 h-5 md:w-6 md:h-6 flex-shrink-0">
                    <Image
                      src={archetypeIcons[archetype as ArchetypeKey]}
                      alt={archetype}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs md:text-sm mb-0.5">
                      <span className="font-medium">{archetype}</span>
                      <span className="text-muted-foreground">{percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
        className="flex flex-row gap-3 justify-center"
      >
        <Button onClick={onShare} variant="secondary" size="default" className="gap-2">
          <Share2 className="size-4" />
          Share
        </Button>
        <Button onClick={onReset} variant="outline" size="default" className="gap-2">
          <RotateCcw className="size-4" />
          Retake
        </Button>
      </motion.div>
    </motion.div>
  );
}
