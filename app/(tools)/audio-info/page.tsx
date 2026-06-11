'use client'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/glass/GlassCard'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { FileMeta } from '@/components/tool/FileMeta'
import { ToolShell } from '@/components/tool/ToolShell'
import type { AudioMeta } from '@/lib/audio/types'
import { AUDIO_ACCEPTS, getToolBySlug } from '@/lib/config/tools'

const tool = getToolBySlug('audio-info')!

const ACCEPT = Object.fromEntries(
  AUDIO_ACCEPTS.filter((a) => a.startsWith('audio/')).map((m) => [m, []])
)

export default function AudioInfoPage() {
  const [meta, setMeta] = useState<AudioMeta | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setMeta(null)
    setError(null)
    setCoverUrl(null)
    setLoading(true)

    try {
      const { runInfo } = await import('@/lib/audio/tools/info')
      const result = await runInfo(file, {}, (p) => {
        if (p.percent === 100) setLoading(false)
      })
      setMeta(result)
      if (result.coverArt) {
        setCoverUrl(URL.createObjectURL(result.coverArt))
      }
    } catch (e) {
      const code = (e as Error & { code?: string }).code || 'PROCESS_FAILED'
      setError(code)
      toast.error((e as Error).message || 'Could not read file info')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReset = () => {
    setMeta(null)
    setError(null)
    setCoverUrl(null)
  }

  return (
    <ToolShell
      tool={tool}
      description="AudioNest reads your file entirely on your device using the Web Audio API and music-metadata library. No data is uploaded anywhere. Metadata like GPS coordinates or device info may be present in some files — use the Metadata Remover tool if you need to strip them."
    >
      {!meta && !loading && (
        <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop an audio file to inspect it" />
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)]">Reading file info…</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col gap-4">
          <ErrorCard error={error} onRetry={handleReset} />
        </div>
      )}

      {meta && (
        <div className="flex flex-col gap-5">
          {/* Cover art + basic info */}
          {coverUrl && (
            <div className="flex items-start gap-4">
              <Image
                src={coverUrl}
                alt="Cover art"
                width={80}
                height={80}
                className="rounded-xl object-cover shrink-0 shadow-lg"
              />
              <div className="flex-1 min-w-0">
                {meta.tags?.title && (
                  <p className="font-bold text-lg text-[var(--fg)] dark:text-[var(--fg)] truncate">
                    {meta.tags.title}
                  </p>
                )}
                {meta.tags?.artist && (
                  <p className="text-[var(--muted)] dark:text-[var(--muted)] truncate">
                    {meta.tags.artist}
                  </p>
                )}
                {meta.tags?.album && (
                  <p className="text-sm text-[var(--muted)] dark:text-[var(--muted)] truncate">
                    {meta.tags.album}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Technical details */}
          <FileMeta meta={meta} />

          {/* ID3 tags */}
          {meta.tags && Object.keys(meta.tags).length > 0 && (
            <GlassCard intensity="light" className="p-4">
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)] dark:text-[var(--muted)] mb-3">
                Tags
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {Object.entries(meta.tags).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] dark:text-[var(--muted)] capitalize">
                      {key}
                    </p>
                    <p className="text-sm text-[var(--fg)] dark:text-[var(--fg)] truncate">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="self-start px-4 py-2 rounded-xl text-sm font-medium bg-black/5 hover:bg-black/8 dark:bg-surface-2 dark:hover:bg-surface border border-line transition-all"
          >
            Inspect another file
          </button>
        </div>
      )}
    </ToolShell>
  )
}
