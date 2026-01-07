# 🎨 Asset Preparation Guide

**Status:** In Progress  
**Date:** January 7, 2026  
**Purpose:** Convert and organize Nano Banana generated assets for production use

---

## 📂 CURRENT ASSET INVENTORY

### Generated Assets (Nano Banana Pro)

**Location:** `assets/gemini/`
- [x] gemini_sample_logo_1.png
- [x] gemini_sample_logo_2.png
- [x] gemini_sample_logo_3.png
- [x] gemini_audio_speaker_icon.png
- [x] gemini_document_achieved_badge.png
- [x] gemini_flashcard_icon.png
- [x] gemini_home_screen_mockup.png
- [x] gemini_pdf_icon.png
- [x] gemini_results_screen_mockup.png
- [x] gemini_simplification_icon.png
- [x] gemini_streak_badge_icon.png
- [x] gemini_visual_aid_icon.png

**Location:** `assets/adobe/`
- [x] adobe_sample_logo_1.png
- [x] adobe_sample_logo_2.png
- [x] adobe_sample_logo_3.png
- [x] adobe_pdf_icon.svg ✅ (already SVG!)
- [x] adobe_audio_speaker_icon.png
- [x] abode_streak_badge_icon.png
- [x] adobe_document_mastered_badge.png
- [x] adobe_flashcard_icon.png
- [x] adobe_pdf_icon.png
- [x] adobe_simplification_icon.png
- [x] flashcard_icon-removebg.png ✅ (background already removed!)

**Location:** `assets/icons/` (organized by you)
- [x] sample_logo_1.png
- [x] sample_logo_2.png
- [x] sample_logo_3.png
- [x] adobe_pdf_icon.svg ✅
- [x] audio_speaker_icon.png
- [x] document_mastered_badge.png
- [x] flashcard_icon.png
- [x] pdf_icon.png
- [x] streak_badge_icon.png

---

## ✅ ASSET PREPARATION CHECKLIST

### Phase 1: Choose Best Variants
- [ ] **App Logo:** Which logo? (1, 2, or 3)
  - [ ] Review all 3 in light mode
  - [ ] Review all 3 in dark mode
  - [ ] Choose winner

- [ ] **Icons:** Which source? (Gemini or Adobe versions)
  - [ ] Compare quality
  - [ ] Check which ones already have backgrounds removed

### Phase 2: Convert Icons to SVG
**Tools:** Figma, Adobe Illustrator, or online converter

**Icons that need SVG conversion:**
1. [ ] audio_speaker_icon.png → audio_speaker_icon.svg
2. [ ] flashcard_icon.png → flashcard_icon.svg
3. [ ] streak_badge_icon.png → streak_badge_icon.svg
4. [ ] document_mastered_badge.png → document_mastered_badge.svg

**Steps (Figma):**
1. Import PNG to Figma
2. Remove background (if not already removed)
3. Trace as vector (use "Vectorize" plugin)
4. Export as SVG
5. Optimize SVG with SVGOMG.com

**Steps (Adobe Illustrator):**
1. Open PNG in Illustrator
2. Image → Image Trace → High Fidelity Photo
3. Expand traced object
4. Delete background layer
5. Export as SVG (Presentation Attributes)

### Phase 3: Remove Backgrounds (PNG Icons)
**Tool:** Figma or Photoshop or remove.bg

**Icons that need background removal:**
- Check each PNG icon
- Remove white/colored backgrounds
- Keep only icon itself with transparency
- Save as PNG-24 with alpha channel

### Phase 4: Optimize Images
**Tool:** TinyPNG.com or ImageOptim (Mac)

**Target Sizes:**
- App icon (1024x1024): ~500KB max
- Splash screen (1200x1200): ~800KB max
- Feature icons (256x256): ~50KB max
- Hero banner (1200x400): ~300KB max
- Screenshots (750x1334): ~200KB max

**Process:**
1. Go to tinypng.com
2. Upload PNG images (up to 20 at once)
3. Download compressed versions
4. Replace originals

### Phase 5: Create Required Assets

**App Icon** (`assets/icon.png`)
- Size: 1024x1024 pixels
- Format: PNG
- Must work on: White background, black background, colored backgrounds
- No transparency (solid background)
- Square with rounded corners applied by OS

**Splash Screen** (`assets/splash-icon.png`)
- Size: 1200x1200 pixels (will be centered on any screen)
- Format: PNG
- Can have transparency
- Will show during app launch

**Adaptive Icon** (`assets/adaptive-icon.png`)
- Size: 1024x1024 pixels
- Format: PNG
- Android only - center 66% is safe zone
- Outer edges may be cropped

**Favicon** (`assets/favicon.png`)
- Size: 48x48 pixels
- Format: PNG
- For web version

### Phase 6: Organize Final Structure

```
assets/
├── icon.png                    # 1024x1024 app icon (REQUIRED)
├── splash-icon.png             # 1200x1200 splash screen (REQUIRED)
├── adaptive-icon.png           # 1024x1024 Android adaptive (REQUIRED)
├── favicon.png                 # 48x48 web favicon (REQUIRED)
│
├── icons/                      # UI feature icons
│   ├── pdf.svg                 # SVG version (preferred)
│   ├── pdf.png                 # PNG fallback
│   ├── audio.svg
│   ├── audio.png
│   ├── flashcard.svg
│   ├── flashcard.png
│   ├── simplification.svg
│   ├── simplification.png
│   ├── visual-aid.svg
│   ├── visual-aid.png
│   ├── streak-badge.svg
│   └── document-badge.svg
│
├── images/                     # Marketing/hero images
│   ├── hero-banner.png         # 1200x400 for README
│   ├── home-screen.png         # Screenshot mockup
│   ├── results-screen.png      # Screenshot mockup
│   └── feature-showcase.png    # Optional
│
├── samples/                    # Existing sample content (don't touch)
│   ├── biology_cells/
│   ├── chemistry_atoms/
│   └── ...
│
└── gemini/                     # Keep originals as backup
└── adobe/                      # Keep originals as backup
```

