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
    <footer className="hidden md:block border-t border-white/10 bg-white/5 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Wordmark size={24} />
          <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] max-w-xs text-center md:text-left">
            100% free · no upload · no sign-up · works offline
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[#7A6A50] dark:text-[#B8A77F] hover:text-[#1A1208] dark:hover:text-[#FFF8ED] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-xs text-[#7A6A50] dark:text-[#B8A77F] shrink-0">
          © {new Date().getFullYear()} AudioNest
        </p>
      </div>
    </footer>
  )
}
