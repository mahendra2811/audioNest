'use client'
import { Card } from '@/components/ui/Card'
import type { GlassIntensity } from './GlassPanel'

interface GlassCardProps {
  children: React.ReactNode
  intensity?: GlassIntensity
  interactive?: boolean
  /** Kept for API compatibility. */
  featured?: boolean
  className?: string
  onClick?: () => void
}

/** Card-sized clean frost surface (see ui/Card). */
export function GlassCard({ children, interactive = false, className, onClick }: GlassCardProps) {
  return (
    <Card interactive={interactive} onClick={onClick} className={className}>
      {children}
    </Card>
  )
}
