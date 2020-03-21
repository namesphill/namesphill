import { loadPageChunk } from "./loadPageChunk";

const nonPreviewTypes = new Set(["editor", "page", "collection_view"]);

export async function getPagePreview(pageId: string) {
  const data = await loadPageChunk({ pageId, limit: 10 });
  const blocks = Object.values(data.recordMap.block);
  const blockIsDivider = ({ value: { type } }) => type === "divider";
  const dividerIndex = blocks.findIndex(blockIsDivider);
  const blockIsPreviewable = ({ value }) => !nonPreviewTypes.has(value.type);
  const blockHasProperties = ({ value }) => Boolean(value.properties);
  const previewBlocks = blocks
    .splice(0, dividerIndex)
    .filter(blockIsPreviewable)
    .filter(blockHasProperties)
    .map(block => block.value.properties.title);
  return previewBlocks;
}
