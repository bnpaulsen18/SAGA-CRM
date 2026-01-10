# SAGA CRM - Logo Variation System

## 📦 5 Professional Logo Variations

All variations are implemented as React SVG components with full TypeScript support, responsive sizing, and accessibility features.

---

## 🎨 Logo Variations

### 1. **Primary Full Wordmark** (`SagaLogoPrimary`)

**File:** `components/logos/SagaLogoPrimary.tsx`

**Use Cases:**
- Main website header
- Marketing materials and presentations
- Email signatures
- Social media cover images
- Print materials (business cards, brochures)

**Features:**
- Full gradient (purple → orange)
- Includes decorative swoosh
- Optional "CRM" tagline
- Optimized for 200-250px width

**Usage:**
```tsx
import { SagaLogoPrimary } from '@/components/logos'

// Basic usage
<SagaLogoPrimary width={250} />

// Without tagline
<SagaLogoPrimary width={200} showTagline={false} />

// With custom className
<SagaLogoPrimary width={220} className="hover:opacity-90 transition-opacity" />
```

**Props:**
- `width?: number` - Logo width in pixels (default: 250)
- `showTagline?: boolean` - Show/hide "CRM" text (default: true)
- `className?: string` - Additional CSS classes

---

### 2. **Monochrome Dark** (`SagaLogoDark`)

**File:** `components/logos/SagaLogoDark.tsx`

**Use Cases:**
- Partner logo grids
- Black & white print materials
- Light-colored backgrounds
- Document footers
- Forms and official documents

**Features:**
- Single color: #0F1419 (Navy)
- WCAG AAA compliant on white (21:1 contrast)
- No gradients (perfect for print)
- Optional "CRM" tagline

**Usage:**
```tsx
import { SagaLogoDark } from '@/components/logos'

// Basic usage
<SagaLogoDark width={220} />

// Without tagline
<SagaLogoDark width={200} showTagline={false} />
```

**Props:**
- `width?: number` - Logo width in pixels (default: 220)
- `showTagline?: boolean` - Show/hide "CRM" text (default: true)
- `className?: string` - Additional CSS classes

**Accessibility:**
- Contrast ratio: 21:1 on white
- WCAG AAA compliant for all text sizes

---

### 3. **Monochrome Light** (`SagaLogoLight`)

**File:** `components/logos/SagaLogoLight.tsx`

**Use Cases:**
- Dark mode UI
- Website footer (dark background)
- Presentations with dark slides
- Video overlays
- Dark hero sections

**Features:**
- Single color: #FFFFFF (White)
- CRM tagline at 90% opacity
- WCAG AA compliant on dark backgrounds
- Optimized for dark themes

**Usage:**
```tsx
import { SagaLogoLight } from '@/components/logos'

// Basic usage (on dark background)
<div className="bg-[#0F1419] p-8">
  <SagaLogoLight width={220} />
</div>

// With drop shadow on complex backgrounds
<SagaLogoLight
  width={220}
  className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
/>
```

**Props:**
- `width?: number` - Logo width in pixels (default: 220)
- `showTagline?: boolean` - Show/hide "CRM" text (default: true)
- `className?: string` - Additional CSS classes

**Best Practices:**
- Use on backgrounds darker than #555555
- Add drop shadow on photo/complex backgrounds
- Test contrast with WebAIM Color Contrast Checker

---

### 4. **Icon Only** (`SagaIcon`)

**File:** `components/logos/SagaIcon.tsx`

**Use Cases:**
- Favicon (16x16, 32x32, 64x64)
- App icons (iOS, Android)
- Social media profile pictures
- Browser tabs
- Mobile home screen icons
- Loading spinners/avatars

**Features:**
- Square format (64x64)
- Two variants: 'gradient' (default) and 'flat'
- Works at 16px to 512px
- Gradient background with white "S"

**Usage:**
```tsx
import { SagaIcon } from '@/components/logos'

// Default gradient version (64x64)
<SagaIcon size={64} />

// Flat version for tiny sizes (16px-32px)
<SagaIcon size={32} variant="flat" />

// Custom size
<SagaIcon size={128} />

// As avatar/profile picture
<SagaIcon size={180} className="rounded-full" />
```

**Props:**
- `size?: number` - Icon size in pixels (default: 64)
- `variant?: 'gradient' | 'flat'` - Style variant (default: 'gradient')
- `className?: string` - Additional CSS classes

