# Theme Generator Skill

## Purpose
Extract design systems from reference websites and generate production-ready Tailwind CSS and CSS theme configurations for the SAGA CRM project.

## How to Use This Skill

When the user invokes `/theme-generator --reference <url>`, you should:

### Step 1: Analyze Reference Site
1. Use WebFetch to analyze the reference URL
2. Extract:
   - Color palette (primary, secondary, accent, neutral colors)
   - Typography (font families, sizes, weights, line heights)
   - Spacing scale (margins, paddings, gaps)
   - Border radius values
   - Shadow definitions
   - Gradient patterns
   - Breakpoint values

### Step 2: Generate Theme Configuration

Create a comprehensive theme file with:

**For Tailwind (tailwind.config.ts):**
```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Extracted colors
      },
      fontFamily: {
        // Extracted fonts
      },
      spacing: {
        // Custom spacing
      },
      borderRadius: {
        // Custom radius values
      },
      boxShadow: {
        // Custom shadows
      }
    }
  }
}
```

**For CSS Variables (lib/theme/variables.css):**
```css
:root {
  /* Colors */
  --color-primary: ...;

  /* Gradients */
  --gradient-hero: ...;

  /* Spacing */
  --spacing-section: ...;
}
```

### Step 3: Generate Comparison Report

Create a markdown report showing:
- Original colors vs. extracted colors
- Accessibility compliance (WCAG AA/AAA contrast ratios)
- Suggested improvements
- Usage examples

### Step 4: Output Files

Write the following files:
1. `tailwind.config.ts` (updated theme)
2. `lib/theme/variables.css` (CSS custom properties)
3. `docs/theme-analysis.md` (comparison report)

## Example Output

```markdown
# Theme Analysis Report

## Colors Extracted from convergent.org

### Primary Palette
- Electric Blue: #003bff (used for CTAs, links)
- Cyan: #0094ff (used for secondary accents)
- Magenta: #bf00ff (used for highlights)

### Accessibility Check
✅ Blue (#003bff) on white: 4.8:1 (WCAG AA Pass)
⚠️ Cyan (#0094ff) on white: 3.1:1 (WCAG AA Fail - needs darker variant)

### Gradients
1. Hero Background: linear-gradient(135deg, #003bff 0%, #0e0f11 100%)
2. Text Accent: linear-gradient(90deg, #0094ff, #bf00ff)

## Recommended Tailwind Classes

```tsx
// Primary button
className="bg-primary-blue hover:bg-primary-blue/90"

// Gradient hero section
className="bg-gradient-hero"

// Section spacing (64px)
className="gap-section"
```

## Implementation Priority

1. HIGH: Update color palette (replace current purple/pink with blue/magenta)
2. MEDIUM: Add gradient utilities
3. LOW: Refine spacing scale
```

## Best Practices

- Always check color contrast ratios
- Provide both light and dark mode variants
- Include usage examples for common patterns
- Suggest accessibility improvements
- Generate both Tailwind and CSS variable formats
