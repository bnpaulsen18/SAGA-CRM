/**
 * Tree of Giving Icon Mark
 * Symbolism: Sustainable growth, deep community roots, expanding impact
 * Use case: Impact-focused messaging, sustainability reports, legacy giving
 * Best for: Environmental nonprofits, community foundations, multi-generational impact
 */

interface TreeOfGivingIconProps {
  size?: number
  className?: string
  variant?: 'gradient' | 'monochrome'
  monochromeColor?: string
}

export default function TreeOfGivingIcon({
  size = 64,
  className = '',
  variant = 'gradient',
  monochromeColor = '#764ba2'
}: TreeOfGivingIconProps) {
  const fillColor = variant === 'gradient' ? 'url(#saga-gradient-tree)' : monochromeColor

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="Tree of Giving Icon"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="saga-gradient-tree" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}

      {/* Roots (foundation) */}
      <path
        d="M32 42L28 50L24 56"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 42L32 56"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 42L36 50L40 56"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Trunk */}
      <path
        d="M32 42L32 28"
        stroke={fillColor}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Branches (growth/impact) */}
      <path
        d="M32 28L24 20L20 14"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 28L28 18L26 12"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 28L32 12L32 8"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 28L36 18L38 12"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 28L40 20L44 14"
        stroke={fillColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Impact nodes (leaves/fruit) */}
      <circle cx="20" cy="14" r="3" fill={fillColor} />
      <circle cx="26" cy="12" r="3" fill={fillColor} />
      <circle cx="32" cy="8" r="3.5" fill={fillColor} />
      <circle cx="38" cy="12" r="3" fill={fillColor} />
      <circle cx="44" cy="14" r="3" fill={fillColor} />
    </svg>
  )
}
