import React from "react";
import getPosts, { PostRow } from "../../lib/blog/getPosts";
import { GetStaticProps } from "next";
import CollectionContent from "../../components/atoms/collection-content";
import Link from "next/link";
import { getPostLink } from "../../lib/blog/blog-helpers";

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  let posts = await getPosts({
    queryUsers: true,
    queryPageContent: true,
    separatePreviewContent: true,
    contentBlockLimit: 10,
  });
  posts = JSON.parse(JSON.stringify(posts));
  const props: BlogIndexProps = { preview, posts };
  return { props, revalidate: 10 };
};

export type BlogIndexProps = {
  posts: PostRow[];
  preview: boolean;
};

export default function BlogIndex({
  posts: items,
  preview,
}: BlogIndexProps): JSX.Element {
  const title = "Blog";
  const CollectionItem = (props) => (
    <div>
      <br />
      <Link href="/blog/[slug]" as={getPostLink(props.Slug)}>
        {JSON.stringify(props, null, 2)}
      </Link>
      <br />
      <hr />
    </div>
  );
  const collectionContentProps = { title, CollectionItem, items, preview };
  return <CollectionContent<PostRow> {...collectionContentProps} />;
}
