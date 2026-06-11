'use client'
import { cn } from '@/lib/utils'

export interface SegmentOption<T extends string> {
  value: T
  label: string
  hint?: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Grid columns on small screens (auto-wraps). */
  columns?: 2 | 3 | 4
  'aria-label'?: string
  className?: string
}

const colClass = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
} as const

/** Reusable option picker — format grids, modes, presets. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
  className,
  ...rest
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={rest['aria-label']}
      className={cn('grid gap-2', colClass[columns], className)}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-150',
              active
                ? 'border-transparent bg-brand text-white shadow-sm'
                : 'border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface'
            )}
          >
            <span>{opt.label}</span>
            {opt.hint && (
              <span
                className={cn('text-[11px] font-normal', active ? 'text-white/80' : 'text-muted')}
              >
                {opt.hint}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
