'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CATEGORIES, liveTools } from '@/lib/config/tools'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function ToolIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon) return null
  return <Icon size={size} />
}

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="py-4 px-3">
        {CATEGORIES.map(({ id, label }) => {
          const catTools = liveTools.filter((t) => t.category === id)
          if (!catTools.length) return null
          return (
            <div key={id} className="mb-4">
              <p className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-[#7A6A50] dark:text-[#B8A77F]">
                {label}
              </p>
              <ul>
                {catTools.map((tool) => {
                  const isActive = pathname === `/${tool.slug}`
                  return (
                    <li key={tool.slug}>
                      <Link
                        href={`/${tool.slug}`}
                        className={cn(
                          'flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-sm transition-all duration-150',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                          isActive
                            ? 'bg-orange-50/60 dark:bg-white/8 text-orange-600 dark:text-amber-300 font-medium'
                            : 'text-[#1A1208]/60 dark:text-[#FFF8ED]/60 hover:bg-white/8 hover:text-[#1A1208] dark:hover:text-[#FFF8ED]'
                        )}
                      >
                        <span className="shrink-0 opacity-70">
                          <ToolIcon name={tool.icon} size={14} />
                        </span>
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
