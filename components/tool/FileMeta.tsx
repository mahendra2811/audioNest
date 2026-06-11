'use client'
import type { AudioMeta } from '@/lib/audio/types'
import { formatBytes, formatDuration } from '@/lib/utils'
import { GlassCard } from '@/components/glass/GlassCard'

interface FileMetaProps {
  meta: AudioMeta
}

export function FileMeta({ meta }: FileMetaProps) {
  const fields = [
    { label: 'Format', value: meta.format },
    { label: 'Size', value: formatBytes(meta.size) },
    meta.duration ? { label: 'Duration', value: formatDuration(meta.duration) } : null,
    meta.sampleRate ? { label: 'Sample Rate', value: `${meta.sampleRate.toLocaleString()} Hz` } : null,
    meta.numberOfChannels ? { label: 'Channels', value: meta.numberOfChannels === 1 ? 'Mono' : 'Stereo' } : null,
    meta.bitrate ? { label: 'Bitrate', value: `${meta.bitrate} kbps` } : null,
    meta.codec ? { label: 'Codec', value: meta.codec } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <GlassCard intensity="light" className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-wider text-[#7A6A50] dark:text-[#B8A77F]">{label}</p>
            <p className="text-sm font-mono font-medium text-[#1A1208] dark:text-[#FFF8ED] truncate">{value}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
