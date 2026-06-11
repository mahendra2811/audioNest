import Link from 'next/link'
import { Wordmark } from '@/components/brand/Wordmark'

const footerLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/about', label: 'About' },
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="mt-24 hidden border-t border-line bg-surface/50 md:block">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Wordmark size={24} />
          <p className="max-w-xs text-center text-xs text-muted md:text-left">
            100% free · no upload · no sign-up · works offline
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded text-sm text-muted transition-colors hover:text-fg"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="shrink-0 text-xs text-muted">© {new Date().getFullYear()} AudioNest</p>
      </div>
    </footer>
  )
}
