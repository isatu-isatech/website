/**
 * Quiz scoring engine (spec 003-quiz-page-improvements).
 *
 * Single source of truth for result derivation and tie-breaker routing. The
 * tie-break decision used to be re-implemented inline in `quiz-container.tsx`
 * with a divergent condition (no `SCORE_THRESHOLD` gap check), so the quiz
 * could route to the tie-breaker phase differently than the result memo would
 * have computed. Everything now funnels through `needsTieBreaker` /
 * `deriveResult` below.
 */

import {
  adjectives,
  archetypes,
  SCORE_THRESHOLD,
  type ArchetypeKey,
  type CanonicalRole,
} from "./data";

export type Scores = Record<ArchetypeKey, number>;

/** One (archetype, score) pair from a sorted score list. */
type ScorePair = [ArchetypeKey, number];

/* ---------------------------------------------------------------------------
 * Result shapes (moved here from components/quiz/types.ts so lib/quiz owns
 * the full scoring domain and no lib module imports from components).
 * ------------------------------------------------------------------------- */

export interface TieBreakerResult {
  needsTieBreaker: true;
}

export interface FinalResult {
  needsTieBreaker: false;
  role: CanonicalRole;
  description: string;
  primaryArchetype: ArchetypeKey;
  secondaryArchetype: ArchetypeKey | null;
  breakdown: Record<ArchetypeKey, number>;
  isGeneralist: boolean;
}

export type QuizResult = TieBreakerResult | FinalResult | null;

export function isFinalResult(result: QuizResult): result is FinalResult {
  return result !== null && !result.needsTieBreaker;
}

/* ---------------------------------------------------------------------------
 * Scoring
 * ------------------------------------------------------------------------- */

/** Scores sorted descending (all four archetypes are always present). */
export function sortScores(scores: Scores): [ArchetypeKey, number][] {
  return Object.entries(scores).toSorted(([, a], [, b]) => b - a) as [
    ArchetypeKey,
    number,
  ][];
}

/**
 * Whether the quiz still needs a tie-breaker question.
 *
 * A tie is a top-two dead heat, or a near-miss where the second and third
 * scores are equal and the gap to first is below `SCORE_THRESHOLD` (so the
 * role label would otherwise be a coin flip). Also requires that an unused
 * tie-breaker question remains.
 */
export function needsTieBreaker(
  sortedScores: [ArchetypeKey, number][],
  usedTieBreakers: number,
  totalTieBreakers: number,
): boolean {
  // `scores` always holds every archetype key, so the sorted list has exactly
  // three (or four) entries — the tuple casts pin that invariant for
  // noUncheckedIndexedAccess.
  const [top1, top2, top3] = sortedScores as [ScorePair, ScorePair, ScorePair];
  const tied =
    top1[1] === top2[1] ||
    (top2[1] === top3[1] && top1[1] - top2[1] < SCORE_THRESHOLD);
  return tied && usedTieBreakers < totalTieBreakers;
}

/**
 * Full result derivation: tie-breaker flag, role label, description,
 * primary/secondary archetypes, and per-archetype breakdown percentages.
 */
export function deriveResult(
  scores: Scores,
  usedTieBreakers: number,
  totalTieBreakers: number,
): QuizResult {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const sortedScores = sortScores(scores);
  const [top1, top2, top3, top4] = sortedScores as [
    ScorePair,
    ScorePair,
    ScorePair,
    ScorePair,
  ];

  if (needsTieBreaker(sortedScores, usedTieBreakers, totalTieBreakers)) {
    return { needsTieBreaker: true };
  }

  const isGeneralist =
    top1[1] === top2[1] && top2[1] === top3[1] && top3[1] === top4[1];

  let role: CanonicalRole;
  const primaryArchetype: ArchetypeKey = top1[0];
  let secondaryArchetype: ArchetypeKey | null = null;

  if (isGeneralist) {
    role = "Generalist";
  } else if (top1[1] - top2[1] < SCORE_THRESHOLD) {
    role = `${adjectives[top2[0]]} ${top1[0]}` as CanonicalRole;
    secondaryArchetype = top2[0];
  } else {
    role = `True ${top1[0]}` as CanonicalRole;
  }

  // Largest-remainder rounding so the displayed shares always sum to 100.
  const exact = sortedScores.map(
    ([key, value]) => [key, (value / total) * 100] as const,
  );
  const breakdown = {} as Record<ArchetypeKey, number>;
  let assigned = 0;
  let largestIdx = 0;
  let largestRemainder = -1;
  for (let i = 0; i < exact.length; i++) {
    const floored = Math.floor(exact[i]![1]);
    breakdown[exact[i]![0]] = floored;
    assigned += floored;
    const remainder = exact[i]![1] - floored;
    if (remainder > largestRemainder) {
      largestRemainder = remainder;
      largestIdx = i;
    }
  }
  breakdown[exact[largestIdx]![0]]! += 100 - assigned;

  return {
    needsTieBreaker: false,
    role,
    description: archetypes[role] ?? archetypes.Generalist,
    primaryArchetype,
    secondaryArchetype,
    breakdown,
    isGeneralist,
  };
}
