import type { OnProgress, ToolResult } from '../types'
import { getFFmpeg } from '../ffmpeg'
import { fetchFile } from '@ffmpeg/util'

export async function runStereoToMono(
  file: File,
  _opts: Record<string, never>,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop() || 'mp3'
  onProgress({ percent: 5, step: 'processing' })
  await ffmpeg.writeFile(`input.${inputExt}`, await fetchFile(file))
  await ffmpeg.exec(['-i', `input.${inputExt}`, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '128k', 'output.mp3'])
  if (signal?.aborted) throw new Error('ABORTED')
  const output = await ffmpeg.readFile('output.mp3')
  await ffmpeg.deleteFile(`input.${inputExt}`)
  await ffmpeg.deleteFile('output.mp3')
  const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mpeg' })
  return { blob, name: file.name.replace(/.[^.]+$/, '-mono.mp3'), size: blob.size, mimeType: 'audio/mpeg', format: 'MP3' }
}

export async function runMonoToStereo(
  file: File,
  _opts: Record<string, never>,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop() || 'mp3'
  onProgress({ percent: 5, step: 'processing' })
  await ffmpeg.writeFile(`input.${inputExt}`, await fetchFile(file))
  await ffmpeg.exec(['-i', `input.${inputExt}`, '-ac', '2', '-c:a', 'libmp3lame', '-b:a', '192k', 'output.mp3'])
  if (signal?.aborted) throw new Error('ABORTED')
  const output = await ffmpeg.readFile('output.mp3')
  await ffmpeg.deleteFile(`input.${inputExt}`)
  await ffmpeg.deleteFile('output.mp3')
  const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mpeg' })
  return { blob, name: file.name.replace(/.[^.]+$/, '-stereo.mp3'), size: blob.size, mimeType: 'audio/mpeg', format: 'MP3' }
}
