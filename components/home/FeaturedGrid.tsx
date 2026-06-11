'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Scissors, SplitSquareHorizontal, ArrowLeftRight, Wand2,
  Volume2, Mic2, Settings2, Info, FileAudio, Music, Zap,
  BarChart3, Link2, VolumeX, Activity, Layers, Tag, Repeat,
} from 'lucide-react'
import { GlassCard } from '@/components/glass/GlassCard'
import { featuredTools } from '@/lib/config/tools'

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, SplitSquareHorizontal, ArrowLeftRight, Wand2,
  Volume2, Mic2, Settings2, Info, FileAudio, Music, Zap,
  BarChart3, Link2, VolumeX, Activity, Layers, Tag, Repeat,
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 360, damping: 28 },
  },
}

export function FeaturedGrid() {
  const displayed = featuredTools.slice(0, 8)

  return (
    <section className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1208] dark:text-[#FFF8ED] sm:text-3xl">
          Featured Tools
        </h2>
        <p className="mt-2 text-sm text-[#7A6A50] dark:text-[#B8A77F]">
          The most-used audio tools — all running in your browser.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayed.map((tool) => {
          const IconComponent = ICON_MAP[tool.icon] ?? FileAudio

          return (
            <motion.div key={tool.slug} variants={itemVariants}>
              <Link href={`/${tool.slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-2xl">
                <GlassCard interactive className="h-full p-4 sm:p-5">
                  <div className="flex flex-col gap-3">
                    {/* Icon */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,140,0,0.85) 0%, rgba(255,215,0,0.75) 100%)',
                        boxShadow: '0 4px 14px rgba(255,140,0,0.3)',
                      }}
                    >
                      <IconComponent className="h-5 w-5 text-white" strokeWidth={1.75} />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold leading-snug text-[#1A1208] dark:text-[#FFF8ED]">
                        {tool.name}
                      </span>
                      <span className="line-clamp-2 text-xs leading-relaxed text-[#7A6A50] dark:text-[#B8A77F]">
                        {tool.benefit}
                      </span>
                    </div>

                    {/* Badge */}
                    <span className="self-start rounded-full border border-[#1A1208]/10 bg-[#FF8C00]/8 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#7A6A50] dark:border-white/15 dark:bg-white/8 dark:text-white/45">
                      private · no upload
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
