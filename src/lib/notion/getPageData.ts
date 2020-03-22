import fetch from "node-fetch";
import { loadPageChunk } from "./loadPageChunk";

export default async function getPageData(
  pageId: string,
  config: { separatePreviewContent?: boolean; limit?: number } = {}
) {
  try {
    const { separatePreviewContent, limit } = config;
    const data = await loadPageChunk({ pageId, limit });
    const blocks = Object.values(data.recordMap.block);
    if (blocks[0] && blocks[0].value.content) blocks.splice(0, 3);
    const fullContent = await parseBlocks(blocks);
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

const getTweetId = (source: string) => source.split("/")[5].split("?")[0];
export async function parseBlocks(
  blocks: NotionBlock[]
): Promise<NotionPageContent> {
  const content: NotionPageContent = [];
  let index = 0;
  for (const block of blocks) {
    const { value } = block;
    const { type, properties, format = {}, id, file_ids } = value;
    if (index === 0 && type === "page") continue;
    if (type === "divider") content.push(["divider", [[""]], { id }]);
    if (properties) {
      const { title = [[""]] } = properties;
      if (type === "tweet") {
        const source = (properties.source as TextProp)[0][0];
        const tweetId = getTweetId(source);
        if (!tweetId) continue;
        try {
          const url = `https://api.twitter.com/1/statuses/oembed.json?id=${tweetId}`;
          const res = await fetch(url);
          const json = await res.json();
          const html = json.html.split("<script")[0];
          content.push([type, title, { html, id }]);
        } catch (e) {
          console.error(`Failed to get tweet embed for ${source}: ${e}`);
        }
      } else if (type === "code") {
        const language = (properties.language as TextProp)[0][0];
        content.push([type, title, { language, id }]);
      } else if (type === "image" || type === "video" || type === "embed") {
        content.push([type, title, { ...format, file_ids, id }]);
      } else {
        content.push([type, title, { id }]);
      }
    }
    index++;
  }
  return content;
}

const nonPreviewTypes = new Set<NotionBlockType>(["page", "collection_view"]);
export function splitContent(content: NotionPageContent) {
  const dividerIndex = content.findIndex(([type]) => type === "divider");
  const previewBlocks = content
    .splice(0, dividerIndex)
    .filter(([type]) => !nonPreviewTypes.has(type));
  return [previewBlocks, content.slice(1)];
}
