'use client'
import { flags } from '@/lib/config/flags'

export function AdSlot({ slot }: { slot?: string }) {
  if (!flags.adsEnabled) return null
  return (
    <div className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-xs text-muted-foreground" aria-label="Advertisement">
      <ins
        className="adsbygoogle block w-full h-full"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
      />
    </div>
  )
}
