'use client'
import { useState, useCallback } from 'react'
import { Dropzone } from '@/components/tool/Dropzone'
import { FileMeta } from '@/components/tool/FileMeta'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import { GlassCard } from '@/components/glass/GlassCard'
import { getToolBySlug, AUDIO_ACCEPTS } from '@/lib/config/tools'
import type { AudioMeta, Progress, ToolResult, ToolError } from '@/lib/audio/types'
import type { ExportFormat } from '@/lib/audio/encode'
import { useProcessingState } from '@/lib/store/processing'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const tool = getToolBySlug('audio-converter')!

const FORMATS: Array<{ id: ExportFormat; label: string; lossy: boolean }> = [
  { id: 'mp3', label: 'MP3', lossy: true },
  { id: 'wav', label: 'WAV', lossy: false },
  { id: 'flac', label: 'FLAC', lossy: false },
  { id: 'aac', label: 'AAC', lossy: true },
  { id: 'ogg', label: 'OGG', lossy: true },
  { id: 'm4a', label: 'M4A', lossy: true },
  { id: 'opus', label: 'Opus', lossy: true },
]

const BITRATES = [64, 96, 128, 192, 256, 320]

const ACCEPT = Object.fromEntries(
  [...AUDIO_ACCEPTS].filter(a => a.startsWith('audio/')).map(m => [m, []])
)

export default function AudioConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [meta, setMeta] = useState<AudioMeta | null>(null)
  const [targetFormat, setTargetFormat] = useState<ExportFormat>('mp3')
  const [bitrate, setBitrate] = useState(192)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    // Get basic meta
    const inputFmt = f.name.split('.').pop()?.toUpperCase() || 'UNKNOWN'
    setMeta({
      name: f.name,
      size: f.size,
      duration: 0,
      format: inputFmt,
      sampleRate: 44100,
      numberOfChannels: 2,
    })
  }, [])

  const handleConvert = async () => {
    if (!file) return
    const ctrl = new AbortController()
    setAbortCtrl(ctrl)
    setProgress({ percent: 0, step: 'processing' })
    setResult(null)
    setError(null)
    startProcessing()

    try {
      const { runConvert } = await import('@/lib/audio/tools/convert')
      const res = await runConvert(file, { targetFormat, bitrate }, (p) => setProgress(p), ctrl.signal)
      setResult(res)
      toast.success('Conversion complete!')
    } catch (e) {
      if ((e as Error).message === 'ABORTED') return
      const code = ((e as Error & { code?: string }).code || 'PROCESS_FAILED') as ToolError
      setError(code)
      toast.error('Conversion failed')
    } finally {
      setProgress(null)
      endProcessing()
      setAbortCtrl(null)
    }
  }

  const handleCancel = () => {
    abortCtrl?.abort()
    setProgress(null)
    endProcessing()
  }

  const handleReset = () => {
    setFile(null)
    setMeta(null)
    setResult(null)
    setError(null)
    setProgress(null)
  }

  const inputFormat = file?.name.split('.').pop()?.toLowerCase() || ''
  const isLossyConversion =
    ['wav', 'flac', 'aiff'].includes(inputFormat) &&
    FORMATS.find(f => f.id === targetFormat)?.lossy

  return (
    <ToolShell
      tool={tool}
      description="AudioNest converts audio files entirely in your browser using ffmpeg.wasm — a version of the industry-standard FFmpeg compiled to WebAssembly. No audio data is uploaded. Converting from a lossless format (WAV, FLAC) to a lossy format (MP3, AAC) permanently reduces quality."
    >
      {!file && (
        <Dropzone
          onFile={handleFile}
          accept={ACCEPT}
          label="Drop an audio file to convert"
        />
      )}

      {file && !progress && (
        <div className="flex flex-col gap-5">
          {meta && <FileMeta meta={meta} />}

          {/* Format picker */}
          <div>
            <p className="text-sm font-medium text-[#1A1208] dark:text-[#FFF8ED] mb-2">Output format</p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTargetFormat(id)}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-sm font-medium border transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                    targetFormat === id
                      ? 'text-white border-transparent'
                      : 'bg-black/4 border-black/10 dark:bg-white/5 dark:border-white/15 text-[#1A1208] dark:text-[#FFF8ED] hover:bg-white/10'
                  )}
                  style={targetFormat === id ? { background: 'linear-gradient(135deg, #FF8C00, #FFD700)' } : {}}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Lossy warning */}
          {isLossyConversion && (
            <GlassCard intensity="light" className="px-4 py-3 border border-amber-300/30">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Converting from lossless to {targetFormat.toUpperCase()} is lossy — audio quality will be permanently reduced.
              </p>
            </GlassCard>
          )}

          {/* Bitrate (lossy formats) */}
          {FORMATS.find(f => f.id === targetFormat)?.lossy && (
            <div>
              <p className="text-sm font-medium text-[#1A1208] dark:text-[#FFF8ED] mb-2">
                Bitrate: <span className="font-mono">{bitrate} kbps</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {BITRATES.map(b => (
                  <button
                    key={b}
                    onClick={() => setBitrate(b)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-sm border transition-all',
                      bitrate === b
                        ? 'text-white border-transparent'
                        : 'bg-black/4 border-black/10 dark:bg-white/5 dark:border-white/15 text-[#7A6A50] dark:text-[#B8A77F] hover:bg-white/10'
                    )}
                    style={bitrate === b ? { background: 'linear-gradient(135deg, #FF8C00, #FFD700)' } : {}}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleConvert}
              className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
            >
              Convert to {targetFormat.toUpperCase()}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-black/5 border border-black/10 hover:bg-black/8 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 transition-all"
            >
              Change file
            </button>
          </div>
        </div>
      )}

      {progress && (
        <div className="flex flex-col items-center py-10 gap-6">
          <ProgressRing
            percent={progress.percent}
            step={progress.step}
            onCancel={handleCancel}
          />
          <p className="text-sm text-[#7A6A50] dark:text-[#B8A77F]">Converting to {targetFormat.toUpperCase()}…</p>
        </div>
      )}

      {result && !progress && (
        <div className="flex flex-col gap-4">
          <ResultPanel result={result} originalSize={file?.size} />
          <button
            onClick={handleReset}
            className="self-start px-4 py-2 rounded-xl text-sm font-medium bg-black/5 border border-black/10 hover:bg-black/8 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 transition-all"
          >
            Convert another file
          </button>
        </div>
      )}

      {error && (
        <ErrorCard error={error} onRetry={handleReset} />
      )}
    </ToolShell>
  )
}
