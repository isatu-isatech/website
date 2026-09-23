/**
 * Session-scoped quiz progress persistence (spec 003, FR-008).
 *
 * An in-progress quiz survives an accidental page refresh or back/forward
 * navigation within the same browser session: the record lives in
 * `sessionStorage` (per-tab, discarded when the tab closes). A stored record
 * whose quiz data version no longer matches is discarded, so a restored quiz
 * is never inconsistent with the current questions.
 */

import {
  adjectives,
  questions,
  SCORE_THRESHOLD,
  tieBreakers,
  type ArchetypeKey,
  type Choice,
  type Question,
} from "./data";
import { ARCHETYPE_KEYS } from "./canonical";

export const QUIZ_PROGRESS_KEY = "4h-quiz-progress-v3";

export interface SavedQuizProgress {
  version: string;
  phase: "quiz" | "tiebreaker";
  currentQuestionIndex: number;
  usedTieBreakers: number;
  scores: Record<ArchetypeKey, number>;
  answers: Choice[];
  /** Index into the shuffled choices for each answer (exact highlight restore). */
  answerIndexes: number[];
  /** Shuffled order of the main questions (indexes into `questions`). */
  questionOrder: number[];
  /** Shuffled order of the tiebreakers (indexes into `tieBreakers`). */
  tieBreakerOrder: number[];
  /** Per main question: shuffled choice order (indexes into the choices). */
  choiceOrders: number[][];
  /** Per tiebreaker: shuffled choice order. */
  tieChoiceOrders: number[][];
}

/**
 * Version token derived from the quiz data shape plus the persistence schema
 * version (v3: `choiceOrders` keyed by original index, answers appended
 * sequentially, `answerIndexes` for exact highlight restore). Any weight,
 * copy, threshold, or structure retune invalidates stale records so restored
 * scores are never replayed against new questions.
 */
export function makeProgressVersion(): string {
  let hash = 0;
  const sig = JSON.stringify({
    choices: questions.map((q) => q.choices.length),
    tieChoices: tieBreakers.map((q) => q.choices.length),
    // Copy is part of the hash: same counts/weights with edited wording must
    // not restore stale answerIndexes/questionOrder against new text.
    copy: questions.map((q) => [q.question, q.choices.map((c) => c.choice)]),
    tieCopy: tieBreakers.map((q) => [
      q.question,
      q.choices.map((c) => c.choice),
    ]),
    weights: questions.flatMap((q) => q.choices.map((c) => c.weight)),
    tieWeights: tieBreakers.flatMap((q) => q.choices.map((c) => c.weight)),
    adjectives,
    threshold: SCORE_THRESHOLD,
  });
  for (let i = 0; i < sig.length; i++) {
    hash = (hash * 31 + sig.charCodeAt(i)) | 0;
  }
  return `v3:${questions.length}:${tieBreakers.length}:${(hash >>> 0).toString(36)}`;
}

/**
 * Single source for the quiz progress-bar fraction (0–100). Quiz phase
 * climbs toward—but never hits—100% on the last main question; the
 * tiebreaker phase continues monotonically over the combined total.
 */
export function getQuizProgressFraction(args: {
  phase: "intro" | "quiz" | "tiebreaker" | "result";
  currentQuestionIndex: number;
  usedTieBreakers: number;
  mainLen: number;
  tieTotal: number;
}): number {
  const { phase, currentQuestionIndex, usedTieBreakers, mainLen, tieTotal } =
    args;
  if (mainLen <= 0) return 0;
  if (phase === "quiz") {
    return ((currentQuestionIndex + 1) / (mainLen + tieTotal)) * 100;
  }
  if (phase === "tiebreaker") {
    return ((mainLen + usedTieBreakers + 1) / (mainLen + tieTotal)) * 100;
  }
  return 0;
}

function isWeight(value: unknown): value is Record<ArchetypeKey, number> {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return ARCHETYPE_KEYS.every(
    (key) =>
      typeof record[key] === "number" &&
      Number.isFinite(record[key]) &&
      (record[key] as number) >= 0,
  );
}

function isChoice(value: unknown): value is Choice {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.choice === "string" && isWeight(record.weight);
}

