export const flags = {
  analyticsEnabled: !!(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GTM_ID),
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' && !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  sentryEnabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID || '',
} as const
