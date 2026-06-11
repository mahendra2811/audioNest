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
import { cn } from '@/lib/utils'

const tool = getToolBySlug('audio-normalizer')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)
const PRESETS = [
  { id: 'streaming', label: 'Streaming', lufs: -14 },
  { id: 'podcast', label: 'Podcast', lufs: -16 },
  { id: 'broadcast', label: 'Broadcast', lufs: -23 },
] as const

export default function AudioNormalizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preset, setPreset] = useState<'streaming' | 'podcast' | 'broadcast'>('streaming')
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleRun = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'processing' })
    setResult(null)
    setError(null)
    startProcessing()
    try {
      const { runNormalize } = await import('@/lib/audio/tools/normalize')
      const res = await runNormalize(file, { target: preset }, (p) => setProgress(p))
      setResult(res)
      toast.success('Normalized!')
    } catch {
      setError('PROCESS_FAILED')
    } finally {
      setProgress(null)
      endProcessing()
    }
  }

  const selectedLUFS = PRESETS.find((p) => p.id === preset)?.lufs

  return (
    <ToolShell
      tool={tool}
      description="Uses ffmpeg loudnorm filter (EBU R128) to normalize audio loudness on-device."
    >
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to normalize" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[var(--fg)] dark:text-[var(--fg)]">{file.name}</p>
          <div className="flex gap-3 flex-wrap">
            {PRESETS.map(({ id, label, lufs }) => (
              <button
                type="button"
                key={id}
                onClick={() => setPreset(id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border transition-all text-left',
                  preset === id
                    ? 'text-white border-transparent'
                    : 'border border-line bg-surface-2 text-fg'
                )}
              >
                <span
                  style={
                    preset === id
                      ? {
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }
                      : {}
                  }
                >
                  {label}
                </span>
                <p
                  className="text-xs font-mono opacity-70 mt-0.5"
                  style={{
                    WebkitTextFillColor: 'unset',
                    color: preset === id ? 'rgba(255,255,255,0.7)' : undefined,
                  }}
                >
                  {lufs} LUFS
                </p>
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)]">
            Target: <span className="font-mono">{selectedLUFS} LUFS</span>
          </p>
          <button
            type="button"
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Normalize
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
