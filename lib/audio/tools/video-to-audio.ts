import type { OnProgress, ToolResult } from '../types'
import { getFFmpeg } from '../ffmpeg'
import { fetchFile } from '@ffmpeg/util'

type AudioFormat = 'mp3' | 'wav' | 'aac'

interface VideoToAudioOptions {
  format?: AudioFormat
}

export async function runVideoToAudio(
  file: File,
  opts: VideoToAudioOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { format = 'mp3' } = opts
  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop() || 'mp4'

  onProgress({ percent: 5, step: 'processing' })
  await ffmpeg.writeFile(`input.${inputExt}`, await fetchFile(file))

  const codecArgs: Record<AudioFormat, string[]> = {
    mp3: ['-vn', '-c:a', 'libmp3lame', '-b:a', '192k'],
    wav: ['-vn', '-c:a', 'pcm_s16le'],
    aac: ['-vn', '-c:a', 'aac', '-b:a', '192k'],
  }

  const mimeMap: Record<AudioFormat, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
  }

  await ffmpeg.exec(['-i', `input.${inputExt}`, ...codecArgs[format], `output.${format}`])
  if (signal?.aborted) throw new Error('ABORTED')

  const output = await ffmpeg.readFile(`output.${format}`)
  await ffmpeg.deleteFile(`input.${inputExt}`)
  await ffmpeg.deleteFile(`output.${format}`)

  const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: mimeMap[format] })
  const outName = file.name.replace(/.[^.]+$/, `.${format}`)
  return { blob, name: outName, size: blob.size, mimeType: mimeMap[format], format: format.toUpperCase() }
}
