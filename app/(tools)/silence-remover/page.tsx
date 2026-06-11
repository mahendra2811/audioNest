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

const tool = getToolBySlug('silence-remover')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))

export default function SilenceRemoverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [threshold, setThreshold] = useState(-30)
  const [minDuration, setMinDuration] = useState(0.5)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleRun = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'processing' })
    setResult(null); setError(null)
    startProcessing()
    try {
      const { runSilenceRemove } = await import('@/lib/audio/tools/silence')
      const res = await runSilenceRemove(file, { threshold, minDuration }, (p) => setProgress(p))
      setResult(res); toast.success('Silence removed!')
    } catch { setError('PROCESS_FAILED') }
    finally { setProgress(null); endProcessing() }
  }

  return (
    <ToolShell tool={tool} description="Uses ffmpeg silenceremove filter to automatically cut silent sections from your audio file.">
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to remove silence" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="font-medium text-[#1A1208] dark:text-[#FFF8ED]">{file.name}</p>
          <div>
            <p className="text-sm font-medium mb-1 text-[#1A1208] dark:text-[#FFF8ED]">Threshold: <span className="font-mono">{threshold} dB</span></p>
            <input type="range" min={-60} max={-10} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-orange-500" aria-label="Silence threshold" />
          </div>
          <div>
            <p className="text-sm font-medium mb-1 text-[#1A1208] dark:text-[#FFF8ED]">Min silence: <span className="font-mono">{minDuration}s</span></p>
            <input type="range" min={0.1} max={5} step={0.1} value={minDuration} onChange={(e) => setMinDuration(Number(e.target.value))} className="w-full accent-orange-500" aria-label="Min silence duration" />
          </div>
          <button onClick={handleRun} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>Remove Silence</button>
        </div>
      )}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
