/**
 * Creates default slug or normalizes one
 * @param slug Base slug
 */
export default function normalizeSlug(slug: string): string {
  let startingSlash = slug.startsWith("/");
  let endingSlash = slug.endsWith("/");

  if (startingSlash) slug = slug.substr(1);
  if (endingSlash) slug = slug.substr(0, slug.length - 1);

  return startingSlash || endingSlash ? normalizeSlug(slug) : slug;
}
