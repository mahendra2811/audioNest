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
import { formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const tool = getToolBySlug('audio-compressor')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))
const BITRATES = [32, 64, 96, 128]

export default function AudioCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [bitrate, setBitrate] = useState(96)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const estSize = file ? Math.round((file.size * bitrate) / 192) : 0

  const handleRun = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'processing' }); setResult(null); setError(null)
    startProcessing()
    try {
      const { runCompress } = await import('@/lib/audio/tools/compress')
      const res = await runCompress(file, { bitrate }, (p) => setProgress(p))
      setResult(res); toast.success('Compressed!')
    } catch { setError('PROCESS_FAILED') }
    finally { setProgress(null); endProcessing() }
  }

  return (
    <ToolShell tool={tool} description="Re-encodes your audio at a lower bitrate using ffmpeg.wasm on-device to reduce file size.">
      {!file && <Dropzone onFile={setFile} accept={ACCEPT} label="Drop audio to compress" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[#1A1208] dark:text-[#FFF8ED]">{file.name} · {formatBytes(file.size)}</p>
          <div>
            <p className="text-sm font-medium mb-2 text-[#1A1208] dark:text-[#FFF8ED]">Target bitrate</p>
            <div className="flex gap-2">
              {BITRATES.map(b => (
                <button key={b} onClick={() => setBitrate(b)} className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all', bitrate === b ? 'text-white border-transparent' : 'bg-white/5 border-white/15')} style={bitrate === b ? { background: 'linear-gradient(135deg, #FF8C00, #FFD700)' } : {}}>
                  {b} kbps
                </button>
              ))}
            </div>
          </div>
          {estSize > 0 && <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F]">Estimated output: ~{formatBytes(estSize)}</p>}
          <button onClick={handleRun} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>Compress</button>
        </div>
      )}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
