import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { NotionPageContent } from "../lib/notion/getPageData";
import contentStyles from "./page-content.module.css";
import Header from "./header";
import PreviewAlert from "./preview-alert";
import ContentItem from "./content-item";

export type PageContentProps = {
  content?: NotionPageContent;
  pageName?: string;
  pageHeading?: JSX.Element | JSX.Element[];
  previewConfigs?: {
    active: boolean;
    key: string;
    value: string;
  };
};

export default function PageContent({
  content = [],
  pageHeading = <div>[Page Heading]</div>,
  pageName = "[No Title]",
  previewConfigs
}: PageContentProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) return <div>Loading...</div>;
  const PageHeader = (
    <>
      <Header titlePre={pageName} />
      <h1>{pageName || ""}</h1>
      {pageHeading}
    </>
  );
  const Empty = <p>This page has no content</p>;
  const PageContent = content.length ? content.map(ContentItem) : Empty;
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
