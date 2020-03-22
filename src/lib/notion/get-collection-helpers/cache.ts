import {
  GetCollectionDataConfigs,
  CollectionRow,
  CollectionTable,
} from "../getCollectionData";
import { readFile, writeFile } from "../../fs-helpers";

const path = require("path");

export function getCacheFile(
  collectionBlock: NotionBlock,
  configs: GetCollectionDataConfigs
) {
  const { value } = collectionBlock;
  const collectionId = value.collection_id;
  const collectionViewId = value.view_ids[0];

  const cacheFileSuffix = Object.entries(configs)
    .map(([key, value]) => key + "_" + Number(value))
    .filter(Boolean)
    .join("__");
  const cacheIndex = `.${collectionId}_${collectionViewId}_index_data`;
  const CLLXN_INDEX_CACHE: string = path.resolve(cacheIndex);
  const cacheFile = `${CLLXN_INDEX_CACHE}${cacheFileSuffix}`;
  return cacheFile;
}

export async function readCache<T extends CollectionRow>(cacheFile: string) {
  let table: CollectionTable<T> = {};
  const useCache = process.env.USE_CACHE === "true";
  if (useCache) {
    try {
      const cacheContents = await readFile(cacheFile, "utf8");
      table = JSON.parse(cacheContents) as CollectionTable<T>;
      return table;
    } catch (e) {
      console.error(`NON FATAL: error reading cache file`);
      return table;
    }
  }
  return table;
}

export function writeCache<T extends CollectionRow>(
  cacheFile: string,
  table: CollectionTable<T>
) {
  const useCache = process.env.USE_CACHE === "true";
  if (useCache) {
    const dateString = new Date().toDateString();
    const timeString = new Date().toTimeString();
    const dateTimeString = dateString + timeString;
    writeFile(cacheFile, JSON.stringify(table), "utf8")
      .then((_) => console.info(`Success writing cache file ${dateTimeString}`))
      .catch((e) => console.error(`Error writing cache file: ${e}`));
  }
}
