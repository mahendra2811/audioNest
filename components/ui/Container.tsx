import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'wide' | 'narrow'
}

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-7xl',
} as const

/**
 * Inner max-width + centering. The horizontal gutter (px) is owned once by
 * <main> in the root layout, so this only constrains and centers content.
 */
export function Container({ size = 'default', className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full', sizes[size], className)} {...props}>
      {children}
    </div>
  )
}
