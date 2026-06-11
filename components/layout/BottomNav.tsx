'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3x3, Heart, MoreHorizontal } from 'lucide-react'
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
      className="fixed bottom-0 inset-x-0 z-50 md:hidden safe-area-bottom"
    >
      <div className="bg-white/80 dark:bg-white/15 backdrop-blur-xl border-t border-black/8 dark:border-white/20 shadow-[0_-1px_0_rgba(0,0,0,0.06)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.15)]">
        <ul className="flex items-center h-16">
          {tabs.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-label={label}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 h-full transition-all duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-xl mx-1',
                    isActive ? 'text-orange-500' : 'text-[#7A6A50] dark:text-[#B8A77F]'
                  )}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 w-8 h-0.5 rounded-b-full bg-brand"
                      style={{ background: 'linear-gradient(90deg, #FF8C00, #FFD700)' }}
                    />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
