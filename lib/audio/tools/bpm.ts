import type { OnProgress } from '../types'

export async function runBPM(
  file: File,
  _opts: Record<string, never>,
  onProgress: OnProgress
): Promise<{ bpm: number | null; confidence: number }> {
  onProgress({ percent: 10, step: 'decoding' })

  const arrayBuffer = await file.arrayBuffer()
  const ctx = new AudioContext()
  const buffer = await ctx.decodeAudioData(arrayBuffer)
  ctx.close()

  onProgress({ percent: 50, step: 'processing' })

  try {
    const { analyze } = await import('web-audio-beat-detector')
    const bpm = await analyze(buffer)
    onProgress({ percent: 100, step: 'done' })
    return { bpm: Math.round(bpm), confidence: 0.8 }
  } catch {
    onProgress({ percent: 100, step: 'done' })
    return { bpm: null, confidence: 0 }
  }
}
