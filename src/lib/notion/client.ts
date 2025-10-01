import { Client } from "@notionhq/client";
import type { Client as NotionClientType } from "@notionhq/client";

let notion: NotionClientType | null = null;

export function getNotionClient(): NotionClientType {
  if (notion) return notion;

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NOTION_API_KEY in environment");
  }

  notion = new Client({ auth: apiKey });
  return notion;
}

export default getNotionClient;
