/**
 * Heart + Growth Icon Mark
 * Symbolism: Mission-driven growth and fundraising momentum
 * Use case: Emotional storytelling, donor impact reports, mission-focused campaigns
 * Best for: Individual donors, grassroots nonprofits, faith-based organizations
 */

interface HeartGrowthIconProps {
  size?: number
  className?: string
  variant?: 'gradient' | 'monochrome'
  monochromeColor?: string
}

export default function HeartGrowthIcon({
  size = 64,
  className = '',
  variant = 'gradient',
  monochromeColor = '#764ba2'
}: HeartGrowthIconProps) {
  const fillColor = variant === 'gradient' ? 'url(#saga-gradient-heart)' : monochromeColor

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="Heart + Growth Icon"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="saga-gradient-heart" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}

      {/* Heart base */}
      <path
        d="M32 52L14 34C10 30 10 24 14 20C18 16 24 16 28 20L32 24L36 20C40 16 46 16 50 20C54 24 54 30 50 34L32 52Z"
        fill={fillColor}
        stroke={fillColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Growth arcs */}
      <path
        d="M20 16C20 16 24 12 32 8"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M28 14C28 14 30 11 32 8"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M44 16C44 16 40 12 32 8"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}
