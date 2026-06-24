# Gradient Builder Skill

## Purpose
Generate sophisticated, production-ready gradient CSS for backgrounds, text effects, borders, and overlays in the Convergent.org style.

## Gradient Styles

### 1. tech-modern
- Multi-stop gradients with vibrant colors
- 135deg angle (diagonal)
- Smooth color transitions
- Often includes dark fade to black

### 2. glassmorphic
- Subtle, translucent gradients
- White/color with low opacity
- Used for overlay effects
- Includes backdrop-blur

### 3. convergent (default)
- Electric blue to magenta to black
- High contrast, bold statement
- Perfect for hero sections

### 4. subtle
- Monochromatic gradients
- Low color variation
- Professional, understated

## Gradient Types

### background
Full background gradients for sections/containers

### text
Gradient text effects with background-clip

### border
Gradient borders using pseudo-elements

### overlay
Overlay gradients for glassmorphism

### animated
CSS animation keyframes for moving gradients

## How to Use This Skill

When invoked with `/gradient-builder --style convergent --colors blue,magenta,black`, you should:

### Step 1: Parse Input
- Extract style type
- Parse color values (names or hex codes)
- Determine gradient type (default: background)

### Step 2: Generate Gradient CSS

**For Background Gradients:**
```css
.gradient-hero {
  background: linear-gradient(135deg,
    #003bff 0%,
    #bf00ff 50%,
    #0e0f11 100%
  );
}
```

**For Text Gradients:**
```css
.text-gradient {
  background: linear-gradient(90deg, #003bff, #bf00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**For Border Gradients:**
```css
.gradient-border {
  position: relative;
  background: white;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, #003bff, #bf00ff);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

**For Animated Gradients:**
```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-animated {
  background: linear-gradient(
    270deg,
    #003bff,
    #bf00ff,
    #0094ff
  );
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}
```

### Step 3: Generate Tailwind Utilities

Add to `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    backgroundImage: {
      'gradient-hero': 'linear-gradient(135deg, #003bff 0%, #bf00ff 50%, #0e0f11 100%)',
      'gradient-text': 'linear-gradient(90deg, #003bff, #bf00ff)',
      'gradient-subtle': 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
    }
  }
}
```

### Step 4: Generate Usage Examples

```tsx
// Background gradient
<section className="bg-gradient-hero min-h-screen" />

// Text gradient
<h1 className="text-6xl font-bold bg-gradient-text bg-clip-text text-transparent">
  Gradient Text
</h1>

// Animated gradient
<div className="gradient-animated p-8 rounded-xl" />
```

### Step 5: Output Files

Create:
1. `lib/theme/gradients.css` (gradient classes)
2. `tailwind.config.ts` (updated with gradient utilities)
3. `docs/gradient-examples.md` (usage guide with previews)

## Color Parsing

Support multiple formats:
- Named colors: "blue", "magenta", "black"
- Hex codes: "#003bff", "#bf00ff"
- RGB: "rgb(0, 59, 255)"
- HSL: "hsl(228, 100%, 50%)"

## Accessibility Considerations

- Check gradient contrast for text overlays
- Ensure text gradients have fallback solid color
- Test gradients in dark mode
- Provide prefers-reduced-motion alternatives for animations

## Example Complete Output

```markdown
# Gradient Build Complete

## Generated Gradients

### Hero Background
\`\`\`css
background: linear-gradient(135deg, #003bff 0%, #bf00ff 50%, #0e0f11 100%);
\`\`\`

**Tailwind class:** `bg-gradient-hero`

**Usage:**
\`\`\`tsx
<section className="bg-gradient-hero py-24">
  <h1 className="text-white">Welcome</h1>
</section>
\`\`\`

### Accessibility
✅ White text on gradient: Minimum 7.8:1 contrast (WCAG AAA)

### Dark Mode
Same gradient works in dark mode (already dark base)
```
