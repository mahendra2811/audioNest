'use client'

import Link from 'next/link'
import {
  Scissors, Link2, SplitSquareHorizontal, VolumeX, Rewind, RefreshCw,
  Film, ImagePlay, Mic, PackageOpen, Volume2, SlidersHorizontal,
  AudioWaveform, BarChart2, Waves, Gauge, Music, Radio, Headphones,
  Timer, Tag, ShieldOff, Repeat, Info,
  type LucideIcon,
} from 'lucide-react'
import { GlassCard } from '@/components/glass/GlassCard'
import { liveTools, CATEGORIES } from '@/lib/config/tools'

export const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Link2, SplitSquareHorizontal, VolumeX, Rewind, RefreshCw,
  Film, ImagePlay, Mic, PackageOpen, Volume2, SlidersHorizontal,
  AudioWaveform, BarChart2, Waves, Gauge, Music, Radio, Headphones,
  Timer, Tag, ShieldOff, Repeat, Info,
}

const nonFeaturedTools = liveTools.filter((t) => !t.featured)

export function CategorySection() {
  return (
    <section className="w-full space-y-12">
      {CATEGORIES.map((cat) => {
        const tools = nonFeaturedTools.filter((t) => t.category === cat.id)
        if (tools.length === 0) return null

        return (
          <div key={cat.id}>
            <h2 className="mb-5 text-lg font-bold tracking-tight text-[#1A1208] dark:text-[#FFF8ED]">
              {cat.label}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {tools.map((tool) => {
                const Icon = ICON_MAP[tool.icon] ?? Info

                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    <GlassCard intensity="light" interactive>
                      <div className="flex flex-col gap-3 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF8C00]/12 dark:bg-white/10">
                          <Icon className="h-4 w-4 text-[#FF8C00] dark:text-amber-400" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-snug text-[#1A1208] dark:text-[#FFF8ED]">
                            {tool.name}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#7A6A50] dark:text-[#B8A77F] line-clamp-2">
                            {tool.benefit}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
