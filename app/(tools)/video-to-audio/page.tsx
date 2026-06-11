'use client'
import { useState } from 'react'
import { Dropzone } from '@/components/tool/Dropzone'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import { GlassCard } from '@/components/glass/GlassCard'
import { getToolBySlug, VIDEO_ACCEPTS } from '@/lib/config/tools'
import type { ToolResult, ToolError, Progress } from '@/lib/audio/types'
import { useProcessingState } from '@/lib/store/processing'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const tool = getToolBySlug('video-to-audio')!
const ACCEPT = Object.fromEntries(VIDEO_ACCEPTS.filter(a => a.startsWith('video/')).map(m => [m, []]))
const FORMATS = [{ id: 'mp3', label: 'MP3' }, { id: 'wav', label: 'WAV' }, { id: 'aac', label: 'AAC' }] as const

export default function VideoToAudioPage() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<'mp3' | 'wav' | 'aac'>('mp3')
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleExtract = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'processing' }); setResult(null); setError(null)
    startProcessing()
    try {
      const { runVideoToAudio } = await import('@/lib/audio/tools/video-to-audio')
      const res = await runVideoToAudio(file, { format }, (p) => setProgress(p))
      setResult(res); toast.success('Audio extracted!')
    } catch { setError('PROCESS_FAILED') }
    finally { setProgress(null); endProcessing() }
  }

  return (
    <ToolShell tool={tool} description="Extracts the audio stream from video files using ffmpeg.wasm on-device.">
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop a video file" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <GlassCard intensity="light" className="px-4 py-3"><p className="text-sm text-[#1A1208] dark:text-[#FFF8ED] truncate">{file.name}</p></GlassCard>
          <div className="flex gap-2">
            {FORMATS.map(({ id, label }) => (
              <button key={id} onClick={() => setFormat(id)} className={cn('px-4 py-1.5 rounded-xl text-sm font-medium border transition-all', format === id ? 'text-white border-transparent' : 'bg-black/4 border-black/10 dark:bg-white/5 dark:border-white/15')} style={format === id ? { background: 'linear-gradient(135deg, #FF8C00, #FFD700)' } : {}}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={handleExtract} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>
            Extract Audio
          </button>
        </div>
      )}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
