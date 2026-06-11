'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Wordmark } from '@/components/brand/Wordmark'
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
    <header className="sticky top-0 z-50 hidden md:block bg-white/8 backdrop-blur-xl border-b border-white/15 shadow-[0_1px_0_rgba(255,255,255,0.2)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link href="/" aria-label="AudioNest home">
          <Wordmark size={28} />
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    'hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                    pathname === href || pathname.startsWith(href + '/')
                      ? 'text-orange-600 bg-orange-50/40 dark:text-amber-300 dark:bg-white/5'
                      : 'text-[#1A1208]/70 dark:text-[#FFF8ED]/70 hover:text-[#1A1208] dark:hover:text-[#FFF8ED]'
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
