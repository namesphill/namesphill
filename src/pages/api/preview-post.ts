import { NextApiRequest, NextApiResponse } from "next";
import getPageData from "../../lib/notion/getPageData";
import getPosts from "../../lib/blog/getPosts";
import { getPostLink } from "../../lib/blog/blog-helpers";
import { NOTION_TOKEN } from "../../private";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.query.token !== "string") {
    return res.status(401).json({ message: "invalid token" });
  }
  if (req.query.token !== NOTION_TOKEN) {
    return res.status(404).json({ message: "not authorized" });
  }

  if (typeof req.query.slug !== "string") {
    return res.status(401).json({ message: "invalid slug" });
  }
  const postsTable = await getPosts();
  const post = postsTable[req.query.slug];

  if (!post) {
    console.error(`Failed to find post for slug: ${req.query.slug}`);
    return {
      props: {
        redirect: "/blog"
      },
      revalidate: 5
    };
  }

  const postData = await getPageData(post.id);

  if (!postData) {
    return res.status(401).json({ message: "Invalid slug" });
  }

  res.setPreviewData({});
  res.writeHead(307, { Location: getPostLink(post.Slug) });
  res.end();
};
