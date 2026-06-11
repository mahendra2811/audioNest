export interface AudioMeta {
  name: string
  size: number
  duration: number
  format: string
  sampleRate: number
  numberOfChannels: number
  bitrate?: number
  codec?: string
  tags?: Record<string, string>
  coverArt?: Blob
}

export interface ToolResult {
  blob: Blob
  name: string
  size: number
  duration?: number
  mimeType: string
  format: string
}

export interface MultiToolResult {
  blobs: Blob[]
  names: string[]
  zipName?: string
}

export type ProcessStep = 'idle' | 'decoding' | 'processing' | 'encoding' | 'done' | 'error'

export interface Progress {
  percent: number
  step: ProcessStep
  message?: string
}

export type OnProgress = (progress: Progress) => void

export type ToolError =
  | 'UNSUPPORTED_BROWSER'
  | 'UNSUPPORTED_FORMAT'
  | 'TOO_LARGE'
  | 'TOO_LONG'
  | 'OOM'
  | 'DECODE_FAILED'
  | 'PROCESS_FAILED'

export const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB
export const MAX_DURATION = 2 * 60 * 60 // 2 hours in seconds
