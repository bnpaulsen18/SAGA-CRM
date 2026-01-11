/**
 * SAGA Logo - Classic Serif Professional
 * Design Direction: Timeless, trustworthy, institutional
 * Target Audience: Universities, hospitals, legacy nonprofits
 * Color Palette: Navy and gold
 */

interface SagaLogoClassicProps {
  className?: string
  width?: number
  variant?: 'full-crest' | 'wordmark' | 'shield-only'
  colorScheme?: 'navy-gold' | 'all-navy' | 'all-gold' | 'burgundy-gold'
  showFoundingYear?: boolean
  showRibbon?: boolean
}

export default function SagaLogoClassic({
  className = '',
  width = 180,
  variant = 'full-crest',
  colorScheme = 'navy-gold',
  showFoundingYear = false,
  showRibbon = false
}: SagaLogoClassicProps) {
  const height = variant === 'shield-only' ? width * 1.2 : width * 0.5

  // Color definitions
  const colors = {
    'navy-gold': { primary: '#0F2347', secondary: '#C5A572', accent: '#6B2737' },
    'all-navy': { primary: '#0F2347', secondary: '#0F2347', accent: '#2C3539' },
    'all-gold': { primary: '#C5A572', secondary: '#B8935E', accent: '#D4B996' },
    'burgundy-gold': { primary: '#6B2737', secondary: '#C5A572', accent: '#8B2747' }
  }

  const { primary, secondary, accent } = colors[colorScheme]

  if (variant === 'shield-only') {
    return (
      <svg
        viewBox="0 0 80 96"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        className={className}
        aria-label="SAGA CRM Classic Shield"
      >
        {/* Shield outline */}
        <path
          d="M40 4 L72 20 L72 52 C72 70 40 92 40 92 C40 92 8 70 8 52 L8 20 Z"
          fill={primary}
          stroke={secondary}
          strokeWidth="2"
        />

        {/* Inner shield */}
        <path
          d="M40 12 L64 24 L64 50 C64 64 40 82 40 82 C40 82 16 64 16 50 L16 24 Z"
          fill={`${primary}dd`}
        />

        {/* Monogram S in center */}
        <path
          d="M35 32c-2 0-4 1-4 3 0 1 1 2 2 3l5 3c2 1 3 2 3 4 0 2-2 4-4 4-2 0-3-1-4-2l-2 2c1 2 3 3 6 3 3 0 6-2 6-5 0-2-1-3-3-4l-5-3c-2-1-3-2-3-4 0-2 2-4 5-4 2 0 3 1 4 2l2-2c-1-2-3-3-5-3z"
          fill={secondary}
        />

        {/* Laurel wreath */}
        <path
          d="M4 30 Q6 36 8 42 Q6 38 4 34 Q2 32 4 30 M6 44 Q8 50 10 56 Q8 52 6 48 Q4 46 6 44"
          stroke="#8B9B85"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M76 30 Q74 36 72 42 Q74 38 76 34 Q78 32 76 30 M74 44 Q72 50 70 56 Q72 52 74 48 Q76 46 74 44"
          stroke="#8B9B85"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Optional ribbon */}
        {showRibbon && (
          <g>
            <path
              d="M20 88 L40 82 L60 88 L58 94 L40 88 L22 94 Z"
              fill={secondary}
              stroke={`${secondary}cc`}
              strokeWidth="1"
            />
            <text
              x="40"
              y="92"
              fontFamily="serif"
              fontSize="6"
              fill={primary}
              textAnchor="middle"
            >
              CRM
            </text>
          </g>
        )}
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 320 100"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      aria-label="SAGA CRM Classic Logo"
    >
      {/* Shield crest (if full variant) */}
      {variant === 'full-crest' && (
        <g transform="translate(0, 10)">
          <path
            d="M32 2 L58 14 L58 42 C58 54 32 70 32 70 C32 70 6 54 6 42 L6 14 Z"
            fill={primary}
            stroke={secondary}
            strokeWidth="2"
          />
          <path
            d="M32 8 L52 18 L52 40 C52 50 32 64 32 64 C32 64 12 50 12 40 L12 18 Z"
            fill={`${primary}dd`}
          />
          <path
            d="M28 24c-1.5 0-3 0.8-3 2.5 0 0.8 0.8 1.5 1.5 2.5l4 2.5c1.5 0.8 2.5 1.5 2.5 3 0 1.5-1.5 3-3 3-1.5 0-2.5-0.8-3-1.5l-1.5 1.5c0.8 1.5 2.5 2.5 4.5 2.5 2.5 0 5-1.5 5-4 0-1.5-0.8-2.5-2.5-3l-4-2.5c-1.5-0.8-2.5-1.5-2.5-3 0-1.5 1.5-3 4-3 1.5 0 2.5 0.8 3 1.5l1.5-1.5c-0.8-1.5-2.5-2.5-4-2.5z"
            fill={secondary}
          />
        </g>
      )}

      {/* SAGA Wordmark in serif style */}
      <g transform={variant === 'full-crest' ? 'translate(80, 30)' : 'translate(20, 30)'} fill={primary}>
        {/* S with ball terminals */}
        <g>
          <path d="M0 0h18c5 0 9 2 9 6 0 2 -1 4-3 5 2 1 4 3 4 6 0 5-4 9-10 9H0v-6h18c2 0 4-1 4-4s-2-4-4-4H0v-6h18c2 0 4-1 4-4s-2-4-4-4H0v-4z" />
          <circle cx="1" cy="-1" r="1.5" />
          <circle cx="19" cy="27" r="1.5" />
        </g>

        {/* A */}
        <path transform="translate(35, 0)" d="M10 0l11 26h-6l-2-6h-8l-2 6h-6l11-26h2zm0 8l-3 10h6l-3-10z" />

        {/* G */}
        <path transform="translate(65, 0)" d="M10 0c8 0 14 6 14 13v1h-5v-1c0-5-4-9-9-9s-9 4-9 9 4 9 9 9c3 0 6-1 8-4h-6v-5h11v7c-2 4-7 7-13 7-8 0-14-6-14-13s6-13 14-13z" />

        {/* A */}
        <path transform="translate(100, 0)" d="M10 0l11 26h-6l-2-6h-8l-2 6h-6l11-26h2zm0 8l-3 10h6l-3-10z" />
      </g>

      {/* CRM small caps */}
      <text
        x={variant === 'full-crest' ? '220' : '160'}
        y="55"
        fontFamily="serif"
        fontSize="12"
        fontWeight="500"
        fill={secondary}
        letterSpacing="3"
      >
        CRM
      </text>

      {/* Founding year */}
      {showFoundingYear && (
        <text
          x={variant === 'full-crest' ? '180' : '120'}
          y="75"
          fontFamily="serif"
          fontSize="7"
          fill={accent}
          textAnchor="middle"
        >
          EST. 2024
        </text>
      )}
    </svg>
  )
}
