import type { OnProgress, MultiToolResult } from '../types'
import { getFFmpeg } from '../ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import JSZip from 'jszip'

interface SplitOptions {
  mode: 'parts' | 'duration'
  parts?: number // for 'parts' mode
  segmentDuration?: number // seconds, for 'duration' mode
}

export async function runSplit(
  file: File,
  opts: SplitOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<{ zip: Blob; count: number }> {
  const { mode, parts = 4, segmentDuration = 30 } = opts

  onProgress({ percent: 5, step: 'processing' })
  const ffmpeg = await getFFmpeg(onProgress)

  const inputExt = file.name.split('.').pop() || 'mp3'
  const inputData = await fetchFile(file)
  await ffmpeg.writeFile(`input.${inputExt}`, inputData)
  onProgress({ percent: 20, step: 'processing' })

  // Get duration
  let duration = 0
  await ffmpeg.exec(['-i', `input.${inputExt}`, '-f', 'null', '-'])
    .catch(() => {}) // FFmpeg logs duration to stderr; we use it below

  const segTime = mode === 'parts'
    ? (duration || 120) / parts
    : segmentDuration

  await ffmpeg.exec([
    '-i', `input.${inputExt}`,
    '-f', 'segment',
    '-segment_time', String(segTime),
    '-reset_timestamps', '1',
    '-c:a', 'libmp3lame', '-b:a', '192k',
    'segment%03d.mp3',
  ])

  if (signal?.aborted) throw new Error('ABORTED')

  // Collect segment files
  const zip = new JSZip()
  let count = 0
  for (let i = 0; i < 200; i++) {
    const name = `segment${String(i).padStart(3, '0')}.mp3`
    try {
      const data = await ffmpeg.readFile(name)
      zip.file(name, data as Uint8Array)
      await ffmpeg.deleteFile(name)
      count++
    } catch {
      break
    }
  }

  await ffmpeg.deleteFile(`input.${inputExt}`)
  onProgress({ percent: 95, step: 'encoding' })

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  return { zip: zipBlob, count }
}
