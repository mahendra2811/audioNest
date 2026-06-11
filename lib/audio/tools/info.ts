import type { AudioMeta, OnProgress } from '../types'
import { MAX_DURATION, MAX_FILE_SIZE } from '../types'

export async function runInfo(
  file: File,
  _opts: Record<string, never>,
  onProgress: OnProgress
): Promise<AudioMeta> {
  if (file.size > MAX_FILE_SIZE) throw Object.assign(new Error('TOO_LARGE'), { code: 'TOO_LARGE' })

  onProgress({ percent: 20, step: 'decoding' })

  // Try to parse metadata with music-metadata (dynamic import)
  const tags: Record<string, string> = {}
  let coverArt: Blob | undefined
  let codec: string | undefined
  let bitrate: number | undefined

  try {
    const { parseBlob } = await import('music-metadata')
    const meta = await parseBlob(file)
    onProgress({ percent: 50, step: 'decoding' })

    codec = meta.format.codec
    bitrate = meta.format.bitrate ? Math.round(meta.format.bitrate / 1000) : undefined

    const t = meta.common
    if (t.title) tags.title = t.title
    if (t.artist) tags.artist = t.artist
    if (t.album) tags.album = t.album
    if (t.year) tags.year = String(t.year)
    if (t.genre?.length) tags.genre = t.genre[0]
    if (t.track.no) tags.track = String(t.track.no)

    if (meta.common.picture?.length) {
      const pic = meta.common.picture[0]
      coverArt = new Blob([pic.data.buffer as ArrayBuffer], { type: pic.format })
    }
  } catch {
    // Fallback: basic decode for duration
  }

  // Decode to get accurate duration
  let duration = 0
  let sampleRate = 44100
  let numberOfChannels = 2

  try {
    const arrayBuffer = await file.arrayBuffer()
    const ctx = new AudioContext()
    const decoded = await ctx.decodeAudioData(arrayBuffer)
    duration = decoded.duration
    sampleRate = decoded.sampleRate
    numberOfChannels = decoded.numberOfChannels
    ctx.close()

    if (duration > MAX_DURATION) throw Object.assign(new Error('TOO_LONG'), { code: 'TOO_LONG' })
  } catch (e: unknown) {
    if ((e as Error & { code?: string }).code) throw e
    // Non-decodable (video container, etc) — use metadata duration
    duration = 0
  }

  onProgress({ percent: 100, step: 'done' })

  return {
    name: file.name,
    size: file.size,
    duration,
    format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
    sampleRate,
    numberOfChannels,
    bitrate,
    codec,
    tags,
    coverArt,
  }
}
