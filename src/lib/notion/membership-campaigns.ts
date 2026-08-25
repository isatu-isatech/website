/**
 * Helpers for the Membership Campaigns DB.
 *
 * Campaigns are the yearly containers for submissions. The site only reads
 * campaigns — officers create them via the Notion dashboard
 * (`Membership Application Dashboard` > `Membership Campaigns`).
 *
 * The form is open only when exactly one campaign has `Status = "In progress"`.
 * This module queries that active campaign and returns its page ID/URL and
 * Academic Year for linking on submit and for closed-state messaging.
 */

import { getNotionClient } from "./client";
import { env } from "@/lib/env";

export type MembershipCampaign = {
  id: string; // Notion page ID (with dashes)
  url: string; // Notion page URL
  academicYear: string;
  status: "Draft" | "In progress" | "Closed";
  submissionsDataSourceId: string | null; // per-campaign Form Submissions DB data-source ID (collection://…), null if blank
};

/**
 * Query the Membership Campaigns DB for the currently active campaign.
 * Returns the single `In progress` campaign, or null if none / none active.
 * If multiple are `In progress` (admin misconfiguration), picks the most
 * recently created (by `created_time` desc) and logs a warning.
 */
export async function getActiveCampaign(): Promise<MembershipCampaign | null> {
  try {
    const notion = getNotionClient();
    const databaseId = env.NOTION_MEMBERSHIP_CAMPAIGNS_DATABASE_ID;

    // Use the SDK's generic request() — works for both data-source IDs
    // (collection://…8095…) and database page IDs (…8000…) regardless of
    // SDK method renames (databases.query → dataSources.query).
    let res: unknown;
    try {
      res = await (
        notion as unknown as { request: (args: unknown) => Promise<unknown> }
      ).request({
        path: `data_sources/${databaseId}/query`,
        method: "post",
        body: {
          filter: {
            property: "Status",
            status: { equals: "In progress" },
          },
          sorts: [{ timestamp: "created_time", direction: "descending" }],
          page_size: 2,
        },
      });
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? String(err);
      if (
        msg.includes("Could not find data_source") ||
        msg.includes("data_source with ID")
      ) {
        // Env holds a database PAGE ID (e.g., …8000…), not a data-source ID.
        // Resolve it to its data-source ID via GET /v1/databases/{id} then retry.
        // If the database is not shared with the integration, this will also throw
        // "Could not find database" — treat as no active campaign (closed state)
        // rather than a hard error so the page still renders.
        try {
          const db = await (
            notion as unknown as {
              request: (args: unknown) => Promise<unknown>;
            }
          ).request({
            path: `databases/${databaseId}`,
            method: "get",
          });
          const dsId =
            (db as { data_sources?: { id: string }[] })?.data_sources?.[0]
              ?.id ?? (db as { id?: string })?.id;
          if (!dsId || dsId === databaseId) throw err;
          res = await (
            notion as unknown as {
              request: (args: unknown) => Promise<unknown>;
            }
          ).request({
            path: `data_sources/${dsId}/query`,
            method: "post",
            body: {
              filter: {
                property: "Status",
                status: { equals: "In progress" },
              },
              sorts: [{ timestamp: "created_time", direction: "descending" }],
              page_size: 2,
            },
          });
        } catch (inner) {
          const innerMsg =
            (inner as { message?: string })?.message ?? String(inner);
          if (
            innerMsg.includes("Could not find database") ||
            innerMsg.includes("Could not find data_source")
          ) {
            console.warn(
              `[membership-campaigns] Database ${databaseId} not found or not shared with integration — treating as no active campaign. Share the Membership Campaigns DB with "ISATech Internal Integration".`,
            );
            return null;
          }
          throw inner;
        }
      } else {
        throw err;
      }
    }

    const results = (res as { results?: unknown[] })?.results ?? [];
    if (!results || results.length === 0) return null;

    if (results.length > 1) {
      console.warn(
        "[membership-campaigns] Multiple 'In progress' campaigns found; using most recent.",
      );
    }

    const page = results[0] as {
      id: string;
      url: string;
      created_time: string;
      properties: Record<string, unknown>;
    };

    const academicYearProp = page.properties["Academic Year"] as
      { type: string; title?: { plain_text: string }[] } | undefined;
    const statusProp = page.properties["Status"] as
      { type: string; status?: { name: string } } | undefined;

    const academicYear =
      academicYearProp?.title?.[0]?.plain_text ?? "Unknown Academic Year";
    const statusRaw = statusProp?.status?.name ?? "Draft";
    const status: MembershipCampaign["status"] =
      statusRaw === "In progress"
        ? "In progress"
        : statusRaw === "Closed"
          ? "Closed"
          : "Draft";

    // Try to resolve the per-campaign Form Submissions DB from the campaign page's
    // inline database block. Template campaigns have the DB inside a callout:
    //   <callout><database ...>Form Submissions</database></callout>
    // Blank pages (created without template) have no blocks — fallback to env var.
    let submissionsDataSourceId: string | null = null;
    try {
      const blocksApi = (
        notion as unknown as {
          blocks?: {
            children?: {
              list: (args: unknown) => Promise<{ results: unknown[] }>;
            };
          };
        }
      ).blocks?.children;
      if (blocksApi?.list) {
        const fetchBlocks = async (
          blockId: string,
        ): Promise<Record<string, unknown>[]> => {
          try {
            const r = await blocksApi.list({
              block_id: blockId,
            } as unknown as Record<string, unknown>);
            return ((r as { results?: unknown[] })?.results ?? []) as Record<
              string,
              unknown
            >[];
          } catch {
            return [];
          }
        };
        const topBlocks = await fetchBlocks(page.id);
        const queue: Record<string, unknown>[] = [...topBlocks];
        while (queue.length > 0 && !submissionsDataSourceId) {
          const b = queue.shift()!;
          const type = b["type"] as string | undefined;
          if (type === "child_database") {
            const childDb = b["child_database"] as
              { title?: string } | undefined;
            if (
              childDb?.title === "Form Submissions" &&
              typeof b["id"] === "string"
            ) {
              try {
                const db = await (
                  notion as unknown as {
                    databases?: {
                      retrieve: (args: unknown) => Promise<unknown>;
                    };
                    dataSources?: {
                      retrieve: (args: unknown) => Promise<unknown>;
                    };
                  }
                ).databases?.retrieve?.({
                  database_id: b["id"] as string,
                } as unknown as Record<string, unknown>);
                const ds = (db as { data_sources?: { id: string }[] })
                  ?.data_sources?.[0]?.id;
                if (ds) {
                  submissionsDataSourceId = ds;
                  break;
                }
                submissionsDataSourceId = b["id"] as string;
                break;
              } catch {
                // ignore
              }
            }
          }
          if (
            type === "callout" ||
            type === "column_list" ||
            type === "column" ||
            type === "toggle" ||
            type === "quote"
          ) {
            if (typeof b["id"] === "string") {
              const children = await fetchBlocks(b["id"] as string);
              queue.unshift(...children);
            }
          }
        }
      }
    } catch {
      // ignore — fallback to env var
    }

    return {
      id: page.id,
      url: page.url,
      academicYear,
      status,
      submissionsDataSourceId,
    };
  } catch (error) {
    console.error("[membership-campaigns] getActiveCampaign failed:", error);
    return null;
  }
}
