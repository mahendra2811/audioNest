import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'sonner'
import { GlassFilter } from '@/components/glass/GlassFilter'
import { BlobBackground } from '@/components/glass/BlobBackground'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { AppSplash } from '@/components/layout/AppSplash'
import { site } from '@/lib/config/site'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Every audio tool in your browser`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBF5' },
    { media: '(prefers-color-scheme: dark)', color: '#0F0A00' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Skip-to-content for keyboard and screen-reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-orange-500 focus:text-white focus:font-medium focus:shadow-lg"
          >
            Skip to content
          </a>
          {/* One-time app splash on first mount */}
          <AppSplash />
          {/* SVG filter defs — mounted once, referenced by glass components */}
          <GlassFilter />
          {/* Living orange-gold blob background */}
          <BlobBackground />
          {/* Brand gradient top progress bar */}
          <NextTopLoader
            color="linear-gradient(90deg, #FF8C00, #FFD700)"
            showSpinner={false}
            height={3}
            zIndex={9998}
          />
          {/* Desktop sticky header */}
          <Header />
          {/* Page content */}
          <main id="main-content" className="pb-16 md:pb-0">{children}</main>
          {/* Desktop footer */}
          <Footer />
          {/* Mobile bottom nav */}
          <BottomNav />
          {/* Toast notifications */}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
