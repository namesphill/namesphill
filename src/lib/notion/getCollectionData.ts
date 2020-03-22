import { NotionUser } from "./getUsers";
import { NotionPageContent } from "./getPageData";
import {
  writeCache,
  readCache,
  getCacheFile,
} from "./get-collection-helpers/cache";
import getDefaultConfigs from "./get-collection-helpers/getDefaultConfigs";
import queryTable from "./get-collection-helpers/queryTable";

export type CollectionProperty =
  | ["date", Date]
  | ["link", string]
  | ["userIds", string[]]
  | ["richText", RichTextProp[]]
  | ["users", NotionUser[]]
  | ["pageContent", NotionPageContent]
  | ["text", string]
  | ["checked", boolean];

export type CollectionPropertyType = CollectionProperty[0];
export type CollectionPropertyValue = CollectionProperty[1];

export type CollectionPropertyMap = {
  date: ["date", Date];
  link: ["link", string];
  userIds: ["userIds", string[]];
  users: ["users", NotionUser[]];
  text: ["text", string];
  richText: ["richText", RichTextProp[]];
  pageContent: ["pageContent", NotionPageContent];
  checked: ["checked", boolean];
};

export type CollectionRow = {
  id: string;
  Slug: string;
  Name: string;
  PageCover: string;
  PageContent: CollectionPropertyMap["pageContent"] | null;
  PreviewContent: CollectionPropertyMap["pageContent"] | null;
  [key: string]: null | string | CollectionProperty;
};

export type CollectionTable<T extends CollectionRow = CollectionRow> = {
  [key: string]: T;
};

export type GetCollectionDataConfigs = {
  queryUsers?: boolean;
  queryPageContent?: boolean;
  separatePreviewContent?: boolean;
  contentBlockLimit?: number;
};

export default async function getCollectionData<
  T extends CollectionRow = CollectionRow
>(collectionBlock: NotionBlock, configs: GetCollectionDataConfigs = {}) {
  let table: CollectionTable<T> = {};
  const newConfigs = getDefaultConfigs(configs);
  const cacheFile = getCacheFile(collectionBlock, newConfigs);
  table = await readCache<T>(cacheFile);
  const tableIsEmpty = JSON.stringify(table) === "{}";
  if (tableIsEmpty) table = await queryTable<T>(collectionBlock, newConfigs);
  writeCache<T>(cacheFile, table);
  return table;
}
