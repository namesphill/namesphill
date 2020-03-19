import fetch, { Response } from "node-fetch";
import { API_ENDPOINT, NOTION_TOKEN } from "../server/server-constants";

export type NotionBlock = {
  role: string;
  value: {
    id: string;
    version: number;
    type: string;
    properties: { title: [string[]] };
    content: string[];
    format: {
      page_icon: string;
      page_cover: string;
      page_cover_position: number;
    };
    permissions: {
      role: string;
      type: string;
      user_id: string;
    }[];
    collection_id: string;
    view_ids: string[];
    schema: { [key: string]: any };
    created_time: number;
    last_edited_time: number;
    parent_id: string;
    parent_table: string;
    alive: true;
    created_by_table: string;
    created_by_id: string;
    last_edited_by_table: string;
    last_edited_by_id: string;
    given_name: string;
    family_name: string;
  };
};

export type NotionBlockMap = { [key: string]: NotionBlock };

export type GenericNotionResult = {
  recordMap: {
    block: NotionBlockMap;
    notion_user: NotionBlockMap;
    comment: NotionBlockMap;
    space: NotionBlockMap;
    collection_view: NotionBlockMap;
    collection: NotionBlockMap;
  };
  result: {
    type: string;
    blockIds: string[];
    aggregationResults: any[];
    total: Number;
  };
  results: NotionBlock[];
  cursor: { stack: any[] };
};

export type NotionFunctionName =
  | "queryCollection"
  | "loadPageChunk"
  | "getRecordValues";

export type NotionLoadPageChunkBody = {
  pageId: string;
  limit: number;
  cursor: { stack: any[] };
  chunkNumber: number;
  verticalColumns: false;
};

export type NotionGetRecordValuesBody = {
  requests: {
    id: string;
    table: "notion_user";
  }[];
};

export type NotionQueryCollectionBody = {
  collectionId: string;
  collectionViewId: string;
  loader: {
    limit: number;
    loadContentCover: boolean;
    type: string;
    userLocale: string;
    userTimeZone: string;
  };
  query: {
    aggregate: {
      aggregation_type: string;
      id: string;
      property: string;
      type: string;
      view_type: string;
    }[];
    filter: any[];
    filter_operator: string;
    sort: any[];
  };
};

export interface NotionRequestBodies {
  queryCollection: NotionQueryCollectionBody;
  loadPageChunk: NotionLoadPageChunkBody;
  getRecordValues: NotionGetRecordValuesBody;
}

export interface NotionRequestResults {
  queryCollection: Pick<GenericNotionResult, "recordMap" | "result">;
  loadPageChunk: Pick<GenericNotionResult, "recordMap" | "cursor">;
  getRecordValues: Pick<GenericNotionResult, "results">;
}

export default async function rpc<T extends NotionFunctionName>(
  fnName: T,
  body: NotionRequestBodies[T]
): Promise<NotionRequestResults[T]> {
  if (!NOTION_TOKEN) throw new Error("NOTION_TOKEN is not set in `private.js`");

  const res = await fetch(`${API_ENDPOINT}/${fnName}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `token_v2=${NOTION_TOKEN}`
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    console.log("_____" + fnName + "_____");
    const obo = await res.json();
    console.log(Object.keys(obo).sort());
    console.log("__________________________________");
    return obo;
  } else {
    throw new Error(await getError(res));
  }
}

export async function getError(res: Response) {
  return `Notion API error (${res.status}) 
  ${getJSONHeaders(res)}
  ${await getBodyOrNull(res)}
  `;
}

export function getJSONHeaders(res: Response) {
  return JSON.stringify(res.headers.raw());
}

export function getBodyOrNull(res: Response) {
  try {
    return res.text();
  } catch (err) {
    return null;
  }
}

export function values(obj: any) {
  const vals: any = [];

  Object.keys(obj).forEach(key => {
    vals.push(obj[key]);
  });
  return vals;
}
