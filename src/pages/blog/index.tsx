import React from "react";
import getPosts, { PostRow } from "../../lib/blog/getPosts";
import { GetStaticProps } from "next";
import CollectionContent from "../../components/collection-content";
import Link from "next/link";
import { getPostLink } from "../../lib/blog/blog-helpers";

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  let posts = await getPosts({
    queryUsers: true,
    queryPageContent: true,
    separatePreviewContent: true,
    contentBlockLimit: 10
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
  preview
}: BlogIndexProps): JSX.Element {
  const title = "Blog";
  const CollectionItem = props => (
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
/** 
  <Header titlePre="Blog" />
  {preview && (
    <div className={blogStyles.previewAlertContainer}>
      <div className={blogStyles.previewAlert}>
        <b>Note:</b>
        {` `}Viewing in preview mode{' '}
        <Link href={`/api/clear-preview`}>
          <button className={blogStyles.escapePreview}>Exit Preview</button>
        </Link>
      </div>
    </div>
  )}
  <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
    <h1>My Notion Blog</h1>
    {posts.length === 0 && (
      <p className={blogStyles.noPosts}>There are no posts yet</p>
    )}
    {posts.map(post => {
      return (
        <div className={blogStyles.postPreview} key={post.Slug}>
          <h3>
            <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
              <div className={blogStyles.titleContainer}>
                {!post.Published && (
                  <span className={blogStyles.draftBadge}>Draft</span>
                )}
                <a>{post.Page}</a>
              </div>
            </Link>
          </h3>
          {post.Authors.length > 0 && (
            <div className="authors">By: {post.Authors.join(' ')}</div>
          )}
          {post.Date && (
            <div className="posted">Posted: {getDateStr(post.Date)}</div>
          )}
          <p>
            {(!post.preview || post.preview.length === 0) &&
              'No preview available'}
            {(post.preview || []).map((block, idx) =>
              textBlock(block, true, `${post.Slug}${idx}`)
            )}
          </p>
        </div>
      )
    })}
  </div>
*/
