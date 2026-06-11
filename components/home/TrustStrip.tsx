'use client'
import { CheckCircle, Shield, Smartphone, UserX } from 'lucide-react'

const badges = [
  { icon: CheckCircle, label: '100% Free' },
  { icon: Shield, label: 'No Upload' },
  { icon: UserX, label: 'No Sign-up' },
  { icon: Smartphone, label: 'Works on Mobile' },
]

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-2xl border border-line bg-surface/60 px-5 py-3.5 backdrop-blur-sm">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-tint" aria-hidden="true" />
          <span className="text-sm font-medium text-fg">{label}</span>
        </div>
      ))}
    </div>
  )
}
