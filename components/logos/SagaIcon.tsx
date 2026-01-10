/**
 * SAGA Icon - Square Logo Mark
 * Use case: Favicon, app icons, social media avatars, loading spinners
 * Size: 64x64 (optimized for 16px, 32px, 64px, 128px, 512px)
 * Variants: 'gradient' (default), 'flat' (for tiny sizes)
 */

interface SagaIconProps {
  className?: string
  size?: number
  variant?: 'gradient' | 'flat'
}

export default function SagaIcon({
  className = '',
  size = 64,
  variant = 'gradient'
}: SagaIconProps) {
  if (variant === 'flat') {
    // Simplified bold "S" for legibility at tiny sizes (16px-32px)
    return (
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className={className}
        aria-label="SAGA Icon"
      >
        <defs>
          <linearGradient id="iconGradientFlat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Simplified bold "S" for maximum clarity at small sizes */}
        <path
          d="M20 16h24c6 0 10 4 10 10 0 4-2 7-6 8 4 1 6 5 6 9 0 6-4 11-10 11h-24v-8h24c2 0 3-1 3-3s-1-3-3-3h-24v-8h24c2 0 3-1 3-3s-1-3-3-3h-24v-8z"
          fill="url(#iconGradientFlat)"
        />
      </svg>
    )
  }

  // Default: Stylized "S" with circle background (for larger sizes)
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-label="SAGA Icon"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill="url(#iconGradient)" />

      {/* Stylized "S" lettermark in white */}
      <path
        d="M32 12c-5.5 0-10 4.5-10 10 0 3 1.5 5.5 4 7.5l8 5c1.5 1 2.5 2.5 2.5 4.5 0 3-2.5 5.5-5.5 5.5-2 0-3.5-1-4.5-2.5l-4 3c2 3 5.5 5 8.5 5 5.5 0 10-4.5 10-10 0-3-1.5-5.5-4-7.5l-8-5c-1.5-1-2.5-2.5-2.5-4.5 0-3 2.5-5.5 5.5-5.5 2 0 3.5 1 4.5 2.5l4-3c-2-3-5.5-5-8.5-5z"
        fill="#FFFFFF"
      />

      {/* Accent arc */}
      <path
        d="M10 48c6-4 13-6 22-6 9 0 17 2 22 6"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
