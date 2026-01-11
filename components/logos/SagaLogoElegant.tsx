/**
 * SAGA Logo - Elegant Minimal
 * Design Direction: Sophisticated, upscale, refined
 * Target Audience: Gala organizers, major donors, high-net-worth individuals
 * Color Palette: Charcoal, gold, rose
 */

interface SagaLogoElegantProps {
  className?: string
  width?: number
  variant?: 'full' | 'icon-only' | 'stacked'
  colorScheme?: 'charcoal' | 'gold' | 'rose-gold' | 'white'
  weight?: 'ultra-light' | 'light' | 'regular'
  showAccentDot?: boolean
}

export default function SagaLogoElegant({
  className = '',
  width = 200,
  variant = 'full',
  colorScheme = 'charcoal',
  weight = 'ultra-light',
  showAccentDot = false
}: SagaLogoElegantProps) {
  const height = variant === 'icon-only' ? width : (width * 0.6)

  // Color definitions
  const colors = {
    charcoal: '#2B2D2F',
    gold: '#D4AF37',
    'rose-gold': '#B76E79',
    white: '#FFFFFF'
  }

  const strokeColor = colors[colorScheme]

  // Stroke width based on weight
  const strokeWidths = {
    'ultra-light': 1.5,
    light: 2,
    regular: 2.5
  }

  const strokeWidth = strokeWidths[weight]

  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 80 60"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        className={className}
        aria-label="SAGA CRM Elegant Icon"
      >
        <defs>
          <linearGradient id="elegantGrad" x1="0%" x2="100%">
            <stop offset="0%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Infinity symbol / elegant continuous line */}
        <path
          d="M10 30 Q25 10, 40 30 T70 30 Q55 50, 40 30 T10 30"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Optional accent dot */}
        {showAccentDot && <circle cx="40" cy="50" r="1.5" fill={colors.gold} />}
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 400 120"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      aria-label="SAGA CRM Elegant Logo"
    >
      {/* Icon */}
      {variant === 'full' && (
        <g transform="translate(10, 30)">
          <path
            d="M8 25 Q20 10, 32 25 T56 25 Q44 40, 32 25 T8 25"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* SAGA Wordmark - Hairline elegant with generous spacing */}
      <g transform="translate(90, 50)">
        {/* S - Hairline with mathematical curves */}
        <path
          d="M0 0c-7 0-12 4-12 9 0 3 2 6 6 8l16 8c5 3 8 6 8 11 0 7-6 13-14 13-6 0-11-3-13-7l2-2c2 3 6 6 11 6 6 0 11-5 11-10 0-4-2-7-6-9L-7 19c-5-3-8-6-8-11 0-7 7-13 15-13 6 0 10 3 12 6l-2 2c-2-3-5-5-10-5z"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* A - Elegant thin */}
        <path
          transform="translate(50, 0)"
          d="M14 0l14 40h-4l-4-11h-12l-4 11h-4l14-40h0zm0 6l-5 17h10l-5-17z"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* G - Elegant with precise geometry */}
        <path
          transform="translate(100, 0)"
          d="M14 0c9 0 16 7 16 20v1h-3v-1c0-11-6-17-13-17s-13 6-13 17 6 17 13 17c6 0 11-3 13-8h-11v-3h14v10c-3 6-9 10-16 10-9 0-16-7-16-20s7-20 16-20z"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* A - Elegant thin */}
        <path
          transform="translate(150, 0)"
          d="M14 0l14 40h-4l-4-11h-12l-4 11h-4l14-40h0zm0 6l-5 17h10l-5-17z"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* CRM subtitle - lighter and smaller */}
      <text
        x="200"
        y="95"
        fontFamily="Futura, Avenir Next, sans-serif"
        fontSize="10"
        fontWeight="100"
        fill="#6B7280"
        letterSpacing="6"
        textAnchor="middle"
      >
        CRM
      </text>

      {/* Optional subtle underline */}
      <line
        x1="120"
        y1="105"
        x2="280"
        y2="105"
        stroke={colors.gold}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Optional accent dot */}
      {showAccentDot && <circle cx="200" cy="110" r="2" fill={colors.gold} />}
    </svg>
  )
}
