'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { soonTools } from '@/lib/config/tools'
import { GlassCard } from '@/components/glass/GlassCard'

function ToolIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon) return null
  return <Icon size={24} />
}

export function ComingSoonGrid() {
  function handleTileClick() {
    toast('Coming soon — stay tuned!')
  }

  return (
    <section className="w-full px-4 py-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-[#1A1208]/70 dark:text-[#FFF8ED]/70">
        Coming Soon
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {soonTools.map((tool, index) => (
          <motion.div
            key={tool.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.07 }}
          >
            <GlassCard
              intensity="light"
              interactive
              onClick={handleTileClick}
              className="opacity-70 saturate-50 hover:opacity-80 hover:saturate-75 transition-[opacity,filter] duration-200"
            >
              <div className="relative flex flex-col gap-3 p-4">
                {/* Lock overlay badge */}
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.3)]">
                  <Lock size={12} className="text-[#1A1208]/60 dark:text-[#FFF8ED]/60" />
                </span>

                {/* Tool icon */}
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-[#1A1208]/50 dark:text-[#FFF8ED]/50">
                  <ToolIcon name={tool.icon} />
                </span>

                {/* Tool name */}
                <p className="text-sm font-semibold leading-snug text-[#1A1208]/70 dark:text-[#FFF8ED]/70">
                  {tool.name}
                </p>

                {/* Benefit */}
                <p className="text-xs leading-relaxed text-[#1A1208]/45 dark:text-[#FFF8ED]/45 line-clamp-2">
                  {tool.benefit}
                </p>

                {/* Coming soon badge */}
                <span className="mt-1 inline-flex w-fit items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#1A1208]/50 dark:text-[#FFF8ED]/50 shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]">
                  Coming soon
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
