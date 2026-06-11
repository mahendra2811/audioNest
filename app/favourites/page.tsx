'use client'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useFavourites } from '@/lib/store/favourites'
import { getToolBySlug } from '@/lib/config/tools'
import { GlassCard } from '@/components/glass/GlassCard'
import { GlassPanel } from '@/components/glass/GlassPanel'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function ToolIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  return Icon ? <Icon size={20} /> : null
}

export default function FavouritesPage() {
  const { favourites, toggle } = useFavourites()
  const tools = favourites.map(getToolBySlug).filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1A1208] dark:text-[#FFF8ED] mb-6">Favourites</h1>
      {tools.length === 0 ? (
        <GlassPanel intensity="light" className="p-10 flex flex-col items-center gap-4 text-center">
          <Heart size={40} className="text-orange-300 dark:text-amber-600" />
          <p className="text-[#7A6A50] dark:text-[#B8A77F]">No favourites yet. Tap ♡ on any tool to save it here.</p>
          <Link
            href="/tools"
            className="mt-2 px-5 py-2 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
          >
            Explore tools
          </Link>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <Link key={tool!.slug} href={`/${tool!.slug}`}>
              <GlassCard interactive intensity="medium" className="p-4 flex flex-col gap-2 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 dark:text-amber-400">
                    <ToolIcon name={tool!.icon} />
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(tool!.slug) }}
                    aria-label="Remove from favourites"
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                </div>
                <p className="font-medium text-sm text-[#1A1208] dark:text-[#FFF8ED]">{tool!.name}</p>
                <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] line-clamp-2 flex-1">{tool!.benefit}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