**Variant Guide:**
- **Gradient** (default): Use for 64px+ sizes (app icons, avatars, profile pictures)
- **Flat**: Use for 16px-32px sizes (favicon, browser tabs) for maximum clarity

**Favicon Implementation:**
```html
<!-- In app/layout.tsx or HTML head -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

---

### 5. **Compact Horizontal** (`SagaLogoCompact`)

**File:** `components/logos/SagaLogoCompact.tsx`

**Use Cases:**
- Navigation bars
- Mobile headers
- Email headers
- Application sidebars (collapsed state)
- Browser extensions
- Tight layout constraints

**Features:**
- Ultra-compact: 140x48 (120-150px width)
- Micro icon + condensed "SAGA" text
- Optional icon hiding for very small screens
- Maintains 48px height for touch targets

**Usage:**
```tsx
import { SagaLogoCompact } from '@/components/logos'

// Basic usage in nav
<nav className="flex items-center gap-4">
  <SagaLogoCompact width={140} />
</nav>

// Hide icon on very small screens
<SagaLogoCompact width={120} hideIcon={true} />

// Responsive with CSS
<SagaLogoCompact
  width={140}
  className="hidden sm:block"
/>
```

**Props:**
- `width?: number` - Logo width in pixels (default: 140)
- `hideIcon?: boolean` - Hide the micro icon (default: false)
- `className?: string` - Additional CSS classes

**Responsive Strategy:**
```tsx
// Desktop: Full compact logo (140px)
// Tablet: Compact without icon (100px)
// Mobile: Icon only (64px)

<div className="flex items-center">
  {/* Desktop */}
  <SagaLogoCompact width={140} className="hidden lg:block" />

  {/* Tablet */}
  <SagaLogoCompact width={100} hideIcon className="hidden md:block lg:hidden" />

  {/* Mobile */}
  <SagaIcon size={48} className="block md:hidden" />
</div>
```

---

## 📐 Size Guidelines

| Variation | Minimum Width | Recommended Width | Maximum Width |
|-----------|---------------|-------------------|---------------|
| Primary | 180px | 200-250px | 500px |
| Dark | 180px | 200-240px | 500px |
| Light | 180px | 200-240px | 500px |
| Icon | 16px | 64px | 512px |
| Compact | 100px | 120-150px | 200px |

---

## 🎨 Color Specifications

### Gradient (Primary, Compact)
```css
linear-gradient(to right, #764ba2, #ff6b35)
/* Purple RGB(118, 75, 162) → Orange RGB(255, 107, 53) */
```

### Monochrome Dark
```css
#0F1419 /* Navy/Charcoal */
/* RGB(15, 20, 25) */
/* Contrast on white: 21:1 (WCAG AAA) */
```

### Monochrome Light
```css
#FFFFFF /* Pure White */
/* RGB(255, 255, 255) */
/* Contrast on #0F1419: 21:1 (WCAG AAA) */
```

---

## 🔧 Implementation Examples

### Update Navigation to Use New Logos

**Before:**
```tsx
// components/DashboardLayout.tsx
<Image src="/SAGA_Logo_transparent.png" alt="SAGA CRM" width={120} height={40} />
```

**After:**
```tsx
import { SagaLogoCompact } from '@/components/logos'

<SagaLogoCompact width={140} className="h-auto" />
```

---

### Landing Page Navigation

**Light background:**
```tsx
import { SagaLogoPrimary } from '@/components/logos'

<nav className="bg-white border-b">
  <SagaLogoPrimary width={200} className="h-auto" />
</nav>
```

**Dark background:**
```tsx
import { SagaLogoLight } from '@/components/logos'

<nav className="bg-[#0F1419] border-b border-white/10">
  <SagaLogoLight width={200} className="h-auto" />
</nav>
```

---

### Footer with Monochrome Logo

```tsx
import { SagaLogoDark, SagaLogoLight } from '@/components/logos'

// Light theme footer
<footer className="bg-gray-100">
  <SagaLogoDark width={180} showTagline={false} />
</footer>

// Dark theme footer
<footer className="bg-[#0F1419]">
  <SagaLogoLight width={180} showTagline={false} />
</footer>
```

---

### Favicon Setup

1. **Create favicon files:**
```bash
# Export SagaIcon at multiple sizes
# Variant: 'flat' for 16x16 and 32x32
# Variant: 'gradient' for 180x180 (Apple touch icon)
```

2. **Add to `app/layout.tsx`:**
```tsx
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}
```

---

## 📂 File Structure

```
components/logos/
├── index.ts                    # Export all logo components
├── SagaLogoPrimary.tsx        # Full wordmark with gradient
├── SagaLogoDark.tsx           # Monochrome dark (for light bg)
├── SagaLogoLight.tsx          # Monochrome light (for dark bg)
├── SagaIcon.tsx               # Square icon (favicon, avatars)
└── SagaLogoCompact.tsx        # Compact horizontal (nav bars)

