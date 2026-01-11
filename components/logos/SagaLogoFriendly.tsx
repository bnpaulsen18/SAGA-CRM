/**
 * SAGA Logo - Friendly Rounded
 * Design Direction: Approachable, warm, community-focused
 * Target Audience: Community orgs, youth programs, local nonprofits
 * Color Palette: Warm coral, teal, yellow
 */

interface SagaLogoFriendlyProps {
  className?: string
  width?: number
  variant?: 'full' | 'icon-only' | 'stacked'
  colorScheme?: 'rainbow-gradient' | 'coral' | 'teal' | 'multicolor'
  playful?: boolean
  showSmile?: boolean
}

export default function SagaLogoFriendly({
  className = '',
  width = 200,
  variant = 'full',
  colorScheme = 'rainbow-gradient',
  playful = false,
  showSmile = false
}: SagaLogoFriendlyProps) {
  const height = variant === 'icon-only' ? width : (width * 0.45)

  // Color definitions
  const colors = {
    'rainbow-gradient': 'url(#friendlyGradient)',
    coral: '#FF6F61',
    teal: '#1ABC9C',
    multicolor: 'url(#friendlyGradient)'
  }

  const fillColor = colors[colorScheme]

  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={width}
        className={className}
        aria-label="SAGA CRM Friendly Icon"
      >
        <defs>
          <linearGradient id="friendlyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6F61', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FDB44B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1ABC9C', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Overlapping circles forming community/heart */}
        <circle cx="28" cy="40" r="22" fill="none" stroke="#FF6F61" strokeWidth="5" opacity="0.7" />
        <circle cx="52" cy="40" r="22" fill="none" stroke="#1ABC9C" strokeWidth="5" opacity="0.7" />
        <circle cx="40" cy="50" r="22" fill="none" stroke="#FDB44B" strokeWidth="5" opacity="0.7" />

        {/* Alternative: filled with opacity */}
        <circle cx="28" cy="40" r="18" fill="#FF6F61" opacity="0.3" />
        <circle cx="52" cy="40" r="18" fill="#1ABC9C" opacity="0.3" />
        <circle cx="40" cy="50" r="18" fill="#FDB44B" opacity="0.3" />
      </svg>
    )
  }

  // Bouncy baseline offsets for playful variant
  const bounceOffsets = playful ? [0, -2, 0, 2] : [0, 0, 0, 0]

  return (
    <svg
      viewBox="0 0 280 90"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      aria-label="SAGA CRM Friendly Logo"
    >
      <defs>
        <linearGradient id="friendlyGradient" x1="0%" x2="100%">
          <stop offset="0%" style={{ stopColor: '#FF6F61', stopOpacity: 1 }} />
          <stop offset="33%" style={{ stopColor: '#FDB44B', stopOpacity: 1 }} />
          <stop offset="66%" style={{ stopColor: '#1ABC9C', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#9B88D9', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Icon */}
      {variant === 'full' && (
        <g transform="translate(0, 5)">
          <circle cx="20" cy="28" r="14" fill="none" stroke="#FF6F61" strokeWidth="3" opacity="0.6" />
          <circle cx="36" cy="28" r="14" fill="none" stroke="#1ABC9C" strokeWidth="3" opacity="0.6" />
          <circle cx="28" cy="36" r="14" fill="none" stroke="#FDB44B" strokeWidth="3" opacity="0.6" />
        </g>
      )}

      {/* SAGA Wordmark with rounded letters */}
      <g transform="translate(65, 30)">
        {/* S - rounded, baseline + bounce[0] */}
        <g transform={`translate(0, ${bounceOffsets[0]})`}>
          <path
            d="M18 4c-6 0-10 3-10 8 0 3 2 5 4 7l10 5c3 2 5 4 5 7 0 5-4 9-9 9-4 0-7-2-9-5l5-3c1 2 3 3 4 3 2 0 4-2 4-4 0-2-1-3-3-4L9 22c-3-2-5-4-5-8 0-5 5-10 11-10 4 0 7 2 9 4l-4 3c-2-2-4-3-6-3z"
            fill={fillColor}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* A - rounded, baseline + bounce[1] */}
        <g transform={`translate(40, ${bounceOffsets[1]})`}>
          <path
            d="M14 4c1 0 2 0 3 1l10 31h-7l-2-6h-9l-2 6h-7l10-31c1-1 2-1 4-1zm0 9l-3 13h6l-3-13z"
            fill={fillColor}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* G - rounded, baseline + bounce[2] */}
        <g transform={`translate(75, ${bounceOffsets[2]})`}>
          <path
            d="M14 4c8 0 14 6 14 16v1h-6v-1c0-6-4-10-8-10s-8 4-8 10 4 10 8 10c3 0 6-1 7-4h-6v-6h12v8c-2 5-7 8-13 8-8 0-14-6-14-16s6-16 14-16z"
            fill={fillColor}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* A - rounded, baseline + bounce[3] */}
        <g transform={`translate(115, ${bounceOffsets[3]})`}>
          <path
            d="M14 4c1 0 2 0 3 1l10 31h-7l-2-6h-9l-2 6h-7l10-31c1-1 2-1 4-1zm0 9l-3 13h6l-3-13z"
            fill={fillColor}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      {/* CRM tagline */}
      <text
        x="230"
        y="52"
        fontFamily="Nunito, Quicksand, sans-serif"
        fontSize="14"
        fontWeight="600"
        fill="#FF6F61"
        letterSpacing="2"
      >
        CRM
      </text>

      {/* Optional smile curve */}
      {showSmile && (
        <path
          d="M65 75 Q140 80 215 75"
          stroke="#FDB44B"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      )}
    </svg>
  )
}
