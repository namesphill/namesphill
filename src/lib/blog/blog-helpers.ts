import { PostRow } from "./getPosts";

export const getPostLink = (slug: string) => `/blog/${slug}`;

export function getDateString(date: Date) {
  const localeConfigs = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleString("en-US", localeConfigs);
}

export const postIsPublished = (post: PostRow) => post.Published[1];
