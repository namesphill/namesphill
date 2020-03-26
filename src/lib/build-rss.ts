import { resolve } from "path";
import { writeFile } from "./fs-helpers";
import { renderToStaticMarkup } from "react-dom/server";
import getPosts, { PostRow } from "./blog/getPosts";
import { postIsPublished, getPostLink } from "./blog/blog-helpers";
import RichText from "../components/cells/rich-text";
import { NotionUser } from "./notion/getUsers";

// must use weird syntax to bypass auto replacing of NODE_ENV
process.env["NODE" + "_ENV"] = "production";
process.env.USE_CACHE = "true";

// constants
const NOW = new Date().toJSON();

const authorToEntry = (author: NotionUser) =>
  `<author><name>${author.full_name}</name></author>`;

function decode(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function postToEntry(post: PostRow) {
  const {
    Date: [, date = new Date()],
    Name: [, title = ""],
    Preview: [, preview = []],
    Authors: [, authors = []],
    Slug,
    id: key,
  } = post;
  const link = getPostLink(Slug);
  const previewJSX = preview.map((content) => RichText({ content, key }));
  return `
    <entry>
      <id>${link}</id>
      <title>${decode(title)}</title>
      <link href="${link}"/>
      <updated>${date.toJSON()}</updated>
      <content type="xhtml">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${renderToStaticMarkup(previewJSX)}
          <p class="more">
            <a href="${link}">Read more</a>
          </p>
        </div>
      </content>
      ${authors.map(authorToEntry).join("\n      ")}
    </entry>`;
}

function createRSS(blogPosts: PostRow[] = []) {
  const postsString = blogPosts.map(postToEntry).join("");
  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>My Blog</title>
    <subtitle>Blog</subtitle>
    <link href="/atom" rel="self" type="application/rss+xml"/>
    <link href="/" />
    <updated>${NOW}</updated>
    <id>My Notion Blog</id>${postsString}
  </feed>`;
}

async function main() {
  const postsTable = await getPosts();
  const blogPosts = Object.values(postsTable);
  const publishedPosts = blogPosts.filter(postIsPublished);
  const outputPath = "./public/atom";
  await writeFile(resolve(outputPath), createRSS(publishedPosts));
  console.info(`Atom feed file generated at \`${outputPath}\``);
}

main().catch((error) => console.error(error));
