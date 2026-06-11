'use client'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/glass/GlassCard'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ToolShell } from '@/components/tool/ToolShell'
import type { Progress, ToolError } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'
import { useProcessingState } from '@/lib/store/processing'

const tool = getToolBySlug('audio-splitter')!
const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

export default function AudioSplitterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'parts' | 'duration'>('parts')
  const [parts, setParts] = useState(4)
  const [segDuration, setSegDuration] = useState(30)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [zipBlob, setZipBlob] = useState<Blob | null>(null)
  const [count, setCount] = useState(0)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleSplit = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'processing' })
    setZipBlob(null)
    setError(null)
    startProcessing()
    try {
      const { runSplit } = await import('@/lib/audio/tools/split')
      const { zip, count: cnt } = await runSplit(
        file,
        { mode, parts, segmentDuration: segDuration },
        (p) => setProgress(p)
      )
      setZipBlob(zip)
      setCount(cnt)
      toast.success(`Split into ${cnt} segments!`)
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
      description="Splits your audio using ffmpeg.wasm segment muxer on-device. Output segments are zipped in the browser."
    >
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to split" />}
      {file && !progress && !zipBlob && (
        <div className="flex flex-col gap-5">
          <p className="font-medium text-[var(--fg)] dark:text-[var(--fg)]">{file.name}</p>
          <div className="flex gap-3">
            {(['parts', 'duration'] as const).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${mode === m ? 'text-white border-transparent' : 'border border-line bg-surface-2 text-fg'}`}
                style={
                  mode === m ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}
                }
              >
                {m === 'parts' ? 'Equal parts' : 'Every N seconds'}
              </button>
            ))}
          </div>
          {mode === 'parts' && (
            <div>
              <p className="text-sm font-medium mb-1 text-[var(--fg)] dark:text-[var(--fg)]">
                Parts: {parts}
              </p>
              <input
                type="range"
                min={2}
                max={20}
                value={parts}
                onChange={(e) => setParts(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          )}
          {mode === 'duration' && (
            <div>
              <p className="text-sm font-medium mb-1 text-[var(--fg)] dark:text-[var(--fg)]">
                Segment length: {segDuration}s
              </p>
              <input
                type="range"
                min={5}
                max={300}
                step={5}
                value={segDuration}
                onChange={(e) => setSegDuration(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleSplit}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Split
          </button>
        </div>
      )}
      {progress && (
        <div className="flex justify-center py-10">
          <ProgressRing percent={progress.percent} step={progress.step} />
        </div>
      )}
      {zipBlob && !progress && (
        <GlassCard intensity="medium" className="p-5 flex items-center justify-between gap-4">
          <p className="font-medium text-[var(--fg)] dark:text-[var(--fg)]">{count} segments</p>
          <a
            href={URL.createObjectURL(zipBlob)}
            download="segments.zip"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Download size={16} /> Download ZIP
          </a>
        </GlassCard>
      )}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
