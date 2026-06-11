'use client'
import { useState } from 'react'
import { Dropzone } from '@/components/tool/Dropzone'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import { getToolBySlug, AUDIO_ACCEPTS } from '@/lib/config/tools'
import type { ToolResult, ToolError, Progress } from '@/lib/audio/types'
import { useProcessingState } from '@/lib/store/processing'
import { toast } from 'sonner'

const tool = getToolBySlug('audio-reverser')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))

export default function AudioReverserPage() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleFile = async (f: File) => {
    setFile(f); setResult(null); setError(null)
    setProgress({ percent: 0, step: 'decoding' })
    startProcessing()
    try {
      const { runReverse } = await import('@/lib/audio/tools/reverse')
      const res = await runReverse(f, {}, (p) => setProgress(p))
      setResult(res); toast.success('Reversed!')
    } catch { setError('PROCESS_FAILED') }
    finally { setProgress(null); endProcessing() }
  }

  return (
    <ToolShell tool={tool} description="Reverses all audio channels on-device using the Web Audio API OfflineAudioContext.">
      {!file && !progress && <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop audio to reverse" />}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && <ErrorCard error={error} onRetry={() => { setFile(null); setError(null) }} />}
    </ToolShell>
  )
}
