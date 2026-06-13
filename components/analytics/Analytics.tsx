import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

/**
 * Injects Google Analytics 4 (and optionally Google Tag Manager) via
 * `@next/third-parties`. Both are gated on their env vars, so the app
 * works with an empty .env — nothing renders when the IDs are absent.
 *
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID  — GA4 measurement ID (G-XXXXXXXXXX)
 *   NEXT_PUBLIC_GTM_ID             — GTM container ID (GTM-XXXXXXX)
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
    </>
  )
}
