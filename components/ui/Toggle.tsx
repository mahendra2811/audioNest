'use client'
import { cn } from '@/lib/utils'

interface ToggleProps {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  children: React.ReactNode
  className?: string
}

/** A pill on/off toggle (Fade In, Maintain pitch, etc.). */
export function Toggle({ pressed, onPressedChange, children, className }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-150',
        pressed
          ? 'border-transparent bg-brand text-white shadow-sm'
          : 'border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-2 w-2 rounded-full transition-colors',
          pressed ? 'bg-white' : 'bg-muted/50'
        )}
      />
      {children}
    </button>
  )
}
