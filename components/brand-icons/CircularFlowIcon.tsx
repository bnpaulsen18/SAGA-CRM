/**
 * Circular Flow Icon Mark
 * Symbolism: Donor lifecycle, recurring donations, continuous engagement
 * Use case: Retention campaigns, monthly giving, lifecycle marketing
 * Best for: Recurring revenue focus, subscription giving, annual fund directors
 */

interface CircularFlowIconProps {
  size?: number
  className?: string
  variant?: 'gradient' | 'monochrome'
  monochromeColor?: string
}

export default function CircularFlowIcon({
  size = 64,
  className = '',
  variant = 'gradient',
  monochromeColor = '#764ba2'
}: CircularFlowIconProps) {
  const fillColor = variant === 'gradient' ? 'url(#saga-gradient-flow)' : monochromeColor

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="Circular Flow Icon"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="saga-gradient-flow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}

      {/* Circular flow path */}
      <path
        d="M32 10A22 22 0 1 1 31.9 10"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Directional arrows (showing flow) */}
      <path
        d="M48 20L52 16L48 12"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 44L12 48L16 52"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M32 56L32 60L36 56"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Lifecycle nodes */}
      <circle cx="32" cy="10" r="4" fill={fillColor} />
      <circle cx="52" cy="32" r="4" fill={fillColor} />
      <circle cx="12" cy="32" r="4" fill={fillColor} />
    </svg>
  )
}
