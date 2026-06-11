'use client'
import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Tool } from '@/lib/config/tools'
import { cn } from '@/lib/utils'

function ToolGlyph({ name, className }: { name: string; className?: string }) {
  const Glyph =
    (LucideIcons as unknown as Record<string, LucideIcon>)[name] ?? LucideIcons.FileAudio
  return <Glyph className={className} strokeWidth={1.9} aria-hidden="true" />
}

interface ToolCardProps {
  tool: Tool
  locked?: boolean
  onClick?: () => void
}

/** The single tool tile used by every grid — featured, category, and coming-soon. */
export function ToolCard({ tool, locked = false, onClick }: ToolCardProps) {
  const body = (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            locked ? 'bg-surface-2 text-muted' : 'bg-primary-soft text-tint'
          )}
        >
          <ToolGlyph name={tool.icon} className="h-5 w-5" />
        </span>
        {locked && <Lock size={14} className="mt-1 text-muted" aria-hidden="true" />}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug text-fg">{tool.name}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted">{tool.benefit}</p>
      </div>
      <div className="mt-auto pt-1">
        {locked ? (
          <Badge variant="neutral">Coming soon</Badge>
        ) : (
          <Badge variant="tint">private · no upload</Badge>
        )}
      </div>
    </div>
  )

  if (locked) {
    return (
      <Card
        as="button"
        interactive
        onClick={onClick}
        className="h-full w-full p-4 text-left opacity-75 hover:opacity-100 sm:p-5"
      >
        {body}
      </Card>
    )
  }

  return (
    <Link href={`/${tool.slug}`} className="block h-full rounded-card">
      <Card interactive className="h-full p-4 sm:p-5">
        {body}
      </Card>
    </Link>
  )
}
