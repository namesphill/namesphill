import React from "react";
import PreviewAlert from "./preview-alert";
import Header from "./header";

export type CollectionContentProps<T> = {
  title: string;
  CollectionItem: (props: T) => JSX.Element;
  items: T[];
  preview: boolean;
  emptyMessage?: string;
};

export default function CollectionContent<T>(
  props: CollectionContentProps<T>
): JSX.Element {
  const {
    title,
    CollectionItem,
    items,
    preview,
    emptyMessage = "Oh, such empty",
  } = props;
  const PageHeader = <Header titlePre={title} />;
  const Empty = <p style={{ textAlign: "center" }}>{emptyMessage}</p>;
  const PageContent = items.length ? items.map(CollectionItem) : Empty;
  return (
    <div>
      {preview && <PreviewAlert />}
      {PageHeader}
      <hr />
      {PageContent}
    </div>
  );
}
