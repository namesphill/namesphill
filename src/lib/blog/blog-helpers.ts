import { PostRow } from "./getPosts";

export const getPostLink = (slug: string) => `/blog/${slug}`;

const localeConfigs = {
  month: "long",
  day: "2-digit",
  year: "numeric"
};
export const getDateStr = (date: Date) =>
  date.toLocaleString("en-US", localeConfigs);

export const postIsPublished = (post: PostRow) => post.Published[1];
