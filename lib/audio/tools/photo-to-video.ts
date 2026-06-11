import type { OnProgress, ToolResult } from '../types'
import { getFFmpeg } from '../ffmpeg'
import { fetchFile } from '@ffmpeg/util'

interface PhotoToVideoOptions {
  imageMime?: string
}

export async function runPhotoToVideo(
  imageFile: File,
  audioFile: File,
  _opts: PhotoToVideoOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const ffmpeg = await getFFmpeg(onProgress)
  const imgExt = imageFile.name.split('.').pop() || 'jpg'
  const audioExt = audioFile.name.split('.').pop() || 'mp3'

  onProgress({ percent: 5, step: 'processing' })
  await ffmpeg.writeFile(`image.${imgExt}`, await fetchFile(imageFile))
  await ffmpeg.writeFile(`audio.${audioExt}`, await fetchFile(audioFile))
  onProgress({ percent: 20, step: 'processing' })

  await ffmpeg.exec([
    '-loop', '1',
    '-i', `image.${imgExt}`,
    '-i', `audio.${audioExt}`,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    'output.mp4',
  ])

  if (signal?.aborted) throw new Error('ABORTED')

  const output = await ffmpeg.readFile('output.mp4')
  await ffmpeg.deleteFile(`image.${imgExt}`)
  await ffmpeg.deleteFile(`audio.${audioExt}`)
  await ffmpeg.deleteFile('output.mp4')

  const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: 'video/mp4' })
  const outName = audioFile.name.replace(/.[^.]+$/, '-video.mp4')
  return { blob, name: outName, size: blob.size, mimeType: 'video/mp4', format: 'MP4' }
}