---

## 🛠️ RECOMMENDED WORKFLOW

### Today (Day 1 - 2 hours)
1. **Choose best logo** (15 min)
   - Open all 3 logos side-by-side
   - Test in light/dark mode
   - Pick winner

2. **Create app icon** (30 min)
   - Take chosen logo
   - Resize to 1024x1024
   - Add solid background if needed
   - Save as `assets/icon.png`
   - Test in `app.json`

3. **Create splash screen** (15 min)
   - Use same logo
   - Center on 1200x1200 canvas
   - Save as `assets/splash-icon.png`

4. **Convert 3-4 icons to SVG** (1 hour)
   - Start with most important: pdf, audio, flashcard
   - Use Figma or Illustrator
   - Save to `assets/icons/`

### Tomorrow (Day 2 - 1 hour)
5. **Convert remaining icons to SVG**
   - Finish all feature icons

6. **Optimize all images**
   - Run through TinyPNG
   - Replace in `assets/icons/` and `assets/images/`

7. **Update app.json**
   - Point to new icon/splash

8. **Test in simulator**
   - See if icon shows correctly
   - Check splash screen

---

## 📱 INTEGRATION CHECKLIST

### Update `app.json`
```json
{
  "expo": {
    "name": "Elimu AI",
    "slug": "elimu-ai",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#5B47ED"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#5B47ED"
      }
    }
  }
}
```

### Update Feature Icons in Code

**Example: PDF Upload Icon**
```typescript
// OLD (placeholder)
<Ionicons name="document" size={24} color="purple" />

// NEW (custom icon)
<Image source={require('@/assets/icons/pdf.png')} style={{ width: 24, height: 24 }} />
// OR (if SVG)
import PdfIcon from '@/assets/icons/pdf.svg';
<PdfIcon width={24} height={24} />
```

**Files to update:**
- `app/index.tsx` - Home screen icons
- `app/upload.tsx` - Upload screen icons
- `app/results.tsx` - Tab icons
- `app/settings.tsx` - Settings icons

### Update README.md

```markdown
# Elimu AI - Accessible Education for All

![Elimu AI Hero](assets/images/hero-banner.png)

## Features

📄 **PDF Processing** - Upload any document  
🎯 **AI Simplification** - Complex → Simple  
🔊 **Text-to-Speech** - Listen to content  
📚 **Study Tools** - Flashcards & quizzes  
```

---

## 🎨 DESIGN TIPS

### App Icon Best Practices
✅ **DO:**
- Keep it simple (3 elements max)
- Use high contrast
- Test at 16x16 (smallest size)
- Make it recognizable instantly
- Use your brand colors (#5B47ED purple)

❌ **DON'T:**
- Use thin lines (<2px)
- Add too much detail
- Use text/words
- Make it too dark (hard to see in dark mode)

### Icon Consistency
- All icons same style (outline vs filled)
- Same stroke width (2-3px)
- Same color scheme
- Same level of detail

---

## 🧪 TESTING CHECKLIST

### Before Committing Assets
- [ ] App icon shows in iOS simulator
- [ ] App icon shows in Android emulator
- [ ] Splash screen displays correctly
- [ ] Icons look good in light mode
- [ ] Icons look good in dark mode
- [ ] All images <300KB
- [ ] No broken image links

### Visual QA
- [ ] Icon is recognizable at 16x16
- [ ] Splash screen centers properly
- [ ] Feature icons are consistent style
- [ ] Colors match theme palette
- [ ] No pixelation or artifacts

---

## 📊 PROGRESS TRACKER

### Asset Conversion Status

| Asset | Status | Size | Format |
|-------|--------|------|--------|
| App Icon | ⏳ Not Started | - | PNG |
| Splash Screen | ⏳ Not Started | - | PNG |
| Adaptive Icon | ⏳ Not Started | - | PNG |
| PDF Icon | ⏳ Not Started | - | SVG |
| Audio Icon | ⏳ Not Started | - | SVG |
| Flashcard Icon | ⏳ Not Started | - | SVG |
| Simplification Icon | ⏳ Not Started | - | SVG |
| Visual Aid Icon | ⏳ Not Started | - | SVG |
| Streak Badge | ⏳ Not Started | - | SVG |
| Document Badge | ⏳ Not Started | - | SVG |
| Hero Banner | ⏳ Not Started | - | PNG |

**Update this table as you complete each asset!**

---

## 🚀 NEXT STEPS

Once assets are ready:
1. Commit to git
2. Push to GitHub
3. Test on real device (TestFlight or APK)
4. Move to next Phase 5 feature (Error Boundaries or Personal Notes)

---

**Last Updated:** January 7, 2026  
**Status:** In Progress  
**Estimated Completion:** End of Day 2 (Jan 8, 2026)

---

<div align="center">
  <sub>Created with Nano Banana Pro 🎨</sub>
</div>
