import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'tint' | 'neutral' | 'success'
}

const variants = {
  tint: 'bg-primary-soft text-tint',
  neutral: 'bg-surface-2 text-muted border border-line',
  success: 'bg-green-500/10 text-green-600 dark:text-green-400',
} as const

export function Badge({ variant = 'tint', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
