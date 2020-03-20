import { NotionBlock } from "./rpc";
import Slugger from "github-slugger";
import queryCollection from "./queryCollection";
import { normalizeSlug } from "../blog-helpers";

export default async function loadTable(
  collectionBlock: NotionBlock,
  isPosts = false
) {
  const slugger = new Slugger();
  const { value } = collectionBlock;
  let table: { [key: string]: any } = {};

  const collection = await queryCollection({
    collectionId: value.collection_id,
    collectionViewId: value.view_ids[0]
  });

  console.log(
    collection.recordMap.block["1dee455b-0466-4660-978a-6a1daf23789b"].value
      .format.page_cover
  );

  const entries = Object.values(collection.recordMap.block).filter(
    block =>
      block && block.value && block.value.parent_id === value.collection_id
  );

  const collectionId = Object.keys(collection.recordMap.collection)[0];

  const schema = collection.recordMap.collection[collectionId].value.schema;

  for (const entry of entries) {
    const props = entry.value && entry.value.properties;
    const row: {
      id: string;
      Slug: string;
      [key: string]: string[] | string | number | null;
    } = { id: "", Slug: "" };

    if (!props) continue;
    if (entry.value.content) row.id = entry.value.id;

    for (const key in schema) {
      let val: string | string[] | number = props[key] && props[key][0][0];

      if (val && props[key][0][1]) {
        const type = props[key][0][1][0];
        switch (type[0]) {
          case "a": // link
            val = type[1];
            break;

          case "u": // user
            val = (props[key] as any)
              .filter((arr: any[]) => arr.length > 1)
              .map((arr: any[]) => arr[1][0][1]);
            break;

          case "p": // page (block)
            let page;
            if (
              collection &&
              collection.recordMap &&
              collection.recordMap.block &&
              collection.recordMap.block[type[1]]
            ) {
              page = collection.recordMap.block[type[1]];
            }
            if (page && page.value && page.value.properties) {
              row.id = page.value.id;
              val = page.value.properties.title[0][0];
            } else {
              console.error(
                "Page provides no permission for linked page.\nA new query could be performed with `page.value.id` but it is deemed unnecessary."
              );
            }
            break;

          case "d":
            if (!type[1].start_date) break;
            // initial with provided date
            const providedDate = new Date(
              type[1].start_date + " " + (type[1].start_time || "")
            ).getTime();

            // calculate offset from provided time zone
            const timezoneOffset =
              new Date(
                new Date().toLocaleString("en-US", {
                  timeZone: type[1].time_zone
                })
              ).getTime() - new Date().getTime();

            // initialize subtracting time zone offset
            val = new Date(providedDate - timezoneOffset).getTime();
            break;
          default:
            console.error(
              "unknown type",
              type[0],
              JSON.stringify({ type }, null, 2)
            );
            break;
        }
      }
      if (typeof val === "string") {
        val = val.trim();
      }
      row[schema[key].name] = val || null;
    }

    // auto-generate slug from title
    row.Slug = normalizeSlug(row.Slug || slugger.slug(row.Name || ""));
    const key = row.Slug;

    function getPageCover(pageId: string) {
      const page = collection.recordMap.block[pageId];
      const pageCover =
        page && page.value && page.value.format && page.value.format.page_cover;
      return pageCover || "";
    }

    row.PageCover = getPageCover(row.id);

    console.log(row);
    if (isPosts && !key) continue;

    if (key) {
      table[key] = row;
    } else {
      if (!Array.isArray(table)) table = [];
      table.push(row);
    }
  }
  return table;
}
