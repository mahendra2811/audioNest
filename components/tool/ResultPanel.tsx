'use client'
import { Download } from 'lucide-react'
import { buttonVariants } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { ToolResult } from '@/lib/audio/types'
import { cn, formatBytes, formatDuration } from '@/lib/utils'
import { AudioPlayer } from './AudioPlayer'

interface ResultPanelProps {
  result: ToolResult
  originalSize?: number
  className?: string
}

export function ResultPanel({ result, originalSize, className }: ResultPanelProps) {
  const blobUrl = URL.createObjectURL(result.blob)

  return (
    <Card className={cn('flex flex-col gap-4 p-5', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-fg">{result.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            <span>{formatBytes(result.size)}</span>
            {result.duration && <span>{formatDuration(result.duration)}</span>}
            {result.format && <span>{result.format}</span>}
            {originalSize && result.size < originalSize && (
              <span className="text-green-600 dark:text-green-400">
                −{Math.round((1 - result.size / originalSize) * 100)}%
              </span>
            )}
          </div>
        </div>
        <a
          href={blobUrl}
          download={result.name}
          className={cn(buttonVariants({ size: 'md' }), 'shrink-0')}
        >
          <Download size={16} />
          Download
        </a>
      </div>

      {result.mimeType.startsWith('audio/') && <AudioPlayer src={blobUrl} label="Preview" />}
    </Card>
  )
}
