"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import {
  questions,
  tieBreakers,
  deriveResult,
  isFinalResult,
  needsTieBreaker,
  sortScores,
  loadProgress,
  saveProgress,
  clearProgress,
  makeProgressVersion,
  getQuizProgressFraction,
  buildShareUrl,
  type ArchetypeKey,
  type Question,
  type Choice,
  type Scores,
} from "@/lib/quiz";
import { toast } from "sonner";
import { COLORS } from "@/lib/constants/design-tokens";
import { useQuizLeaveGuard } from "@/lib/hooks";
import { IdleCountdown } from "./idle-countdown";
import { IntroScreen } from "./intro-screen";
import { QuestionScreen } from "./question-screen";
import { ResultScreen } from "./result-screen";
import { LeaveQuizDialog } from "./leave-quiz-dialog";

/** Idle reset budgets — 3 min on quiz/tiebreaker, 1 min on result. */
const QUIZ_IDLE_MS = 3 * 60 * 1000;
const RESULT_IDLE_MS = 60 * 1000;
/** Countdown pill appears during the final minute of the budget. */
const WARN_MS = 60 * 1000;
const TICK_MS = 1000;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // i and j are always in-bounds (0 ≤ j ≤ i < length).
    const swap = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = swap;
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
  /** Per-answer index into the shuffled choices (exact highlight restore). */
  answerIndexes: number[];
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
    answerIndexes: [],
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
  const lockTimeoutRef = useRef<number | undefined>(undefined);

  // Clear the answer-lock timer on unmount so the callback cannot fire past
  // the component lifetime.
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current !== undefined) {
        window.clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  const startQuiz = useCallback(() => {
    const questionOrder = shuffleArray(questions.map((_, i) => i));
    // Keyed by original question index so restore (`questionOrder.map((i) =>
    // choiceOrders[i])`) and the `isValidChoiceOrders` validator (which checks
    // `orders[index]` against `set[index]`) agree. Positional pushes broke
    // round-trip for any non-identity shuffle.
    const choiceOrders: number[][] = new Array<number[]>(questions.length);
    const shuffledQ = questionOrder.map((i) => {
      const order = shuffleArray(questions[i]!.choices.map((_, j) => j));
      choiceOrders[i] = order;
      return {
        ...questions[i]!,
        choices: order.map((j) => questions[i]!.choices[j]!),
      };
    });

    const tieBreakerOrder = shuffleArray(tieBreakers.map((_, i) => i));
    const tieChoiceOrders: number[][] = new Array<number[]>(tieBreakers.length);
    const shuffledTB = tieBreakerOrder.map((i) => {
      const order = shuffleArray(tieBreakers[i]!.choices.map((_, j) => j));
      tieChoiceOrders[i] = order;
      return {
        ...tieBreakers[i]!,
        choices: order.map((j) => tieBreakers[i]!.choices[j]!),
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
      answerIndexes: [],
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
  }, [
    state.phase,
    state.shuffledQuestions,
    state.shuffledTieBreakers,
    state.currentQuestionIndex,
    state.usedTieBreakers,
  ]);

  // Derived highlight for the current question (supports Undo/back without
  // an effect-driven setState). Main answers occupy `answers[0..N)` in order;
  // tiebreaker answers append after them, so the tiebreaker slot is
  // `answers[shuffledQuestions.length + usedTieBreakers]`. Indexes are stored
  // at answer time — exact even when two choices share the same text.
  const selectedChoice = useMemo(() => {
    if (!currentQuestion) return null;
    const answerIndex =
      state.phase === "tiebreaker"
        ? state.shuffledQuestions.length + state.usedTieBreakers
        : state.currentQuestionIndex;
    const previousIndex = state.answerIndexes[answerIndex];
    if (previousIndex === undefined) return null;
    return previousIndex < currentQuestion.choices.length
      ? previousIndex
      : null;
  }, [
    currentQuestion,
    state.answerIndexes,
    state.phase,
    state.shuffledQuestions.length,
    state.currentQuestionIndex,
    state.usedTieBreakers,
  ]);

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
          ...questions[i]!,
          choices: saved.choiceOrders[i]!.map((j) => questions[i]!.choices[j]!),
        })),
        shuffledTieBreakers: saved.tieBreakerOrder.map((i) => ({
          ...tieBreakers[i]!,
          choices: saved.tieChoiceOrders[i]!.map(
            (j) => tieBreakers[i]!.choices[j]!,
          ),
        })),
        usedTieBreakers: saved.usedTieBreakers,
        answers: saved.answers,
        answerIndexes: saved.answerIndexes,
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
        answerIndexes: state.answerIndexes,
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
      if (!choice) return; // index always in-bounds; guard for noUncheckedIndexedAccess

      // Lock against double-clicks during the exit transition; the lock
      // releases after the transition, so there is no artificial delay
      // (FR-003) and no state-driven re-renders.
      answerLockRef.current = true;
      lockTimeoutRef.current = window.setTimeout(() => {
        answerLockRef.current = false;
      }, 450);

      setState((prev) => {
        // Accumulate inside the updater from `prev.scores` so rapid
        // successive answers cannot drop a delta via a stale closure.
        const nextScores = { ...prev.scores };
        for (const [key, value] of Object.entries(choice.weight)) {
          nextScores[key as ArchetypeKey] += value;
        }
        // Answers append sequentially: main answers first, then tiebreaker
        // answers. Slicing by `currentQuestionIndex` during tiebreaker used
        // to overwrite the last main answer and lose history.
        const newState = {
          ...prev,
          scores: nextScores,
          answers: [...prev.answers, choice],
          answerIndexes: [...prev.answerIndexes, choiceIndex],
        };

        if (prev.phase === "quiz") {
          if (prev.currentQuestionIndex < prev.shuffledQuestions.length - 1) {
            return {
              ...newState,
              currentQuestionIndex: prev.currentQuestionIndex + 1,
            };
          } else {
            const sortedScores = sortScores(nextScores);
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
          const sortedScores = sortScores(nextScores);
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
    },
    [currentQuestion],
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
        } else {
          return prev;
        }
      }

      // Answers append sequentially, so undo always pops the last entry.
      const answerToUndo = prev.answers[prev.answers.length - 1];
      const revertedScores = { ...prev.scores };

      if (answerToUndo) {
        for (const [key, value] of Object.entries(answerToUndo.weight)) {
          revertedScores[key as ArchetypeKey] -= value;
        }
      }

      return {
        ...prev,
        scores: revertedScores,
        answers: prev.answers.slice(0, -1),
        answerIndexes: prev.answerIndexes.slice(0, -1),
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
      let cancelled = false;
      // Lazy-load celebration code so every quiz visitor doesn't pay for it.
      void import("canvas-confetti").then(({ default: confetti }) => {
        if (cancelled) return;
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          if (cancelled) return;
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
      });
      return () => {
        cancelled = true;
      };
    }
  }, [state.phase, result, reduceMotion]);

  const progress = useMemo(() => {
    return getQuizProgressFraction({
      phase: state.phase,
      currentQuestionIndex: state.currentQuestionIndex,
      usedTieBreakers: state.usedTieBreakers,
      mainLen: state.shuffledQuestions.length,
      tieTotal: state.shuffledTieBreakers.length,
    });
  }, [
    state.phase,
    state.currentQuestionIndex,
    state.shuffledQuestions.length,
    state.shuffledTieBreakers.length,
    state.usedTieBreakers,
  ]);

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
      answerIndexes: [],
      questionOrder: [],
      tieBreakerOrder: [],
      choiceOrders: [],
      tieChoiceOrders: [],
    });
  }, []);

  const shareResult = useCallback(() => {
    if (!isFinalResult(result)) return;
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
      void navigator
        .share({ title: "4H Personality Quiz", text, url })
        .catch(() => {
          // Share abort/dismissal — no toast, nothing lost.
        });
    } else if (
      typeof navigator.clipboard?.writeText === "function" &&
      window.isSecureContext
    ) {
      void navigator.clipboard
        .writeText(`${text} ${url}`)
        .then(() => toast("Result copied to clipboard!"))
        .catch(() =>
          toast.error("Copy failed — long-press the link to copy it manually."),
        );
    } else {
      toast.error("Sharing isn't supported in this browser.");
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

  // Idle reset for kiosk/LED installations: after a per-phase inactivity
  // budget (3 min on quiz/tiebreaker, 1 min on result) return to a clean
  // intro state so the next visitor starts fresh. Intro itself is already
  // clean, so only quiz/tiebreaker/result are watched. The countdown pill
  // appears during the final minute (always visible on result). Hidden tabs
  // pause the timer instead of wiping a visitor who tabbed away, and an open
  // leave-confirm dialog suppresses the reset.
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (state.phase === "intro" || open) {
      setSecondsLeft(null);
      return;
    }

    const timeoutMs = state.phase === "result" ? RESULT_IDLE_MS : QUIZ_IDLE_MS;
    let timeoutId: number | undefined;
    let intervalId: number | undefined;
    let deadline = Date.now() + timeoutMs;

    const clearTimers = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      timeoutId = undefined;
      intervalId = undefined;
    };

    const resetToIdle = () => {
      clearTimers();
      setSecondsLeft(null);
      clearProgress();
      resetQuiz();
      toast("Session reset due to inactivity");
    };

    const tick = () => {
      const remainingMs = Math.max(0, deadline - Date.now());
      const remainingSec = Math.ceil(remainingMs / 1000);
      // Result shows the full minute; quiz/tiebreaker only the final minute.
      setSecondsLeft(
        state.phase === "result"
          ? remainingSec
          : remainingMs <= WARN_MS
            ? remainingSec
            : null,
      );
    };

    const schedule = () => {
      clearTimers();
      deadline = Date.now() + timeoutMs;
      tick();
      timeoutId = window.setTimeout(resetToIdle, timeoutMs);
      intervalId = window.setInterval(tick, TICK_MS);
    };

    const handleActivity = () => schedule();

    const handleVisibility = () => {
      if (document.hidden) {
        // Pause while hidden — never wipe a tabbed-away visitor.
        clearTimers();
      } else {
        schedule();
      }
    };

    // Initial schedule
    schedule();

    const bubbleEvents: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "touchmove",
      "click",
    ];
    for (const evt of bubbleEvents) {
      window.addEventListener(evt, handleActivity, { passive: true });
    }
    // `scroll` doesn't bubble, so a capture listener is required to catch
    // scrolls inside the quiz's inner overflow container.
    window.addEventListener("scroll", handleActivity, {
      passive: true,
      capture: true,
    });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimers();
      for (const evt of bubbleEvents) {
        window.removeEventListener(evt, handleActivity);
      }
      window.removeEventListener("scroll", handleActivity, { capture: true });
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [state.phase, resetQuiz, open]);

  // Once the visitor confirms leaving, stop persisting progress for this
  // component instance — a blocked navigation must not resurrect the record
  // the modal promised to erase.
  const handleContinueLeave = useCallback(() => {
    leavingRef.current = true;
    continueLeave();
  }, [continueLeave]);

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col justify-start pt-2 md:pt-4 portrait:mt-[4svh] portrait:mb-auto md:portrait:mt-[5svh] landscape:my-auto landscape:pt-0">
      {secondsLeft !== null && <IdleCountdown secondsLeft={secondsLeft} />}
      <AnimatePresence mode="wait">
        {state.phase === "intro" && (
          <IntroScreen key="intro" onStart={startQuiz} />
        )}

        {(state.phase === "quiz" || state.phase === "tiebreaker") &&
          currentQuestion && (
            <QuestionScreen
              key={`question-${state.phase}-${state.phase === "tiebreaker" ? state.usedTieBreakers : state.currentQuestionIndex}`}
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
