import Link from "next/link";
import Header from "../../components/header";

import blogStyles from "../../styles/blog.module.css";
import sharedStyles from "../../styles/shared.module.css";

import { getDateStr, postIsPublished } from "../../lib/blog/blog-helpers";
import { textBlock } from "../../lib/notion/renderers";
import getPosts, { PostsTable } from "../../lib/blog/getPosts";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const posts = await getPosts();
  const props = { preview, posts };
  return { props, revalidate: 10 };
};

export type BlogIndexProps = {
  posts: PostsTable;
  preview: boolean;
};

export default function BlogIndex({
  posts,
  preview
}: BlogIndexProps): JSX.Element {
  return (
    <>
      <Header titlePre="Blog" />
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>My Blog</h1>
        {!Object.keys(posts).length && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
      </div>
    </>
  );
}
/** 
 {Object.values(posts).map(post => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              <h3>
                <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                  <div className={blogStyles.titleContainer}>
                    {!post.Published && (
                      <span className={blogStyles.draftBadge}>Draft</span>
                    )}
                    <a>{post.Name}</a>
                  </div>
                </Link>
              </h3>
              {post.Authors.length > 0 && (
                <div className="authors">By: {post.Authors.join(" ")}</div>
              )}
              {post.Date && (
                <div className="posted">Posted: {getDateStr(post.Date)}</div>
              )}
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  "No preview available"}
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
*/
