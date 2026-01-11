/**
 * SAGA Logo - Bold Impact
 * Design Direction: Dramatic, mission-driven, high-energy
 * Target Audience: Social justice orgs, advocacy groups, activists
 * Color Palette: Deep purple, magenta, burning orange
 */

interface SagaLogoBoldProps {
  className?: string
  width?: number
  variant?: 'full' | 'icon-only' | 'stacked' | 'diagonal-slash'
  colorScheme?: 'purple-orange' | 'all-black' | 'gradient' | 'magenta-yellow'
  showImpactLine?: boolean
  animate?: boolean
}

export default function SagaLogoBold({
  className = '',
  width = 220,
  variant = 'full',
  colorScheme = 'gradient',
  showImpactLine = false,
  animate = false
}: SagaLogoBoldProps) {
  const height = variant === 'icon-only' ? width : (width * 0.45)

  // Color definitions
  const colors = {
    'purple-orange': 'url(#impactGradient)',
    'all-black': '#0A0A0A',
    gradient: 'url(#impactGradient)',
    'magenta-yellow': 'url(#impactGradient2)'
  }

  const fillColor = colors[colorScheme]

  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={width}
        className={className}
        aria-label="SAGA CRM Bold Impact Icon"
      >
        <defs>
          <linearGradient id="impactGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#5B21B6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#DB2777', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EA580C', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Lightning bolt with upward arrow */}
        <path
          d="M32 8 L38 28 L50 28 L28 48 L34 32 L22 32 Z"
          fill={fillColor}
          stroke="#0A0A0A"
          strokeWidth="2"
        />

        {/* Upward arrow at top */}
        <path d="M32 8 L38 14 M32 8 L26 14" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />

        {/* Energy lines radiating */}
        <g opacity="0.6">
          <line x1="32" y1="8" x2="32" y2="4" stroke="#EA580C" strokeWidth="2" />
          <line x1="38" y1="10" x2="42" y2="6" stroke="#DB2777" strokeWidth="2" />
          <line x1="26" y1="10" x2="22" y2="6" stroke="#5B21B6" strokeWidth="2" />
        </g>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      aria-label="SAGA CRM Bold Impact Logo"
    >
      <defs>
        <linearGradient id="impactGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#5B21B6', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#DB2777', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#EA580C', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="impactGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#DB2777', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FACC15', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Optional diagonal slash accent */}
      {showImpactLine && (
        <line
          x1="0"
          y1="85"
          x2="280"
          y2="15"
          stroke="url(#impactGradient)"
          strokeWidth="8"
          opacity="0.3"
          strokeLinecap="round"
        />
      )}

      {/* Icon */}
      {variant === 'full' && (
        <g transform="translate(10, 20)">
          <path
            d="M26 6 L30 20 L38 20 L22 36 L26 24 L18 24 Z"
            fill="url(#impactGradient)"
            stroke="#0A0A0A"
            strokeWidth="1.5"
          />
          <path d="M26 6 L30 10 M26 6 L22 10" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* SAGA Wordmark - Ultra Bold */}
      <g transform="translate(65, 25)" fill={fillColor}>
        {/* S - Extra thick */}
        <path d="M0 0h30c9 0 16 5 16 13 0 5-3 10-8 12 5 2 9 7 9 14 0 9-8 16-17 16H0v-9h30c4 0 7-3 7-7s-3-7-7-7H0v-9h30c4 0 7-3 7-7s-3-7-7-7H0v-6z" />

        {/* A - Thick, powerful */}
        <path d="M55 0l18 45h-10l-3-9h-12l-3 9h-10l18-45h2zm0 14l-5 18h10l-5-18z" />

        {/* G - Bold with cut */}
        <path d="M95 0c12 0 21 9 21 22v1h-8v-1c0-8-6-14-13-14s-13 6-13 14 6 14 13 14c5 0 9-2 12-6h-9v-8h17v11c-4 7-11 12-20 12-12 0-21-9-21-22s9-22 21-22z" />

        {/* A - Thick, powerful */}
        <path d="M145 0l18 45h-10l-3-9h-12l-3 9h-10l18-45h2zm0 14l-5 18h10l-5-18z" />
      </g>

      {/* CRM tagline */}
      <text
        x="255"
        y="65"
        fontFamily="Impact, Arial Black, sans-serif"
        fontSize="16"
        fontWeight="900"
        fill="#0A0A0A"
        letterSpacing="1"
      >
        CRM
      </text>
    </svg>
  )
}
