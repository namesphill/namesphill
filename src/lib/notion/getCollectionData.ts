import Slugger from "github-slugger";
import queryCollection from "./queryCollection";
import { normalizeSlug } from "../blog-helpers";
import getNotionUsers, { NotionUser } from "./getNotionUsers";

export type CollectionProperty =
  | ["date", Date]
  | ["link", string]
  | ["userIds", string[]]
  | ["users", NotionUser[]]
  | ["text", string]
  | ["checked", boolean];
export type CollectionPropertyType = CollectionProperty[0];
export type CollectionPropertyValue = CollectionProperty[1];
export type CollectionRow = {
  id: string;
  Slug: string;
  PageCover: string;
  [key: string]: null | string | CollectionProperty;
};

export type CollectionPropertyMap = {
  date: ["date", Date];
  link: ["link", string];
  userIds: ["userIds", string[]];
  users: ["users", NotionUser[]];
  text: ["text", string];
  checked: ["checked", boolean];
};

export type CollectionTable<T extends CollectionRow = CollectionRow> = {
  [key: string]: T;
};

export default async function getCollectionData<
  T extends CollectionRow = CollectionRow
>(collectionBlock: NotionBlock, config: { queryUsers?: boolean } = {}) {
  const { queryUsers = false } = config;

  const slugger = new Slugger();
  const { value } = collectionBlock;
  let table: CollectionTable<T> = {};

  const collection = await queryCollection({
    collectionId: value.collection_id,
    collectionViewId: value.view_ids[0]
  });

  const entries = Object.values(collection.recordMap.block).filter(
    block =>
      block && block.value && block.value.parent_id === value.collection_id
  );

  const collectionId = Object.keys(collection.recordMap.collection)[0];

  const schema = collection.recordMap.collection[collectionId].value.schema;

  for (const entry of entries) {
    const props = entry.value && entry.value.properties;
    const row: CollectionRow = { id: "", Slug: "", PageCover: "" };

    if (!props) continue;

    if (entry.value.content) row.id = entry.value.id;

    for (const columnKey in schema) {
      const defaultCellValue = props[columnKey] && props[columnKey][0].join("");
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
              .filter(arr => arr.length > 1)
              .map(arr => arr[1][0][1]);
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
        page && page.value && page.value.format && page.value.format.page_cover;
      return pageCover || "";
    }
    row.PageCover = getPageCover(row.id);

    row.Slug = normalizeSlug(row.Slug || slugger.slug(row.Name || ""));
    const key = row.Slug;

    if (!key) continue;
    if (key) (table as any)[key] = row;
    if (!key) console.error(`Items has no Slug`);
  }
  if (queryUsers) {
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
    const users = await getNotionUsers(userIds);
    for (const [slug, key] of paths) {
      const [_, ids] = table[slug][key] as CollectionPropertyMap["userIds"];
      const cellUsers: NotionUser[] = ids.map(id => users[id]);
      const cell: CollectionPropertyMap["users"] = ["users", cellUsers];
      table[slug][key as keyof T] = cell as any;
    }
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
          timeZone: dateProp[1].time_zone
        })
      ).getTime() - new Date().getTime();

    // initialize subtracting time zone offset
    return new Date(providedDate - timezoneOffset);
  } catch {
    return new Date("Invalid Date");
  }
}
