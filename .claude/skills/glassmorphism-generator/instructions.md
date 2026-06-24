# Glassmorphism Component Generator Skill

## Purpose
Generate production-ready glassmorphic UI components with backdrop blur effects, subtle borders, and proper layering for the Convergent.org-style modern interface.

## Component Types

### card
Content cards with glass effect

### modal
Dialog/modal overlays

### navigation
Header/sidebar navigation

### stat-box
Metric display boxes (like Convergent's data visualizations)

### hero-overlay
Hero section glass overlays

### button
Glassmorphic button variants

## Glassmorphism Principles

1. **Backdrop Blur** - Essential for glass effect (8-20px)
2. **Transparency** - Semi-transparent backgrounds (5-15% opacity)
3. **Subtle Borders** - Light borders with opacity (10-20%)
4. **Layering** - Proper z-index management
5. **Contrast** - Ensure readability with background

## How to Use This Skill

When invoked with `/glassmorphism --type card --blur 12px --opacity 0.1`, you should:

### Step 1: Parse Parameters
- Component type (card, modal, etc.)
- Blur amount (default: 12px)
- Opacity (default: 0.05-0.1)
- Style variant (default: convergent)

### Step 2: Generate Component Code

**For Card Component:**
```tsx
// components/ui/GlassCard.tsx
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassCard({
  children,
  className = '',
  blur = 'md'
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',   // 4px
    md: 'backdrop-blur-md',   // 12px
    lg: 'backdrop-blur-lg',   // 16px
    xl: 'backdrop-blur-xl',   // 24px
  };

  return (
    <div className={`
      relative overflow-hidden rounded-[27px]
      border border-white/10
      bg-white/5
      ${blurClasses[blur]}
      shadow-lg shadow-black/10
      transition-all duration-300
      hover:bg-white/10 hover:border-white/20
      ${className}
    `}>
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
}
```

**For Modal Component:**
```tsx
// components/ui/GlassModal.tsx
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function GlassModal({ isOpen, onClose, children, title }: GlassModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="
          relative overflow-hidden rounded-[27px]
          border border-white/20
          bg-gradient-to-br from-white/10 to-white/5
          backdrop-blur-xl
          shadow-2xl shadow-black/50
        ">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**For Stat Box Component:**
```tsx
// components/ui/GlassStatBox.tsx
interface GlassStatBoxProps {
  value: string | number;
  label: string;
  gradient?: string;
  icon?: React.ReactNode;
}

export function GlassStatBox({
  value,
  label,
  gradient = 'from-blue-500 to-purple-500',
  icon
}: GlassStatBoxProps) {
  return (
    <div className="
      relative overflow-hidden rounded-[15px]
      border border-white/20
      bg-white/5
      backdrop-blur-md
      p-6
      transition-all duration-300
      hover:bg-white/10 hover:scale-105
      group
    ">
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-white/60 group-hover:text-white transition-colors">
          {icon}
        </div>
      )}

      {/* Value with gradient */}
      <div className={`
        text-4xl font-bold mb-2
        bg-gradient-to-r ${gradient}
        bg-clip-text text-transparent
      `}>
        {value}
      </div>

      {/* Label */}
      <div className="text-sm text-white/70">
        {label}
      </div>

      {/* Animated glow effect */}
      <div className="
        absolute inset-0 rounded-[15px]
        bg-gradient-to-br from-white/0 via-white/5 to-white/0
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      " />
    </div>
  );
}
```

### Step 3: Generate Tailwind Extensions

```typescript
// tailwind.config.ts additions
theme: {
  extend: {
    backdropBlur: {
      xs: '2px',
    },
    borderRadius: {
      'glass-card': '27px',
      'glass-sm': '15px',
    },
    backgroundColor: {
      'glass-light': 'rgba(255, 255, 255, 0.05)',
      'glass-lighter': 'rgba(255, 255, 255, 0.1)',
    },
    borderColor: {
      'glass': 'rgba(255, 255, 255, 0.1)',
      'glass-strong': 'rgba(255, 255, 255, 0.2)',
    }
  }
}
```

### Step 4: Generate CSS Utilities

```css
/* lib/theme/glassmorphism.css */

/* Glass effect presets */
.glass-effect {
  @apply backdrop-blur-xl bg-white/5 border border-white/10;
}

.glass-effect-strong {
  @apply backdrop-blur-xl bg-white/10 border border-white/20;
}

.glass-effect-subtle {
  @apply backdrop-blur-md bg-white/5 border border-white/5;
}

/* Dark mode variants */
@media (prefers-color-scheme: dark) {
  .glass-effect {
    @apply bg-black/20 border-white/10;
  }
}

/* Performance optimization */
@supports (backdrop-filter: blur(12px)) {
  .glass-effect {
    backdrop-filter: blur(12px);
  }
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(12px)) {
  .glass-effect {
    @apply bg-white/20;
  }
}
```

### Step 5: Accessibility Considerations

- **Contrast Ratios**: Ensure text meets WCAG AA (4.5:1)
- **Focus States**: Add visible focus rings
- **Reduced Motion**: Disable animations for `prefers-reduced-motion`
- **Browser Support**: Provide fallbacks for `backdrop-filter`

```tsx
// Accessible glass button
<button className="
  glass-effect
  px-6 py-3 rounded-lg
  text-white font-medium
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  focus:ring-offset-black
  transition-all duration-200
  motion-reduce:transition-none
">
  Click me
</button>
```

### Step 6: Generate Usage Guide

Create `docs/glassmorphism-guide.md`:

```markdown
# Glassmorphism Component Library

## Quick Start

\`\`\`tsx
import { GlassCard, GlassModal, GlassStatBox } from '@/components/ui';

// Basic card
<GlassCard>
  <h3 className="text-white text-xl mb-2">Title</h3>
  <p className="text-white/70">Content goes here</p>
</GlassCard>

// Stat box
<GlassStatBox
  value="$500M+"
  label="Raised"
  gradient="from-blue-500 to-cyan-500"
/>
\`\`\`

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Fallback: Solid background with higher opacity

## Performance

- Uses GPU-accelerated backdrop-filter
- Optimized for 60fps animations
- Minimal re-paints with proper layering
```

### Step 7: Output Files

Generate:
1. `components/ui/GlassCard.tsx`
2. `components/ui/GlassModal.tsx`
3. `components/ui/GlassStatBox.tsx`
4. `lib/theme/glassmorphism.css`
5. `docs/glassmorphism-guide.md`
6. Update `tailwind.config.ts` with new utilities

## Testing Checklist

- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify contrast ratios with WebAIM tool
- [ ] Test with backdrop images/gradients
- [ ] Check performance (should maintain 60fps)
- [ ] Test dark mode
- [ ] Verify keyboard navigation
- [ ] Test with reduced motion enabled
