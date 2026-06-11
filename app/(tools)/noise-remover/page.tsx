'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/glass/GlassCard'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ToolShell } from '@/components/tool/ToolShell'
import type { Progress, ToolError, ToolResult } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'
import { useProcessingState } from '@/lib/store/processing'

const tool = getToolBySlug('noise-remover')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

export default function NoiseRemoverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    if (f.type.includes('audio') && !f.name.match(/.(mp3|wav|ogg|flac|m4a|aac)/i)) return
    toast.info('Best for voice recordings — results on music may vary.')
  }

  const handleRun = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'decoding' })
    setResult(null)
    setError(null)
    startProcessing()
    try {
      const { runDenoise } = await import('@/lib/audio/tools/denoise')
      const res = await runDenoise(file, {}, (p) => setProgress(p))
      setResult(res)
      toast.success('Noise removed!')
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
      description="Removes background noise using a highpass/lowpass filter via ffmpeg on-device. Best results with voice recordings. Music files may sound different."
    >
      {!file && <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop audio to remove noise" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <GlassCard intensity="light" className="px-4 py-3">
            <p className="text-sm text-indigo-700 dark:text-indigo-400">
              Best for voice recordings — results on music may vary.
            </p>
          </GlassCard>
          <p className="text-sm text-[var(--fg)] dark:text-[var(--fg)]">{file.name}</p>
          <button
            type="button"
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Remove Noise
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
