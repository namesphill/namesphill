import React from "react";
import { NotionContentItem } from "../lib/notion/getPageData";
import RichText from "./rich-text";
import Media from "./media";
import Code from "./code";
import Callout from "./callout";
import Tweet from "./tweet";
export default function ContentItem(props: NotionContentItem): JSX.Element {
  const [
    type,
    content,
    { id, html, language, file_ids, ...format } = {
      html: "",
      language: "",
      id: "",
      file_ids: [],
    },
  ] = props;
  const [[text]] = content || [[""]];
  if (type === "divider") return <hr />;
  if (type === "text") return <RichText content={content} />;
  if (type === "header") return <h1>{text}</h1>;
  if (type === "sub_header") return <h2>{text}</h2>;
  if (type === "sub_sub_header") return <h3>{text}</h3>;
  if (type === "quote") return <blockquote>{text}</blockquote>;
  if (type === "image") return <Media {...{ type, format, id }} />;
  if (type === "video") return <Media {...{ type, format, id }} />;
  if (type === "embed") return <Media {...{ type, format, file_ids, id }} />;
  if (type === "code") return <Code {...({ language, content } as any)} />;
  if (type === "callout") return <Callout content={content} format={format} />;
  if (type === "page") return <>[Page]</>;
  if (type === "collection_view") return <>[Collection View]</>;
  if (type === "tweet") return <Tweet html={html} />;
  return <></>;
}
