import PageContent, {
  PageContentProps,
} from "../../components/atoms/page-content";
import { GetStaticProps, GetStaticPaths } from "next";
import getPosts from "../../lib/blog/getPosts";
import {
  getPostLink,
  postIsPublished,
  getDateString,
} from "../../lib/blog/blog-helpers";
import { NotionUser } from "../../lib/notion/getUsers";
import UserCard from "../../components/atoms/user";

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const slug = params.slug as string;
  const posts = await getPosts({
    queryUsers: true,
    queryPageContent: true,
    separatePreviewContent: true,
  });
  const post = posts.find(({ Slug }) => slug === Slug);
  const {
    PageContent: [, content],
    Name: name,
    Authors: [, authors],
    Date: [, date],
  } = post;
  let props: BlogProps = {
    content,
    name,
    authors,
    dateString: getDateString(date),
    previewConfigs: {
      active: preview || false,
      key: "slug",
      value: slug,
    },
  };
  props = JSON.parse(JSON.stringify(props));
  return { props };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsTable = await getPosts();
  const posts = Object.values(postsTable);
  const paths = posts
    .filter(postIsPublished)
    .map(({ Slug }) => getPostLink(Slug));
  return { paths, fallback: true };
};

export interface BlogProps
  extends NonNullable<
    Pick<PageContentProps, "content" | "previewConfigs" | "heading" | "name">
  > {
  authors: NotionUser[];
  dateString: string;
}

export function BlogHeading(props: BlogProps) {
  const { authors, dateString } = props;
  return (
    <>
      <div>
        {authors.map((user) => (
          <UserCard {...user} caption="Author" />
        ))}
      </div>
      <div>Published: {dateString}</div>
    </>
  );
}

export default function Blog(props: BlogProps) {
  return <PageContent {...props} heading={BlogHeading(props)} />;
}
