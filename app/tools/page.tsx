import type { Metadata } from 'next'
import Link from 'next/link'
import { GlassCard } from '@/components/glass/GlassCard'
import { CATEGORIES, liveTools, soonTools } from '@/lib/config/tools'
import { site } from '@/lib/config/site'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'All Audio Tools',
  description: `Browse all ${liveTools.length} free online audio tools. No upload, 100% private, on-device.`,
}

function ToolIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  return Icon ? <Icon size={18} /> : null
}

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1208] dark:text-[#FFF8ED]">All Audio Tools</h1>
        <p className="mt-2 text-[#7A6A50] dark:text-[#B8A77F]">
          {liveTools.length} free tools — 100% private, no upload, works offline
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {CATEGORIES.map(({ id, label }) => {
          const catTools = liveTools.filter((t) => t.category === id)
          if (!catTools.length) return null
          return (
            <section key={id} aria-labelledby={`cat-${id}`}>
              <h2 id={`cat-${id}`} className="text-lg font-semibold text-[#1A1208] dark:text-[#FFF8ED] mb-4">
                {label}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {catTools.map((tool) => (
                  <Link key={tool.slug} href={`/${tool.slug}`}>
                    <GlassCard interactive intensity="light" className="p-4 flex flex-col gap-2 h-full">
                      <span className="text-orange-500 dark:text-amber-400">
                        <ToolIcon name={tool.icon} />
                      </span>
                      <p className="font-medium text-sm text-[#1A1208] dark:text-[#FFF8ED]">{tool.name}</p>
                      <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] line-clamp-2 flex-1">{tool.benefit}</p>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {soonTools.length > 0 && (
          <section aria-labelledby="cat-soon">
            <h2 id="cat-soon" className="text-lg font-semibold text-[#1A1208] dark:text-[#FFF8ED] mb-4">Coming Soon</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {soonTools.map((tool) => (
                <GlassCard key={tool.slug} intensity="light" className="p-4 flex flex-col gap-2 opacity-60">
                  <span className="text-orange-300 dark:text-amber-600">
                    <ToolIcon name={tool.icon} />
                  </span>
                  <p className="font-medium text-sm text-[#1A1208] dark:text-[#FFF8ED]">{tool.name}</p>
                  <p className="text-xs text-orange-500 dark:text-amber-400 font-medium">Coming soon</p>
                </GlassCard>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
