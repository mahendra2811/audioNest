'use client'
import { useState, useCallback, useRef } from 'react'
import { Dropzone } from '@/components/tool/Dropzone'
import { FileMeta } from '@/components/tool/FileMeta'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import { GlassCard } from '@/components/glass/GlassCard'
import { getToolBySlug, AUDIO_ACCEPTS } from '@/lib/config/tools'
import type { AudioMeta, Progress, ToolResult, ToolError } from '@/lib/audio/types'
import { useProcessingState } from '@/lib/store/processing'
import { toast } from 'sonner'
import { formatDuration } from '@/lib/utils'

const tool = getToolBySlug('audio-cutter')!

const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []])
)

export default function AudioCutterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [meta, setMeta] = useState<AudioMeta | null>(null)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)

    // Get duration
    try {
      const url = URL.createObjectURL(f)
      const audio = new Audio(url)
      await new Promise<void>((res, rej) => {
        audio.onloadedmetadata = () => {
          const dur = audio.duration
          setDuration(dur)
          setStartTime(0)
          setEndTime(dur)
          URL.revokeObjectURL(url)
          res()
        }
        audio.onerror = rej
      })
      setMeta({
        name: f.name,
        size: f.size,
        duration: audio.duration,
        format: f.name.split('.').pop()?.toUpperCase() || 'AUDIO',
        sampleRate: 44100,
        numberOfChannels: 2,
      })
    } catch {
      // fallback: use file size estimate
      setDuration(0)
    }
  }, [])

  const handleCut = async () => {
    if (!file) return
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setProgress({ percent: 0, step: 'decoding' })
    setResult(null)
    setError(null)
    startProcessing()

    try {
      const { runCut } = await import('@/lib/audio/tools/cut')
      const res = await runCut(
        file,
        {
          startTime,
          endTime,
          fadeIn: fadeIn ? 0.5 : 0,
          fadeOut: fadeOut ? 0.5 : 0,
          format: 'mp3',
        },
        (p) => setProgress(p),
        ctrl.signal
      )
      setResult(res)
      toast.success('Cut complete!')
    } catch (e) {
      if ((e as Error).message === 'ABORTED') return
      const code = ((e as Error & { code?: string }).code || 'PROCESS_FAILED') as ToolError
      setError(code)
      toast.error('Cutting failed')
    } finally {
      setProgress(null)
      endProcessing()
      abortRef.current = null
    }
  }

  const handleCancel = () => {
    abortRef.current?.abort()
    setProgress(null)
    endProcessing()
  }

  const handleReset = () => {
    setFile(null)
    setMeta(null)
    setResult(null)
    setError(null)
    setProgress(null)
    setDuration(0)
    setStartTime(0)
    setEndTime(0)
  }

  const cutDuration = endTime - startTime

  return (
    <ToolShell
      tool={tool}
      description="AudioNest cuts your audio file entirely on your device using the Web Audio API. Set start and end points using the sliders, optionally add fade in/out for smooth transitions, then click Cut. The result is encoded to MP3 with ffmpeg.wasm — nothing is uploaded."
    >
      {!file && (
        <Dropzone
          onFile={handleFile}
          accept={ACCEPT}
          label="Drop an audio file to cut"
        />
      )}

      {file && !progress && (
        <div className="flex flex-col gap-5">
          {meta && <FileMeta meta={meta} />}

          {/* Start / End sliders */}
          {duration > 0 && (
            <GlassCard intensity="light" className="p-5 flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#1A1208] dark:text-[#FFF8ED]">Start</label>
                  <span className="font-mono text-sm text-[#7A6A50] dark:text-[#B8A77F]">
                    {formatDuration(startTime)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={endTime - 0.1}
                  step={0.01}
                  value={startTime}
                  onChange={(e) => setStartTime(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                  aria-label="Start time"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#1A1208] dark:text-[#FFF8ED]">End</label>
                  <span className="font-mono text-sm text-[#7A6A50] dark:text-[#B8A77F]">
                    {formatDuration(endTime)}
                  </span>
                </div>
                <input
                  type="range"
                  min={startTime + 0.1}
                  max={duration}
                  step={0.01}
                  value={endTime}
                  onChange={(e) => setEndTime(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                  aria-label="End time"
                />
              </div>

              <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] font-mono text-center">
                Selection: {formatDuration(cutDuration)} of {formatDuration(duration)}
              </p>
            </GlassCard>
          )}

          {/* Fade toggles */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Fade In', value: fadeIn, set: setFadeIn },
              { label: 'Fade Out', value: fadeOut, set: setFadeOut },
            ].map(({ label, value, set }) => (
              <button
                key={label}
                onClick={() => set(!value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  value
                    ? 'text-white border-transparent'
                    : 'bg-white/5 border-white/15 text-[#1A1208] dark:text-[#FFF8ED] hover:bg-white/10'
                }`}
                style={value ? { background: 'linear-gradient(135deg, #FF8C00, #FFD700)' } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCut}
              className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
            >
              Cut
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
            >
              Change file
            </button>
          </div>
        </div>
      )}

      {progress && (
        <div className="flex flex-col items-center py-10 gap-6">
          <ProgressRing percent={progress.percent} step={progress.step} onCancel={handleCancel} />
          <p className="text-sm text-[#7A6A50] dark:text-[#B8A77F]">Cutting audio…</p>
        </div>
      )}

      {result && !progress && (
        <div className="flex flex-col gap-4">
          <ResultPanel result={result} originalSize={file?.size} />
          <button
            onClick={handleReset}
            className="self-start px-4 py-2 rounded-xl text-sm font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            Cut another file
          </button>
        </div>
      )}

      {error && <ErrorCard error={error} onRetry={handleReset} />}
    </ToolShell>
  )
}
