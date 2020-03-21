import Link from "next/link";
import Header from "../../components/header";

import blogStyles from "../../styles/blog.module.css";
import sharedStyles from "../../styles/shared.module.css";

import {
  getBlogLink,
  getDateStr,
  postIsPublished
} from "../../lib/blog-helpers";
import { textBlock } from "../../lib/notion/renderers";
import getNotionUsers from "../../lib/notion/getNotionUsers";
import getBlogTable from "../../lib/blog/getBlogTable";

export async function getStaticProps({ preview }) {
  await getNotionUsers(["4e919141-98cf-4ec0-b969-3476645cd6e2"]);
  const postsTable = await getBlogTable();
  console.log(JSON.stringify(postsTable, null, 3));
  return {
    props: {
      preview: preview || false,
      posts: []
    },
    revalidate: 10
  };
}

export default ({ posts = [], preview }) => {
  return (
    <>
      <Header titlePre="Blog" />
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
};
