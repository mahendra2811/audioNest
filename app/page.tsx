import type { Metadata } from 'next'
import { CategorySection } from '@/components/home/CategorySection'
import { ComingSoonGrid } from '@/components/home/ComingSoonGrid'
import { FeaturedGrid } from '@/components/home/FeaturedGrid'
import { Hero } from '@/components/home/Hero'
import { TrustStrip } from '@/components/home/TrustStrip'

export const metadata: Metadata = {
  title: 'AudioNest — Every audio tool. Right in your browser.',
  description:
    'Free, private, 100% on-device audio tools. Cut, convert, clean, and create without uploading anything.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <div className="mt-16 flex flex-col gap-20 pb-20">
        <FeaturedGrid />
        <CategorySection />
        <ComingSoonGrid />
      </div>
    </>
  )
}
