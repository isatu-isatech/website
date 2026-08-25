import { getNotionClient } from "./client";
import { APIResponseError } from "@notionhq/client";
import type {
  CreatePageResponse,
  CreatePageParameters,
} from "@notionhq/client";

const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 250;
const MAX_BACKOFF_MS = 5000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Transient Notion failures worth retrying: rate limits and 5xx. */
function isRetryable(error: unknown): boolean {
  if (error instanceof APIResponseError) {
    return (
      error.status === 429 ||
      error.status === 500 ||
      error.status === 502 ||
      error.status === 503 ||
      error.status === 504
    );
  }
  // Network-level failures (connection refused/aborted) surface as TypeErrors.
  return error instanceof TypeError;
}

/** Backoff for retry `attempt` (1-based), honoring Retry-After on 429s. */
function backoffMs(attempt: number, error: unknown): number {
  if (error instanceof APIResponseError && error.status === 429) {
    // `headers` is untyped in the SDK's error type; only `retry-after` is read.
    const headers = error.headers as
      { get?: (name: string) => string | null } | undefined;
    const retryAfter = headers?.get?.("retry-after");
    if (retryAfter) {
      const seconds = Number(retryAfter);
      if (Number.isFinite(seconds) && seconds > 0) {
        return Math.min(seconds * 1000, MAX_BACKOFF_MS);
      }
    }
  }
  // Exponential with jitter: ~250ms, ~500ms, ~1s...
  const jitter = Math.random() * BASE_BACKOFF_MS;
  return Math.min(
    BASE_BACKOFF_MS * 2 ** (attempt - 1) + jitter,
    MAX_BACKOFF_MS,
  );
}

/**
 * Run `operation`, retrying transient Notion failures (429 rate limits and
 * 5xx) with capped exponential backoff (ADR 0001: "Buffer/retry against
 * Notion rate limits is a real build item").
 */
async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS || !isRetryable(error)) throw error;
      await sleep(backoffMs(attempt, error));
    }
  }
}

/**
 * Create a page in a Notion database (the contact-form submission path).
 *
 * All other read/query helpers were removed in the Phase 3 cleanup — they had
 * zero consumers. When a Notion-backed read surface is built (per ADR 0001),
 * add paginated helpers here using the SDK's `collectPaginatedAPI` rather
 * than re-introducing single-page queries that silently drop rows.
 */
export async function createPage(
  databaseId: string,
  properties: CreatePageParameters["properties"],
): Promise<CreatePageResponse> {
  const notion = getNotionClient();
  return withRetry(() =>
    notion.pages.create({
      parent: { database_id: databaseId },
      properties,
    }),
  );
}

/**
 * Create a page in a Notion data source (the membership submissions path).
 *
 * Membership Form Submissions live in data sources (`collection://…`), which
 * use a separate ID namespace from database page IDs. Creating a page in one
 * requires `parent: { data_source_id }` — the `database_id` parent only accepts
 * database page IDs. Kept separate from `createPage` so the contact path
 * (database IDs) is untouched.
 */
export async function createPageInDataSource(
  dataSourceId: string,
  properties: CreatePageParameters["properties"],
): Promise<CreatePageResponse> {
  const notion = getNotionClient();
  return withRetry(() =>
    notion.pages.create({
      parent: { data_source_id: dataSourceId },
      properties,
    }),
  );
}
