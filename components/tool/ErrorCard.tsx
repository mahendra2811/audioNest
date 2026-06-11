'use client'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ToolError } from '@/lib/audio/types'
import { strings } from '@/lib/strings'

interface ErrorCardProps {
  error: ToolError | string
  onRetry?: () => void
}

export function ErrorCard({ error, onRetry }: ErrorCardProps) {
  const message = strings.errors[error as ToolError] || strings.errors.PROCESS_FAILED

  return (
    <div className="rounded-card border border-red-400/40 bg-red-500/8 p-5">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{message}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
              {strings.tool.tryAgain}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
