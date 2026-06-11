import { describe, expect, it } from 'vitest'

// ─── audioBufferToWav ──────────────────────────────────────────────────────────
describe('audioBufferToWav', () => {
  it('produces a valid WAV header', async () => {
    const { audioBufferToWav } = await import('@/lib/audio/decode')

    // Minimal AudioBuffer-like object
    const mockBuffer = {
      numberOfChannels: 1,
      sampleRate: 44100,
      length: 100,
      duration: 100 / 44100,
      getChannelData: () => new Float32Array(100),
    } as unknown as AudioBuffer

    const result = audioBufferToWav(mockBuffer)
    const view = new DataView(result)

    // WAV signature
    const riff = String.fromCharCode(
      view.getUint8(0),
      view.getUint8(1),
      view.getUint8(2),
      view.getUint8(3)
    )
    const wave = String.fromCharCode(
      view.getUint8(8),
      view.getUint8(9),
      view.getUint8(10),
      view.getUint8(11)
    )

    expect(riff).toBe('RIFF')
    expect(wave).toBe('WAVE')
    expect(result.byteLength).toBe(44 + 100 * 1 * 2) // 44 header + samples * ch * 2 bytes
  })

  it('handles stereo audio', async () => {
    const { audioBufferToWav } = await import('@/lib/audio/decode')

    const mockBuffer = {
      numberOfChannels: 2,
      sampleRate: 48000,
      length: 200,
      duration: 200 / 48000,
      getChannelData: () => new Float32Array(200),
    } as unknown as AudioBuffer

    const result = audioBufferToWav(mockBuffer)
    expect(result.byteLength).toBe(44 + 200 * 2 * 2)

    const view = new DataView(result)
    // Number of channels at offset 22
    expect(view.getUint16(22, true)).toBe(2)
    // Sample rate at offset 24
    expect(view.getUint32(24, true)).toBe(48000)
  })
})

// ─── Pitch calculation ─────────────────────────────────────────────────────────
describe('pitch semitone calculation', () => {
  it('computes correct sample rate for +12 semitones (octave up)', () => {
    const sampleRate = 44100
    const semitones = 12
    const pitchFactor = 2 ** (semitones / 12)
    const newRate = Math.round(sampleRate * pitchFactor)
    expect(newRate).toBe(88200) // exactly double
  })

  it('computes correct sample rate for -12 semitones (octave down)', () => {
    const sampleRate = 44100
    const semitones = -12
    const pitchFactor = 2 ** (semitones / 12)
    const newRate = Math.round(sampleRate * pitchFactor)
    expect(newRate).toBe(22050) // exactly half
  })

  it('computes correct sample rate for 0 semitones (no change)', () => {
    const sampleRate = 44100
    const semitones = 0
    const pitchFactor = 2 ** (semitones / 12)
    const newRate = Math.round(sampleRate * pitchFactor)
    expect(newRate).toBe(44100)
  })
})

// ─── Speed atempo chaining ─────────────────────────────────────────────────────
describe('speed atempo filter chaining', () => {
  function buildAtempoFilter(speed: number): string {
    let s = speed
    const parts: number[] = []
    while (s > 2.0) {
      parts.push(2.0)
      s /= 2.0
    }
    while (s < 0.5) {
      parts.push(0.5)
      s /= 0.5
    }
    parts.push(s)
    return parts.map((v) => `atempo=${v.toFixed(4)}`).join(',')
  }

  it('uses single atempo for speed in 0.5-2.0 range', () => {
    const filter = buildAtempoFilter(1.5)
    expect(filter).toBe('atempo=1.5000')
  })

  it('chains two atempo filters for speed 4x', () => {
    const filter = buildAtempoFilter(4.0)
    expect(filter).toBe('atempo=2.0000,atempo=2.0000')
  })

  it('chains atempo filters for speed 0.25x', () => {
    const filter = buildAtempoFilter(0.25)
    expect(filter).toBe('atempo=0.5000,atempo=0.5000')
  })

  it('handles exact 2.0x boundary', () => {
    const filter = buildAtempoFilter(2.0)
    expect(filter).toBe('atempo=2.0000')
  })
})

