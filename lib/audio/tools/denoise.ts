import type { OnProgress, ToolResult } from '../types'
import { decodeFile, audioBufferToWav } from '../decode'
import { ffmpegExec } from '../ffmpeg'

export async function runDenoise(
  file: File,
  _opts: Record<string, never>,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  onProgress({ percent: 5, step: 'decoding' })
  const buffer = await decodeFile(file, (pct) => onProgress({ percent: pct * 0.3, step: 'decoding' }))
  if (signal?.aborted) throw new Error('ABORTED')

  // Try RNNoise via @sapphi-red/web-noise-suppressor if worklet files are available
  try {
    const { RnnoiseWorkletNode, loadRnnoise } = await import('@sapphi-red/web-noise-suppressor')

    // Fetch WASM binary (requires /audio-worklets/rnnoise.wasm on the server)
    const wasmBinary = await loadRnnoise({
      url: '/audio-worklets/rnnoise.wasm',
      simdUrl: '/audio-worklets/rnnoise-simd.wasm',
    })

    const ctx = new AudioContext({ sampleRate: 48000 })
    // Load the worklet processor module
    await ctx.audioWorklet.addModule('/audio-worklets/rnnoise-processor.js')
    onProgress({ percent: 40, step: 'processing' })

    const offline = new OfflineAudioContext(
      1,
      Math.ceil(buffer.duration * 48000),
      48000
    )
    await offline.audioWorklet.addModule('/audio-worklets/rnnoise-processor.js')

    const src = offline.createBufferSource()
    src.buffer = buffer

    const suppressor = new RnnoiseWorkletNode(offline as unknown as AudioContext, {
      maxChannels: 1,
      wasmBinary,
    })
    src.connect(suppressor)
    suppressor.connect(offline.destination)
    src.start()

    const rendered = await offline.startRendering()
    ctx.close()
    if (signal?.aborted) throw new Error('ABORTED')

    onProgress({ percent: 80, step: 'encoding' })
    const { encodeAudioBuffer } = await import('../encode')
    const blob = await encodeAudioBuffer(rendered, 'mp3', (p) =>
      onProgress({ percent: 80 + p.percent * 0.2, step: 'encoding' })
    )
    return {
      blob,
      name: file.name.replace(/\.[^.]+$/, '-denoised.mp3'),
      size: blob.size,
      duration: rendered.duration,
      mimeType: 'audio/mpeg',
      format: 'MP3',
    }
  } catch {
    // Fallback: ffmpeg highpass + lowpass + afftdn for noise reduction
    onProgress({ percent: 50, step: 'processing' })
    const wavBuffer = audioBufferToWav(buffer)
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' })
    const output = await ffmpegExec(
      wavBlob,
      'input.wav',
      'output.mp3',
      ['-af', 'highpass=f=80,lowpass=f=8000,afftdn=nf=-25', '-c:a', 'libmp3lame', '-b:a', '192k'],
      onProgress
    )
    if (signal?.aborted) throw new Error('ABORTED')
    const blob = new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mpeg' })
    return {
      blob,
      name: file.name.replace(/\.[^.]+$/, '-denoised.mp3'),
      size: blob.size,
      mimeType: 'audio/mpeg',
      format: 'MP3',
    }
  }
}
