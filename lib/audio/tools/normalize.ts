import type { OnProgress, ToolResult } from '../types'
import { getFFmpeg } from '../ffmpeg'
import { fetchFile } from '@ffmpeg/util'

type LoudnessTarget = 'streaming' | 'podcast' | 'broadcast' | 'peak'
const LUFS: Record<LoudnessTarget, number> = {
  streaming: -14,
  podcast: -16,
  broadcast: -23,
  peak: -0.1,
}

interface NormalizeOptions {
  target?: LoudnessTarget
  customLUFS?: number
}

export async function runNormalize(
  file: File,
  opts: NormalizeOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { target = 'streaming', customLUFS } = opts
  const targetLUFS = customLUFS ?? LUFS[target]
  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop() || 'mp3'

  onProgress({ percent: 5, step: 'processing' })
  await ffmpeg.writeFile(`input.${inputExt}`, await fetchFile(file))

  await ffmpeg.exec([
    '-i', `input.${inputExt}`,
    '-af', `loudnorm=I=${targetLUFS}:TP=-1.5:LRA=11`,
    '-c:a', 'libmp3lame', '-b:a', '192k',
    'output.mp3',
  ])

  if (signal?.aborted) throw new Error('ABORTED')

  const output = await ffmpeg.readFile('output.mp3')
  await ffmpeg.deleteFile(`input.${inputExt}`)
  await ffmpeg.deleteFile('output.mp3')

  const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mpeg' })
  const outName = file.name.replace(/.[^.]+$/, `-normalized.${inputExt === 'mp3' ? 'mp3' : 'mp3'}`)
  return { blob, name: outName, size: blob.size, mimeType: 'audio/mpeg', format: 'MP3' }
}
