# Production Assets Checklist

Before deploying to production, you need to create the following marketing assets for social media previews and SEO.

---

## 🎨 Required Images

### 1. Open Graph Image (Facebook/LinkedIn)
**File:** `/public/og-image.png`

**Specifications:**
- **Dimensions:** 1200×630px
- **Format:** PNG or JPG
- **File size:** < 8 MB
- **Purpose:** Preview card when sharing on Facebook, LinkedIn, Slack, etc.

**Design Guidelines:**
- Feature SAGA CRM branding with gradient (#764ba2 → #ff6b35)
- Include tagline: "Nonprofit Donor Management Platform"
- Use clean, modern typography
- Ensure text is readable at small sizes
- Test preview at [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

**Recommended Content:**
```
SAGA CRM
━━━━━━━━━━━━━━━━━━
Empower Your Mission

Modern Donor Management
Built for Nonprofits

✓ Track Donations
✓ Manage Contacts
✓ Run Campaigns
✓ AI-Powered Insights
```

---

### 2. Twitter/X Card Image
**File:** `/public/twitter-image.png`

**Specifications:**
- **Dimensions:** 1200×675px (16:9 aspect ratio)
- **Format:** PNG or JPG
- **File size:** < 5 MB
- **Purpose:** Preview card when sharing on Twitter/X

**Design Guidelines:**
- Similar to OG image but optimized for 16:9 ratio
- Test preview at [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- More horizontal space available - use it for additional messaging

---

## 📝 Metadata Updates

### Twitter/X Handle
**File:** `app/layout.tsx:64`

**Current:** `@sagacrm`
**Action:** Update with your actual Twitter/X handle before launch

**Example:**
```typescript
creator: "@yourhandle", // Replace @sagacrm with your actual handle
```

---

## 🛠️ Design Tools

### Option 1: Figma (Recommended)
1. Use [Figma](https://figma.com) (free tier available)
2. Create artboards:
   - OG Image: 1200×630px
   - Twitter Card: 1200×675px
3. Use SAGA gradient: Linear gradient from #764ba2 to #ff6b35
4. Export as PNG with 2x resolution for crisp display

### Option 2: Canva
1. Use [Canva](https://canva.com) with custom dimensions
2. OG Image template: Facebook Post (1200×630px)
3. Twitter Card template: Twitter Post (1200×675px)
4. Export as PNG

### Option 3: Adobe Express / Photoshop
1. Create new document with specified dimensions
2. Design with SAGA branding
3. Export optimized PNGs

---

## 📥 Asset Placement

1. **Save images to:** `/public/` directory
   - `public/og-image.png`
   - `public/twitter-image.png`

2. **Verify metadata references:**
   - `app/layout.tsx` lines 51, 63

3. **Test locally:**
   - Start dev server: `npm run dev`
   - View page source: Look for `<meta property="og:image">`
   - Verify image paths are correct

---

## ✅ Pre-Launch Validation

### Test Open Graph Tags

1. **Facebook Sharing Debugger:**
   - URL: https://developers.facebook.com/tools/debug/
   - Enter your production URL
   - Click "Scrape Again" to refresh cache
   - Verify image displays correctly

2. **LinkedIn Post Inspector:**
   - URL: https://www.linkedin.com/post-inspector/
   - Enter your production URL
   - Check image preview

3. **Twitter Card Validator:**
   - URL: https://cards-dev.twitter.com/validator
   - Enter your production URL
   - Verify card displays correctly

### Test Image Loading

```bash
# After deploying to production
curl -I https://yourdomain.com/og-image.png
curl -I https://yourdomain.com/twitter-image.png

# Should return 200 OK
```

---

## 🎯 Current Status

- ✅ Metadata structure configured in `app/layout.tsx`
- ✅ Image paths defined
- ⏳ **TODO:** Create og-image.png (1200×630px)
- ⏳ **TODO:** Create twitter-image.png (1200×675px)
- ⏳ **TODO:** Update Twitter handle to actual handle
- ⏳ **TODO:** Test social media previews after deployment

---

## 📊 Impact

**Why This Matters:**
- **30-50% higher click-through** rates with proper OG images
- **Professional appearance** when shared on social media
- **Increased trust** and brand recognition
- **Better SEO** through complete metadata

---

## 🚀 Quick Start Templates

### DIY with SAGA Logo

If you have the SAGA logo (`SAGA_Logo_final.png`):

1. **OG Image (1200×630):**
   - Background: Gradient #764ba2 → #ff6b35
   - Logo: Centered, 300px width
   - Text below: "Nonprofit Donor Management Platform"
   - Bottom text: "Manage donors • Track donations • Run campaigns"

2. **Twitter Image (1200×675):**
   - Same design, adjusted for 16:9 ratio
   - Logo on left, text on right
   - More horizontal space for additional features

---

## 💡 Tips

- **Keep it simple:** Don't overcrowd the image
- **High contrast:** Ensure text is readable
- **Test at small sizes:** Images appear as small thumbnails
- **Use brand colors:** Maintain SAGA gradient consistency
- **Include CTA:** Subtle call-to-action can help

---

## 📞 Need Help?

If you need design assistance:
1. Hire a freelancer on Fiverr/Upwork ($20-50)
2. Use AI image generators (Midjourney, DALL-E)
3. Ask the AI to create simple gradient images with text overlay
4. Use existing SAGA branding assets as reference

---

## Priority

**Priority:** Medium (Complete before public launch)

**Timeline:** 1-2 hours (including design + testing)

**Blocker:** No - Site will work without these, but social sharing will be less effective
