'use client'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { FileMeta } from '@/components/tool/FileMeta'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ToolShell } from '@/components/tool/ToolShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import { Toggle } from '@/components/ui/Toggle'
import type { AudioMeta, Progress, ToolError, ToolResult } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'
import { useProcessingState } from '@/lib/store/processing'
import { formatDuration } from '@/lib/utils'

const tool = getToolBySlug('audio-cutter')!

const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
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
        { startTime, endTime, fadeIn: fadeIn ? 0.5 : 0, fadeOut: fadeOut ? 0.5 : 0, format: 'mp3' },
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
      description="AudioNest cuts your audio file entirely on your device using the Web Audio API. Set start and end points, optionally add fade in/out for smooth transitions, then click Cut. The result is encoded to MP3 with ffmpeg.wasm — nothing is uploaded."
    >
      {!file && <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop an audio file to cut" />}

      {file && !progress && (
        <div className="flex flex-col gap-5">
          {meta && <FileMeta meta={meta} />}

          {duration > 0 && (
            <Card inset className="flex flex-col gap-4 p-5">
              <Slider
                label="Start"
                value={startTime}
                min={0}
                max={Math.max(0.1, endTime - 0.1)}
                step={0.01}
                onChange={setStartTime}
                format={formatDuration}
              />
              <Slider
                label="End"
                value={endTime}
                min={startTime + 0.1}
                max={duration}
                step={0.01}
                onChange={setEndTime}
                format={formatDuration}
              />
              <p className="text-center font-mono text-xs text-muted">
                Selection: {formatDuration(cutDuration)} of {formatDuration(duration)}
              </p>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            <Toggle pressed={fadeIn} onPressedChange={setFadeIn}>
              Fade In
            </Toggle>
            <Toggle pressed={fadeOut} onPressedChange={setFadeOut}>
              Fade Out
            </Toggle>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCut}>Cut</Button>
            <Button variant="secondary" onClick={handleReset}>
              Change file
            </Button>
          </div>
        </div>
      )}

      {progress && (
        <div className="flex flex-col items-center gap-6 py-10">
          <ProgressRing percent={progress.percent} step={progress.step} onCancel={handleCancel} />
          <p className="text-sm text-muted">Cutting audio…</p>
        </div>
      )}

      {result && !progress && (
        <div className="flex flex-col gap-4">
          <ResultPanel result={result} originalSize={file?.size} />
          <Button variant="secondary" size="sm" className="self-start" onClick={handleReset}>
            Cut another file
          </Button>
        </div>
      )}

      {error && <ErrorCard error={error} onRetry={handleReset} />}
    </ToolShell>
  )
}
