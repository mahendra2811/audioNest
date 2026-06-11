'use client'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface WaveformViewProps {
  file?: File
  src?: string
  onReady?: (duration: number) => void
  onRegionChange?: (start: number, end: number) => void
  className?: string
  interactive?: boolean
}

export function WaveformView({
  file,
  src,
  onReady,
  className,
  interactive = false,
}: WaveformViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<import('wavesurfer.js').default | null>(null)
  const [ready, setReady] = useState(false)
  const [regionStart, _setRegionStart] = useState(0)
  const [regionEnd, setRegionEnd] = useState(1)

  useEffect(() => {
    if (!containerRef.current || (!file && !src)) return

    let ws: import('wavesurfer.js').default

    const init = async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default
      ws = WaveSurfer.create({
        container: containerRef.current!,
        waveColor: 'rgba(99,102,241,0.45)',
        progressColor: '#6366f1',
        cursorColor: '#8b5cf6',
        height: 80,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        interact: interactive,
      })

      const url = src || (file ? URL.createObjectURL(file) : '')
      await ws.load(url)

      ws.on('ready', () => {
        setReady(true)
        const dur = ws.getDuration()
        onReady?.(dur)
        setRegionEnd(dur)
      })

      wsRef.current = ws
    }

    init()

    return () => {
      ws?.destroy()
      wsRef.current = null
    }
  }, [file, src, interactive, onReady])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-line bg-surface-2 p-3',
        className
      )}
    >
      <div ref={containerRef} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      {interactive && ready && (
        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          <span>
            Start: <span className="font-mono">{regionStart.toFixed(2)}s</span>
          </span>
          <span>
            End: <span className="font-mono">{regionEnd.toFixed(2)}s</span>
          </span>
        </div>
      )}
    </div>
  )
}
