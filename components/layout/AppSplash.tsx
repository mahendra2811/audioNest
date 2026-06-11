'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/brand/Logo'

export function AppSplash() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('splash-seen')
    if (!seen) {
      setVisible(true)
      sessionStorage.setItem('splash-seen', '1')
      const t = setTimeout(() => setVisible(false), 1800)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFFBF5] dark:bg-[#0F0A00]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'backOut' }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <Logo size={72} />
              {/* Gradient shimmer */}
              <motion.span
                className="absolute inset-0 rounded-[18px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
              />
            </div>
            <p className="font-bold text-xl tracking-tight text-[#1A1208] dark:text-[#FFF8ED]">
              Audio<span className="text-brand">Nest</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
