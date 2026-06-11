import { decodeFile } from '../decode'
import { encodeAudioBuffer } from '../encode'
import type { OnProgress, ToolResult } from '../types'

interface LoopOptions {
  count: number // 2-50
  gap?: number // seconds, 0-3
}

export async function runLoop(
  file: File,
  opts: LoopOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { count = 4, gap = 0 } = opts

  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) =>
    onProgress({ percent: pct * 0.3, step: 'decoding' })
  )
  if (signal?.aborted) throw new Error('ABORTED')

  const gapSamples = Math.floor(gap * buffer.sampleRate)
  const totalLength = (buffer.length + gapSamples) * count - gapSamples
  const offline = new OfflineAudioContext(buffer.numberOfChannels, totalLength, buffer.sampleRate)

  for (let i = 0; i < count; i++) {
    const src = offline.createBufferSource()
    src.buffer = buffer
    src.connect(offline.destination)
    src.start(i * (buffer.duration + gap))
    onProgress({ percent: 30 + (i / count) * 30, step: 'processing' })
  }

  const rendered = await offline.startRendering()
  if (signal?.aborted) throw new Error('ABORTED')

  onProgress({ percent: 70, step: 'encoding' })
  const blob = await encodeAudioBuffer(rendered, 'mp3', (p) =>
    onProgress({ percent: 70 + p.percent * 0.3, step: 'encoding' })
  )
  return {
    blob,
    name: file.name.replace(/.[^.]+$/, `-loop-x${count}.mp3`),
    size: blob.size,
    duration: rendered.duration,
    mimeType: 'audio/mpeg',
    format: 'MP3',
  }
}
