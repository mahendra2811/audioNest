'use client'
import { Grid3x3, Heart, Home, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tools', label: 'Tools', icon: Grid3x3 },
  { href: '/favourites', label: 'Favourites', icon: Heart },
  { href: '/more', label: 'More', icon: MoreHorizontal },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Bottom navigation"
      className="safe-area-bottom fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/90 backdrop-blur-xl md:hidden"
    >
      <ul className="flex h-16 items-center">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-label={label}
                className={cn(
                  'relative flex h-full flex-col items-center justify-center gap-1 transition-colors',
                  isActive ? 'text-tint' : 'text-muted'
                )}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-0.5 w-8 rounded-b-full bg-brand"
                  />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
