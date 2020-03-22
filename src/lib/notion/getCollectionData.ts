import Slugger from "github-slugger";
import queryCollection from "./queryCollection";
import getUsers, { NotionUser } from "./getUsers";
import getPageData, { NotionPageContent } from "./getPageData";
import { readFile, writeFile } from "../fs-helpers";

const path = require("path");
const slugger = new Slugger();

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
export type CollectionRow = {
  id: string;
  Slug: string;
  PageCover: string;
  PageContent: CollectionPropertyMap["pageContent"] | null;
  PreviewContent: CollectionPropertyMap["pageContent"] | null;
  [key: string]: null | string | CollectionProperty;
};

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

  const { value } = collectionBlock;
  const collectionId = value.collection_id;
  const collectionViewId = value.view_ids[0];

  const {
    contentBlockLimit,
    queryUsers = false,
    queryPageContent = false,
    separatePreviewContent = queryPageContent && configs.separatePreviewContent,
  } = configs;

  const useCache = process.env.USE_CACHE === "true";
  const cacheFileSuffix = Object.entries(configs)
    .map(([key, value]) => key + "_" + Number(value))
    .filter(Boolean)
    .join("__");
  const cacheIndex = `.${collectionId}_${collectionViewId}_index_data`;
  const CLLXN_INDEX_CACHE: string = path.resolve(cacheIndex);
  const cacheFile = `${CLLXN_INDEX_CACHE}${cacheFileSuffix}`;
  if (useCache) {
    try {
      const cacheContents = await readFile(cacheFile, "utf8");
      table = JSON.parse(cacheContents);
    } catch (e) {
      console.error(`NON FATAL: error reading cache file`);
    }
  }

  if (JSON.stringify(table) === "{}") {
    const collection = await queryCollection({
      collectionId,
      collectionViewId,
    });

    const entries = Object.values(collection.recordMap.block).filter(
      (block) =>
        block && block.value && block.value.parent_id === value.collection_id
    );

    const { schema } = Object.values(collection.recordMap.collection)[0].value;

    for (const entry of entries) {
      const props = entry.value && entry.value.properties;
      const row: CollectionRow = {
        id: "",
        Slug: "",
        PageCover: "",
        PageContent: null,
        PreviewContent: null,
      };

      if (!props) continue;

      if (entry.value.content) row.id = entry.value.id;

      if (queryPageContent && row.id) {
        const { content, previewContent } = await getPageData(row.id, {
          separatePreviewContent,
          limit: contentBlockLimit,
        });
        row.PageContent = ["pageContent", content];
        if (separatePreviewContent) {
          row.PreviewContent = ["pageContent", previewContent];
        }
      }

      for (const columnKey in schema) {
        const defaultCellValue =
          props[columnKey] && props[columnKey][0].join("");
        let cell: CollectionProperty = ["text", defaultCellValue];

        if (defaultCellValue && props[columnKey][0][1]) {
          const blockProp = props[columnKey][0][1][0];
          switch (blockProp[0]) {
            case "a":
              cell = ["link", blockProp[1]];
              break;

            case "u":
              const userProp = props[columnKey] as UserProp;
              const userIds = userProp
                .filter((arr) => arr.length > 1)
                .map((arr) => arr[1][0][1]);
              cell = ["userIds", userIds];
              break;

            case "d":
              const date = getDateFromProp(blockProp);
              cell = ["date", date];
              break;

            case "p":
              // TODO: handle pages
              break;

            default:
              console.error(
                "unsupported type",
                blockProp[0],
                JSON.stringify({ type: blockProp }, null, 2)
              );
              break;
          }
        }
        if (typeof cell[1] === "string") cell[1] = cell[1].trim();
        if (cell[1] === "Yes") cell = ["checked", true];
        if (cell[1] === "No") cell = ["checked", false];
        const columnName = schema[columnKey].name;
        if (columnName === "Slug") {
          row.Slug = String(cell[1]);
        } else if (cell[1]) {
          row[columnName] = cell;
        } else {
          row[columnName] = null;
        }
      }

      function getPageCover(pageId: string) {
        const page = collection.recordMap.block[pageId];
        const pageCover =
          page &&
          page.value &&
          page.value.format &&
          page.value.format.page_cover;
        return pageCover || "";
      }
      row.PageCover = getPageCover(row.id);

      row.Slug = normalizeSlug(
        row.Slug || slugger.slug((row.Name && row.Name[1]) || "")
      );
      const key = row.Slug;

      if (!key) continue;
      if (key) (table as any)[key] = row;
      if (!key) console.error(`Items has no Slug`);
    }
    table = sortTableByDate(table);
    if (queryUsers) table = await queryUsersOnTable<T>(table);
  }

  if (useCache) {
    const dateString = new Date().toDateString();
    const timeString = new Date().toTimeString();
    const dateTimeString = dateString + timeString;
    writeFile(cacheFile, JSON.stringify(table), "utf8")
      .then((_) => console.info(`Success writing cache file ${dateTimeString}`))
      .catch((e) => console.error(`Error writing cache file: ${e}`));
  }

  return table;
}

export function getDateFromProp(dateProp: DatePropertyValue[1][0]) {
  try {
    if (!dateProp[1].start_date) return new Date("Invalid Date");
    const providedDate = new Date(
      dateProp[1].start_date + " " + (dateProp[1].start_time || "")
    ).getTime();

    // calculate offset from provided time zone
    const timezoneOffset =
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: dateProp[1].time_zone,
        })
      ).getTime() - new Date().getTime();

    // initialize subtracting time zone offset
    return new Date(providedDate - timezoneOffset);
  } catch {
    return new Date("Invalid Date");
  }
}

export function sortTableByDate<T extends CollectionRow = CollectionRow>(
  table: CollectionTable<T>
) {
  const newTable: CollectionTable<T> = {};
  Object.values(table)
    .sort((A, B) => {
      let [, a] = A.Date || [];
      let [, b] = B.Date || [];
      a = a instanceof Date ? a : new Date();
      b = b instanceof Date ? b : new Date();
      return Math.sign(a.getTime() || 0 - b.getTime() || 0);
    })
    .forEach((row) => (newTable[row.Slug] = row));
  return newTable;
}

export async function queryUsersOnTable<
  T extends CollectionRow = CollectionRow
>(table: CollectionTable<T>) {
  let userIds: string[] = [];
  const paths: [string, string][] = [];
  for (const row of Object.values(table)) {
    const slug = row.Slug;
    for (const [key, cell] of Object.entries(row)) {
      if (!cell || typeof cell === "string") continue;
      const [type, value] = cell;
      if (type === "userIds") {
        userIds = userIds.concat(value as string[]);
        paths.push([slug, key]);
      }
    }
  }
  const users = await getUsers(userIds);
  for (const [slug, key] of paths) {
    const [, ids] = table[slug][key] as CollectionPropertyMap["userIds"];
    const cellUsers: NotionUser[] = ids.map((id) => users[id]);
    const cell: CollectionPropertyMap["users"] = ["users", cellUsers];
    table[slug][key as keyof T] = cell as any;
  }
  return table;
}

/**
 * Creates default slug or normalizes one
 * @param slug Base slug
 */
export const normalizeSlug = (slug: string): string => {
  let startingSlash = slug.startsWith("/");
  let endingSlash = slug.endsWith("/");
  if (startingSlash) slug = slug.substr(1);
  if (endingSlash) slug = slug.substr(0, slug.length - 1);
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug;
};
