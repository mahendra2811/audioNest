'use client'
import { useState, useCallback } from 'react'
import { Dropzone } from '@/components/tool/Dropzone'
import { ProgressRing } from '@/components/tool/ProgressRing'
import { ResultPanel } from '@/components/tool/ResultPanel'
import { ErrorCard } from '@/components/tool/ErrorCard'
import { ToolShell } from '@/components/tool/ToolShell'
import { GlassCard } from '@/components/glass/GlassCard'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { getToolBySlug, AUDIO_ACCEPTS } from '@/lib/config/tools'
import type { AudioMeta, ToolResult, ToolError, Progress } from '@/lib/audio/types'
import { useProcessingState } from '@/lib/store/processing'
import { toast } from 'sonner'

const tool = getToolBySlug('metadata-remover')!
const ACCEPT = Object.fromEntries(AUDIO_ACCEPTS.filter(a => a.startsWith('audio/')).map(m => [m, []]))

const SENSITIVE_KEYS = ['gps', 'location', 'device', 'encoder', 'software', 'comment']

export default function MetadataRemoverPage() {
  const [file, setFile] = useState<File | null>(null)
  const [meta, setMeta] = useState<AudioMeta | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [error, setError] = useState<ToolError | null>(null)
  const startProcessing = useProcessingState((s) => s.start)
  const endProcessing = useProcessingState((s) => s.end)

  const handleFile = useCallback(async (f: File) => {
    setFile(f); setMeta(null); setResult(null); setError(null)
    try {
      const { runInfo } = await import('@/lib/audio/tools/info')
      const m = await runInfo(f, {}, () => {})
      setMeta(m)
    } catch { /* ok to fail */ }
  }, [])

  const handleRemove = async () => {
    if (!file) return
    setProgress({ percent: 0, step: 'processing' }); setResult(null); setError(null)
    startProcessing()
    try {
      const { runStripMetadata } = await import('@/lib/audio/tools/strip-metadata')
      const res = await runStripMetadata(file, {}, (p) => setProgress(p))
      const fieldCount = Object.keys(meta?.tags || {}).length
      setResult(res)
      toast.success(`Removed ${fieldCount} metadata fields`)
    } catch { setError('PROCESS_FAILED') }
    finally { setProgress(null); endProcessing() }
  }

  const tags = meta?.tags || {}
  const sensitiveKeys = Object.keys(tags).filter(k => SENSITIVE_KEYS.some(s => k.toLowerCase().includes(s)))

  return (
    <ToolShell tool={tool} description="Strips all metadata from audio files using ffmpeg -map_metadata -1 on-device. Useful for removing GPS coordinates, device info, and other private data before sharing.">
      {!file && <Dropzone onFile={handleFile} accept={ACCEPT} label="Drop audio to strip metadata" />}
      {file && !progress && !result && (
        <div className="flex flex-col gap-5">
          {meta && Object.keys(tags).length > 0 && (
            <GlassCard intensity="light" className="p-4">
              <p className="text-sm font-medium mb-3 text-[#1A1208] dark:text-[#FFF8ED]">Found {Object.keys(tags).length} metadata fields</p>
              <div className="flex flex-col gap-1.5">
                {Object.entries(tags).map(([k, v]) => {
                  const isSensitive = SENSITIVE_KEYS.some(s => k.toLowerCase().includes(s))
                  return (
                    <div key={k} className="flex items-center gap-2 text-sm">
                      {isSensitive ? <AlertTriangle size={14} className="text-amber-500 shrink-0" /> : <ShieldCheck size={14} className="text-[#7A6A50] shrink-0" />}
                      <span className="text-[#7A6A50] dark:text-[#B8A77F] w-20 shrink-0 capitalize">{k}</span>
                      <span className="text-[#1A1208] dark:text-[#FFF8ED] truncate">{v}</span>
                    </div>
                  )
                })}
              </div>
              {sensitiveKeys.length > 0 && (
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">Contains potentially sensitive fields: {sensitiveKeys.join(', ')}</p>
              )}
            </GlassCard>
          )}
          {meta && Object.keys(tags).length === 0 && (
            <GlassCard intensity="light" className="p-4">
              <p className="text-sm text-[#7A6A50] dark:text-[#B8A77F]">No readable metadata found. File may already be clean.</p>
            </GlassCard>
          )}
          <button onClick={handleRemove} className="px-6 py-2.5 rounded-xl font-medium text-sm text-white" style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}>
            Remove All Metadata
          </button>
        </div>
      )}
      {progress && <div className="flex justify-center py-10"><ProgressRing percent={progress.percent} step={progress.step} /></div>}
      {result && !progress && <ResultPanel result={result} originalSize={file?.size} />}
      {error && <ErrorCard error={error} onRetry={() => setError(null)} />}
    </ToolShell>
  )
}
