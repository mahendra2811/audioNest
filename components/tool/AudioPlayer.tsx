'use client'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn, formatDuration } from '@/lib/utils'

interface AudioPlayerProps {
  src: string
  label?: string
  className?: string
}

export function AudioPlayer({ src, label, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrent(audio.currentTime)
    const onDuration = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.pause()
    else await audio.play()
    setPlaying(!playing)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const bar = progressRef.current
    if (!audio || !bar) return
    const pct = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth
    audio.currentTime = pct * duration
  }

  const pct = duration ? (current / duration) * 100 : 0

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>}
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 p-3">
        <audio ref={audioRef} src={src} preload="metadata" />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div
          ref={progressRef}
          onClick={seek}
          className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-line-strong"
          role="slider"
          aria-label="Playback position"
          aria-valuenow={Math.round(current)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-brand"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
          {formatDuration(current)} / {formatDuration(duration)}
        </span>
      </div>
    </div>
  )
}
