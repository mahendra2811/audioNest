'use client'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/glass/GlassCard'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ToolShell } from '@/components/tool/ToolShell'
import type { Progress, ToolError, ToolResult } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug, IMAGE_ACCEPTS } from '@/lib/config/tools'
import { useProcessingState } from '@/lib/store/processing'
import { formatBytes } from '@/lib/utils'

const tool = getToolBySlug('photo-audio-to-video')!
const AUDIO_ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)
const IMAGE_ACCEPT = Object.fromEntries(
  IMAGE_ACCEPTS.filter((a) => a.startsWith('image/')).map((m) => [m, []])
)

export default function PhotoAudioToVideoPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleImageFile = (f: File) => {
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  const handleCreate = async () => {
    if (!imageFile || !audioFile) {
      toast.error('Add both a photo and an audio file')
      return
    }
    setProgress({ percent: 0, step: 'processing' })
    setResult(null)
    setError(null)
    startProcessing()
    try {
      const { runPhotoToVideo } = await import('@/lib/audio/tools/photo-to-video')
      const res = await runPhotoToVideo(imageFile, audioFile, {}, (p) => setProgress(p))
      setResult(res)
      toast.success('Video created!')
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
      description="Combines a static image with an audio file to create an MP4 video using ffmpeg.wasm on-device. Great for lyric videos and podcast cover videos."
    >
      {!progress && !result && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2 text-[var(--fg)] dark:text-[var(--fg)]">
                Photo
              </p>
              {imageFile && imagePreview ? (
                <GlassCard intensity="light" className="p-3 flex items-center gap-3">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <p className="text-xs truncate text-[var(--fg)] dark:text-[var(--fg)]">
                    {imageFile.name}
                  </p>
                </GlassCard>
              ) : (
                <Dropzone
                  onFile={handleImageFile}
                  accept={IMAGE_ACCEPT}
                  label="Drop a photo"
                  className="min-h-[120px]"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-2 text-[var(--fg)] dark:text-[var(--fg)]">
                Audio
              </p>
              {audioFile ? (
                <GlassCard intensity="light" className="px-4 py-3">
                  <p className="text-sm truncate text-[var(--fg)] dark:text-[var(--fg)]">
                    {audioFile.name} · {formatBytes(audioFile.size)}
                  </p>
                </GlassCard>
              ) : (
                <Dropzone
                  onFile={setAudioFile}
                  accept={AUDIO_ACCEPT}
                  label="Drop audio"
                  className="min-h-[120px]"
                />
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!imageFile || !audioFile}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Create Video
          </button>
        </div>
      )}
      {progress && (
        <div className="flex justify-center py-10">
          <ProgressRing percent={progress.percent} step={progress.step} />
        </div>
      )}
      {result && !progress && <ResultPanel result={result} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
