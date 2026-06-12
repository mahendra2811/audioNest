export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://audionest.app'

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'AudioNest'

export function toolUrl(slug: string): string {
  return `${SITE_URL}/${slug}`
}

export function blogUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`
}
