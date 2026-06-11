'use client'
import { AlertTriangle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { FileMeta } from '@/components/tool/FileMeta'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ToolShell } from '@/components/tool/ToolShell'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { ExportFormat } from '@/lib/audio/encode'
import type { AudioMeta, Progress, ToolError, ToolResult } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'
import { useProcessingState } from '@/lib/store/processing'

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
  [...AUDIO_ACCEPTS].filter((a) => a.startsWith('audio/')).map((m) => [m, []])
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
    setMeta({
      name: f.name,
      size: f.size,
      duration: 0,
      format: f.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
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
      const res = await runConvert(
        file,
        { targetFormat, bitrate },
        (p) => setProgress(p),
        ctrl.signal
      )
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
  const isLossy = FORMATS.find((f) => f.id === targetFormat)?.lossy
  const isLossyConversion = ['wav', 'flac', 'aiff'].includes(inputFormat) && isLossy

  return (
    <ToolShell
      tool={tool}
      description="AudioNest converts audio files entirely in your browser using ffmpeg.wasm — the industry-standard FFmpeg compiled to WebAssembly. No audio data is uploaded. Converting from a lossless format (WAV, FLAC) to a lossy format (MP3, AAC) permanently reduces quality."
    >
      {!file && (
        <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop an audio file to convert" />
      )}

      {file && !progress && (
        <div className="flex flex-col gap-6">
          {meta && <FileMeta meta={meta} />}

          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-medium text-fg">Output format</p>
            <SegmentedControl
              aria-label="Output format"
              columns={4}
              value={targetFormat}
              onChange={(v) => setTargetFormat(v as ExportFormat)}
              options={FORMATS.map((f) => ({ value: f.id, label: f.label }))}
            />
          </div>

          {isLossyConversion && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Converting from lossless to {targetFormat.toUpperCase()} is lossy — quality will be
                permanently reduced.
              </p>
            </div>
          )}

          {isLossy && (
            <div className="flex flex-col gap-2.5">
              <p className="text-sm font-medium text-fg">
                Bitrate <span className="font-mono text-muted">· {bitrate} kbps</span>
              </p>
              <SegmentedControl
                aria-label="Bitrate"
                columns={3}
                value={String(bitrate)}
                onChange={(v) => setBitrate(Number(v))}
                options={BITRATES.map((b) => ({ value: String(b), label: `${b}`, hint: 'kbps' }))}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleConvert}>Convert to {targetFormat.toUpperCase()}</Button>
            <Button variant="secondary" onClick={handleReset}>
              Change file
            </Button>
          </div>
        </div>
      )}

      {progress && (
        <div className="flex flex-col items-center gap-6 py-10">
          <ProgressRing percent={progress.percent} step={progress.step} onCancel={handleCancel} />
          <p className="text-sm text-muted">Converting to {targetFormat.toUpperCase()}…</p>
        </div>
      )}

      {result && !progress && (
        <div className="flex flex-col gap-4">
          <ResultPanel result={result} originalSize={file?.size} />
          <Button variant="secondary" size="sm" className="self-start" onClick={handleReset}>
            Convert another file
          </Button>
        </div>
      )}

      {error && <ErrorCard error={error} onRetry={handleReset} />}
    </ToolShell>
  )
}
