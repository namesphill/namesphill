import { NotionRequestResults } from "../rpc";
import {
  GetCollectionDataConfigs,
  CollectionRow,
  CollectionProperty,
} from "../getCollectionData";
import getPageData from "../getPageData";
import getDateFromProp from "./getDateProps";
import normalizeSlug from "./normalizeSlug";
import Slugger from "github-slugger";

const slugger = new Slugger();

export default async function getRowsFromCollection<T extends CollectionRow>(
  collection: NotionRequestResults["queryCollection"],
  collectionId: string,
  configs: GetCollectionDataConfigs
): Promise<T[]> {
  const {
    contentBlockLimit,
    separatePreviewContent,
    queryPageContent,
  } = configs;

  const blocks = Object.values(collection.recordMap.block);
  const isCollectionChild = ({ value }) => value.parent_id === collectionId;
  const entries = blocks.filter(isCollectionChild);
  const { schema } = Object.values(collection.recordMap.collection)[0].value;

  const rows: T[] = [];

  for (const entry of entries) {
    const props = entry.value && entry.value.properties;

    const row: CollectionRow = {
      id: "",
      Slug: "",
      Name: "",
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
      } else if (columnName === "Name") {
        row.Name = String(cell[1]);
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

    row.Slug = normalizeSlug(
      row.Slug || slugger.slug((row.Name && row.Name[1]) || "")
    );

    if (row.Slug) rows.push(row as T);
  }
  return rows;
}
