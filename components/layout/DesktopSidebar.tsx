'use client'
import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORIES, liveTools } from '@/lib/config/tools'
import { cn } from '@/lib/utils'

function ToolIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon) return null
  return <Icon size={size} />
}

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="scroll-thin sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 self-start overflow-y-auto py-4 pr-2 md:block">
      {CATEGORIES.map(({ id, label }) => {
        const catTools = liveTools.filter((t) => t.category === id)
        if (!catTools.length) return null
        return (
          <div key={id} className="mb-5">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
              {label}
            </p>
            <ul className="mt-0.5 flex flex-col gap-0.5">
              {catTools.map((tool) => {
                const isActive = pathname === `/${tool.slug}`
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/${tool.slug}`}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-primary-soft font-medium text-tint'
                          : 'text-muted hover:bg-surface-2 hover:text-fg'
                      )}
                    >
                      <span className="shrink-0">
                        <ToolIcon name={tool.icon} size={15} />
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
    </aside>
  )
}
