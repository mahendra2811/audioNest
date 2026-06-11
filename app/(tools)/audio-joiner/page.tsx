'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { GripVertical, X, Upload } from 'lucide-react'
import { ToolShell } from '@/components/tool/ToolShell'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { GlassCard } from '@/components/glass/GlassCard'
import { getToolBySlug, AUDIO_ACCEPTS } from '@/lib/config/tools'
import type { ToolResult, ToolError, Progress } from '@/lib/audio/types'
import { useProcessingState } from '@/lib/store/processing'
import { formatBytes } from '@/lib/utils'
import { toast } from 'sonner'

const tool = getToolBySlug('audio-joiner')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))

export default function AudioJoinerPage() {
  const [files, setFiles] = useState<File[]>([])
  const [crossfade, setCrossfade] = useState(1)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    multiple: true,
    maxFiles: 10,
    onDrop: (accepted) => setFiles((prev) => [...prev, ...accepted].slice(0, 10)),
  })

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const handleJoin = async () => {
    if (files.length < 2) { toast.error('Add at least 2 files'); return }
    setProgress({ percent: 0, step: 'processing' })
    setResult(null)
    setError(null)
    startProcessing()
    try {
      const { runJoin } = await import('@/lib/audio/tools/join')
      const res = await runJoin(files, { crossfade }, (p) => setProgress(p))
      setResult(res)
      toast.success('Joined!')
    } catch {
      setError('PROCESS_FAILED')
    } finally {
      setProgress(null)
      endProcessing()
    }
  }

  return (
    <ToolShell tool={tool} description="Merges multiple audio files in order using ffmpeg.wasm crossfade filter. All processing is on-device.">
      {!progress && !result && (
        <div className="flex flex-col gap-5">
          <div {...getRootProps()} className={`rounded-3xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-orange-400 bg-orange-50/20' : 'border-white/25 bg-white/5 hover:bg-white/10'}`}>
            <input {...getInputProps()} />
            <Upload size={24} className="mx-auto mb-2 text-orange-500" />
            <p className="text-sm font-medium text-[#1A1208] dark:text-[#FFF8ED]">{isDragActive ? 'Drop files!' : 'Drop audio files here'}</p>
            <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] mt-1">2–10 files · Max 500 MB each</p>
          </div>

          {files.length > 0 && (
            <div className="flex flex-col gap-2">
              {files.map((f, i) => (
                <GlassCard key={i} intensity="light" className="px-4 py-3 flex items-center gap-3">
                  <GripVertical size={16} className="text-[#7A6A50]" />
                  <span className="flex-1 text-sm truncate text-[#1A1208] dark:text-[#FFF8ED]">{f.name}</span>
                  <span className="text-xs text-[#7A6A50] font-mono">{formatBytes(f.size)}</span>
                  <button onClick={() => removeFile(i)} aria-label="Remove" className="text-[#7A6A50] hover:text-red-400 transition-colors"><X size={14} /></button>
                </GlassCard>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2 text-[#1A1208] dark:text-[#FFF8ED]">Crossfade: <span className="font-mono">{crossfade}s</span></p>
            <input type="range" min={0} max={5} step={0.5} value={crossfade} onChange={(e) => setCrossfade(Number(e.target.value))} className="w-full accent-orange-500" aria-label="Crossfade duration" />
          </div>

          <button onClick={handleJoin} disabled={files.length < 2} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>
            Join {files.length} files
          </button>
        </div>
      )}

      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
