import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { FeaturedGrid } from '@/components/home/FeaturedGrid'
import { CategorySection } from '@/components/home/CategorySection'
import { TrustStrip } from '@/components/home/TrustStrip'
import { ComingSoonGrid } from '@/components/home/ComingSoonGrid'

export const metadata: Metadata = {
  title: 'AudioNest — Every audio tool. Right in your browser.',
  description: 'Free, private, 100% on-device audio tools. Cut, convert, clean, and create without uploading anything.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <TrustStrip />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col gap-20">
        <FeaturedGrid />
        <CategorySection />
        <ComingSoonGrid />
      </section>
    </div>
  )
}
