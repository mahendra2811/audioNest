import type { SVGProps } from 'react'

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ size = 48, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AudioNest"
      width={size}
      height={size}
      {...props}
    >
      <defs>
        <linearGradient id="anGrad" x1="3" y1="3" x2="45" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#anGrad)" />
      <g fill="#fff">
        <rect x="13" y="21" width="3.2" height="6" rx="1.6" />
        <rect x="18.4" y="17" width="3.2" height="14" rx="1.6" />
        <rect x="23.8" y="12" width="3.2" height="24" rx="1.6" />
        <rect x="29.2" y="17" width="3.2" height="14" rx="1.6" />
        <rect x="34.6" y="21" width="3.2" height="6" rx="1.6" />
      </g>
    </svg>
  )
}
