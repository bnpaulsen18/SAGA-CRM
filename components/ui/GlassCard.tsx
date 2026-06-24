import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export function GlassCard({
  children,
  className = '',
  blur = 'md',
  hover = true
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',   // 4px
    md: 'backdrop-blur-md',   // 12px
    lg: 'backdrop-blur-lg',   // 16px
    xl: 'backdrop-blur-xl',   // 24px
  };

  const hoverClass = hover ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]' : '';

  return (
    <div className={`
      relative overflow-hidden rounded-[27px]
      border border-white/10
      bg-white/5
      ${blurClasses[blur]}
      shadow-lg shadow-black/10
      transition-all duration-300
      ${hoverClass}
      ${className}
    `}>
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
