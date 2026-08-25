/**
 * Quiz shared helpers (spec 003-quiz-page-improvements).
 *
 * `canonical` — canonical outcome set + share/banner URL builders (used by
 * the OG route, the result page metadata, and the in-app share button).
 * `progress` — session-scoped in-progress quiz persistence (FR-008).
 * `scoring` — result derivation + tie-breaker routing (single source).
 */

export * from "./canonical";
export * from "./data";
export * from "./progress";
export * from "./scoring";
