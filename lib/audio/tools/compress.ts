import type { OnProgress, ToolResult } from '../types'
import { getFFmpeg } from '../ffmpeg'
import { fetchFile } from '@ffmpeg/util'

interface CompressOptions {
  bitrate: number // kbps: 32, 64, 96, 128
}

export async function runCompress(
  file: File,
  opts: CompressOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { bitrate = 96 } = opts
  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop() || 'mp3'
  onProgress({ percent: 5, step: 'processing' })
  await ffmpeg.writeFile(`input.${inputExt}`, await fetchFile(file))
  await ffmpeg.exec(['-i', `input.${inputExt}`, '-c:a', 'libmp3lame', '-b:a', `${bitrate}k`, 'output.mp3'])
  if (signal?.aborted) throw new Error('ABORTED')
  const output = await ffmpeg.readFile('output.mp3')
  await ffmpeg.deleteFile(`input.${inputExt}`)
  await ffmpeg.deleteFile('output.mp3')
  const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mpeg' })
  return { blob, name: file.name.replace(/.[^.]+$/, `-${bitrate}kbps.mp3`), size: blob.size, mimeType: 'audio/mpeg', format: 'MP3' }
}
