/**
 * SAGA Logo - Compact Horizontal
 * Use case: Navigation bars, mobile headers, email headers, tight spaces
 * Size: 140x48 (optimized for 120-150px width)
 * Features: Micro icon + condensed wordmark
 */

interface SagaLogoCompactProps {
  className?: string
  width?: number
  hideIcon?: boolean
}

export default function SagaLogoCompact({
  className = '',
  width = 140,
  hideIcon = false
}: SagaLogoCompactProps) {
  return (
    <svg
      viewBox="0 0 140 48"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      className={className}
      aria-label="SAGA CRM Logo"
    >
      <defs>
        <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Micro icon (simplified S) - hide on very small screens */}
      {!hideIcon && (
        <g className="compact-logo-icon">
          {/* Background circle */}
          <circle cx="18" cy="24" r="16" fill="url(#compactGradient)" opacity="0.15" />

          {/* Simplified S */}
          <path
            d="M18 10c-3.5 0-6.5 3-6.5 6.5 0 2 1 3.5 2.5 5l5 3c1 0.5 1.5 1.5 1.5 3 0 2-1.5 3.5-3.5 3.5-1.5 0-2.5-0.5-3-1.5l-2.5 2c1.5 2 3.5 3 6 3 3.5 0 6.5-3 6.5-6.5 0-2-1-3.5-2.5-5l-5-3c-1-0.5-1.5-1.5-1.5-3 0-2 1.5-3.5 3.5-3.5 1.5 0 2.5 0.5 3 1.5l2.5-2c-1.5-2-3.5-3-6-3z"
            fill="url(#compactGradient)"
          />
        </g>
      )}

      {/* SAGA wordmark (condensed) */}
      <text
        x={hideIcon ? "10" : "42"}
        y="32"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="url(#compactGradient)"
        letterSpacing="-0.5"
      >
        SAGA
      </text>
    </svg>
  )
}
