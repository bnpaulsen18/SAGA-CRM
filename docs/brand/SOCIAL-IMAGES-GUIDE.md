# Social Media Images Guide

Create professional Open Graph (OG) and Twitter Card images for SAGA CRM to ensure beautiful link previews when sharing on social media.

---

## Required Images

### 1. Open Graph Image
**File:** `public/og-image.png`
**Dimensions:** 1200 x 630 pixels
**Aspect Ratio:** 1.91:1
**Format:** PNG (recommended) or JPG
**Max File Size:** 8MB (recommended: <300KB)
**Used by:** Facebook, LinkedIn, Discord, Slack, and most social platforms

### 2. Twitter Card Image
**File:** `public/twitter-image.png`
**Dimensions:** 1200 x 675 pixels
**Aspect Ratio:** 16:9
**Format:** PNG (recommended) or JPG
**Max File Size:** 5MB (recommended: <300KB)
**Used by:** Twitter/X

---

## Design Specifications

### Brand Colors

```css
/* Primary Gradient */
background: linear-gradient(135deg, #764ba2 0%, #ff6b35 100%);

/* Purple */
#764ba2 (118, 75, 162)

/* Orange */
#ff6b35 (255, 107, 53)

/* Dark Background (for contrast) */
#0f1419 (15, 20, 25)
#1a1a2e (26, 26, 46)

/* Text Colors */
White: #ffffff
Light Gray: rgba(255, 255, 255, 0.7)
```

### Typography

**Primary Font:** Inter, -apple-system, system-ui
**Weights:**
- Bold: 700 (for main title)
- Semibold: 600 (for tagline)
- Regular: 400 (for small text)

**Recommended Text Sizes:**
- Main Title: 72-96px
- Tagline: 36-48px
- Small Text: 24-28px

---

## Content Requirements

### Primary Text
```
SAGA CRM
```

### Tagline (Choose one or create similar)
```
Donor Management & Fundraising Platform
```

or

```
Empower Your Nonprofit with Smart Donor Management
```

or

```
Built for Nonprofits. Powered by Community.
```

### Optional Footer Text
```
saga-crm.com
```

---

## Design Layout Recommendations

### Layout Option 1: Centered Hero
```
┌─────────────────────────────────────┐
│                                     │
│         [Purple-Orange              │
│          Gradient Background]       │
│                                     │
│           🎯 SAGA CRM              │
│                                     │
│    Donor Management & Fundraising   │
│            Platform                 │
│                                     │
│         saga-crm.com               │
│                                     │
└─────────────────────────────────────┘
```

### Layout Option 2: Split Design
```
┌─────────────────────────────────────┐
│                    │                │
│  SAGA CRM          │   [Icon or    │
│                    │    Visual      │
│  Donor Management  │    Element]    │
│  & Fundraising     │                │
│                    │                │
│  saga-crm.com     │                │
│                    │                │
└─────────────────────────────────────┘
```

### Layout Option 3: Gradient Overlay
```
┌─────────────────────────────────────┐
│  [Background: Dark gradient]        │
│                                     │
│                                     │
│  SAGA CRM                          │
│  Donor Management & Fundraising     │
│  Platform                          │
│                                     │
│  [Gradient accent bar]             │
│                                     │
└─────────────────────────────────────┘
```

---

## Design Tools

### Option 1: Figma (Recommended)
**Best for:** Professional designers, team collaboration

1. **Create new file**: 1200x630 for OG, 1200x675 for Twitter
2. **Set background**: Apply purple-to-orange gradient
3. **Add text layers**: Use Inter font (or similar sans-serif)
4. **Export**: File → Export → PNG @ 2x

