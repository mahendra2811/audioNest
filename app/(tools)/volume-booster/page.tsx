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

const tool = getToolBySlug('volume-booster')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

export default function VolumeBoosterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [gainDb, setGainDb] = useState(0)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleRun = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'decoding' })
    setResult(null)
    setError(null)
    startProcessing()
    try {
      const { runVolume } = await import('@/lib/audio/tools/volume')
      const res = await runVolume(file, { gainDb }, (p) => setProgress(p))
      setResult(res)
      toast.success('Done!')
    } catch {
      setError('PROCESS_FAILED')
    } finally {
      setProgress(null)
      endProcessing()
    }
  }

  return (
    <ToolShell
      tool={tool}
      description="Adjusts volume using Web Audio API GainNode with a soft limiter to prevent clipping."
    >
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to adjust volume" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[var(--fg)] dark:text-[var(--fg)]">{file.name}</p>
          <div>
            <p className="text-sm font-medium mb-2 text-[var(--fg)] dark:text-[var(--fg)]">
              Gain:{' '}
              <span className="font-mono">
                {gainDb >= 0 ? '+' : ''}
                {gainDb} dB
              </span>
            </p>
            <input
              type="range"
              min={-20}
              max={20}
              step={1}
              value={gainDb}
              onChange={(e) => setGainDb(Number(e.target.value))}
              className="w-full accent-indigo-500"
              aria-label="Volume gain"
            />
          </div>
          <button
            type="button"
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Apply
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
