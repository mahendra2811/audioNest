import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'wide' | 'narrow'
}

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
} as const

/** Consistent horizontal gutter + max width for every page region. */
export function Container({ size = 'default', className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6', sizes[size], className)} {...props}>
      {children}
    </div>
  )
}
