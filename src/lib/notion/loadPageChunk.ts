import rpc from "./rpc";

export function loadPageChunk({
  pageId,
  limit = 999,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false
}: any) {
  return rpc("loadPageChunk", {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns
  });
}
