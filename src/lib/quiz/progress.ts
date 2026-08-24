/**
 * Session-scoped quiz progress persistence (spec 003, FR-008).
 *
 * An in-progress quiz survives an accidental page refresh or back/forward
 * navigation within the same browser session: the record lives in
 * `sessionStorage` (per-tab, discarded when the tab closes). A stored record
 * whose quiz-data version no longer matches is discarded, so a restored quiz
 * is never inconsistent with the current questions.
 */

import {
  questions,
  tieBreakers,
  type ArchetypeKey,
  type Choice,
  type Question,
} from "./data";
import { ARCHETYPE_KEYS } from "./canonical";

export const QUIZ_PROGRESS_KEY = "4h-quiz-progress-v1";

export interface SavedQuizProgress {
  version: string;
  phase: "quiz" | "tiebreaker";
  currentQuestionIndex: number;
  usedTieBreakers: number;
  scores: Record<ArchetypeKey, number>;
  answers: Choice[];
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
 * Version token derived from the quiz-data shape. Stored records with a
 * different token are treated as stale and discarded.
 */
export function makeProgressVersion(): string {
  return `${questions.length}:${tieBreakers.length}`;
}

function isWeight(value: unknown): value is Record<ArchetypeKey, number> {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return ARCHETYPE_KEYS.every((key) => typeof record[key] === "number");
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
    isValidOrder(order, set[index].choices.length),
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
          record.usedTieBreakers >= tieBreakers.length))
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

    return {
      version: record.version,
      phase: record.phase,
      currentQuestionIndex: record.currentQuestionIndex,
      usedTieBreakers: record.usedTieBreakers,
      scores: record.scores,
      answers: record.answers,
      questionOrder: record.questionOrder,
      tieBreakerOrder: record.tieBreakerOrder,
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
