import type { OnProgress, ToolResult } from '../types'
import { decodeFile } from '../decode'
import { encodeAudioBuffer } from '../encode'

export type ReverbPreset = 'room' | 'hall' | 'church' | 'cave' | 'studio' | 'plate'

interface ReverbOptions {
  preset?: ReverbPreset
  wet?: number // 0-1
  dry?: number // 0-1
}

const IR_PATHS: Record<ReverbPreset, string> = {
  room: '/ir/room.wav',
  hall: '/ir/hall.wav',
  church: '/ir/church.wav',
  cave: '/ir/cave.wav',
  studio: '/ir/studio.wav',
  plate: '/ir/plate.wav',
}

function syntheticIR(preset: ReverbPreset, sampleRate: number): AudioBuffer {
  const decayTimes: Record<ReverbPreset, number> = {
    room: 0.8, hall: 2.5, church: 4.0, cave: 3.0, studio: 0.4, plate: 1.5,
  }
  const decay = decayTimes[preset]
  const length = Math.ceil(sampleRate * decay)
  const ctx = new OfflineAudioContext(2, length, sampleRate)
  const buf = ctx.createBuffer(2, length, sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * decay * 0.3))
    }
  }
  return buf
}

async function loadIR(preset: ReverbPreset): Promise<AudioBuffer> {
  try {
    const res = await fetch(IR_PATHS[preset])
    if (!res.ok) throw new Error(`IR fetch failed: ${res.status}`)
    const arrayBuffer = await res.arrayBuffer()
    const ctx = new AudioContext()
    const buffer = await ctx.decodeAudioData(arrayBuffer)
    ctx.close()
    return buffer
  } catch {
    return syntheticIR(preset, 44100)
  }
}

export async function runReverb(
  file: File,
  opts: ReverbOptions,
  onProgress: OnProgress,
  signal?: AbortSignal
): Promise<ToolResult> {
  const { preset = 'room', wet = 0.5, dry = 0.5 } = opts

  onProgress({ percent: 5, step: 'decoding' })
  const [inputBuf, irBuf] = await Promise.all([
    decodeFile(file, (pct) => onProgress({ percent: pct * 0.3, step: 'decoding' })),
    loadIR(preset),
  ])
  if (signal?.aborted) throw new Error('ABORTED')

  // Pad length to accommodate reverb tail
  const totalLength = inputBuf.length + irBuf.length
  const offline = new OfflineAudioContext(inputBuf.numberOfChannels, totalLength, inputBuf.sampleRate)

  const src = offline.createBufferSource()
  src.buffer = inputBuf

  const convolver = offline.createConvolver()
  convolver.buffer = irBuf

  const dryGain = offline.createGain()
  dryGain.gain.value = dry
  const wetGain = offline.createGain()
  wetGain.gain.value = wet

  src.connect(dryGain)
  src.connect(convolver)
  convolver.connect(wetGain)
  dryGain.connect(offline.destination)
  wetGain.connect(offline.destination)
  src.start()

  onProgress({ percent: 50, step: 'processing' })
  const rendered = await offline.startRendering()
  if (signal?.aborted) throw new Error('ABORTED')

  onProgress({ percent: 70, step: 'encoding' })
  const blob = await encodeAudioBuffer(rendered, 'mp3', (p) =>
    onProgress({ percent: 70 + p.percent * 0.3, step: 'encoding' })
  )
  return { blob, name: file.name.replace(/.[^.]+$/, `-${preset}-reverb.mp3`), size: blob.size, duration: rendered.duration, mimeType: 'audio/mpeg', format: 'MP3' }
}
