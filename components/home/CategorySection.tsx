'use client'

import Link from 'next/link'
import {
  Scissors,
  Link2,
  SplitSquareHorizontal,
  VolumeX,
  Rewind,
  RefreshCw,
  Film,
  ImagePlay,
  Mic,
  PackageOpen,
  Volume2,
  SlidersHorizontal,
  AudioWaveform,
  BarChart2,
  Waves,
  Gauge,
  Music,
  Radio,
  Headphones,
  Timer,
  Tag,
  ShieldOff,
  Repeat,
  Info,
  type LucideIcon,
} from 'lucide-react'
import { GlassCard } from '@/components/glass/GlassCard'
import { liveTools, CATEGORIES } from '@/lib/config/tools'

export const ICON_MAP: Record<string, LucideIcon> = {
  Scissors,
  Link2,
  SplitSquareHorizontal,
  VolumeX,
  Rewind,
  RefreshCw,
  Film,
  ImagePlay,
  Mic,
  PackageOpen,
  Volume2,
  SlidersHorizontal,
  AudioWaveform,
  BarChart2,
  Waves,
  Gauge,
  Music,
  Radio,
  Headphones,
  Timer,
  Tag,
  ShieldOff,
  Repeat,
  Info,
}

const nonFeaturedTools = liveTools.filter((t) => !t.featured)

export function CategorySection() {
  return (
    <section className="w-full space-y-14">
      {CATEGORIES.map((cat) => {
        const tools = nonFeaturedTools.filter((t) => t.category === cat.id)
        if (tools.length === 0) return null

        return (
          <div key={cat.id}>
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-white/80">
              {cat.label}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {tools.map((tool) => {
                const Icon = ICON_MAP[tool.icon] ?? Info

                return (
                  <Link key={tool.slug} href={`/${tool.slug}`} className="block">
                    <GlassCard intensity="light" interactive={true}>
                      <div className="flex flex-col gap-3 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                          <Icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-snug text-white">
                            {tool.name}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-white/55">
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
