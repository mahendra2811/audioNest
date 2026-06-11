'use client'
import { useId } from 'react'
import { cn } from '@/lib/utils'

const fieldClass =
  'w-full rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/70 transition-colors hover:border-line-strong focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50'

interface BaseProps {
  label?: string
  hint?: string
  className?: string
}

export function Input({
  label,
  hint,
  className,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </label>
      )}
      <input id={id} className={fieldClass} {...props} />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

export function Textarea({
  label,
  hint,
  className,
  ...props
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </label>
      )}
      <textarea id={id} className={cn(fieldClass, 'resize-none')} {...props} />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
