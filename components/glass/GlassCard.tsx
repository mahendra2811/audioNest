'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { GlassIntensity } from './GlassPanel'

interface GlassCardProps {
  children: React.ReactNode
  intensity?: GlassIntensity
  interactive?: boolean
  featured?: boolean
  className?: string
  onClick?: () => void
}

export function GlassCard({
  children,
  intensity = 'medium',
  interactive = false,
  featured = false,
  className,
  onClick,
}: GlassCardProps) {
  const bgByIntensity: Record<GlassIntensity, string> = {
    heavy: 'bg-white/75 dark:bg-white/15 backdrop-blur-xl',
    medium: 'bg-white/55 dark:bg-white/10 backdrop-blur-lg',
    light: 'bg-white/35 dark:bg-white/5 backdrop-blur-md',
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={interactive ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        bgByIntensity[intensity],
        // Light mode: subtle dark border + warm shadow; dark mode: white specular rim
        'shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.07),0_4px_16px_rgba(255,140,0,0.08)]',
        'dark:shadow-[inset_1px_1px_0_rgba(255,255,255,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)]',
        featured && 'dark:shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.3),0_16px_48px_rgba(255,140,0,0.18)]',
        interactive && 'cursor-pointer',
        className
      )}
    >
      {/* Chromatic rim */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1px] z-0 rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,140,0,0.2) 0%, transparent 45%, rgba(255,215,0,0.2) 100%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
