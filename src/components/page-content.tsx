import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { NotionPageContent } from "../lib/notion/getPageData";
import contentStyles from "./page-content.module.css";
import Header from "./header";
import PreviewAlert from "./preview-alert";
import ContentItem from "./content-item";

export type PageContentProps = {
  content: NotionPageContent;
  pageName: string;
  pageHead: JSX.Element | JSX.Element[];
  previewConfigs?: {
    active: boolean;
    key: string;
    value: string;
  };
};

export default function PageContent({
  content,
  pageHead,
  pageName,
  previewConfigs
}: PageContentProps): JSX.Element {
  const router = useRouter();
  let listTagName: string | null = null;
  let listLastId: string | null = null;
  let listMap: {
    [id: string]: {
      key: string;
      isNested?: boolean;
      nested: string[];
      children: React.ReactFragment;
    };
  } = {};

  if (router.isFallback) return <div>Loading...</div>;
  const PageHeader = (
    <>
      <Header titlePre={pageName} />
      <h1>{pageName || ""}</h1>
      {pageHead}
    </>
  );
  const Empty = <p>This post has no content</p>;
  const PageContent = content.map(ContentItem) || Empty;
  return (
    <div className={contentStyles.post}>
      {previewConfigs && previewConfigs.active && (
        <PreviewAlert
          previewKey={previewConfigs.key}
          previewValue={previewConfigs.value}
        />
      )}
      {PageHeader}
      <hr />
      {PageContent}
    </div>
  );
}
