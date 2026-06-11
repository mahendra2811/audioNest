import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="text-brand text-7xl font-extrabold">404</span>
      <h1 className="text-2xl font-semibold text-fg">Page not found</h1>
      <p className="max-w-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={buttonVariants({ size: 'md' })}>
        Back to AudioNest
      </Link>
    </div>
  )
}
