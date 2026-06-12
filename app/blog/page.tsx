import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { allBlogs } from '@/content/blogs'
import { liveTools } from '@/lib/config/tools'
import { SITE_NAME, SITE_URL, toolUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: `Audio Tools Blog — ${SITE_NAME}`,
  description: `Tips, guides, and tutorials for every audio tool on ${SITE_NAME}. Learn how to cut, convert, compress, and clean audio for free.`,
  alternates: { canonical: `${SITE_URL}/blog` },
}

const toolMap = Object.fromEntries(liveTools.map((t) => [t.slug, t]))

function BlogCard({ blog }: { blog: (typeof allBlogs)[0] }) {
  const tool = toolMap[blog.toolSlug]
  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <Card interactive className="h-full p-5 transition-shadow group-hover:shadow-lg">
        <div className="mb-3 flex items-center gap-2">
          {/* Tool badge — plain span to avoid nested <a> elements */}
          {tool && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {tool.name}
            </span>
          )}
          <span className="text-xs text-muted">{blog.readTime} min read</span>
        </div>
        <h2 className="mb-2 text-base font-semibold leading-snug text-fg group-hover:text-primary">
          {blog.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted line-clamp-3">{blog.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  )
}

export default function BlogPage() {
  const byTool = liveTools
    .map((tool) => ({
      tool,
      posts: allBlogs.filter((b) => b.toolSlug === tool.slug),
    }))
    .filter((g) => g.posts.length > 0)

  return (
    <div className="py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-fg">Audio Tools Blog</h1>
        <p className="mt-2 text-muted">
          Guides, tips, and tutorials for every audio tool on{' '}
          <Link href="/" className="text-primary hover:underline">
            {SITE_NAME}
          </Link>
          .
        </p>
        <p className="mt-1 text-sm text-muted">
          {allBlogs.length} articles · {liveTools.length} tools covered
        </p>
      </div>

      <div className="flex flex-col gap-14">
        {byTool.map(({ tool, posts }) => (
          <div key={tool.slug}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-fg">{tool.name}</h2>
              <Link
                href={toolUrl(tool.slug)}
                className="text-sm text-primary hover:underline"
                target="_blank"
                rel="noopener"
              >
                Open tool →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
