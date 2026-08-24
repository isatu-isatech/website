import { getNotionClient } from "./client";
import type {
  CreatePageResponse,
  CreatePageParameters,
} from "@notionhq/client";

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
  return await notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
}
