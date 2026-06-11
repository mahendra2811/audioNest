import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import type { OnProgress } from './types'

let ffmpegInstance: FFmpeg | null = null
let loadPromise: Promise<FFmpeg> | null = null

export async function getFFmpeg(onProgress?: OnProgress): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance

  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg()

    ffmpeg.on('progress', ({ progress }) => {
      onProgress?.({
        percent: Math.round(progress * 100),
        step: 'processing',
      })
    })

    ffmpeg.on('log', ({ message }) => {
      if (process.env.NODE_ENV === 'development') console.debug('[ffmpeg]', message)
    })

    // Self-hosted core for COOP/COEP compliance
    const baseURL = '/ffmpeg'
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
    } catch {
      // Fallback to CDN if self-hosted not available (dev mode)
      await ffmpeg.load()
    }

    ffmpegInstance = ffmpeg
    loadPromise = null
    return ffmpeg
  })()

  return loadPromise
}

export async function ffmpegExec(
  inputFile: File | Blob,
  inputName: string,
  outputName: string,
  args: string[],
  onProgress?: OnProgress
): Promise<Uint8Array> {
  const ffmpeg = await getFFmpeg(onProgress)
  const data = await fetchFile(inputFile)
  await ffmpeg.writeFile(inputName, data)

  await ffmpeg.exec(['-i', inputName, ...args, outputName])

  const output = await ffmpeg.readFile(outputName)
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  return output as Uint8Array
}

export function terminateFFmpeg() {
  if (ffmpegInstance) {
    ffmpegInstance.terminate()
    ffmpegInstance = null
    loadPromise = null
  }
}

export { fetchFile }
