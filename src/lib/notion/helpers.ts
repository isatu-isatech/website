/* eslint-disable @typescript-eslint/no-explicit-any */
import { getNotionClient } from "./client";
import type {
  PageObjectResponse,
  RichTextItemResponse,
  QueryDataSourceResponse,
  UpdatePageResponse,
  CreatePageResponse,
  GetPageResponse,
  GetDatabaseResponse,
  UserObjectResponse,
  PartialUserObjectResponse,
  GroupObjectResponse,
  CreatePageParameters,
} from "@notionhq/client";

// Custom types for Notion API responses
export type DateResponse = {
  start: string;
  end: string | null;
  time_zone: string | null;
};

export type UserResponse =
  | UserObjectResponse
  | PartialUserObjectResponse
  | GroupObjectResponse;

// Notion Property Types - using actual API response types
export type NotionProperty =
  | { type: "title"; title: RichTextItemResponse[]; id: string }
  | { type: "rich_text"; rich_text: RichTextItemResponse[]; id: string }
  | { type: "number"; number: number | null; id: string }
  | {
      type: "select";
      select: { id: string; name: string; color: string } | null;
      id: string;
    }
  | {
      type: "multi_select";
      multi_select: Array<{ id: string; name: string; color: string }>;
      id: string;
    }
  | { type: "date"; date: DateResponse | null; id: string }
  | { type: "checkbox"; checkbox: boolean; id: string }
  | { type: "url"; url: string | null; id: string }
  | { type: "email"; email: string | null; id: string }
  | { type: "phone_number"; phone_number: string | null; id: string }
  | { type: "formula"; formula: any; id: string }
  | { type: "relation"; relation: Array<{ id: string }>; id: string }
  | { type: "rollup"; rollup: any; id: string }
  | { type: "people"; people: Array<UserResponse>; id: string }
  | { type: "files"; files: Array<any>; id: string }
  | { type: "created_time"; created_time: string; id: string }
  | { type: "created_by"; created_by: UserResponse; id: string }
  | { type: "last_edited_time"; last_edited_time: string; id: string }
  | { type: "last_edited_by"; last_edited_by: UserResponse; id: string };

// Query and Filter Types
export type NotionFilter = Record<string, any>;
export type NotionSort = Array<{
  property: string;
  direction: "ascending" | "descending";
}>;

// Type guards and getters for Notion properties

export function isTextProperty(property: NotionProperty): boolean {
  return property.type === "title" || property.type === "rich_text";
}

export function getText(property: NotionProperty): string {
  if (!isTextProperty(property)) return "";

  if (property.type === "title") {
    return property.title?.map((item) => item.plain_text).join("") || "";
  } else if (property.type === "rich_text") {
    return property.rich_text?.map((item) => item.plain_text).join("") || "";
  }
  return "";
}

export function isNumberProperty(property: NotionProperty): boolean {
  return property.type === "number";
}

export function getNumber(property: NotionProperty): number | null {
  if (!isNumberProperty(property)) return null;
  return (property as Extract<NotionProperty, { type: "number" }>).number;
}

export function isSelectProperty(property: NotionProperty): boolean {
  return property.type === "select";
}

export function getSelect(property: NotionProperty): string | null {
  if (!isSelectProperty(property)) return null;
  return (
    (property as Extract<NotionProperty, { type: "select" }>).select?.name ||
    null
  );
}

export function isMultiSelectProperty(property: NotionProperty): boolean {
  return property.type === "multi_select";
}

export function getMultiSelect(property: NotionProperty): string[] {
  if (!isMultiSelectProperty(property)) return [];
  return (
    (
      property as Extract<NotionProperty, { type: "multi_select" }>
    ).multi_select?.map((item) => item.name) || []
  );
}

export function isDateProperty(property: NotionProperty): boolean {
  return property.type === "date";
}