/** A permutation of `0..size-1` — exact, in-bounds, no duplicates. */
function isValidOrder(order: unknown, size: number): order is number[] {
  if (!Array.isArray(order) || order.length !== size) return false;
  const seen = new Set<number>();
  for (const index of order) {
    if (
      typeof index !== "number" ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= size
    ) {
      return false;
    }
    if (seen.has(index)) return false;
    seen.add(index);
  }
  return true;
}

function isValidChoiceOrders(
  orders: unknown,
  set: readonly Question[],
): orders is number[][] {
  if (!Array.isArray(orders) || orders.length !== set.length) return false;
  return orders.every((order, index) =>
    isValidOrder(order, set[index]!.choices.length),
  );
}

/** Restore the saved progress, or `null` when absent/stale/malformed. */
export function loadProgress(): SavedQuizProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Record<string, unknown>;

    if (record.version !== makeProgressVersion()) return null;
    if (record.phase !== "quiz" && record.phase !== "tiebreaker") return null;
    if (
      typeof record.currentQuestionIndex !== "number" ||
      !Number.isInteger(record.currentQuestionIndex) ||
      record.currentQuestionIndex < 0 ||
      typeof record.usedTieBreakers !== "number" ||
      !Number.isInteger(record.usedTieBreakers)
    ) {
      return null;
    }
    if (
      (record.phase === "quiz" &&
        (record.currentQuestionIndex >= questions.length ||
          record.usedTieBreakers !== 0)) ||
      (record.phase === "tiebreaker" &&
        (record.currentQuestionIndex >= questions.length ||
          record.usedTieBreakers < 0 ||
          // Allow == length: all mains + all tiebreakers answered but the
          // result screen not yet reached is still restorable (the
          // expectedAnswers guard below keeps it consistent).
          record.usedTieBreakers > tieBreakers.length))
    ) {
      return null;
    }
    if (!isWeight(record.scores)) return null;
    if (!Array.isArray(record.answers) || !record.answers.every(isChoice)) {
      return null;
    }
    if (!isValidOrder(record.questionOrder, questions.length)) return null;
    if (!isValidOrder(record.tieBreakerOrder, tieBreakers.length)) return null;
    if (!isValidChoiceOrders(record.choiceOrders, questions)) return null;
    if (!isValidChoiceOrders(record.tieChoiceOrders, tieBreakers)) return null;
    // Answers append sequentially: quiz answers occupy `answers[0..N)`,
    // tiebreaker answers append after them.
    const answers = record.answers as Choice[];
    const questionOrder = record.questionOrder as number[];
    const tieBreakerOrder = record.tieBreakerOrder as number[];
    const expectedAnswers =
      record.phase === "quiz"
        ? record.currentQuestionIndex
        : questions.length + (record.usedTieBreakers as number);
    if (answers.length !== expectedAnswers) return null;
    // Exact highlight indexes, one per answer, bounded by the shuffled
    // question's choice count.
    if (
      !Array.isArray(record.answerIndexes) ||
      record.answerIndexes.length !== answers.length
    ) {
      return null;
    }
    const answerIndexes = record.answerIndexes as unknown[];
    for (let i = 0; i < answerIndexes.length; i++) {
      const idx = answerIndexes[i];
      if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0) {
        return null;
      }
      const bound =
        i < questions.length
          ? questions[questionOrder[i]!]!.choices.length
          : tieBreakers[tieBreakerOrder[i - questions.length]!]!.choices.length;
      if (idx >= bound) return null;
    }

    return {
      version: record.version,
      phase: record.phase,
      currentQuestionIndex: record.currentQuestionIndex,
      usedTieBreakers: record.usedTieBreakers,
      scores: record.scores,
      answers,
      answerIndexes: answerIndexes as number[],
      questionOrder,
      tieBreakerOrder,
      choiceOrders: record.choiceOrders,
      tieChoiceOrders: record.tieChoiceOrders,
    };
  } catch {
    return null;
  }
}

/** Persist the current in-progress state. */
export function saveProgress(progress: SavedQuizProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode / quota) — the quiz still works,
    // it just won't survive a refresh.
  }
}

/** Discard the saved progress (result reached, retake, or stale record). */
export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(QUIZ_PROGRESS_KEY);
  } catch {
    // Ignore — nothing to recover from here.
  }
}
