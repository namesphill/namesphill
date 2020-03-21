import getPosts from "./getPosts";
import getPageData from "../notion/getPageData";

export default async function getPost(
  slug: string,
  configs: { includeUnpublished?: boolean } = {}
) {
  const { includeUnpublished } = configs;
  const postsTable = await getPosts();
  const post = postsTable[slug];
  const [, published] = post.Published;
  if (!includeUnpublished && !published) return null;
  const postData = await getPageData(post.id);
  post.Content = postData.blocks;
}
