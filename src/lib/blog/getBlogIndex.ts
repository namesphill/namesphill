import { Sema } from "async-sema";
import getCollectionData from "../notion/getCollectionData";
import { getPostPreview } from "../notion/getPostPreview";
import { readFile, writeFile } from "../fs-helpers";
import { BLOG_INDEX_ID, BLOG_INDEX_CACHE } from "../server/server-constants";
import { loadPageChunk } from "../notion/loadPageChunk";

export default async function getBlogIndex({ includePreviews = true } = {}) {
  let postsTable: any = null;
  const useCache = process.env.USE_CACHE === "true";
  const cacheFile = `${BLOG_INDEX_CACHE}${includePreviews ? "_previews" : ""}`;

  if (useCache) {
    try {
      postsTable = JSON.parse(await readFile(cacheFile, "utf8"));
    } catch {}
  }

  if (!postsTable) {
    try {
      const data = await loadPageChunk({ pageId: BLOG_INDEX_ID });

      // Parse table with posts
      const tableBlock = Object.values(data.recordMap.block).find(
        block => block.value.type === "collection_view"
      );

      postsTable = await getCollectionData(tableBlock, true);
    } catch (err) {
      console.warn(`Failed to load Notion posts: ${err}`);
      return {};
    }

    // only get 10 most recent post's previews
    const postsKeys = Object.keys(postsTable).splice(0, 10);

    const sema = new Sema(3, { capacity: postsKeys.length });

    if (includePreviews) {
      await Promise.all(
        postsKeys
          .sort((a, b) => {
            const postA = postsTable[a];
            const postB = postsTable[b];
            const timeA = postA.Date;
            const timeB = postB.Date;
            return Math.sign(timeB - timeA);
          })
          .map(async postKey => {
            await sema.acquire();
            const post = postsTable[postKey];
            post.preview = post.id ? await getPostPreview(post.id) : [];
            sema.release();
          })
      );
    }

    if (useCache)
      writeFile(cacheFile, JSON.stringify(postsTable), "utf8").catch(() => {});
  }

  return postsTable;
}
