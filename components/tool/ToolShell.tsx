'use client'
import Link from 'next/link'
import { Heart, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassPanel } from '@/components/glass/GlassPanel'
import { GlassCard } from '@/components/glass/GlassCard'
import { AdSlot } from '@/components/ads/AdSlot'
import { useFavourites } from '@/lib/store/favourites'
import { getRelatedTools } from '@/lib/config/tools'
import type { Tool } from '@/lib/config/tools'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'

function ToolIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon) return null
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
    <div className="flex gap-0 md:gap-6 max-w-7xl mx-auto px-4 md:px-6 py-6">
      <DesktopSidebar />

      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#7A6A50] dark:text-[#B8A77F]">
          <Link href="/" className="hover:text-[#1A1208] dark:hover:text-[#FFF8ED] transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/tools" className="hover:text-[#1A1208] dark:hover:text-[#FFF8ED] transition-colors">Tools</Link>
          <ChevronRight size={14} />
          <span className="text-[#1A1208] dark:text-[#FFF8ED] font-medium">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
            >
              <ToolIcon name={tool.icon} size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1208] dark:text-[#FFF8ED]">{tool.name}</h1>
              <p className="text-sm text-[#7A6A50] dark:text-[#B8A77F]">{tool.benefit}</p>
            </div>
          </div>
          <button
            onClick={() => toggle(tool.slug)}
            aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all border shrink-0',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
              fav
                ? 'text-red-500 border-red-200/40 bg-red-50/10'
                : 'text-[#7A6A50] dark:text-[#B8A77F] border-white/20 bg-white/5 hover:text-red-400'
            )}
          >
            <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {['Private', 'No Upload', 'Free'].map((label) => (
            <span
              key={label}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-orange-50/40 dark:bg-white/5 text-orange-700 dark:text-amber-300 border border-orange-200/30"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Main glass panel — tool content */}
        <GlassPanel intensity="medium" className="p-5 md:p-7">
          {children}
        </GlassPanel>

        {/* How it works */}
        {description && (
          <GlassPanel intensity="light" className="p-5">
            <h2 className="font-semibold text-base mb-2 text-[#1A1208] dark:text-[#FFF8ED]">How it works</h2>
            <p className="text-sm text-[#7A6A50] dark:text-[#B8A77F] leading-relaxed">{description}</p>
          </GlassPanel>
        )}

        {/* Related tools */}
        {related.length > 0 && (
          <div>
            <h2 className="font-semibold text-base mb-3 text-[#1A1208] dark:text-[#FFF8ED]">Related tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((t) => (
                <Link key={t.slug} href={`/${t.slug}`}>
                  <GlassCard interactive intensity="light" className="p-4 flex flex-col gap-2">
                    <span className="text-orange-500 dark:text-amber-400">
                      <ToolIcon name={t.icon} size={18} />
                    </span>
                    <p className="text-sm font-medium text-[#1A1208] dark:text-[#FFF8ED] leading-tight">{t.name}</p>
                    <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] line-clamp-2">{t.benefit}</p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        )}

        <AdSlot slot="tool-bottom" />
      </div>
    </div>
  )
}
