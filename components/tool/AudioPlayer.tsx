'use client'
import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { cn } from '@/lib/utils'

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
  }, [src])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      await audio.play()
    }
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
      {label && (
        <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] font-medium uppercase tracking-wider">
          {label}
        </p>
      )}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
        <audio ref={audioRef} src={src} preload="metadata" />
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-brand text-white shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div
          ref={progressRef}
          onClick={seek}
          className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
          role="slider"
          aria-label="Playback position"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-brand"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #FF8C00, #FFD700)' }}
          />
        </div>
        <span className="font-mono text-xs text-[#7A6A50] dark:text-[#B8A77F] shrink-0 tabular-nums">
          {formatDuration(current)} / {formatDuration(duration)}
        </span>
      </div>
    </div>
  )
}