// ─── Loop length calculation ───────────────────────────────────────────────────
describe('loop length calculation', () => {
  it('computes total length with no gap', () => {
    const bufferLength = 44100 // 1 second
    const sampleRate = 44100
    const count = 4
    const gap = 0
    const gapSamples = Math.floor(gap * sampleRate)
    const totalLength = (bufferLength + gapSamples) * count - gapSamples
    expect(totalLength).toBe(44100 * 4) // 4 seconds
  })

  it('computes total length with 1 second gap', () => {
    const bufferLength = 44100 // 1 second buffer
    const sampleRate = 44100
    const count = 3
    const gap = 1.0
    const gapSamples = Math.floor(gap * sampleRate) // 44100
    const totalLength = (bufferLength + gapSamples) * count - gapSamples
    // 3 repetitions × (1s + 1s gap) − final gap = 6s − 1s = 5s
    expect(totalLength).toBe(44100 * 5)
  })
})

// ─── Volume gain linear conversion ────────────────────────────────────────────
describe('volume gain conversion', () => {
  it('converts 0 dB to 1.0 linear', () => {
    const gainDb = 0
    const gainLinear = 10 ** (gainDb / 20)
    expect(gainLinear).toBeCloseTo(1.0, 5)
  })

  it('converts +6 dB to ~2.0 linear', () => {
    const gainDb = 6
    const gainLinear = 10 ** (gainDb / 20)
    expect(gainLinear).toBeCloseTo(1.995, 2)
  })

  it('converts -20 dB to 0.1 linear', () => {
    const gainDb = -20
    const gainLinear = 10 ** (gainDb / 20)
    expect(gainLinear).toBeCloseTo(0.1, 5)
  })
})

// ─── Reverb synthetic IR ───────────────────────────────────────────────────────
describe('reverb synthetic IR', () => {
  it('generates non-silent IR buffer', () => {
    const sampleRate = 44100
    const decay = 0.8 // room preset
    const length = Math.ceil(sampleRate * decay)
    const data = new Float32Array(length)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * decay * 0.3))
    }
    // First sample should be near max amplitude (no decay yet)
    expect(Math.abs(data[0])).toBeGreaterThan(0)
    // Last sample should be significantly smaller than the peak (decayed)
    expect(Math.abs(data[length - 1])).toBeLessThan(Math.abs(data[0]) * 0.1)
    expect(data.length).toBe(length)
  })
})

// ─── Tool registry ─────────────────────────────────────────────────────────────
describe('tool registry', () => {
  it('has 24 live tools', async () => {
    const { liveTools } = await import('@/lib/config/tools')
    expect(liveTools).toHaveLength(24)
  })

  it('all live tools have required fields', async () => {
    const { liveTools } = await import('@/lib/config/tools')
    for (const tool of liveTools) {
      expect(tool.slug).toBeTruthy()
      expect(tool.name).toBeTruthy()
      expect(tool.benefit).toBeTruthy()
      expect(tool.icon).toBeTruthy()
      expect(tool.category).toBeTruthy()
      expect(tool.status).toBe('live')
    }
  })

  it('getToolBySlug returns correct tool', async () => {
    const { getToolBySlug } = await import('@/lib/config/tools')
    const tool = getToolBySlug('audio-cutter')
    expect(tool).toBeDefined()
    expect(tool?.name).toBe('Audio Cutter')
    expect(tool?.featured).toBe(true)
  })

  it('getToolBySlug returns undefined for unknown slug', async () => {
    const { getToolBySlug } = await import('@/lib/config/tools')
    expect(getToolBySlug('not-a-real-tool')).toBeUndefined()
  })

  it('has at least 4 soon tools', async () => {
    const { soonTools } = await import('@/lib/config/tools')
    expect(soonTools.length).toBeGreaterThanOrEqual(4)
  })

  it('featured tools are all live', async () => {
    const { featuredTools } = await import('@/lib/config/tools')
    for (const tool of featuredTools) {
      expect(tool.status).toBe('live')
      expect(tool.featured).toBe(true)
    }
  })
})

// ─── Loudness calculation ──────────────────────────────────────────────────────
describe('loudness calculations', () => {
  it('computes RMS correctly for a constant signal', () => {
    const length = 1000
    const numCh = 1
    const signal = 0.5 // constant amplitude

    let sumSq = 0
    for (let ch = 0; ch < numCh; ch++) {
      for (let i = 0; i < length; i++) {
        sumSq += signal * signal
      }
    }
    const rmsLinear = Math.sqrt(sumSq / (length * numCh))
    const rmsDb = 20 * Math.log10(rmsLinear)

    expect(rmsLinear).toBeCloseTo(0.5, 5)
    expect(rmsDb).toBeCloseTo(-6.02, 1) // 0.5 linear = -6dB
  })

  it('computes peak dB correctly', () => {
    const maxAbs = 0.707 // ~-3dB
    const peakDb = 20 * Math.log10(maxAbs)
    expect(peakDb).toBeCloseTo(-3.01, 1)
  })
})
