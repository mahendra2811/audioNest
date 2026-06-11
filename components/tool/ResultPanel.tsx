'use client'
import { Download } from 'lucide-react'
import { AudioPlayer } from './AudioPlayer'
import { GlassCard } from '@/components/glass/GlassCard'
import { formatBytes, formatDuration } from '@/lib/utils'
import type { ToolResult } from '@/lib/audio/types'

interface ResultPanelProps {
  result: ToolResult
  originalSize?: number
  className?: string
}

export function ResultPanel({ result, originalSize, className }: ResultPanelProps) {
  const blobUrl = URL.createObjectURL(result.blob)

  return (
    <GlassCard intensity="medium" className={`p-5 flex flex-col gap-4 ${className || ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[#1A1208] dark:text-[#FFF8ED] truncate">{result.name}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-[#7A6A50] dark:text-[#B8A77F] font-mono">
            <span>{formatBytes(result.size)}</span>
            {result.duration && <span>{formatDuration(result.duration)}</span>}
            {result.format && <span>{result.format}</span>}
            {originalSize && result.size < originalSize && (
              <span className="text-green-600 dark:text-green-400">
                -{Math.round((1 - result.size / originalSize) * 100)}%
              </span>
            )}
          </div>
        </div>
        <a
          href={blobUrl}
          download={result.name}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
        >
          <Download size={16} />
          Download
        </a>
      </div>

      {result.mimeType.startsWith('audio/') && (
        <AudioPlayer src={blobUrl} label="Preview" />
      )}
    </GlassCard>
  )
}
