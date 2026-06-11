'use client'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="flex flex-col items-center py-20 text-center sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur-sm">
          <ShieldCheck size={13} className="text-tint" />
          100% on-device · nothing uploaded
        </span>

        <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          Every audio tool. <span className="text-brand">Right in your browser.</span>
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base text-muted sm:text-lg">
          Cut, convert, clean, and create — free, private, and 100% on your device. Nothing is ever
          uploaded.
        </p>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/tools" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
            Explore tools
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/how-it-works"
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'w-full sm:w-auto')}
          >
            How it works
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
