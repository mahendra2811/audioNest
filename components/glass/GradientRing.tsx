import { cn } from '@/lib/utils'

interface GradientRingProps {
  className?: string
  thickness?: number
}

/** Static brand-gradient border ring (no animation — keeps the clean look calm). */
export function GradientRing({ className, thickness = 2 }: GradientRingProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 rounded-2xl bg-brand', className)}
      style={{
        padding: thickness,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    />
  )
}
