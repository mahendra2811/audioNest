'use client'
import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { BookOpen, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { AdSlot } from '@/components/ads/AdSlot'
import { ToolCard } from '@/components/home/ToolCard'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
import { Accordion } from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { getBlogsByTool } from '@/lib/config/blogs'
import { getToolFaqs } from '@/lib/config/faqs'
import type { Tool } from '@/lib/config/tools'
import { getRelatedTools } from '@/lib/config/tools'
import { SITE_NAME, toolUrl } from '@/lib/site'
import { useFavourites } from '@/lib/store/favourites'
import { cn } from '@/lib/utils'

function ToolIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name] ?? LucideIcons.FileAudio
  return <Icon size={size} />
}

interface ToolShellProps {
  tool: Tool
  children: React.ReactNode
  description?: string
}

export function ToolShell({ tool, children, description }: ToolShellProps) {
  const { toggle, isFavourite } = useFavourites()
  const fav = isFavourite(tool.slug)
  const related = getRelatedTools(tool, 4)

  return (
    <div className="flex gap-6 py-6 md:py-8">
      <DesktopSidebar />

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
          <Link href="/" className="transition-colors hover:text-fg">
            Home
          </Link>
          <ChevronRight size={14} className="opacity-60" />
          <Link href="/tools" className="transition-colors hover:text-fg">
            Tools
          </Link>
          <ChevronRight size={14} className="opacity-60" />
          <span className="font-medium text-fg">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
              <ToolIcon name={tool.icon} size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">{tool.name}</h1>
              <p className="text-sm text-muted">{tool.benefit}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggle(tool.slug)}
            aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={fav}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors',
              fav
                ? 'border-red-300/50 bg-red-500/10 text-red-500'
                : 'border-line bg-surface-2 text-muted hover:border-line-strong hover:text-fg'
            )}
          >
            <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-2">
          {['Private', 'No upload', 'Free'].map((label) => (
            <Badge key={label} variant="tint">
              {label}
            </Badge>
          ))}
        </div>

        {/* Main tool panel */}
        <Card panel className="p-5 md:p-7">
          {children}
        </Card>

        {/* How it works */}
        {description && (
          <Card inset className="p-5">
            <h2 className="mb-2 text-base font-semibold text-fg">How it works</h2>
            <p className="text-sm leading-relaxed text-muted">{description}</p>
          </Card>
        )}

        {/* Related tools */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-fg">Related tools</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        )}

        {/* FAQ / Accordion */}
        {(() => {
          const faqs = getToolFaqs(tool.slug)
          return faqs.length > 0 ? (
            <div>
              <h2 className="mb-3 text-base font-semibold text-fg">
                Frequently Asked Questions — {tool.name}
              </h2>
              <Card inset className="px-5 py-1">
                <Accordion items={faqs} allowMultiple />
              </Card>
              <p className="mt-2 text-xs text-muted">
                Powered by{' '}
                <Link href={toolUrl(tool.slug)} className="text-primary hover:underline">
                  {SITE_NAME} {tool.name}
                </Link>{' '}
                — free, private, browser-based.
              </p>
            </div>
          ) : null
        })()}

        {/* Related blog articles */}
        {(() => {
          const blogs = getBlogsByTool(tool.slug)
          return blogs.length > 0 ? (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen size={15} className="text-muted" />
                <h2 className="text-base font-semibold text-fg">{tool.name} Guides</h2>
              </div>
              <div className="flex flex-col gap-2">
                {blogs.map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="text-sm font-medium text-fg group-hover:text-primary">
                      {blog.title}
                    </span>
                    <span className="mt-0.5 shrink-0 text-xs text-muted">{blog.readTime}m</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null
        })()}

        <AdSlot slot="tool-bottom" />
      </div>
    </div>
  )
}
