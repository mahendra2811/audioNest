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

const tool = getToolBySlug('mono-to-stereo')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

export default function MonoToStereoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleFile = async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    setProgress({ percent: 0, step: 'processing' })
    startProcessing()
    try {
      const { runMonoToStereo } = await import('@/lib/audio/tools/stereo-mono')
      const res = await runMonoToStereo(f, {}, (p) => setProgress(p))
      setResult(res)
      toast.success('Converted to stereo!')
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
      description="Duplicates a mono channel to both left/right channels using ffmpeg -ac 2 on-device."
    >
      {!file && !progress && (
        <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop mono audio" />
      )}
      {progress && (
        <div className="flex justify-center py-10">
          <ProgressRing percent={progress.percent} step={progress.step} />
        </div>
      )}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && (
        <ErrorCard
          error={error}
          onRetry={() => {
            setFile(null)
            setError(null)
          }}
        />
      )}
    </ToolShell>
  )
}
