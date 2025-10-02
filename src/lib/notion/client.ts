import { Client } from "@notionhq/client";
import type { Client as NotionClientType } from "@notionhq/client";
import { env } from "@/lib/env";

let notion: NotionClientType | null = null;

export function getNotionClient(): NotionClientType {
  if (notion) return notion;

  const notionApiKey = env.NOTION_API_KEY;

  notion = new Client({ auth: notionApiKey });
  return notion;
}

export default getNotionClient;
