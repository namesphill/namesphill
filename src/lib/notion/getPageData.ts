import rpc, { values } from "./rpc";
import { loadPageChunk } from "./loadPageChunk";

export default async function getPageData(pageId: string) {
  try {
    const data = await loadPageChunk({ pageId });
    const blocks = values(data.recordMap.block);

    // remove table blocks
    if (blocks[0] && blocks[0].value.content) blocks.splice(0, 3);

    return { blocks };
  } catch (err) {
    console.error(`Failed to load pageData for ${pageId}`, err);
    return { blocks: [] };
  }
}
