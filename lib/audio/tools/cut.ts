import type { OnProgress, ToolResult } from '../types'
import { decodeFile, audioBufferToWav } from '../decode'
import { encodeAudioBuffer } from '../encode'

interface CutOptions {
  startTime: number
  endTime: number
  fadeIn?: number
  fadeOut?: number
  format?: 'mp3' | 'wav'
}

export async function runCut(
  file: File,
  opts: CutOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) => onProgress({ percent: pct * 0.4, step: 'decoding' }))

  if (signal?.aborted) throw new Error('ABORTED')

  const { startTime, endTime, fadeIn = 0, fadeOut = 0 } = opts
  const sampleRate = buffer.sampleRate
  const startSample = Math.floor(startTime * sampleRate)
  const endSample = Math.min(Math.floor(endTime * sampleRate), buffer.length)
  const length = endSample - startSample

  const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, length, sampleRate)
  const source = offlineCtx.createBufferSource()

  // Slice the buffer
  const sliced = offlineCtx.createBuffer(buffer.numberOfChannels, length, sampleRate)
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    sliced.getChannelData(ch).set(buffer.getChannelData(ch).slice(startSample, endSample))
  }
  source.buffer = sliced

  // Apply fades if requested
  if (fadeIn > 0 || fadeOut > 0) {
    const gainNode = offlineCtx.createGain()
    gainNode.gain.setValueAtTime(fadeIn > 0 ? 0 : 1, 0)
    if (fadeIn > 0) gainNode.gain.linearRampToValueAtTime(1, fadeIn)
    if (fadeOut > 0) {
      const outStart = sliced.duration - fadeOut
      gainNode.gain.setValueAtTime(1, outStart)
      gainNode.gain.linearRampToValueAtTime(0, sliced.duration)
    }
    source.connect(gainNode)
    gainNode.connect(offlineCtx.destination)
  } else {
    source.connect(offlineCtx.destination)
  }

  source.start()
  onProgress({ percent: 60, step: 'processing' })
  const rendered = await offlineCtx.startRendering()
  if (signal?.aborted) throw new Error('ABORTED')

  const format = opts.format || 'mp3'
  onProgress({ percent: 70, step: 'encoding' })
  const blob = await encodeAudioBuffer(rendered, format, (p) =>
    onProgress({ percent: 70 + p.percent * 0.3, step: 'encoding' })
  )

  const outName = file.name.replace(/\.[^.]+$/, `-cut.${format}`)
  return {
    blob,
    name: outName,
    size: blob.size,
    duration: rendered.duration,
    mimeType: blob.type,
    format: format.toUpperCase(),
  }
}
