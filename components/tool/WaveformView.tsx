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
  onRegionChange,
  className,
  interactive = false,
}: WaveformViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<import('wavesurfer.js').default | null>(null)
  const [ready, setReady] = useState(false)
  const [regionStart, setRegionStart] = useState(0)
  const [regionEnd, setRegionEnd] = useState(1)

  useEffect(() => {
    if (!containerRef.current || (!file && !src)) return

    let ws: import('wavesurfer.js').default

    const init = async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default
      ws = WaveSurfer.create({
        container: containerRef.current!,
        waveColor: 'rgba(255,140,0,0.5)',
        progressColor: '#FF8C00',
        cursorColor: '#FFD700',
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
    <div className={cn('relative rounded-2xl overflow-hidden bg-white/5 p-3', className)}>
      <div ref={containerRef} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
        </div>
      )}
      {interactive && ready && (
        <div className="mt-3 flex items-center gap-3 text-xs text-[#7A6A50] dark:text-[#B8A77F]">
          <span>Start: <span className="font-mono">{regionStart.toFixed(2)}s</span></span>
          <span>End: <span className="font-mono">{regionEnd.toFixed(2)}s</span></span>
        </div>
      )}
    </div>
  )
}
