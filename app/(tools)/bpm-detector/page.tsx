'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/glass/GlassCard'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import type { ToolError } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'

const tool = getToolBySlug('bpm-detector')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

export default function BPMDetectorPage() {
  const [bpm, setBpm] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ToolError | null>(null)

  const handleFile = async (f: File) => {
    setBpm(null)
    setError(null)
    setLoading(true)
    try {
      const { runBPM } = await import('@/lib/audio/tools/bpm')
      const { bpm: b } = await runBPM(f, {}, () => {})
      setBpm(b)
      if (!b) toast.info('Beat not detected clearly.')
    } catch {
      setError('PROCESS_FAILED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell
      tool={tool}
      description="Analyzes audio using the web-audio-beat-detector library on-device to estimate BPM."
    >
      {!bpm && !loading && (
        <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop audio to detect BPM" />
      )}
      {loading && (
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)]">Detecting BPM…</p>
        </div>
      )}
      {bpm !== null && !loading && (
        <GlassCard intensity="medium" className="p-8 flex flex-col items-center gap-3">
          <p
            className="text-7xl font-bold font-mono text-brand"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {bpm}
          </p>
          <p className="text-xl font-semibold text-[var(--fg)] dark:text-[var(--fg)]">BPM</p>
          <button
            type="button"
            onClick={() => setBpm(null)}
            className="mt-4 px-4 py-2 rounded-xl text-sm border border-line bg-surface-2 hover:bg-surface"
          >
            Detect another
          </button>
        </GlassCard>
      )}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
