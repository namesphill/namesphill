import { loadPageChunk } from "./loadPageChunk";

export default async function getPageData(pageId: string) {
  try {
    const data = await loadPageChunk({ pageId });
    const blocks = Object.values(data.recordMap.block);
    if (blocks[0] && blocks[0].value.content) blocks.splice(0, 3);
    return { blocks, content: parseBlocks(blocks) };
  } catch (err) {
    console.error(`Failed to load pageData for ${pageId}`, err);
    return { blocks: [], content: [] };
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
