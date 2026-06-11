import type { OnProgress } from '../types'

export interface ID3Tags {
  title?: string
  artist?: string
  album?: string
  year?: string
  genre?: string
  track?: string
  comment?: string
  coverArt?: File
}

export interface ID3ReadResult extends ID3Tags {
  existingCoverUrl?: string
}

export async function readID3(file: File): Promise<ID3ReadResult> {
  const { parseBlob } = await import('music-metadata')
  const meta = await parseBlob(file)
  const tags: ID3ReadResult = {}
  const c = meta.common
  if (c.title) tags.title = c.title
  if (c.artist) tags.artist = c.artist
  if (c.album) tags.album = c.album
  if (c.year) tags.year = String(c.year)
  if (c.genre?.length) tags.genre = c.genre[0]
  if (c.track.no) tags.track = String(c.track.no)
  if (c.comment?.length)
    tags.comment = (c.comment[0] as { text?: string }).text || String(c.comment[0])
  if (c.picture?.length) {
    const pic = c.picture[0]
    const blob = new Blob([pic.data.buffer as ArrayBuffer], { type: pic.format })
    tags.existingCoverUrl = URL.createObjectURL(blob)
  }
  return tags
}

export async function writeID3(file: File, tags: ID3Tags, onProgress: OnProgress): Promise<Blob> {
  onProgress({ percent: 10, step: 'processing' })
  const { ID3Writer } = await import('browser-id3-writer')
  const arrayBuffer = await file.arrayBuffer()
  const writer = new ID3Writer(arrayBuffer)

  if (tags.title) writer.setFrame('TIT2', tags.title)
  if (tags.artist) writer.setFrame('TPE1', [tags.artist])
  if (tags.album) writer.setFrame('TALB', tags.album)
  if (tags.year) writer.setFrame('TYER', parseInt(tags.year, 10))
  if (tags.genre) writer.setFrame('TCON', [tags.genre])
  if (tags.track) writer.setFrame('TRCK', tags.track)
  if (tags.comment)
    writer.setFrame('COMM', { description: '', text: tags.comment, language: 'eng' })

  if (tags.coverArt) {
    const coverBuffer = await tags.coverArt.arrayBuffer()
    writer.setFrame('APIC', {
      type: 3,
      data: coverBuffer,
      description: 'Cover',
      useUnicodeEncoding: false,
    })
  }

  writer.addTag()
  onProgress({ percent: 100, step: 'done' })
  return writer.getBlob()
}
