export interface BlogPost {
  slug: string
  title: string
  toolSlug: string
  excerpt: string
  /** Markdown content. Use [TOOL_LINK] as a placeholder — replaced at render time with the actual tool URL. */
  content: string
  publishedAt: string
  tags: string[]
  readTime: number
}
