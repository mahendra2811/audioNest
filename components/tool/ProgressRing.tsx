'use client'

interface ProgressRingProps {
  percent: number
  step?: string
  onCancel?: () => void
  size?: number
}

export function ProgressRing({ percent, step, onCancel, size = 80 }: ProgressRingProps) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth="6"
            className="stroke-white/20"
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
            style={{
              stroke: 'url(#progressGrad)',
              transition: 'stroke-dashoffset 0.3s ease',
            }}
          />
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-bold text-[#1A1208] dark:text-[#FFF8ED]">
            {percent}%
          </span>
        </div>
      </div>

      {step && (
        <p className="text-sm text-[#7A6A50] dark:text-[#B8A77F] capitalize">
          {step.replace(/_/g, ' ')}
        </p>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="px-4 py-1.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          Cancel
        </button>
      )}
    </div>
  )
}
