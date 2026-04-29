import type { ArchetypeKey } from "@/lib/quiz-data";

export interface TieBreakerResult {
  needsTieBreaker: true;
}

export interface FinalResult {
  needsTieBreaker: false;
  role: string;
  description: string;
  primaryArchetype: ArchetypeKey;
  secondaryArchetype: ArchetypeKey | null;
  breakdown: Record<string, number>;
  isGeneralist: boolean;
}

export type QuizResult = TieBreakerResult | FinalResult | null;

export function isFinalResult(result: QuizResult): result is FinalResult {
  return result !== null && !result.needsTieBreaker;
}
