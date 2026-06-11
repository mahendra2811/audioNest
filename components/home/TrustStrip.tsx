'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Shield, UserX, Smartphone } from 'lucide-react'

const badges = [
  { icon: CheckCircle, label: '100% Free' },
  { icon: Shield,       label: 'No Upload' },
  { icon: UserX,        label: 'No Sign-up' },
  { icon: Smartphone,   label: 'Works on Mobile' },
]

export function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="w-full flex justify-center px-4 py-4"
    >
      <div className="inline-flex flex-wrap justify-center gap-3 rounded-2xl border border-[#1A1208]/8 bg-[#1A1208]/4 px-5 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/6">
        {badges.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon className="h-4 w-4 shrink-0 text-[#FF8C00]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#1A1208]/75 dark:text-[#FFF8ED]/75">
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
