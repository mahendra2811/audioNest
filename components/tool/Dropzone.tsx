'use client'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_FILE_SIZE } from '@/lib/audio/types'
import { strings } from '@/lib/strings'
import { toast } from 'sonner'

interface DropzoneProps {
  onFile: (file: File) => void
  accept?: Record<string, string[]>
  label?: string
  disabled?: boolean
  className?: string
}

export function Dropzone({ onFile, accept, label, disabled, className }: DropzoneProps) {
  const onDrop = useCallback((accepted: File[], rejected: unknown[]) => {
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
  }, [onFile])

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
        'relative rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer',
        'p-10 flex flex-col items-center justify-center gap-4 min-h-[180px]',
        isDragActive
          ? 'border-orange-400 bg-orange-50/20'
          : 'border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/40',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role="button"
      aria-label={label || strings.tool.dropHere}
    >
      <input {...getInputProps()} aria-label="File input" />
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
      >
        <Upload size={24} className="text-white" />
      </div>
      <div className="text-center">
        <p className="font-medium text-[#1A1208] dark:text-[#FFF8ED]">
          {isDragActive ? 'Drop it here!' : label || strings.tool.dropHere}
        </p>
        <p className="text-sm text-[#7A6A50] dark:text-[#B8A77F] mt-1">
          {strings.tool.dropOr}
        </p>
        <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] mt-2 opacity-70">
          {strings.tool.maxSize}
        </p>
      </div>
    </div>
  )
}
