/**
 * SAGA Logo - Modern Geometric
 * Design Direction: Tech-forward, data-driven, minimalist
 * Target Audience: Tech-savvy nonprofits, SaaS-familiar teams
 * Color Palette: Cool blues and teals
 */

interface SagaLogoGeometricProps {
  className?: string
  width?: number
  variant?: 'full' | 'icon-only' | 'wordmark-only'
  colorScheme?: 'gradient' | 'solid-blue' | 'solid-teal' | 'monochrome'
  showTagline?: boolean
}

export default function SagaLogoGeometric({
  className = '',
  width = 200,
  variant = 'full',
  colorScheme = 'gradient',
  showTagline = true
}: SagaLogoGeometricProps) {
  const height = variant === 'icon-only' ? width : (width * 0.35)

  // Color scheme definitions
  const colorMap = {
    gradient: 'url(#geoGradient)',
    'solid-blue': '#0A4D68',
    'solid-teal': '#05BFDB',
    monochrome: '#1E293B'
  }

  const fillColor = colorMap[colorScheme]

  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={width}
        className={className}
        aria-label="SAGA CRM Geometric Icon"
      >
        <defs>
          <linearGradient id="geoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0A4D68', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#05BFDB', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00D9FF', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Hexagonal data node network */}
        <path
          d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z"
          stroke={fillColor}
          strokeWidth="2.5"
          fill="none"
        />

        {/* Data nodes forming triangle */}
        <circle cx="32" cy="20" r="4" fill={fillColor} />
        <circle cx="22" cy="42" r="4" fill={fillColor} />
        <circle cx="42" cy="42" r="4" fill={fillColor} />

        {/* Connection lines */}
        <line x1="32" y1="20" x2="22" y2="42" stroke={fillColor} strokeWidth="2" />
        <line x1="32" y1="20" x2="42" y2="42" stroke={fillColor} strokeWidth="2" />
        <line x1="22" y1="42" x2="42" y2="42" stroke={fillColor} strokeWidth="2" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 280 70"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      aria-label="SAGA CRM Geometric Logo"
    >
      <defs>
        <linearGradient id="geoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#0A4D68', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#05BFDB', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00D9FF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Icon */}
      {variant === 'full' && (
        <g transform="translate(0, 3)">
          <path
            d="M32 4 L48 12 L48 36 L32 44 L16 36 L16 12 Z"
            stroke={fillColor}
            strokeWidth="2"
            fill="none"
          />
          <circle cx="32" cy="16" r="3" fill={fillColor} />
          <circle cx="26" cy="32" r="3" fill={fillColor} />
          <circle cx="38" cy="32" r="3" fill={fillColor} />
          <line x1="32" y1="16" x2="26" y2="32" stroke={fillColor} strokeWidth="1.5" />
          <line x1="32" y1="16" x2="38" y2="32" stroke={fillColor} strokeWidth="1.5" />
          <line x1="26" y1="32" x2="38" y2="32" stroke={fillColor} strokeWidth="1.5" />
        </g>
      )}

      {/* SAGA Wordmark */}
      <g transform="translate(70, 0)" fill={fillColor}>
        {/* S */}
        <path d="M0 14h22c6 0 11 3 11 9 0 4-2 7-6 8 4 1 7 5 7 10 0 7-6 12-13 12H0v-7h21c3 0 5-2 5-5s-2-5-5-5H0v-7h21c3 0 5-2 5-5s-2-5-5-5H0v-5z" />

        {/* A */}
        <path d="M50 14l14 39h-8l-2-7h-10l-2 7h-8l14-39h2zm0 10l-4 14h8l-4-14z" />

        {/* G */}
        <path d="M75 14c11 0 19 8 19 19v1h-7v-1c0-7-5-12-12-12s-12 5-12 12 5 12 12 12c4 0 8-2 10-5h-8v-7h15v9c-3 6-9 10-17 10-11 0-19-8-19-19s8-19 19-19z" />

        {/* A */}
        <path d="M125 14l14 39h-8l-2-7h-10l-2 7h-8l14-39h2zm0 10l-4 14h8l-4-14z" />
      </g>

      {/* CRM Tagline */}
      {showTagline && (
        <text
          x="245"
          y="42"
          fontFamily="monospace"
          fontSize="11"
          fontWeight="600"
          fill={fillColor}
          letterSpacing="3"
        >
          CRM
        </text>
      )}
    </svg>
  )
}
