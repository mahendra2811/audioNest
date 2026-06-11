'use client'
import { Card } from '@/components/ui/Card'
import type { AudioMeta } from '@/lib/audio/types'
import { formatBytes, formatDuration } from '@/lib/utils'

interface FileMetaProps {
  meta: AudioMeta
}

export function FileMeta({ meta }: FileMetaProps) {
  const fields = [
    { label: 'Format', value: meta.format },
    { label: 'Size', value: formatBytes(meta.size) },
    meta.duration ? { label: 'Duration', value: formatDuration(meta.duration) } : null,
    meta.sampleRate
      ? { label: 'Sample Rate', value: `${meta.sampleRate.toLocaleString()} Hz` }
      : null,
    meta.numberOfChannels
      ? { label: 'Channels', value: meta.numberOfChannels === 1 ? 'Mono' : 'Stereo' }
      : null,
    meta.bitrate ? { label: 'Bitrate', value: `${meta.bitrate} kbps` } : null,
    meta.codec ? { label: 'Codec', value: meta.codec } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <Card inset className="p-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {fields.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
            <p className="truncate font-mono text-sm font-medium text-fg">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