export function getDate(
  property: NotionProperty,
): { start: Date; end?: Date } | null {
  if (!isDateProperty(property)) return null;
  const dateProp = property as Extract<NotionProperty, { type: "date" }>;
  if (!dateProp.date) return null;

  const start = new Date(dateProp.date.start);
  const end = dateProp.date.end ? new Date(dateProp.date.end) : undefined;

  return { start, end };
}

export function isCheckboxProperty(property: NotionProperty): boolean {
  return property.type === "checkbox";
}

export function getCheckbox(property: NotionProperty): boolean {
  if (!isCheckboxProperty(property)) return false;
  return (property as Extract<NotionProperty, { type: "checkbox" }>).checkbox;
}

export function isUrlProperty(property: NotionProperty): boolean {
  return property.type === "url";
}

export function getUrl(property: NotionProperty): string | null {
  if (!isUrlProperty(property)) return null;
  return (property as Extract<NotionProperty, { type: "url" }>).url;
}

export function isEmailProperty(property: NotionProperty): boolean {
  return property.type === "email";
}

export function getEmail(property: NotionProperty): string | null {
  if (!isEmailProperty(property)) return null;
  return (property as Extract<NotionProperty, { type: "email" }>).email;
}

export function isPhoneNumberProperty(property: NotionProperty): boolean {
  return property.type === "phone_number";
}

export function getPhoneNumber(property: NotionProperty): string | null {
  if (!isPhoneNumberProperty(property)) return null;
  return (property as Extract<NotionProperty, { type: "phone_number" }>)
    .phone_number;
}

export function isFormulaProperty(property: NotionProperty): boolean {
  return property.type === "formula";
}

export function getFormulaValue(property: NotionProperty): any {
  if (!isFormulaProperty(property)) return null;
  return (property as Extract<NotionProperty, { type: "formula" }>).formula;
}

export function isRelationProperty(property: NotionProperty): boolean {
  return property.type === "relation";
}

export function getRelationIds(property: NotionProperty): string[] {
  if (!isRelationProperty(property)) return [];
  return (
    (property as Extract<NotionProperty, { type: "relation" }>).relation?.map(
      (item) => item.id,
    ) || []
  );
}

export function isRollupProperty(property: NotionProperty): boolean {
  return property.type === "rollup";
}

export function getRollupValue(property: NotionProperty): any {
  if (!isRollupProperty(property)) return null;
  return (property as Extract<NotionProperty, { type: "rollup" }>).rollup;
}

export function isPeopleProperty(property: NotionProperty): boolean {
  return property.type === "people";
}

export function getPeople(property: NotionProperty): Array<UserResponse> {
  if (!isPeopleProperty(property)) return [];
  return (property as Extract<NotionProperty, { type: "people" }>).people || [];
}

export function isFilesProperty(property: NotionProperty): boolean {
  return property.type === "files";
}

export function getFiles(property: NotionProperty): Array<any> {
  if (!isFilesProperty(property)) return [];
  return (property as Extract<NotionProperty, { type: "files" }>).files || [];
}

// Database interaction functions

export async function queryDatabase(
  databaseId: string,
  filter?: NotionFilter,
  sorts?: NotionSort,
): Promise<QueryDataSourceResponse> {
  const notion = getNotionClient();

  const query: any = { data_source_id: databaseId };
  if (filter) query.filter = filter;
  if (sorts) query.sorts = sorts;

  return await notion.dataSources.query(query);
}

export async function getPage(pageId: string): Promise<GetPageResponse> {
  const notion = getNotionClient();
  return await notion.pages.retrieve({ page_id: pageId });
}

export async function updatePage(
  pageId: string,
  properties: Record<string, any>,
): Promise<UpdatePageResponse> {
  const notion = getNotionClient();
  return await notion.pages.update({ page_id: pageId, properties });
}

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

export async function getDatabase(
  databaseId: string,
): Promise<GetDatabaseResponse> {
  const notion = getNotionClient();
  return await notion.databases.retrieve({ database_id: databaseId });
}

// Utility functions

