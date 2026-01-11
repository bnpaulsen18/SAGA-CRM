/**
 * Rising Graph + Shield Icon Mark
 * Symbolism: Security, trust, data-driven growth, analytics
 * Use case: Enterprise positioning, compliance messaging, security features
 * Best for: Large nonprofits, universities, healthcare foundations, enterprise buyers
 */

interface RisingGraphShieldIconProps {
  size?: number
  className?: string
  variant?: 'gradient' | 'monochrome'
  monochromeColor?: string
}

export default function RisingGraphShieldIcon({
  size = 64,
  className = '',
  variant = 'gradient',
  monochromeColor = '#764ba2'
}: RisingGraphShieldIconProps) {
  const fillColor = variant === 'gradient' ? 'url(#saga-gradient-shield)' : monochromeColor

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="Rising Graph + Shield Icon"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="saga-gradient-shield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}

      {/* Shield outline */}
      <path
        d="M32 8L48 16C48 16 50 28 48 40C46 52 32 56 32 56C32 56 18 52 16 40C14 28 16 16 16 16L32 8Z"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Graph line */}
      <polyline
        points="22,42 26,36 30,38 34,30 38,32 42,22"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Data points */}
      <circle cx="22" cy="42" r="2.5" fill={fillColor} />
      <circle cx="26" cy="36" r="2.5" fill={fillColor} />
      <circle cx="30" cy="38" r="2.5" fill={fillColor} />
      <circle cx="34" cy="30" r="2.5" fill={fillColor} />
      <circle cx="38" cy="32" r="2.5" fill={fillColor} />
      <circle cx="42" cy="22" r="2.5" fill={fillColor} />
    </svg>
  )
}
