'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface GradientRingProps {
  className?: string
  thickness?: number
}

export function GradientRing({ className, thickness = 2 }: GradientRingProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    let angle = 0
    const animate = () => {
      angle = (angle + 1.5) % 360
      if (spanRef.current) {
        spanRef.current.style.background = `linear-gradient(${angle}deg, #FF8C00, #FFD700, #FF8C00)`
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <span
      ref={spanRef}
      aria-hidden="true"
      className={cn('absolute inset-0 rounded-2xl pointer-events-none', className)}
      style={{
        padding: thickness,
        background: 'linear-gradient(0deg, #FF8C00, #FFD700, #FF8C00)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    />
  )
}
