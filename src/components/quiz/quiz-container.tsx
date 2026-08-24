"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import {
  questions,
  tieBreakers,
  type ArchetypeKey,
  type Question,
  type Choice,
} from "@/lib/quiz-data";
import {
  deriveResult,
  isFinalResult,
  needsTieBreaker,
  sortScores,
  loadProgress,
  saveProgress,
  clearProgress,
  makeProgressVersion,
  buildShareUrl,
  type Scores,
} from "@/lib/quiz";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { COLORS } from "@/lib/constants/design-tokens";
import { useQuizLeaveGuard } from "@/lib/hooks";
import { IntroScreen } from "./intro-screen";
import { QuestionScreen } from "./question-screen";
import { ResultScreen } from "./result-screen";
import { LeaveQuizDialog } from "./leave-quiz-dialog";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface QuizState {
  phase: "intro" | "quiz" | "tiebreaker" | "result";
  currentQuestionIndex: number;
  scores: Scores;
  shuffledQuestions: Question[];
  shuffledTieBreakers: Question[];
  usedTieBreakers: number;
  answers: Choice[];
  /** Shuffle permutations — kept so session persistence round-trips exactly. */
  questionOrder: number[];
  tieBreakerOrder: number[];
  choiceOrders: number[][];
  tieChoiceOrders: number[][];
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
    questionOrder: [],
    tieBreakerOrder: [],
    choiceOrders: [],
    tieChoiceOrders: [],
  }));

  // Whether the mount-time restore has been applied (guards the save effect).
  const [restored, setRestored] = useState(false);
  // Set once the visitor confirms leaving: the save effect stops writing so
  // a blocked/failed navigation cannot resurrect the cleared record.
  const leavingRef = useRef(false);
  // Double-click lock during the question-exit transition. A ref (not
  // state): no re-render churn and the exiting screen's frozen handlers stay
  // blocked while the new question remains immediately interactive.
  const answerLockRef = useRef(false);

  const startQuiz = useCallback(() => {
    const questionOrder = shuffleArray(questions.map((_, i) => i));
    const choiceOrders: number[][] = [];
    const shuffledQ = questionOrder.map((i) => {
      const order = shuffleArray(questions[i].choices.map((_, j) => j));
      choiceOrders.push(order);
      return {
        ...questions[i],
        choices: order.map((j) => questions[i].choices[j]),
      };
    });

    const tieBreakerOrder = shuffleArray(tieBreakers.map((_, i) => i));
    const tieChoiceOrders: number[][] = [];
    const shuffledTB = tieBreakerOrder.map((i) => {
      const order = shuffleArray(tieBreakers[i].choices.map((_, j) => j));
      tieChoiceOrders.push(order);
      return {
        ...tieBreakers[i],
        choices: order.map((j) => tieBreakers[i].choices[j]),
      };
    });

    setState({
      phase: "quiz",
      currentQuestionIndex: 0,
      scores: { Hustler: 0, Hacker: 0, Hipster: 0, Hound: 0 },
      shuffledQuestions: shuffledQ,
      shuffledTieBreakers: shuffledTB,
      usedTieBreakers: 0,
      answers: [],
      questionOrder,
      tieBreakerOrder,
      choiceOrders,
      tieChoiceOrders,
    });
  }, []);

  const currentQuestion = useMemo(() => {
    if (state.phase === "quiz") {
      return state.shuffledQuestions[state.currentQuestionIndex];
    } else if (state.phase === "tiebreaker") {
      return state.shuffledTieBreakers[state.usedTieBreakers];
    }
    return null;
  }, [state]);

  // Derived highlight for the current question (supports Undo/back without
  // an effect-driven setState).
  const selectedChoice = useMemo(() => {
    if (!currentQuestion) return null;
    const previousAnswer = state.answers[state.currentQuestionIndex];
    if (!previousAnswer) return null;
    const index = currentQuestion.choices.findIndex(
      (c) => c.choice === previousAnswer.choice,
    );
    return index !== -1 ? index : null;
  }, [currentQuestion, state.answers, state.currentQuestionIndex]);

  // Session persistence (FR-008): restore an in-progress quiz on mount so a
  // refresh or back/forward resumes at the same question with answers intact.
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      // Mount-time hydration from sessionStorage is a legitimate external
      // system sync; lazy state init would break SSR hydration of the intro.
      // oxlint-disable-next-line react/set-state-in-effect
      setState({
        phase: saved.phase,
        currentQuestionIndex: saved.currentQuestionIndex,
        scores: saved.scores,
        shuffledQuestions: saved.questionOrder.map((i) => ({
          ...questions[i],
          choices: saved.choiceOrders[i].map((j) => questions[i].choices[j]),
        })),
        shuffledTieBreakers: saved.tieBreakerOrder.map((i) => ({
          ...tieBreakers[i],
          choices: saved.tieChoiceOrders[i].map(
            (j) => tieBreakers[i].choices[j],
          ),
        })),
        usedTieBreakers: saved.usedTieBreakers,
        answers: saved.answers,
        questionOrder: saved.questionOrder,
        tieBreakerOrder: saved.tieBreakerOrder,
        choiceOrders: saved.choiceOrders,
        tieChoiceOrders: saved.tieChoiceOrders,
      });
    }
    setRestored(true);
  }, []);

  // Save after every committed transition; clear on result / retake / intro.
  useEffect(() => {
    if (!restored || leavingRef.current) return;
    if (state.phase === "quiz" || state.phase === "tiebreaker") {
      saveProgress({
        version: makeProgressVersion(),
        phase: state.phase,
        currentQuestionIndex: state.currentQuestionIndex,
        usedTieBreakers: state.usedTieBreakers,
        scores: state.scores,
        answers: state.answers,
        questionOrder: state.questionOrder,
        tieBreakerOrder: state.tieBreakerOrder,
        choiceOrders: state.choiceOrders,
        tieChoiceOrders: state.tieChoiceOrders,
      });
    } else {
      clearProgress();
    }
  }, [state, restored]);

  const result = useMemo(
    () =>
      deriveResult(
        state.scores,
        state.usedTieBreakers,
        state.shuffledTieBreakers.length,
      ),
    [state.scores, state.usedTieBreakers, state.shuffledTieBreakers.length],
  );

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (!currentQuestion || answerLockRef.current) return;

      const choice = currentQuestion.choices[choiceIndex];
      const newScores = { ...state.scores };

      for (const [key, value] of Object.entries(choice.weight)) {
        newScores[key as ArchetypeKey] += value;
      }

      // Lock against double-clicks during the exit transition; the lock
      // releases after the transition, so there is no artificial delay
      // (FR-003) and no state-driven re-renders.
      answerLockRef.current = true;

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
            const sortedScores = sortScores(newScores);
            if (
              needsTieBreaker(
                sortedScores,
                prev.usedTieBreakers,
                prev.shuffledTieBreakers.length,
              )
            ) {
              return { ...newState, phase: "tiebreaker" };
            }
            return { ...newState, phase: "result" };
          }
        } else if (prev.phase === "tiebreaker") {
          const sortedScores = sortScores(newScores);
          if (
            needsTieBreaker(
              sortedScores,
              prev.usedTieBreakers + 1,
              prev.shuffledTieBreakers.length,
            )
          ) {
            return { ...newState, usedTieBreakers: prev.usedTieBreakers + 1 };
          }
          return { ...newState, phase: "result" };
        }

        return newState;
      });
      // Release the double-click lock once the exit transition has passed.
      window.setTimeout(() => {
        answerLockRef.current = false;
      }, 450);
    },
    [currentQuestion, state.scores],
  );

  const handleBack = useCallback(() => {
    setState((prev) => {
      if (prev.answers.length === 0) return prev;

      let newPhase = prev.phase;
      let newIndex = prev.currentQuestionIndex;
      let newUsedTieBreakers = prev.usedTieBreakers;

      if (prev.phase === "tiebreaker") {
        if (prev.usedTieBreakers > 0) {
          newUsedTieBreakers--;
        } else {
          newPhase = "quiz";
          newIndex = prev.shuffledQuestions.length - 1;
        }
      } else if (prev.phase === "quiz") {
        if (newIndex > 0) {
          newIndex--;
        }
      }

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
        phase: newPhase,
        currentQuestionIndex: newIndex,
        usedTieBreakers: newUsedTieBreakers,
      };
    });
    // Undo re-arms the answered question; clear any pending answer lock so
    // the visitor can immediately answer again.
    answerLockRef.current = false;
  }, []);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (state.phase === "result" && result && !result.needsTieBreaker) {
      if (reduceMotion) return; // confetti storm off under reduced motion
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [
            COLORS.primary.DEFAULT,
            COLORS.secondary.DEFAULT,
            COLORS.quiz.archetypes.Hipster.from,
            COLORS.quiz.archetypes.Hound.from,
          ],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [
            COLORS.primary.DEFAULT,
            COLORS.secondary.DEFAULT,
            COLORS.quiz.archetypes.Hipster.from,
            COLORS.quiz.archetypes.Hound.from,
          ],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [state.phase, result, reduceMotion]);

  const progress = useMemo(() => {
    if (state.phase === "quiz") {
      return (
        ((state.currentQuestionIndex + 1) / state.shuffledQuestions.length) *
        100
      );
    } else if (state.phase === "tiebreaker") {
      return (
        ((state.usedTieBreakers + 1) /
          (state.shuffledQuestions.length + state.shuffledTieBreakers.length)) *
        100
      );
    }
    return 0;
  }, [state]);

  const resetQuiz = useCallback(() => {
    // A fresh attempt re-enables progress persistence (it was suppressed if
    // the visitor confirmed leaving earlier).
    leavingRef.current = false;
    setState({
      phase: "intro",
      currentQuestionIndex: 0,
      scores: { Hustler: 0, Hacker: 0, Hipster: 0, Hound: 0 },
      shuffledQuestions: [],
      shuffledTieBreakers: [],
      usedTieBreakers: 0,
      answers: [],
      questionOrder: [],
      tieBreakerOrder: [],
      choiceOrders: [],
      tieChoiceOrders: [],
    });
  }, []);

  const shareResult = useCallback(() => {
    if (isFinalResult(result)) {
      const text = `I just took the 4H Personality Quiz and I'm a ${result.role}! 🎉\n\nDiscover your founder archetype at`;
      // Byte-identical with the result page metadata and the OG banner URL (FR-014).
      const url = buildShareUrl(
        {
          role: result.role,
          archetype: result.primaryArchetype,
          isGeneralist: result.isGeneralist,
        },
        window.location.origin,
      ).toString();

      if (navigator.share) {
        navigator.share({ title: "4H Personality Quiz", text, url });
      } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        toast("Result copied to clipboard!");
      }
    }
  }, [result]);

  // Leave guard: confirm before leaving a quiz in progress (browser back,
  // the header "Back to Home" links, or any other navigation trigger).
  // Continue discards the stored progress and navigates; Cancel stays on the
  // quiz so the visitor resumes where they left off.
  const quizInProgress = state.phase === "quiz" || state.phase === "tiebreaker";
  const { open, continueLeave, cancelLeave } = useQuizLeaveGuard(
    quizInProgress,
    resetQuiz,
  );

  // Once the visitor confirms leaving, stop persisting progress for this
  // component instance — a blocked navigation must not resurrect the record
  // the modal promised to erase.
  const handleContinueLeave = useCallback(() => {
    leavingRef.current = true;
    continueLeave();
  }, [continueLeave]);

  return (
    <div className="relative mx-auto my-auto flex w-full max-w-4xl flex-col justify-center">
      <AnimatePresence mode="wait">
        {state.phase === "intro" && (
          <IntroScreen key="intro" onStart={startQuiz} />
        )}

        {(state.phase === "quiz" || state.phase === "tiebreaker") &&
          currentQuestion && (
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
                  : state.shuffledQuestions.length +
                    state.shuffledTieBreakers.length
              }
              isTieBreaker={state.phase === "tiebreaker"}
              onBack={handleBack}
              canGoBack={
                state.phase === "tiebreaker" || state.currentQuestionIndex > 0
              }
            />
          )}

        {state.phase === "result" && isFinalResult(result) && (
          <ResultScreen
            key="result"
            result={result}
            onReset={resetQuiz}
            onShare={shareResult}
          />
        )}
      </AnimatePresence>

      <LeaveQuizDialog
        open={open}
        onContinue={handleContinueLeave}
        onCancel={cancelLeave}
      />
    </div>
  );
}
