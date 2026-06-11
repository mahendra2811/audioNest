'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export type GlassIntensity = 'heavy' | 'medium' | 'light'

interface GlassPanelProps {
  children: React.ReactNode
  intensity?: GlassIntensity
  tilt?: boolean
  interactive?: boolean
  className?: string
  style?: React.CSSProperties
  as?: React.ElementType
}

const intensityStyles: Record<GlassIntensity, string> = {
  heavy: 'bg-white/15 backdrop-blur-xl',
  medium: 'bg-white/10 backdrop-blur-lg',
  light: 'bg-white/5 backdrop-blur-md',
}

export function GlassPanel({
  children,
  intensity = 'medium',
  tilt = false,
  interactive = false,
  className,
  style,
  as: Tag = 'div',
}: GlassPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  })

  // Specular highlight position shifts with tilt
  const specularX = useTransform(mouseX, [-0.5, 0.5], ['10%', '90%'])
  const specularY = useTransform(mouseY, [-0.5, 0.5], ['10%', '90%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    if (!tilt) return
    mouseX.set(0)
    mouseY.set(0)
  }

  const Component = tilt ? motion.div : Tag

  const tiltProps = tilt
    ? {
        ref,
        style: {
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d' as const,
          ...style,
        },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        whileHover: interactive ? { scale: 1.01 } : undefined,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      }
    : { style }

  return (
    <Component
      className={cn(
        'relative rounded-3xl overflow-hidden',
        intensityStyles[intensity],
        // Specular edge: bright top-left, fades bottom-right
        'shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
        // Warm orange-cast drop shadow
        'drop-shadow-[0_20px_60px_rgba(255,140,0,0.12)]',
        // Hover lift
        interactive && 'cursor-pointer transition-shadow duration-300 hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(255,255,255,0.35),0_24px_70px_rgba(255,140,0,0.2)]',
        className
      )}
      {...tiltProps}
    >
      {/* Chromatic rim layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1px] z-0 rounded-3xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,140,0,0.25) 0%, transparent 40%, rgba(255,215,0,0.25) 100%)',
        }}
      />

      {/* Moving specular highlight follows tilt */}
      {tilt && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute z-0 rounded-full opacity-40"
          style={{
            width: '50%',
            height: '50%',
            left: specularX,
            top: specularY,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Component>
  )
}
