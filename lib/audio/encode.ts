import { audioBufferToWav } from './decode'
import { ffmpegExec } from './ffmpeg'
import type { OnProgress } from './types'

export type ExportFormat = 'mp3' | 'wav' | 'flac' | 'ogg' | 'aac' | 'm4a' | 'opus'

export async function encodeAudioBuffer(
  buffer: AudioBuffer,
  format: ExportFormat = 'mp3',
  onProgress?: OnProgress,
  bitrate = 192
): Promise<Blob> {
  const wavArrayBuffer = audioBufferToWav(buffer)
  const wavBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' })
  return encodeBlob(wavBlob, 'wav', format, onProgress, bitrate)
}

export async function encodeBlob(
  input: Blob,
  inputExt: string,
  format: ExportFormat = 'mp3',
  onProgress?: OnProgress,
  bitrate = 192
): Promise<Blob> {
  onProgress?.({ percent: 0, step: 'encoding' })

  const mimeTypes: Record<ExportFormat, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    m4a: 'audio/mp4',
    opus: 'audio/opus',
  }

  const ffmpegArgs: Record<ExportFormat, string[]> = {
    mp3: ['-c:a', 'libmp3lame', '-b:a', `${bitrate}k`, '-q:a', '2'],
    wav: ['-c:a', 'pcm_s16le'],
    flac: ['-c:a', 'flac'],
    ogg: ['-c:a', 'libvorbis', '-b:a', `${bitrate}k`],
    aac: ['-c:a', 'aac', '-b:a', `${bitrate}k`],
    m4a: ['-c:a', 'aac', '-b:a', `${bitrate}k`],
    opus: ['-c:a', 'libopus', '-b:a', `${bitrate}k`],
  }

  const bytes = await ffmpegExec(
    input,
    `input.${inputExt}`,
    `output.${format}`,
    ffmpegArgs[format],
    onProgress
  )

  onProgress?.({ percent: 100, step: 'done' })
  // Cast through ArrayBuffer to satisfy strict BlobPart types
  return new Blob([bytes.buffer as ArrayBuffer], { type: mimeTypes[format] })
}
