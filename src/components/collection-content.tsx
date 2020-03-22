import React from "react";
import PreviewAlert from "./preview-alert";
import Header from "./header";

export type CollectionContentProps<T> = {
  title: string;
  CollectionItem: (props: T) => JSX.Element;
  items: T[];
  preview: boolean;
};

export default function CollectionContent<T>(
  props: CollectionContentProps<T>
): JSX.Element {
  const { title, CollectionItem, items, preview } = props;
  const PageHeader = <Header titlePre={title} />;
  const Empty = <p>There are no posts yet</p>;
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