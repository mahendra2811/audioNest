'use client'
import { Upload } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { MAX_FILE_SIZE } from '@/lib/audio/types'
import { strings } from '@/lib/strings'
import { cn } from '@/lib/utils'

interface DropzoneProps {
  onFile: (file: File) => void
  accept?: Record<string, string[]>
  label?: string
  disabled?: boolean
  className?: string
}

export function Dropzone({ onFile, accept, label, disabled, className }: DropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[], rejected: unknown[]) => {
      if (rejected.length > 0) {
        toast.error(strings.tool.unsupportedFormat)
        return
      }
      const file = accepted[0]
      if (!file) return
      if (file.size > MAX_FILE_SIZE) {
        toast.error(strings.tool.fileTooLarge)
        return
      }
      onFile(file)
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-panel border-2 border-dashed p-10 text-center transition-colors duration-200',
        isDragActive
          ? 'border-primary bg-primary-soft'
          : 'border-line-strong bg-surface-2/50 hover:border-primary/60 hover:bg-surface-2',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      role="button"
      aria-label={label || strings.tool.dropHere}
    >
      <input {...getInputProps()} aria-label="File input" />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
        <Upload size={24} />
      </div>
      <div>
        <p className="font-semibold text-fg">
          {isDragActive ? 'Drop it here!' : label || strings.tool.dropHere}
        </p>
        <p className="mt-1 text-sm text-muted">{strings.tool.dropOr}</p>
        <p className="mt-2 text-xs text-muted/80">{strings.tool.maxSize}</p>
      </div>
    </div>
  )
}
