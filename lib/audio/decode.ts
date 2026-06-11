import type { AudioMeta } from './types'
import { MAX_DURATION, MAX_FILE_SIZE } from './types'

export async function validateFile(file: File): Promise<void> {
  if (file.size > MAX_FILE_SIZE) {
    const err = new Error('TOO_LARGE') as Error & { code: string }
    err.code = 'TOO_LARGE'
    throw err
  }
}

export async function decodeFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<AudioBuffer> {
  await validateFile(file)

  const arrayBuffer = await file.arrayBuffer()
  onProgress?.(30)

  const ctx = new AudioContext()
  const buffer = await ctx.decodeAudioData(arrayBuffer)
  onProgress?.(80)

  if (buffer.duration > MAX_DURATION) {
    ctx.close()
    const err = new Error('TOO_LONG') as Error & { code: string }
    err.code = 'TOO_LONG'
    throw err
  }

  ctx.close()
  onProgress?.(100)
  return buffer
}

export function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const length = buffer.length * numChannels * 2
  const arrayBuf = new ArrayBuffer(44 + length)
  const view = new DataView(arrayBuf)

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + length, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * 2, true)
  view.setUint16(32, numChannels * 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, length, true)

  let offset = 44
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }
  return arrayBuf
}

export function getAudioMeta(file: File, buffer: AudioBuffer): AudioMeta {
  return {
    name: file.name,
    size: file.size,
    duration: buffer.duration,
    format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
    sampleRate: buffer.sampleRate,
    numberOfChannels: buffer.numberOfChannels,
  }
}
