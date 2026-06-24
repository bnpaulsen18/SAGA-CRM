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
      className={`rounded-xl ${variantClasses[variant]} ${className}`}
    >
      {(title || subtitle) && (
        <div
          className="px-6 py-4 border-b border-[var(--line)]"
        >
          {title && (
            <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-[var(--ink-soft)] mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
