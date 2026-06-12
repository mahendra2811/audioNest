import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer'
import { JsonLd } from '@/components/seo/JsonLd'
import { Card } from '@/components/ui/Card'
import { allBlogs } from '@/content/blogs'
import { getBlogBySlug, getRelatedBlogs, resolveBlogContent } from '@/lib/config/blogs'
import { liveTools } from '@/lib/config/tools'
import { SITE_NAME, SITE_URL, blogUrl, toolUrl } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allBlogs.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = getBlogBySlug(slug)
  if (!blog) return {}
  return {
    title: `${blog.title} — ${SITE_NAME}`,
    description: blog.excerpt,
    alternates: { canonical: blogUrl(slug) },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt,
      tags: blog.tags,
      siteName: SITE_NAME,
    },
    keywords: blog.tags,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)
  if (!blog) notFound()

  const tool = liveTools.find((t) => t.slug === blog.toolSlug)
  const related = getRelatedBlogs(slug, blog.toolSlug, 3)
  const resolvedContent = resolveBlogContent(blog.content, blog.toolSlug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.publishedAt,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    keywords: blog.tags.join(', '),
    url: blogUrl(slug),
  }

  return (
    <div className="py-10">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-fg">Blog</Link>
        {tool && (
          <>
            <span>/</span>
            <span className="text-fg">{tool.name}</span>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        {/* Main article */}
        <article>
          <header className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {tool && (
                <Link
                  href={toolUrl(tool.slug)}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                  target="_blank"
                  rel="noopener"
                >
                  {tool.name}
                </Link>
              )}
              <span className="text-xs text-muted">{blog.readTime} min read</span>
              <time className="text-xs text-muted" dateTime={blog.publishedAt}>
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h1 className="text-2xl font-bold leading-snug tracking-tight text-fg sm:text-3xl">
              {blog.title}
            </h1>
            <p className="mt-3 text-base text-muted">{blog.excerpt}</p>
          </header>

          <Card panel className="p-6 md:p-8">
            <MarkdownRenderer content={resolvedContent} />
          </Card>

          {/* Tool CTA */}
          {tool && (
            <div className="mt-6">
              <Card inset className="p-5">
                <p className="text-sm font-medium text-fg">
                  Try{' '}
                  <Link
                    href={toolUrl(tool.slug)}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener"
                  >
                    {tool.name}
                  </Link>{' '}
                  free on {SITE_NAME} — no upload, no account, works in your browser.
                </p>
                <Link
                  href={toolUrl(tool.slug)}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  target="_blank"
                  rel="noopener"
                >
                  Open {tool.name} →
                </Link>
              </Card>
            </div>
          )}

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {related.length > 0 && (
            <Card panel className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-fg">
                More {tool?.name} articles
              </h3>
              <div className="flex flex-col gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {tool && (
            <Card inset className="p-4 text-center">
              <p className="mb-1 text-sm font-medium text-fg">{tool.name}</p>
              <p className="mb-4 text-xs text-muted">{tool.benefit}</p>
              <Link
                href={toolUrl(tool.slug)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                target="_blank"
                rel="noopener"
              >
                Use for free →
              </Link>
            </Card>
          )}

          <Link href="/blog" className="text-center text-sm text-muted hover:text-fg">
            ← All articles
          </Link>
        </aside>
      </div>
    </div>
  )
}
