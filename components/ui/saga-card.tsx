import { ReactNode } from 'react'

interface SagaCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  variant?: 'default' | 'orange' | 'purple' | 'pink' | 'warning'
}

export default function SagaCard({
  children,
  title,
  subtitle,
  className = '',
  variant = 'default'
}: SagaCardProps) {
  const variantStyles = {
    default: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    orange: {
      background: 'rgba(255, 107, 53, 0.2)',
      border: '1px solid rgba(255, 107, 53, 0.4)'
    },
    purple: {
      background: 'rgba(118, 75, 162, 0.2)',
      border: '1px solid rgba(118, 75, 162, 0.4)'
    },
    pink: {
      background: 'rgba(180, 21, 75, 0.2)',
      border: '1px solid rgba(180, 21, 75, 0.4)'
    },
    warning: {
      background: 'rgba(255, 193, 7, 0.1)',
      border: '1px solid rgba(255, 193, 7, 0.3)'
    }
  }

  return (
    <div
      className={`rounded-lg shadow-lg ${className}`}
      style={{
        ...variantStyles[variant],
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}
    >
      {(title || subtitle) && (
        <div
          className="px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255, 107, 107, 0.2)' }}
        >
          {title && (
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-white/70 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
