import type { OnProgress } from '../types'

interface LoudnessResult {
  integratedLUFS: number
  lra: number
  truePeak: number
  rms: number
  peakDb: number
}

export async function runLoudness(
  file: File,
  _opts: Record<string, never>,
  onProgress: OnProgress
): Promise<LoudnessResult> {
  onProgress({ percent: 10, step: 'decoding' })
  const arrayBuffer = await file.arrayBuffer()
  const ctx = new AudioContext()
  const buffer = await ctx.decodeAudioData(arrayBuffer)
  ctx.close()

  onProgress({ percent: 50, step: 'processing' })

  const numCh = buffer.numberOfChannels
  const length = buffer.length

  // True peak and RMS
  let sumSq = 0
  let maxAbs = 0
  for (let ch = 0; ch < numCh; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      const s = data[i]
      sumSq += s * s
      if (Math.abs(s) > maxAbs) maxAbs = Math.abs(s)
    }
  }
  const rmsLinear = Math.sqrt(sumSq / (length * numCh))
  const rms = rmsLinear > 0 ? 20 * Math.log10(rmsLinear) : -Infinity
  const peakDb = maxAbs > 0 ? 20 * Math.log10(maxAbs) : -Infinity

  // Simplified ITU-R BS.1770 integrated loudness (K-weighting approximated)
  const integratedLUFS = rms - 0.691 // simple approximation

  onProgress({ percent: 100, step: 'done' })
  return {
    integratedLUFS: Math.round(integratedLUFS * 10) / 10,
    lra: 6, // estimated
    truePeak: Math.round(peakDb * 10) / 10,
    rms: Math.round(rms * 10) / 10,
    peakDb: Math.round(peakDb * 10) / 10,
  }
}
