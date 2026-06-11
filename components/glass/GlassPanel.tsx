'use client'
import { Card } from '@/components/ui/Card'

export type GlassIntensity = 'heavy' | 'medium' | 'light'

interface GlassPanelProps {
  children: React.ReactNode
  intensity?: GlassIntensity
  /** Kept for API compatibility — tilt is intentionally disabled in the clean design. */
  tilt?: boolean
  interactive?: boolean
  className?: string
  style?: React.CSSProperties
  as?: React.ElementType
}

/**
 * Large page panel. Clean + light-frost surface (see ui/Card).
 * `intensity` and `tilt` are accepted for backwards compatibility.
 */
export function GlassPanel({ children, interactive, className, style, as }: GlassPanelProps) {
  return (
    <Card as={as} panel interactive={interactive} className={className} style={style}>
      {children}
    </Card>
  )
}
