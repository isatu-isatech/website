"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import {
  questions,
  tieBreakers,
  archetypes,
  adjectives,
  SCORE_THRESHOLD,
  type ArchetypeKey,
  type Question,
  type Choice,
} from "@/lib/quiz-data";
import confetti from "canvas-confetti";
import { IntroScreen } from "./intro-screen";
import { QuestionScreen } from "./question-screen";
import { ResultScreen } from "./result-screen";
import { isFinalResult, type QuizResult } from "./types";

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

  const currentQuestion = useMemo(() => {
    if (state.phase === "quiz") {
      return state.shuffledQuestions[state.currentQuestionIndex];
    } else if (state.phase === "tiebreaker") {
      return state.shuffledTieBreakers[state.usedTieBreakers];
    }
    return null;
  }, [state]);

  useEffect(() => {
    if (currentQuestion) {
      setIsSubmitting(false);

      const previousAnswer = state.answers[state.currentQuestionIndex];
      if (previousAnswer) {
        const index = currentQuestion.choices.findIndex(
          (c) => c.choice === previousAnswer.choice,
        );
        setSelectedChoice(index !== -1 ? index : null);
      } else {
        setSelectedChoice(null);
      }
    }
  }, [currentQuestion, state.answers, state.currentQuestionIndex]);

  const result = useMemo((): QuizResult => {
    const { scores } = state;
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    const sortedScores = Object.entries(scores).sort(
      ([, a], [, b]) => b - a,
    ) as [ArchetypeKey, number][];

    const [top1, top2, top3, top4] = sortedScores;

    const needsTieBreaker =
      top1[1] === top2[1] ||
      (top2[1] === top3[1] && top1[1] - top2[1] < SCORE_THRESHOLD);

    if (
      needsTieBreaker &&
      state.usedTieBreakers < state.shuffledTieBreakers.length
    ) {
      return { needsTieBreaker: true };
    }

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
              const sortedScores = Object.entries(newScores).sort(
                ([, a], [, b]) => b - a,
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
            const sortedScores = Object.entries(newScores).sort(
              ([, a], [, b]) => b - a,
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
  }, []);

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
      return (
        ((state.currentQuestionIndex + 1) / state.shuffledQuestions.length) *
        100
      );
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
    <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col justify-center">
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
