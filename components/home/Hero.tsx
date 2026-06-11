'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassPanel } from '@/components/glass/GlassPanel'

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] w-full items-center justify-center px-4 py-20">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF8C00] opacity-10 blur-[120px]" />
        <div className="absolute left-1/3 top-2/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD700] opacity-8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <GlassPanel intensity="heavy" className="w-full px-8 py-14 sm:px-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            {/* Waveform orb */}
            <svg
              aria-hidden="true"
              className="mb-8 h-20 w-20 drop-shadow-[0_0_24px_rgba(255,140,0,0.5)]"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="heroOrbGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#FF8C00" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="heroWaveGrad" x1="0" y1="0" x2="96" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF8C00" />
                  <stop offset="0.5" stopColor="#FFD700" />
                  <stop offset="1" stopColor="#FF8C00" />
                </linearGradient>
              </defs>
              <circle cx="48" cy="48" r="46" fill="url(#heroOrbGlow)" />
              <rect x="14" y="40" width="4" height="16" rx="2" fill="url(#heroWaveGrad)" opacity="0.8" />
              <rect x="21" y="33" width="4" height="30" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="28" y="26" width="4" height="44" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="35" y="34" width="4" height="28" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="42" y="22" width="4" height="52" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="49" y="30" width="4" height="36" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="56" y="20" width="4" height="56" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="63" y="32" width="4" height="32" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="70" y="27" width="4" height="42" rx="2" fill="url(#heroWaveGrad)" />
              <rect x="77" y="38" width="4" height="20" rx="2" fill="url(#heroWaveGrad)" opacity="0.8" />
            </svg>

            {/* Headline */}
            <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-[#1A1208] dark:text-white sm:text-5xl lg:text-6xl">
              Every audio tool.{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #FF8C00, #FFD700)' }}
              >
                Right in your browser.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-2xl text-base text-[#4A3D2A] dark:text-white/70 sm:text-lg">
              Cut, convert, clean, and create — free, private, and 100% on your device. Nothing is ever uploaded.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(255,140,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
                style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)' }}
              >
                Explore tools
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-[#1A1208]/15 bg-black/5 px-8 py-3.5 text-sm font-semibold text-[#1A1208] transition-all duration-200 hover:scale-[1.03] hover:border-[#1A1208]/25 hover:bg-black/8 dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
              >
                How it works
              </Link>
            </div>
          </motion.div>
        </GlassPanel>
      </div>
    </section>
  )
}
