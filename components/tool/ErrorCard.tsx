'use client'
import { AlertCircle } from 'lucide-react'
import type { ToolError } from '@/lib/audio/types'
import { strings } from '@/lib/strings'
import { GlassCard } from '@/components/glass/GlassCard'

interface ErrorCardProps {
  error: ToolError | string
  onRetry?: () => void
}

export function ErrorCard({ error, onRetry }: ErrorCardProps) {
  const message = strings.errors[error as ToolError] || strings.errors.PROCESS_FAILED

  return (
    <GlassCard intensity="light" className="p-5 border border-red-300/30">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-red-600 dark:text-red-400 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-1.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              {strings.tool.tryAgain}
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
