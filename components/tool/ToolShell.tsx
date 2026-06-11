'use client'
import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { AdSlot } from '@/components/ads/AdSlot'
import { ToolCard } from '@/components/home/ToolCard'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Tool } from '@/lib/config/tools'
import { getRelatedTools } from '@/lib/config/tools'
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

        <AdSlot slot="tool-bottom" />
      </div>
    </div>
  )
}
