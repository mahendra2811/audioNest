'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wordmark } from '@/components/brand/Wordmark'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { href: '/tools', label: 'Tools' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 hidden border-b border-line bg-bg/80 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="AudioNest home" className="rounded-xl">
          <Wordmark size={28} />
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-soft text-tint'
                        : 'text-muted hover:bg-surface-2 hover:text-fg'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
