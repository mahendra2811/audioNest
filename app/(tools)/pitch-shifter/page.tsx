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

const tool = getToolBySlug('pitch-shifter')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))

export default function PitchShifterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [semitones, setSemitones] = useState(0)
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
      const { runPitch } = await import('@/lib/audio/tools/pitch')
      const res = await runPitch(file, { semitones }, (p) => setProgress(p))
      setResult(res); toast.success('Pitch shifted!')
    } catch { setError('PROCESS_FAILED') }
    finally { setProgress(null); endProcessing() }
  }

  return (
    <ToolShell tool={tool} description="Shifts pitch using ffmpeg asetrate+aresample trick on-device. Tempo unchanged.">
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to shift pitch" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[#1A1208] dark:text-[#FFF8ED]">{file.name}</p>
          <div>
            <p className="text-sm font-medium mb-2 text-[#1A1208] dark:text-[#FFF8ED]">Pitch: <span className="font-mono">{semitones >= 0 ? '+' : ''}{semitones} semitones</span></p>
            <input type="range" min={-12} max={12} step={1} value={semitones} onChange={(e) => setSemitones(Number(e.target.value))} className="w-full accent-orange-500" aria-label="Pitch shift in semitones" />
            <div className="flex justify-between text-xs text-[#7A6A50] mt-1"><span>-12st</span><span>0</span><span>+12st</span></div>
          </div>
          <button onClick={handleRun} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>Apply</button>
        </div>
      )}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
