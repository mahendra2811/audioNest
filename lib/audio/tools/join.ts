import type { OnProgress, ToolResult } from '../types'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { getFFmpeg } from '../ffmpeg'

interface JoinOptions {
  crossfade?: number // seconds, 0–5
  format?: 'mp3'
}

export async function runJoin(
  files: File[],
  opts: JoinOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  if (files.length < 2) throw new Error('PROCESS_FAILED')
  const { crossfade = 1, format = 'mp3' } = opts

  onProgress({ percent: 5, step: 'processing' })
  const ffmpeg = await getFFmpeg(onProgress)

  // Write all input files
  for (let i = 0; i < files.length; i++) {
    const data = await fetchFile(files[i])
    await ffmpeg.writeFile(`input${i}.mp3`, data)
    onProgress({ percent: 5 + (i / files.length) * 30, step: 'processing' })
  }

  if (signal?.aborted) throw new Error('ABORTED')

  if (crossfade > 0 && files.length === 2) {
    // Two-file crossfade
    await ffmpeg.exec([
      '-i', 'input0.mp3', '-i', 'input1.mp3',
      '-filter_complex',
      `acrossfade=d=${crossfade}:c1=tri:c2=tri`,
      '-c:a', 'libmp3lame', '-b:a', '192k',
      'output.mp3',
    ])
  } else {
    // Concat filter for multiple files or no crossfade
    const inputs = files.flatMap((_, i) => ['-i', `input${i}.mp3`])
    const filterChain = files.map((_, i) => `[a${i}]`).join('') +
      `concat=n=${files.length}:v=0:a=1[out]`
    const filterInputs = files.map((_, i) => `[a${i}]`).join('')
    const amix = files.map((_, i) => `[${i}:a]`).join('')
    await ffmpeg.exec([
      ...inputs,
      '-filter_complex', `${amix}concat=n=${files.length}:v=0:a=1[outa]`,
      '-map', '[outa]',
      '-c:a', 'libmp3lame', '-b:a', '192k',
      'output.mp3',
    ])
  }

  if (signal?.aborted) throw new Error('ABORTED')

  const outputData = await ffmpeg.readFile('output.mp3')
  for (let i = 0; i < files.length; i++) await ffmpeg.deleteFile(`input${i}.mp3`)
  await ffmpeg.deleteFile('output.mp3')

  const blob = new Blob([(outputData as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mpeg' })
  return { blob, name: 'joined.mp3', size: blob.size, mimeType: 'audio/mpeg', format: 'MP3' }
}