public/
├── favicon.svg                 # SagaIcon flat variant
├── favicon-16x16.png
├── favicon-32x32.png
└── apple-touch-icon.png       # 180x180 for iOS
```

---

## ✨ Usage Best Practices

### 1. **Choose the Right Variation**

| Context | Use This Variation |
|---------|-------------------|
| Main header | SagaLogoPrimary |
| Navigation bar | SagaLogoCompact |
| Dark mode UI | SagaLogoLight |
| Partner logos | SagaLogoDark |
| Favicon | SagaIcon (flat variant) |
| App icon | SagaIcon (gradient variant) |

### 2. **Maintain Clear Space**

Always maintain clear space around the logo equal to the height of the "S" letter:
```tsx
<div className="p-6"> {/* Padding = clear space */}
  <SagaLogoPrimary width={220} />
</div>
```

### 3. **Don't Modify the Logo**

❌ **Don't:**
- Stretch or distort aspect ratio
- Change colors (use provided variations)
- Add effects (shadows, outlines, etc.)
- Rotate or skew

✅ **Do:**
- Use provided variations
- Scale proportionally
- Use on appropriate backgrounds
- Add CSS transitions/hover states if needed

### 4. **Accessibility**

All logo components include:
- `aria-label="SAGA CRM Logo"` for screen readers
- Semantic SVG structure
- WCAG AA/AAA compliant contrast ratios

Test your implementation:
```tsx
// Ensure sufficient contrast
<div className="bg-white"> {/* ✅ Use SagaLogoDark or SagaLogoPrimary */}
<div className="bg-[#0F1419]"> {/* ✅ Use SagaLogoLight */}
<div className="bg-[#764ba2]"> {/* ❌ Avoid - poor contrast */}
```

---

## 🚀 Quick Start

1. **Import the logo you need:**
```tsx
import { SagaLogoPrimary, SagaIcon } from '@/components/logos'
```

2. **Use in your component:**
```tsx
export default function Header() {
  return (
    <header className="flex items-center gap-4 p-4">
      <SagaLogoPrimary width={200} />
    </header>
  )
}
```

3. **Customize as needed:**
```tsx
<SagaLogoPrimary
  width={220}
  showTagline={false}
  className="hover:opacity-90 transition-opacity cursor-pointer"
/>
```

---

## 📊 Testing Checklist

Before deploying logo updates:

- [ ] Test all 5 variations render correctly
- [ ] Verify gradient displays properly in all browsers
- [ ] Check monochrome versions on light/dark backgrounds
- [ ] Test icon at 16px, 32px, 64px, 180px sizes
- [ ] Verify compact logo works in navigation
- [ ] Test responsive behavior on mobile
- [ ] Check accessibility with screen reader
- [ ] Validate WCAG contrast ratios
- [ ] Export favicon files at required sizes
- [ ] Update all instances of old logo files

---

## 🎯 Migration Guide

### Step 1: Replace Header Logo

**Old code:**
```tsx
<Image src="/SAGA_Logo_transparent.png" alt="SAGA CRM" width={120} height={40} />
```

**New code:**
```tsx
import { SagaLogoCompact } from '@/components/logos'
<SagaLogoCompact width={140} />
```

### Step 2: Update Landing Pages

Replace logo in:
- `components/landing/shared/LandingNav.tsx`
- Footer components
- Email templates

### Step 3: Generate Favicons

Export `SagaIcon` at these sizes:
- 16x16 (flat variant)
- 32x32 (flat variant)
- 64x64 (gradient variant)
- 180x180 (gradient variant)
- 512x512 (gradient variant)

### Step 4: Update Metadata

Update `app/layout.tsx` with new favicon references.

---

**Created:** January 2026
**Status:** Production-ready
**Components:** 5 SVG React components
**Total File Size:** ~15KB (all components combined, pre-gzip)
