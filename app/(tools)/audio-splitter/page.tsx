'use client'
import { useState, useCallback } from 'react'
import { Dropzone } from '@/components/tool/Dropzone'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import { GlassCard } from '@/components/glass/GlassCard'
import { Download } from 'lucide-react'
import { getToolBySlug, AUDIO_ACCEPTS } from '@/lib/config/tools'
import type { ToolError, Progress } from '@/lib/audio/types'
import { useProcessingState } from '@/lib/store/processing'
import { toast } from 'sonner'

const tool = getToolBySlug('audio-splitter')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))

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
      const { zip, count: cnt } = await runSplit(file, { mode, parts, segmentDuration: segDuration }, (p) => setProgress(p))
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
    <ToolShell tool={tool} description="Splits your audio using ffmpeg.wasm segment muxer on-device. Output segments are zipped in the browser.">
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to split" />}
      {file && !progress && !zipBlob && (
        <div className="flex flex-col gap-5">
          <p className="font-medium text-[#1A1208] dark:text-[#FFF8ED]">{file.name}</p>
          <div className="flex gap-3">
            {(['parts', 'duration'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${mode === m ? 'text-white border-transparent' : 'bg-white/5 border-white/15'}`} style={mode === m ? { background: 'linear-gradient(135deg, #FF8C00, #FFD700)' } : {}}>
                {m === 'parts' ? 'Equal parts' : 'Every N seconds'}
              </button>
            ))}
          </div>
          {mode === 'parts' && (
            <div>
              <p className="text-sm font-medium mb-1 text-[#1A1208] dark:text-[#FFF8ED]">Parts: {parts}</p>
              <input type="range" min={2} max={20} value={parts} onChange={(e) => setParts(Number(e.target.value))} className="w-full accent-orange-500" />
            </div>
          )}
          {mode === 'duration' && (
            <div>
              <p className="text-sm font-medium mb-1 text-[#1A1208] dark:text-[#FFF8ED]">Segment length: {segDuration}s</p>
              <input type="range" min={5} max={300} step={5} value={segDuration} onChange={(e) => setSegDuration(Number(e.target.value))} className="w-full accent-orange-500" />
            </div>
          )}
          <button onClick={handleSplit} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>Split</button>
        </div>
      )}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {zipBlob && !progress && (
        <GlassCard intensity="medium" className="p-5 flex items-center justify-between gap-4">
          <p className="font-medium text-[#1A1208] dark:text-[#FFF8ED]">{count} segments</p>
          <a href={URL.createObjectURL(zipBlob)} download="segments.zip" className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>
            <Download size={16} /> Download ZIP
          </a>
        </GlassCard>
      )}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
