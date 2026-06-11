'use client'
import { useId } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  /** Formats the value shown on the right (e.g. seconds → "1:23"). */
  format?: (value: number) => string
  hint?: string
  disabled?: boolean
  className?: string
}

/** Labeled range control with a live, monospaced value read-out. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  hint,
  disabled,
  className,
}: SliderProps) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        <span className="font-mono text-sm tabular-nums text-muted">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        aria-label={label}
      />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
