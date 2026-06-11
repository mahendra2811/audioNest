'use client'
import { Button } from '@/components/ui/Button'

interface ProgressRingProps {
  percent: number
  step?: string
  onCancel?: () => void
  size?: number
}

export function ProgressRing({ percent, step, onCancel, size = 84 }: ProgressRingProps) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.max(0, Math.min(100, percent)) / 100) * circ

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth="6"
            className="stroke-line-strong"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ stroke: 'url(#progressGrad)', transition: 'stroke-dashoffset 0.3s ease' }}
          />
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-bold tabular-nums text-fg">{percent}%</span>
        </div>
      </div>

      {step && <p className="text-sm capitalize text-muted">{step.replace(/_/g, ' ')}</p>}

      {onCancel && (
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  )
}
