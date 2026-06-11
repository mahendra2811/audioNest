import type { OnProgress, ToolResult } from '../types'
import { ffmpegExec } from '../ffmpeg'

type ConvertFormat = 'mp3' | 'wav' | 'flac' | 'ogg' | 'aac' | 'm4a' | 'opus'

interface ConvertOptions {
  targetFormat: ConvertFormat
  bitrate?: number
}

const mimeTypes: Record<ConvertFormat, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  flac: 'audio/flac',
  ogg: 'audio/ogg',
  aac: 'audio/aac',
  m4a: 'audio/mp4',
  opus: 'audio/opus',
}

const ffmpegCodecArgs: Record<ConvertFormat, (bitrate: number) => string[]> = {
  mp3: (b) => ['-c:a', 'libmp3lame', '-b:a', `${b}k`],
  wav: () => ['-c:a', 'pcm_s16le'],
  flac: () => ['-c:a', 'flac'],
  ogg: (b) => ['-c:a', 'libvorbis', '-b:a', `${b}k`],
  aac: (b) => ['-c:a', 'aac', '-b:a', `${b}k`],
  m4a: (b) => ['-c:a', 'aac', '-b:a', `${b}k`],
  opus: (b) => ['-c:a', 'libopus', '-b:a', `${b}k`],
}

export async function runConvert(
  file: File,
  opts: ConvertOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { targetFormat, bitrate = 192 } = opts
  const inputExt = file.name.split('.').pop() || 'mp3'

  onProgress({ percent: 5, step: 'processing' })
  const bytes = await ffmpegExec(
    file,
    `input.${inputExt}`,
    `output.${targetFormat}`,
    ffmpegCodecArgs[targetFormat](bitrate),
    onProgress
  )

  if (signal?.aborted) throw new Error('ABORTED')

  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeTypes[targetFormat] })
  const outName = file.name.replace(/\.[^.]+$/, `.${targetFormat}`)

  return {
    blob,
    name: outName,
    size: blob.size,
    mimeType: blob.type,
    format: targetFormat.toUpperCase(),
  }
}
