/**
 * SAGA Logo - Monochrome Light
 * Use case: Dark mode UI, dark backgrounds, footer, presentations
 * Color: #FFFFFF (White - use on dark backgrounds only)
 * Size: 240x80
 */

interface SagaLogoLightProps {
  className?: string
  width?: number
  showTagline?: boolean
}

export default function SagaLogoLight({
  className = '',
  width = 220,
  showTagline = true
}: SagaLogoLightProps) {
  return (
    <svg
      viewBox="0 0 240 80"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      className={className}
      aria-label="SAGA CRM Logo"
    >
      {/* S */}
      <path
        d="M12 52c-4-2-6-6-6-10 0-8 6-14 14-14 5 0 9 2 12 5l-5 5c-2-2-4-3-7-3-4 0-7 3-7 7 0 2 1 4 3 5l10 5c4 2 7 6 7 11 0 8-7 15-15 15-6 0-11-3-14-7l6-5c2 3 5 5 8 5 5 0 8-3 8-8 0-2-1-4-3-6l-11-5z"
        fill="#FFFFFF"
      />

      {/* A */}
      <path
        d="M68 75l-3-9h-18l-3 9h-8l16-47h8l16 47h-8zm-10-30l-6 17h12l-6-17z"
        fill="#FFFFFF"
      />

      {/* G */}
      <path
        d="M95 28c8 0 14 3 18 8l-6 5c-3-3-6-5-11-5-9 0-15 7-15 16s6 16 15 16c3 0 6-1 8-2v-9h-10v-7h17v20c-4 4-10 6-16 6-13 0-23-9-23-24s10-24 23-24z"
        fill="#FFFFFF"
      />

      {/* A */}
      <path
        d="M152 75l-3-9h-18l-3 9h-8l16-47h8l16 47h-8zm-10-30l-6 17h12l-6-17z"
        fill="#FFFFFF"
      />

      {/* CRM tagline */}
      {showTagline && (
        <text
          x="185"
          y="55"
          fontFamily="Inter, -apple-system, sans-serif"
          fontSize="14"
          fontWeight="600"
          fill="#FFFFFF"
          letterSpacing="2"
          opacity="0.9"
        >
          CRM
        </text>
      )}
    </svg>
  )
}
