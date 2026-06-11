'use client'
import { Download } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/glass/GlassCard'
import { Dropzone } from '@/components/tool/Dropzone'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import type { ID3ReadResult, ID3Tags } from '@/lib/audio/tools/id3'
import type { ToolError } from '@/lib/audio/types'
import { getToolBySlug } from '@/lib/config/tools'

const tool = getToolBySlug('id3-tag-editor')!
const ACCEPT = { 'audio/mpeg': ['.mp3'], 'audio/mp3': ['.mp3'] }

const FIELDS: Array<{ key: keyof Omit<ID3Tags, 'coverArt'>; label: string; type?: string }> = [
  { key: 'title', label: 'Title' },
  { key: 'artist', label: 'Artist' },
  { key: 'album', label: 'Album' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'genre', label: 'Genre' },
  { key: 'track', label: 'Track #', type: 'number' },
  { key: 'comment', label: 'Comment' },
]

export default function ID3TagEditorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [tags, setTags] = useState<ID3ReadResult>({})
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<ToolError | null>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setTags({})
    setResultBlob(null)
    setError(null)
    try {
      const { readID3 } = await import('@/lib/audio/tools/id3')
      const read = await readID3(f)
      setTags(read)
    } catch {
      /* no existing tags */
    }
  }, [])

  const handleSave = async () => {
    if (!file) return
    setSaving(true)
    setResultBlob(null)
    try {
      const { writeID3 } = await import('@/lib/audio/tools/id3')
      const blob = await writeID3(file, { ...tags, coverArt: coverFile || undefined }, () => {})
      setResultBlob(blob)
      toast.success('Tags saved!')
    } catch {
      setError('PROCESS_FAILED')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ToolShell
      tool={tool}
      description="Reads and writes ID3v2 tags to MP3 files using browser-id3-writer on-device."
    >
      {!file && (
        <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop an MP3 to edit its tags" />
      )}
      {file && !saving && !resultBlob && (
        <div className="flex flex-col gap-4">
          {tags.existingCoverUrl && (
            <div className="flex items-center gap-3">
              <Image
                src={tags.existingCoverUrl}
                alt="Current cover"
                width={60}
                height={60}
                className="rounded-xl object-cover"
              />
              <p className="text-xs text-[var(--muted)] dark:text-[var(--muted)]">
                Current cover art
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELDS.map(({ key, label, type }) => (
              <div key={key}>
                <label className="text-xs uppercase tracking-wider text-[var(--muted)] dark:text-[var(--muted)] mb-1 block">
                  {label}
                </label>
                <input
                  type={type || 'text'}
                  value={(tags[key] as string) || ''}
                  onChange={(e) => setTags((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-sm text-[var(--fg)] dark:text-[var(--fg)] focus:outline-none focus:border-indigo-400"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--muted)] dark:text-[var(--muted)] mb-1 block">
              Cover Art (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="text-sm text-[var(--muted)] dark:text-[var(--muted)]"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Save Tags
          </button>
        </div>
      )}
      {saving && (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
        </div>
      )}
      {resultBlob && (
        <GlassCard intensity="medium" className="p-5 flex items-center justify-between gap-4">
          <p className="font-medium text-[var(--fg)] dark:text-[var(--fg)]">Tags updated!</p>
          <a
            href={URL.createObjectURL(resultBlob)}
            download={file?.name}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Download size={16} /> Download
          </a>
        </GlassCard>
      )}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
