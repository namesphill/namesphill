import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { NotionPageContent } from "../../lib/notion/getPageData";
import Header from "./header";
import PreviewAlert from "./preview-alert";
import ContentItem from "../atoms/content-item";
import styles from "./page-content.module.scss";

export type PageContentProps = {
  content?: NotionPageContent;
  name?: string;
  heading?: JSX.Element | JSX.Element[];
  previewConfigs?: {
    active: boolean;
    key: string;
    value: string;
  };
};

export default function PageContent({
  content = [],
  heading = <div>[Page Heading]</div>,
  name = "[No Title]",
  previewConfigs,
}: PageContentProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) return <div>Loading...</div>;
  const PageHeader = (
    <>
      <Header pageTitle={name} />
      <h1>{name}</h1>
      {heading}
    </>
  );
  const Empty = <p>This page has no content</p>;
  const PageContent = content.length ? content.map(ContentItem) : Empty;
  return (
    <div className={styles.page}>
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
