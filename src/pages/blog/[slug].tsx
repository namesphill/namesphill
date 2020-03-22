import PageContent, { PageContentProps } from "../../components/page-content";
import { GetStaticProps, GetStaticPaths } from "next";
import getPosts from "../../lib/blog/getPosts";
import { getPostLink, postIsPublished } from "../../lib/blog/blog-helpers";

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const slug = params.slug as string;
  const posts = await getPosts({
    queryUsers: true,
    queryPageContent: true,
    separatePreviewContent: true,
  });
  const post = posts.find(({ Slug }) => slug === Slug);
  console.log(JSON.stringify(post, null, 3));
  const { PageContent, Name } = post;
  const props: PageContentProps = {
    content: PageContent[1],
    name: Name,
    previewConfigs: {
      active: preview || false,
      key: "slug",
      value: slug,
    },
  };
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

export type BlogProps = NonNullable<
  Pick<PageContentProps, "content" | "previewConfigs" | "heading">
>;

export default function Blog(props: BlogProps) {
  return <PageContent {...props} heading={<>[Heading]</>} />;
}
