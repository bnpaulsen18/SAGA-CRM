/**
 * Connected Hands Icon Mark
 * Symbolism: Donor-nonprofit relationship, giving, community partnership
 * Use case: Relationship-focused messaging, stewardship campaigns, donor retention
 * Best for: Major gift officers, monthly donors, peer-to-peer fundraising
 */

interface ConnectedHandsIconProps {
  size?: number
  className?: string
  variant?: 'gradient' | 'monochrome'
  monochromeColor?: string
}

export default function ConnectedHandsIcon({
  size = 64,
  className = '',
  variant = 'gradient',
  monochromeColor = '#764ba2'
}: ConnectedHandsIconProps) {
  const fillColor = variant === 'gradient' ? 'url(#saga-gradient-hands)' : monochromeColor

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="Connected Hands Icon"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="saga-gradient-hands" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}

      {/* Left hand (giving) */}
      <path
        d="M12 32C12 32 16 20 22 16C28 12 32 16 32 16L32 32"
        stroke={fillColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right hand (receiving/connecting) */}
      <path
        d="M52 32C52 32 48 44 42 48C36 52 32 48 32 48L32 32"
        stroke={fillColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Connection point (gift/exchange) */}
      <circle cx="32" cy="32" r="5" fill={fillColor} />
      <circle cx="32" cy="32" r="8" stroke={fillColor} strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  )
}
