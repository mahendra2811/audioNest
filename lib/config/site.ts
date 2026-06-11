export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'AudioNest',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://audionest.app',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'mahendrapuniya92@gmail.com',
  description: 'Every audio tool. Right in your browser. Free, private, 100% on-device.',
} as const
