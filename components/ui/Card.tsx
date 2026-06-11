'use client'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  /** Larger radius for big page panels. */
  panel?: boolean
  /** Hover lift + border highlight (for clickable cards). */
  interactive?: boolean
  /** Flat secondary surface for nested blocks (no blur/shadow). */
  inset?: boolean
}

/**
 * The single surface used across the whole app — clean + light frost:
 * solid surface, 1px border, soft shadow, subtle backdrop-blur.
 */
export function Card({
  as: Tag = 'div',
  panel = false,
  interactive = false,
  inset = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        panel ? 'rounded-panel' : 'rounded-card',
        inset
          ? 'border border-line bg-surface-2'
          : 'border border-line bg-surface/85 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-16px_rgba(30,27,46,0.25)]',
        interactive &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_16px_40px_-18px_rgba(79,70,229,0.35)]',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
