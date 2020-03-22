import getCollectionData, {
  CollectionTable,
  CollectionPropertyMap,
  CollectionRow,
  GetCollectionDataConfigs,
} from "../notion/getCollectionData";
import { BLOG_INDEX_ID } from "../server/server-constants";
import { loadPageChunk } from "../notion/loadPageChunk";

export interface PostRow extends CollectionRow {
  Date: CollectionPropertyMap["date"];
  Published: CollectionPropertyMap["checked"];
  Publication: CollectionPropertyMap["text"];
  Authors: CollectionPropertyMap["users"];
}

export type PostsTable = CollectionTable<PostRow>;

export default async function getPosts(configs: GetCollectionDataConfigs = {}) {
  let postsTable: PostsTable = {};
  try {
    const data = await loadPageChunk({ pageId: BLOG_INDEX_ID });
    const blockIsCollxnView = ({ value }) => value.type === "collection_view";
    const pageBlocks = Object.values(data.recordMap.block);
    const tableBlock = pageBlocks.find(blockIsCollxnView);
    postsTable = await getCollectionData<PostRow>(tableBlock, configs);
  } catch (error) {
    console.warn(`Failed to load Notion posts: ${error}`);
    return [];
  }
  return Object.values(postsTable);
}
