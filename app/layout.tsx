import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'sonner'
import { BlobBackground } from '@/components/glass/BlobBackground'
import { GlassFilter } from '@/components/glass/GlassFilter'
import { AppSplash } from '@/components/layout/AppSplash'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
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
    { media: '(prefers-color-scheme: light)', color: '#faf9ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0a12' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-bg font-sans text-fg antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Skip-to-content for keyboard and screen-reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:font-medium focus:text-white focus:shadow-lg"
          >
            Skip to content
          </a>
          {/* One-time app splash on first mount */}
          <AppSplash />
          {/* SVG filter defs — mounted once, referenced by glass components */}
          <GlassFilter />
          {/* Living indigo-gold blob background */}
          <BlobBackground />
          {/* Brand gradient top progress bar */}
          <NextTopLoader color="#6366f1" showSpinner={false} height={3} zIndex={9998} />
          {/* Desktop sticky header */}
          <Header />
          {/* Page content */}
          <main
            id="main-content"
            className="mx-auto w-full justify-center  max-w-7xl px-4 pb-16 sm:px-6 md:pb-0 lg:px-8"
          >
            {children}
          </main>
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