export function extractPropertyValue(
  page: PageObjectResponse,
  propertyName: string,
): any {
  const property = page.properties[propertyName];
  if (!property) return null;

  switch (property.type) {
    case "title":
    case "rich_text":
      return getText(property);
    case "number":
      return getNumber(property);
    case "select":
      return getSelect(property);
    case "multi_select":
      return getMultiSelect(property);
    case "date":
      return getDate(property);
    case "checkbox":
      return getCheckbox(property);
    case "url":
      return getUrl(property);
    case "email":
      return getEmail(property);
    case "phone_number":
      return getPhoneNumber(property);
    case "formula":
      return getFormulaValue(property);
    case "relation":
      return getRelationIds(property);
    case "rollup":
      return getRollupValue(property);
    case "people":
      return getPeople(property);
    case "files":
      return getFiles(property);
    default:
      return property;
  }
}

export function buildFilter(
  property: string,
  condition: Record<string, any>,
): NotionFilter {
  return {
    property,
    ...condition,
  };
}

export function buildSort(
  property: string,
  direction: "ascending" | "descending" = "ascending",
): NotionSort[0] {
  return {
    property,
    direction,
  };
}

// Additional type-safe helper functions

export function createTextProperty(text: string): {
  title: Array<{ text: { content: string } }>;
} {
  return {
    title: [{ text: { content: text } }],
  };
}

export function createRichTextProperty(text: string): {
  rich_text: Array<{ text: { content: string } }>;
} {
  return {
    rich_text: [{ text: { content: text } }],
  };
}

export function createNumberProperty(value: number): { number: number } {
  return { number: value };
}

export function createSelectProperty(optionName: string): {
  select: { name: string };
} {
  return { select: { name: optionName } };
}

export function createMultiSelectProperty(optionNames: string[]): {
  multi_select: Array<{ name: string }>;
} {
  return { multi_select: optionNames.map((name) => ({ name })) };
}

export function createCheckboxProperty(checked: boolean): {
  checkbox: boolean;
} {
  return { checkbox: checked };
}

export function createUrlProperty(url: string): { url: string } {
  return { url };
}

export function createEmailProperty(email: string): { email: string } {
  return { email };
}

export function createPhoneNumberProperty(phone: string): {
  phone_number: string;
} {
  return { phone_number: phone };
}

export function createDateProperty(
  start: string,
  end?: string,
): { date: { start: string; end?: string } } {
  return { date: { start, end } };
}

export function createRelationProperty(pageIds: string[]): {
  relation: Array<{ id: string }>;
} {
  return { relation: pageIds.map((id) => ({ id })) };
}

// Type-safe property value extractors with better return types
export function getPropertyValue<T extends NotionProperty>(
  property: T,
): T extends { type: "title" | "rich_text" }
  ? string
  : T extends { type: "number" }
    ? number | null
    : T extends { type: "select" }
      ? string | null
      : T extends { type: "multi_select" }
        ? string[]
        : T extends { type: "date" }
          ? { start: Date; end?: Date } | null
          : T extends { type: "checkbox" }
            ? boolean
            : T extends { type: "url" }
              ? string | null
              : T extends { type: "email" }
                ? string | null
                : T extends { type: "phone_number" }
                  ? string | null
                  : T extends { type: "people" }
                    ? UserResponse[]
                    : T extends { type: "files" }
                      ? any[]
                      : T extends { type: "relation" }
                        ? string[]
                        : any {
  switch (property.type) {
    case "title":
    case "rich_text":
      return getText(property) as any;
    case "number":
      return getNumber(property) as any;
    case "select":
      return getSelect(property) as any;
    case "multi_select":
      return getMultiSelect(property) as any;
    case "date":
      return getDate(property) as any;
    case "checkbox":
      return getCheckbox(property) as any;
    case "url":
      return getUrl(property) as any;
    case "email":
      return getEmail(property) as any;
    case "phone_number":
      return getPhoneNumber(property) as any;
    case "people":
      return getPeople(property) as any;
    case "files":
      return getFiles(property) as any;
    case "relation":
      return getRelationIds(property) as any;
    default:
      return property as any;
  }
}
