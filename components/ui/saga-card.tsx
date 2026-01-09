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
  const variantClasses = {
    default: 'saga-card-default',
    orange: 'saga-card-orange',
    purple: 'saga-card-purple',
    pink: 'saga-card-pink',
    warning: 'saga-card-warning'
  }

  return (
    <div
      className={`rounded-lg shadow-lg backdrop-blur-md ${variantClasses[variant]} ${className}`}
    >
      {(title || subtitle) && (
        <div
          className="px-6 py-4 border-b border-white/20"
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
