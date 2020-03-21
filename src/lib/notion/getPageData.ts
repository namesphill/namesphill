import { loadPageChunk } from "./loadPageChunk";
import { readFile, writeFile } from "../fs-helpers";

export default async function getPageData(
  pageId: string,
  config: { separatePreviewContent?: boolean; limit?: number } = {}
) {
  try {
    const { separatePreviewContent, limit } = config;
    const data = await loadPageChunk({ pageId, limit });
    const blocks = Object.values(data.recordMap.block);
    if (blocks[0] && blocks[0].value.content) blocks.splice(0, 3);
    const fullContent = parseBlocks(blocks);
    if (separatePreviewContent) {
      const [previewContent, content] = splitContent(fullContent);
      return { blocks, content, previewContent };
    }
    return { blocks, content: fullContent, previewContent: [] };
  } catch (err) {
    console.error(`Failed to load pageData for ${pageId}`, err);
    return { blocks: [], content: [], previewContent: [] };
  }
}

export type ExtraProperties = {
  id: string;
  language?: string;
  html?: string;
  file_ids?: string[];
} & Partial<NotionBlock["value"]["format"]>;

export type NotionContentItem = [
  NotionBlockType,
  RichTextProp,
  ExtraProperties
];

export type NotionPageContent = NotionContentItem[];

export function parseBlocks(blocks: NotionBlock[]): NotionPageContent {
  const content: NotionPageContent = [];
  for (const block of blocks) {
    const { value } = block;
    const { type, properties, format = {}, id, file_ids } = value;
    if (properties) {
      const { title } = properties;
      if (type === "tweet") {
        const html = (properties.html as any) as string;
        content.push([type, title, { html, id }]);
      } else if (type === "code") {
        const language = (properties.language as TextProp)[0][0];
        content.push([type, title, { language, id }]);
      } else if (type === "image" || type === "video" || type === "embed") {
        content.push([type, title, { ...format, file_ids, id }]);
      } else {
        content.push([type, title, { id }]);
      }
    }
  }
  return content;
}

const nonPreviewTypes = new Set(["editor", "page", "collection_view"]);
export function splitContent(content: NotionPageContent) {
  const dividerIndex = content.findIndex(([type]) => type === "divider");
  const previewBlocks = content
    .splice(0, dividerIndex)
    .filter(([type]) => !nonPreviewTypes.has(type));
  const contentBlocks = content.splice(dividerIndex);
  return [previewBlocks, contentBlocks];
}