**Template:** [Download Figma Template](#) (create from scratch using specs above)

### Option 2: Canva (Easiest)
**Best for:** Non-designers, quick creation

1. Go to [canva.com](https://canva.com)
2. Create custom size: 1200x630px (OG) or 1200x675px (Twitter)
3. Background → Gradient → Custom gradient:
   - Color 1: `#764ba2` (top-left)
   - Color 2: `#ff6b35` (bottom-right)
4. Add text → Choose bold sans-serif font (Montserrat, Poppins, or Inter)
5. Download → PNG

### Option 3: Adobe Photoshop/Illustrator
**Best for:** Advanced design work

1. New document: 1200x630px @ 72 DPI
2. Create gradient layer (purple to orange, 135° angle)
3. Add text with layer styles
4. Export → Export As → PNG

### Option 4: Code-Based (HTML/CSS + Puppeteer)
**Best for:** Developers, automated generation

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      width: 1200px;
      height: 630px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #764ba2 0%, #ff6b35 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      text-align: center;
    }
    h1 {
      font-size: 96px;
      font-weight: 700;
      margin: 0 0 20px 0;
      letter-spacing: -2px;
    }
    p {
      font-size: 42px;
      font-weight: 600;
      margin: 0;
      opacity: 0.9;
    }
    .footer {
      position: absolute;
      bottom: 40px;
      font-size: 28px;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <h1>SAGA CRM</h1>
  <p>Donor Management & Fundraising Platform</p>
  <div class="footer">saga-crm.com</div>
</body>
</html>
```

Then use Puppeteer to take a screenshot:
```javascript
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(htmlContent);
await page.screenshot({ path: 'og-image.png' });
await browser.close();
```

---

## Step-by-Step Creation (Canva)

### For Open Graph Image (1200x630)

1. **Go to Canva** and create a custom size design (1200 x 630 px)

2. **Set Background Gradient**
   - Click "Background" in left sidebar
   - Choose "Gradient"
   - Click on gradient → "Customize"
   - Set Color 1: `#764ba2` (purple)
   - Set Color 2: `#ff6b35` (orange)
   - Adjust angle to 135° (diagonal)

3. **Add Main Title**
   - Click "Text" → "Add a heading"
   - Type: `SAGA CRM`
   - Font: **Montserrat Bold** or **Poppins Bold**
   - Size: 96px
   - Color: White (`#ffffff`)
   - Position: Center, upper third

4. **Add Tagline**
   - Add another text box
   - Type: `Donor Management & Fundraising Platform`
   - Font: Same as title, but Semibold
   - Size: 42px
   - Color: White with 90% opacity
   - Position: Below title

5. **Add Footer (Optional)**
   - Small text box at bottom
   - Type: `saga-crm.com`
   - Size: 28px
   - Color: White with 70% opacity

6. **Download**
   - Click "Share" → "Download"
   - Format: PNG
   - Quality: Standard
   - Save as: `og-image.png`

### For Twitter Image (1200x675)

Repeat the same steps but create a 1200 x 675 px canvas. Save as `twitter-image.png`.

---

## File Placement

After creating the images, place them in the `public` folder:

```
public/
├── og-image.png       (1200x630)
└── twitter-image.png  (1200x675)
```

The images are already configured in `app/layout.tsx` and will automatically be used for social media link previews.

---

## Verification

### Test Open Graph (Facebook/LinkedIn)

1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your production URL: `https://your-domain.com`
3. Click "Debug"
4. Verify:
   - ✅ Image appears correctly
   - ✅ Title: "SAGA CRM"
   - ✅ Description shows
   - ✅ Image dimensions: 1200x630

### Test Twitter Card

1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your production URL
3. Click "Preview card"
4. Verify:
   - ✅ Summary large image card type
   - ✅ Image appears correctly
   - ✅ Image dimensions: 1200x675

### Test Discord/Slack

1. Paste your production URL into Discord or Slack
2. Verify the link preview shows your OG image correctly

---

## Optimization Tips

### File Size Optimization

After creating your images, optimize them to reduce file size:

**Option 1: TinyPNG**
- Go to [tinypng.com](https://tinypng.com)
- Upload your PNG images
- Download optimized versions (typically 60-80% smaller)

**Option 2: ImageOptim (Mac) or Squoosh (Web)**
- [ImageOptim](https://imageoptim.com/) - Mac app
- [Squoosh](https://squoosh.app/) - Web-based, works on all platforms

**Target file sizes:**
- OG image: <300KB (ideal: <150KB)
- Twitter image: <300KB (ideal: <150KB)

### Quality Checklist

Before finalizing, check:
- [ ] Text is readable at small sizes (mobile preview)
- [ ] Colors match brand gradient exactly
- [ ] No pixelation or blur
- [ ] File size is optimized (<300KB)
- [ ] White text has good contrast on gradient background
- [ ] Images are saved as PNG (not JPG, to preserve text clarity)

---

## Advanced: Dynamic OG Images

For dynamic Open Graph images (e.g., per campaign or organization), you can use:

### Vercel OG Image Generation

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'SAGA CRM';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #764ba2 0%, #ff6b35 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter',
        }}
      >
        <h1 style={{ fontSize: 96, fontWeight: 700 }}>{title}</h1>
        <p style={{ fontSize: 42, opacity: 0.9 }}>
          Donor Management & Fundraising Platform
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

Then use in metadata:
```typescript
export const metadata = {
  openGraph: {
    images: [`/api/og?title=${encodeURIComponent(campaign.name)}`],
  },
};
```

---

## Examples for Inspiration

### Similar Nonprofit Tech Platforms

**Givebutter:**
- Clean gradient backgrounds
- Bold typography
- Clear value proposition

**Classy:**
- Professional, corporate feel
- Photography + overlay
- Strong branding

**Donorbox:**
- Colorful, vibrant
- Icon-based
- Modern design

### Design Principles

1. **Keep it simple**: Don't overcrowd the image
2. **High contrast**: Ensure text is easily readable
3. **Brand consistency**: Use exact brand colors
4. **Mobile-friendly**: Remember these display small on mobile
5. **Professional**: Reflects SAGA's enterprise focus

---

## Quick Reference

| Specification | Open Graph | Twitter Card |
|--------------|-----------|-------------|
| **Dimensions** | 1200 x 630px | 1200 x 675px |
| **Aspect Ratio** | 1.91:1 | 16:9 |
| **Format** | PNG | PNG |
| **Max Size** | 8MB | 5MB |
| **Recommended** | <300KB | <300KB |
| **File Name** | `og-image.png` | `twitter-image.png` |
| **Location** | `public/` | `public/` |

---

## Need Help?

**Design Resources:**
- [Canva](https://canva.com) - Easy drag-and-drop design
- [Figma](https://figma.com) - Professional design tool
- [Unsplash](https://unsplash.com) - Free stock photos (if needed)

**Social Media Testing:**
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

**Color Tools:**
- [Coolors](https://coolors.co) - Gradient generator
- [ColorSpace](https://mycolor.space) - Palette generator

---

**Once you've created the images, place them in the `public` folder and test using the verification steps above. Your social media link previews will look professional and on-brand! 🎨**
