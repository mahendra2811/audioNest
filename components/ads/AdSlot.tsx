'use client'
import { flags } from '@/lib/config/flags'

export function AdSlot({ slot }: { slot?: string }) {
  if (!flags.adsEnabled) return null
  return (
    <div
      className="flex h-24 w-full items-center justify-center rounded-2xl border border-line bg-surface-2 text-xs text-muted"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle block w-full h-full"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
      />
    </div>
  )
}
