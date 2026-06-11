import { decodeFile } from '../decode'
import { encodeAudioBuffer } from '../encode'
import type { OnProgress, ToolResult } from '../types'

interface VolumeOptions {
  gainDb: number // -20 to +20
}

export async function runVolume(
  file: File,
  opts: VolumeOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { gainDb = 0 } = opts
  const gainLinear = 10 ** (gainDb / 20)

  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) =>
    onProgress({ percent: pct * 0.4, step: 'decoding' })
  )
  if (signal?.aborted) throw new Error('ABORTED')

  const offline = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate)
  const src = offline.createBufferSource()
  src.buffer = buffer

  const gain = offline.createGain()
  gain.gain.value = gainLinear

  // Soft limiter
  const compressor = offline.createDynamicsCompressor()
  compressor.threshold.value = -0.5
  compressor.knee.value = 0
  compressor.ratio.value = 20
  compressor.attack.value = 0.001
  compressor.release.value = 0.1

  src.connect(gain)
  gain.connect(compressor)
  compressor.connect(offline.destination)
  src.start()

  onProgress({ percent: 50, step: 'processing' })
  const rendered = await offline.startRendering()
  if (signal?.aborted) throw new Error('ABORTED')

  onProgress({ percent: 70, step: 'encoding' })
  const blob = await encodeAudioBuffer(rendered, 'mp3', (p) =>
    onProgress({ percent: 70 + p.percent * 0.3, step: 'encoding' })
  )
  const sign = gainDb >= 0 ? '+' : ''
  const outName = file.name.replace(/.[^.]+$/, `-${sign}${gainDb}dB.mp3`)
  return {
    blob,
    name: outName,
    size: blob.size,
    duration: rendered.duration,
    mimeType: 'audio/mpeg',
    format: 'MP3',
  }
}
