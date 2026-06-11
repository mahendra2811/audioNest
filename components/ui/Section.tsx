import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

/** Consistent heading block used above every section + page. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wider text-tint">{eyebrow}</span>
      )}
      <h2 className="text-balance text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-pretty text-sm text-muted sm:text-base">{subtitle}</p>
      )}
    </div>
  )
}
