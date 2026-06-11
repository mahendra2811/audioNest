'use client'
import Link from 'next/link'
import { ChevronRight, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/glass/GlassCard'
import { soonTools, CATEGORIES, liveTools } from '@/lib/config/tools'
import { toast } from 'sonner'
import { strings } from '@/lib/strings'

const moreLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/about', label: 'About AudioNest' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export default function MorePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#1A1208] dark:text-[#FFF8ED]">More</h1>

      {/* Theme toggle */}
      <GlassCard intensity="medium" className="p-4 flex items-center justify-between">
        <span className="font-medium text-[#1A1208] dark:text-[#FFF8ED]">Theme</span>
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm font-medium transition-all"
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-amber-700" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        )}
      </GlassCard>

      {/* Coming soon */}
      {soonTools.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-[#1A1208] dark:text-[#FFF8ED]">Coming soon</h2>
          <div className="grid grid-cols-2 gap-2">
            {soonTools.map((tool) => (
              <button
                key={tool.slug}
                onClick={() => toast.info(strings.comingSoonToast)}
                className="text-left p-3 rounded-2xl bg-white/5 border border-white/10 opacity-60 hover:opacity-80 transition-opacity"
              >
                <p className="font-medium text-sm text-[#1A1208] dark:text-[#FFF8ED]">{tool.name}</p>
                <p className="text-xs text-orange-500 dark:text-amber-400 mt-0.5">Coming soon</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-col gap-1">
        {moreLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <span className="text-sm font-medium text-[#1A1208] dark:text-[#FFF8ED]">{label}</span>
            <ChevronRight size={16} className="text-[#7A6A50] dark:text-[#B8A77F]" />
          </Link>
        ))}
      </div>
    </div>
  )
}
