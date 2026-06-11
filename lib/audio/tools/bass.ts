import { decodeFile } from '../decode'
import { encodeAudioBuffer } from '../encode'
import type { OnProgress, ToolResult } from '../types'

interface BassOptions {
  gainDb: number // 0 to +12
  frequency?: number // Hz, default 100
}

export async function runBass(
  file: File,
  opts: BassOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { gainDb = 6, frequency = 100 } = opts

  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) =>
    onProgress({ percent: pct * 0.4, step: 'decoding' })
  )
  if (signal?.aborted) throw new Error('ABORTED')

  const offline = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate)
  const src = offline.createBufferSource()
  src.buffer = buffer

  const bassFilter = offline.createBiquadFilter()
  bassFilter.type = 'lowshelf'
  bassFilter.frequency.value = frequency
  bassFilter.gain.value = gainDb

  src.connect(bassFilter)
  bassFilter.connect(offline.destination)
  src.start()

  onProgress({ percent: 50, step: 'processing' })
  const rendered = await offline.startRendering()
  if (signal?.aborted) throw new Error('ABORTED')

  onProgress({ percent: 70, step: 'encoding' })
  const blob = await encodeAudioBuffer(rendered, 'mp3', (p) =>
    onProgress({ percent: 70 + p.percent * 0.3, step: 'encoding' })
  )
  return {
    blob,
    name: file.name.replace(/.[^.]+$/, '-bass-boost.mp3'),
    size: blob.size,
    duration: rendered.duration,
    mimeType: 'audio/mpeg',
    format: 'MP3',
  }
}
