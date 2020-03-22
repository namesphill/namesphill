import PageContent, { PageContentProps } from "../../components/page-content";
import { GetStaticProps, GetStaticPaths } from "next";
import getPosts from "../../lib/blog/getPosts";
import { getPostLink, postIsPublished } from "../../lib/blog/blog-helpers";

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const slug = params.slug as string;
  const posts = await getPosts({
    queryUsers: true,
    queryPageContent: true,
    separatePreviewContent: true
  });
  const post = posts.find(({ Slug }) => slug === Slug);
  const { Content, Name } = post;
  const props: PageContentProps = {
    content: Content[1],
    name: Name[1],
    heading: <>[Heading]</>,
    previewConfigs: {
      active: preview,
      key: "slug",
      value: slug
    }
  };
  return { props, preview };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsTable = await getPosts();
  const posts = Object.values(postsTable);
  const paths = posts
    .filter(postIsPublished)
    .map(({ Slug }) => getPostLink(Slug));
  return { paths, fallback: true };
};

export default PageContent;
