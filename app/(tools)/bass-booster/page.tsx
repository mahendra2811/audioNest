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

const tool = getToolBySlug('bass-booster')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))

export default function BassBoosterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [gainDb, setGainDb] = useState(6)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleRun = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'decoding' }); setResult(null); setError(null)
    startProcessing()
    try {
      const { runBass } = await import('@/lib/audio/tools/bass')
      const res = await runBass(file, { gainDb }, (p) => setProgress(p))
      setResult(res); toast.success('Bass boosted!')
    } catch { setError('PROCESS_FAILED') }
    finally { setProgress(null); endProcessing() }
  }

  return (
    <ToolShell tool={tool} description="Applies a lowshelf BiquadFilter at 100 Hz using Web Audio API OfflineAudioContext.">
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to boost bass" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[#1A1208] dark:text-[#FFF8ED]">{file.name}</p>
          <div>
            <p className="text-sm font-medium mb-2 text-[#1A1208] dark:text-[#FFF8ED]">Bass boost: <span className="font-mono">+{gainDb} dB</span></p>
            <input type="range" min={0} max={12} step={1} value={gainDb} onChange={(e) => setGainDb(Number(e.target.value))} className="w-full accent-orange-500" aria-label="Bass gain" />
          </div>
          <button onClick={handleRun} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>
            Apply
          </button>
        </div>
      )}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
