import { audioBufferToWav, decodeFile } from '../decode'
import { ffmpegExec } from '../ffmpeg'
import type { OnProgress, ToolResult } from '../types'

interface PitchOptions {
  semitones: number // -12 to +12
}

export async function runPitch(
  file: File,
  opts: PitchOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { semitones = 0 } = opts

  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) =>
    onProgress({ percent: pct * 0.3, step: 'decoding' })
  )
  if (signal?.aborted) throw new Error('ABORTED')

  const wavBuf = audioBufferToWav(buffer)
  const wavBlob = new Blob([wavBuf], { type: 'audio/wav' })

  // asetrate changes pitch without changing tempo; aresample restores sample rate
  const pitchFactor = 2 ** (semitones / 12)
  const newRate = Math.round(buffer.sampleRate * pitchFactor)

  const output = await ffmpegExec(
    wavBlob,
    'input.wav',
    'output.mp3',
    [
      '-af',
      `asetrate=${newRate},aresample=${buffer.sampleRate}`,
      '-c:a',
      'libmp3lame',
      '-b:a',
      '192k',
    ],
    onProgress
  )

  if (signal?.aborted) throw new Error('ABORTED')
  const blob = new Blob([output.buffer as ArrayBuffer], { type: 'audio/mpeg' })
  const sign = semitones >= 0 ? '+' : ''
  return {
    blob,
    name: file.name.replace(/.[^.]+$/, `-pitch${sign}${semitones}st.mp3`),
    size: blob.size,
    mimeType: 'audio/mpeg',
    format: 'MP3',
  }
}
