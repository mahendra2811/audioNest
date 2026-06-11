import { decodeFile } from '../decode'
import { encodeAudioBuffer } from '../encode'
import type { OnProgress, ToolResult } from '../types'

interface SpeedOptions {
  speed: number // 0.25-4
  maintainPitch?: boolean // default true
}

export async function runSpeed(
  file: File,
  opts: SpeedOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { speed = 1, maintainPitch = true } = opts

  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) =>
    onProgress({ percent: pct * 0.4, step: 'decoding' })
  )
  if (signal?.aborted) throw new Error('ABORTED')

  if (!maintainPitch) {
    // Simple resample: change sample rate (changes both speed and pitch)
    const newLength = Math.round(buffer.length / speed)
    const offline = new OfflineAudioContext(buffer.numberOfChannels, newLength, buffer.sampleRate)
    const src = offline.createBufferSource()
    src.buffer = buffer
    src.playbackRate.value = speed
    src.connect(offline.destination)
    src.start()
    const rendered = await offline.startRendering()
    if (signal?.aborted) throw new Error('ABORTED')
    onProgress({ percent: 70, step: 'encoding' })
    const blob = await encodeAudioBuffer(rendered, 'mp3', (p) =>
      onProgress({ percent: 70 + p.percent * 0.3, step: 'encoding' })
    )
    return {
      blob,
      name: file.name.replace(/.[^.]+$/, `-${speed}x.mp3`),
      size: blob.size,
      duration: rendered.duration,
      mimeType: 'audio/mpeg',
      format: 'MP3',
    }
  }

  // Maintain pitch: use SoundTouch via phase vocoder approach
  // For now use ffmpeg atempo for reliable results
  const { ffmpegExec } = await import('../ffmpeg')
  const { audioBufferToWav } = await import('../decode')
  const wavBuf = audioBufferToWav(buffer)
  const wavBlob = new Blob([wavBuf], { type: 'audio/wav' })

  // ffmpeg atempo accepts 0.5-2.0; chain for extremes
  let s = speed
  const parts: number[] = []
  while (s > 2.0) {
    parts.push(2.0)
    s /= 2.0
  }
  while (s < 0.5) {
    parts.push(0.5)
    s /= 0.5
  }
  parts.push(s)
  const atempoFilter = parts.map((v) => `atempo=${v.toFixed(4)}`).join(',')

  const output = await ffmpegExec(
    wavBlob,
    'input.wav',
    'output.mp3',
    ['-af', atempoFilter, '-c:a', 'libmp3lame', '-b:a', '192k'],
    onProgress
  )
  if (signal?.aborted) throw new Error('ABORTED')
  const blob = new Blob([output.buffer as ArrayBuffer], { type: 'audio/mpeg' })
  return {
    blob,
    name: file.name.replace(/.[^.]+$/, `-${speed}x.mp3`),
    size: blob.size,
    mimeType: 'audio/mpeg',
    format: 'MP3',
  }
}
