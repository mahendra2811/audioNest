'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ToolShell } from '@/components/tool/ToolShell'
import type { ReverbPreset } from '@/lib/audio/tools/reverb'
import type { Progress, ToolError, ToolResult } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'
import { useProcessingState } from '@/lib/store/processing'
import { cn } from '@/lib/utils'

const tool = getToolBySlug('reverb-adder')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)
const PRESETS: Array<{ id: ReverbPreset; label: string }> = [
  { id: 'room', label: 'Room' },
  { id: 'hall', label: 'Hall' },
  { id: 'church', label: 'Church' },
  { id: 'cave', label: 'Cave' },
  { id: 'studio', label: 'Studio' },
  { id: 'plate', label: 'Plate' },
]

export default function ReverbAdderPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preset, setPreset] = useState<ReverbPreset>('room')
  const [wet, setWet] = useState(0.5)
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
      const { runReverb } = await import('@/lib/audio/tools/reverb')
      const res = await runReverb(file, { preset, wet, dry: 1 - wet }, (p) => setProgress(p))
      setResult(res)
      toast.success('Reverb added!')
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
      description="Applies convolution reverb using impulse response files and Web Audio ConvolverNode on-device."
    >
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to add reverb" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[var(--fg)] dark:text-[var(--fg)]">{file.name}</p>
          <div>
            <p className="text-sm font-medium mb-2 text-[var(--fg)] dark:text-[var(--fg)]">
              Preset
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(({ id, label }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setPreset(id)}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-sm font-medium border transition-all',
                    preset === id
                      ? 'text-white border-transparent'
                      : 'border border-line bg-surface-2 text-fg'
                  )}
                  style={
                    preset === id ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-[var(--fg)] dark:text-[var(--fg)]">
              Wet/Dry: <span className="font-mono">{Math.round(wet * 100)}% wet</span>
            </p>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={wet}
              onChange={(e) => setWet(Number(e.target.value))}
              className="w-full accent-indigo-500"
              aria-label="Wet/dry mix"
            />
          </div>
          <button
            type="button"
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Add Reverb
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
