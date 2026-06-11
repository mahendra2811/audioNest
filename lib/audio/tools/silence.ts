import type { OnProgress, ToolResult } from '../types'
import { getFFmpeg } from '../ffmpeg'
import { fetchFile } from '@ffmpeg/util'

interface SilenceOptions {
  threshold?: number // dB, e.g. -30
  minDuration?: number // seconds, e.g. 0.5
}

export async function runSilenceRemove(
  file: File,
  opts: SilenceOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { threshold = -30, minDuration = 0.5 } = opts

  onProgress({ percent: 5, step: 'processing' })
  const ffmpeg = await getFFmpeg(onProgress)

  const inputExt = file.name.split('.').pop() || 'mp3'
  await ffmpeg.writeFile(`input.${inputExt}`, await fetchFile(file))

  await ffmpeg.exec([
    '-i', `input.${inputExt}`,
    '-af', `silenceremove=stop_periods=-1:stop_duration=${minDuration}:stop_threshold=${threshold}dB`,
    '-c:a', 'libmp3lame', '-b:a', '192k',
    'output.mp3',
  ])

  if (signal?.aborted) throw new Error('ABORTED')

  const output = await ffmpeg.readFile('output.mp3')
  await ffmpeg.deleteFile(`input.${inputExt}`)
  await ffmpeg.deleteFile('output.mp3')

  const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mpeg' })
  const outName = file.name.replace(/.[^.]+$/, '-no-silence.mp3')
  return { blob, name: outName, size: blob.size, mimeType: 'audio/mpeg', format: 'MP3' }
}
