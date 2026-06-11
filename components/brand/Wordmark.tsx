import { Logo } from './Logo'

interface WordmarkProps {
  size?: number
}

export function Wordmark({ size = 32 }: WordmarkProps) {
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className="font-bold text-xl tracking-tight">
        Audio<span className="text-brand">Nest</span>
      </span>
    </div>
  )
}
