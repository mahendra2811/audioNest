let sharedContext: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (typeof window === 'undefined') throw new Error('AudioContext requires browser')
  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new AudioContext()
  }
  if (sharedContext.state === 'suspended') {
    sharedContext.resume()
  }
  return sharedContext
}

export function createOfflineContext(
  numberOfChannels: number,
  length: number,
  sampleRate: number
): OfflineAudioContext {
  return new OfflineAudioContext(numberOfChannels, length, sampleRate)
}

export async function decodeBlob(blob: Blob, ctx?: AudioContext): Promise<AudioBuffer> {
  const context = ctx || getAudioContext()
  const arrayBuffer = await blob.arrayBuffer()
  return context.decodeAudioData(arrayBuffer)
}
