'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ToolShell } from '@/components/tool/ToolShell'
import type { Progress, ToolError, ToolResult } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'
import { useProcessingState } from '@/lib/store/processing'
import { formatDuration } from '@/lib/utils'

const tool = getToolBySlug('loop-maker')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

export default function LoopMakerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileDuration, setFileDuration] = useState(0)
  const [count, setCount] = useState(4)
  const [gap, setGap] = useState(0)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleFile = async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    const url = URL.createObjectURL(f)
    const audio = new Audio(url)
    audio.onloadedmetadata = () => {
      setFileDuration(audio.duration)
      URL.revokeObjectURL(url)
    }
  }

  const handleRun = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'decoding' })
    setResult(null)
    setError(null)
    startProcessing()
    try {
      const { runLoop } = await import('@/lib/audio/tools/loop')
      const res = await runLoop(file, { count, gap }, (p) => setProgress(p))
      setResult(res)
      toast.success(`Looped ${count}×!`)
    } catch {
      setError('PROCESS_FAILED')
    } finally {
      setProgress(null)
      endProcessing()
    }
  }

  const outputDuration = fileDuration > 0 ? (fileDuration + gap) * count - gap : 0

  return (
    <ToolShell
      tool={tool}
      description="Concatenates audio clips using Web Audio API OfflineAudioContext on-device."
    >
      {!file && (
        <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop a short audio clip to loop" />
      )}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[var(--fg)] dark:text-[var(--fg)]">{file.name}</p>
          <div>
            <p className="text-sm font-medium mb-2 text-[var(--fg)] dark:text-[var(--fg)]">
              Repeat: <span className="font-mono">{count}×</span>
            </p>
            <input
              type="range"
              min={2}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-indigo-500"
              aria-label="Loop count"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-[var(--fg)] dark:text-[var(--fg)]">
              Gap between loops: <span className="font-mono">{gap}s</span>
            </p>
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-indigo-500"
              aria-label="Gap duration"
            />
          </div>
          {outputDuration > 0 && (
            <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)] font-mono">
              Output: {formatDuration(fileDuration)} × {count} = {formatDuration(outputDuration)}
            </p>
          )}
          <button
            type="button"
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Export Loop
          </button>
        </div>
      )}
      {progress && (
        <div className="flex justify-center py-10">
          <ProgressRing percent={progress.percent} step={progress.step} />
        </div>
      )}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
