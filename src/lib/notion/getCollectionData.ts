import Slugger from "github-slugger";
import queryCollection from "./queryCollection";
import { normalizeSlug } from "../blog-helpers";

export type CollectionProperty =
  | ["date", Date]
  | ["link", string]
  | ["user", string[]]
  | ["text", string]
  | ["checked", boolean];
export type CollectionPropertyType = CollectionProperty[0];
export type CollectionPropertyValue = CollectionProperty[1];
export type CollectionRow = {
  id: string;
  Slug: string;
  PageCover: string;
  [key: string]: string | CollectionProperty;
};

export type CollectionTable = { [key: string]: CollectionRow };

export default async function getCollectionData(
  collectionBlock: NotionBlock,
  isPosts = false
) {
  const slugger = new Slugger();
  const { value } = collectionBlock;
  let table: CollectionTable = {};

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
            cell = ["user", userIds];
            break;

          case "d":
            const date = getDateFromProp(blockProp);
            cell = ["date", date];
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
      row[columnName] = cell || null;
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

    if (isPosts && !key) continue;
    if (key) table[key] = row;
    if (!key) console.error(`Items has no Slug`);
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
