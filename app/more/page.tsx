'use client'
import { ChevronRight, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { soonTools } from '@/lib/config/tools'
import { strings } from '@/lib/strings'

const moreLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/about', label: 'About AudioNest' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export default function MorePage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme === 'dark'

  return (
    <Container size="narrow" className="flex flex-col gap-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-fg">More</h1>

      {/* Theme toggle */}
      <Card className="flex items-center justify-between p-4">
        <span className="font-medium text-fg">Theme</span>
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            {isDark ? (
              <Sun size={16} className="text-tint" />
            ) : (
              <Moon size={16} className="text-tint" />
            )}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        )}
      </Card>

      {/* Coming soon */}
      {soonTools.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-fg">Coming soon</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {soonTools.map((tool) => (
              <button
                key={tool.slug}
                type="button"
                onClick={() => toast.info(strings.comingSoonToast)}
                className="flex flex-col gap-1 rounded-2xl border border-line bg-surface-2 p-3 text-left transition-colors hover:border-line-strong hover:bg-surface"
              >
                <p className="text-sm font-medium text-fg">{tool.name}</p>
                <Badge variant="neutral" className="self-start">
                  Coming soon
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-col gap-2">
        {moreLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between rounded-2xl border border-line bg-surface-2 px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface"
          >
            <span className="text-sm font-medium text-fg">{label}</span>
            <ChevronRight size={16} className="text-muted" />
          </Link>
        ))}
      </div>
    </Container>
  )
}
