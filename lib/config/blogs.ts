/**
 * Blog utilities — all blog content lives in content/blogs/.
 * Import { allBlogs } from there; use helpers here for queries.
 */
export type { BlogPost } from '@/content/blogs'
export { allBlogs } from '@/content/blogs'

import { allBlogs } from '@/content/blogs'
import { SITE_NAME, SITE_URL, toolUrl } from '@/lib/site'

/** Resolve [TOOL_LINK] and [SITE_NAME] placeholders in blog content. */
export function resolveBlogContent(content: string, toolSlug: string): string {
  return content
    .replaceAll('[TOOL_LINK]', toolUrl(toolSlug))
    .replaceAll('[SITE_NAME]', SITE_NAME)
    .replaceAll('[SITE_URL]', SITE_URL)
}

export function getBlogsByTool(toolSlug: string) {
  return allBlogs.filter((b) => b.toolSlug === toolSlug)
}

export function getBlogBySlug(slug: string) {
  return allBlogs.find((b) => b.slug === slug)
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  allBlogs.forEach((b) => b.tags.forEach((t) => tags.add(t)))
  return Array.from(tags)
}

export function getRelatedBlogs(slug: string, toolSlug: string, limit = 3) {
  return allBlogs.filter((b) => b.slug !== slug && b.toolSlug === toolSlug).slice(0, limit)
}
