import { Sema } from "async-sema";
import getCollectionData, {
  CollectionTable,
  CollectionPropertyMap,
  CollectionRow
} from "../notion/getCollectionData";
import { readFile, writeFile } from "../fs-helpers";
import { BLOG_INDEX_ID } from "../notion/server/server-constants";
import { loadPageChunk } from "../notion/loadPageChunk";

export interface PostRow extends CollectionRow {
  Date: CollectionPropertyMap["date"];
  Published: CollectionPropertyMap["checked"];
  Publication: CollectionPropertyMap["text"];
  Authors: CollectionPropertyMap["users"];
  Name: CollectionPropertyMap["text"];
  Preview: CollectionPropertyMap["richText"];
  Content: CollectionPropertyMap["pageContent"];
}
export type PostsTable = CollectionTable<PostRow>;
export default async function getPosts({ includePreviews = true } = {}) {
  let postsTable: PostsTable = null;
  const useCache = process.env.USE_CACHE === "true";
  const cacheFile = `${"CLLXN_INDEX_CACHE"}${
    includePreviews ? "_previews" : ""
  }`;

  if (useCache) {
    try {
      postsTable = JSON.parse(await readFile(cacheFile, "utf8"));
    } catch {}
  }

  if (!postsTable) {
    try {
      const data = await loadPageChunk({ pageId: BLOG_INDEX_ID });
      const blockIsCollxnView = ({ value }) => value.type === "collection_view";
      const pageBlocks = Object.values(data.recordMap.block);
      const tableBlock = pageBlocks.find(blockIsCollxnView);
      const config = { queryUsers: true };
      postsTable = await getCollectionData<PostRow>(tableBlock, config);
    } catch (err) {
      console.warn(`Failed to load Notion posts: ${err}`);
      return {};
    }

    const sema = new Sema(3, { capacity: Object.keys(postsTable).length });
    if (includePreviews) {
      await Promise.all(
        Object.keys(postsTable)
          .sort((a, b) => {
            const [_, timeA] = postsTable[a].Date;
            const [__, timeB] = postsTable[b].Date;
            return Math.sign(timeB.getTime() - timeA.getTime());
          })
          .map(async postKey => {
            await sema.acquire();
            const post = postsTable[postKey];
            const previewBlocks = post.id ? await getPagePreview(post.id) : [];
            post.Preview = ["richText", previewBlocks];
            sema.release();
          })
      );
    }
  }

  return postsTable;
}
