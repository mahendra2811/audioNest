import type { OnProgress, ToolResult } from '../types'
import { decodeFile } from '../decode'
import { encodeAudioBuffer } from '../encode'

export async function runReverse(
  file: File,
  _opts: Record<string, never>,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) => onProgress({ percent: pct * 0.4, step: 'decoding' }))
  if (signal?.aborted) throw new Error('ABORTED')

  onProgress({ percent: 45, step: 'processing' })
  const { sampleRate, numberOfChannels, length } = buffer
  const reversed = new OfflineAudioContext(numberOfChannels, length, sampleRate)
  const src = reversed.createBufferSource()
  const revBuf = reversed.createBuffer(numberOfChannels, length, sampleRate)

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch)
    const rev = revBuf.getChannelData(ch)
    for (let i = 0; i < length; i++) rev[i] = data[length - 1 - i]
  }
  src.buffer = revBuf
  src.connect(reversed.destination)
  src.start()

  const rendered = await reversed.startRendering()
  if (signal?.aborted) throw new Error('ABORTED')

  onProgress({ percent: 70, step: 'encoding' })
  const blob = await encodeAudioBuffer(rendered, 'mp3', (p) =>
    onProgress({ percent: 70 + p.percent * 0.3, step: 'encoding' })
  )
  const outName = file.name.replace(/.[^.]+$/, '-reversed.mp3')
  return { blob, name: outName, size: blob.size, duration: rendered.duration, mimeType: 'audio/mpeg', format: 'MP3' }
}
