'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/glass/GlassCard'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import type { ToolError } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'

const tool = getToolBySlug('loudness-meter')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

interface LoudnessResult {
  integratedLUFS: number
  lra: number
  truePeak: number
  rms: number
  peakDb: number
}

function MeterBar({
  value,
  min,
  max,
  label,
  unit,
  thresholds,
}: {
  value: number
  min: number
  max: number
  label: string
  unit: string
  thresholds: { warn: number; bad: number }
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  const color = value > thresholds.bad ? '#ef4444' : value > thresholds.warn ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--muted)] dark:text-[var(--muted)]">{label}</span>
        <span className="font-mono font-bold text-[var(--fg)] dark:text-[var(--fg)]">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function LoudnessMeterPage() {
  const [result, setResult] = useState<LoudnessResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ToolError | null>(null)

  const handleFile = async (f: File) => {
    setResult(null)
    setError(null)
    setLoading(true)
    try {
      const { runLoudness } = await import('@/lib/audio/tools/loudness')
      const res = await runLoudness(f, {}, () => {})
      setResult(res)
    } catch {
      setError('PROCESS_FAILED')
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell
      tool={tool}
      description="Measures audio loudness metrics on-device using the Web Audio API. Displays Integrated LUFS (EBU R128), LRA, True Peak, and RMS."
    >
      {!result && !loading && (
        <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop audio to measure loudness" />
      )}
      {loading && (
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)]">Analyzing…</p>
        </div>
      )}
      {result && (
        <GlassCard intensity="medium" className="p-5 flex flex-col gap-4">
          <MeterBar
            value={result.integratedLUFS}
            min={-40}
            max={0}
            label="Integrated LUFS"
            unit=" LUFS"
            thresholds={{ warn: -14, bad: -8 }}
          />
          <MeterBar
            value={result.peakDb}
            min={-40}
            max={0}
            label="Peak"
            unit=" dBFS"
            thresholds={{ warn: -3, bad: -1 }}
          />
          <MeterBar
            value={result.rms}
            min={-40}
            max={0}
            label="RMS"
            unit=" dBFS"
            thresholds={{ warn: -14, bad: -8 }}
          />
          <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-line">
            <div>
              <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)]">True Peak</p>
              <p className="font-mono font-bold text-[var(--fg)] dark:text-[var(--fg)]">
                {result.truePeak} dBFS
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)]">LRA</p>
              <p className="font-mono font-bold text-[var(--fg)] dark:text-[var(--fg)]">
                {result.lra} LU
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setResult(null)}
            className="self-start px-4 py-2 rounded-xl text-sm border border-line bg-surface-2 hover:bg-surface"
          >
            Measure another
          </button>
        </GlassCard>
      )}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
