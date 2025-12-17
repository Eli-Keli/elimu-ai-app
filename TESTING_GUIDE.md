# 🧪 Phase 2 Testing Guide

**Quick reference for testing the new PDF/image extraction feature**

---

## ✅ Quick Start

```bash
# Start the app
npx expo start --clear

# Choose your platform
# Press 'a' for Android
# Press 'i' for iOS
```

---

## 📋 Test Checklist

### Test 1: Regular PDF ✅
**What to test:** Upload a normal text-based PDF

**Steps:**
1. Open app on simulator
2. Tap "Upload Document"
3. Select a PDF file (article, textbook, etc.)
4. Watch the console logs

**Expected Result:**
- ✅ Console shows: `[Extract] File loaded: { name: '...', size: '... KB', extension: '.pdf' }`
- ✅ Console shows: `[Extract] ✅ Successfully extracted X characters`
- ✅ Simplified text reflects actual PDF content (not mock React Native text)
- ✅ Processing completes in 10-30 seconds

**What to look for:**
- Real text from your PDF appears in simplified output
- No "React Native" or "TypeScript" mock text appears
- Console logs show actual file details

---

### Test 2: Image with Text 📸
**What to test:** Upload an image/screenshot containing text

**Steps:**
1. Open app
2. Tap "Upload Document"
3. Select an image (JPG, PNG) with text
4. Watch console logs

**Expected Result:**
- ✅ Console shows: `[Extract] MIME type: image/jpeg` (or png/webp)
- ✅ Text is extracted via OCR automatically
- ✅ Simplified output contains text from the image

**Good test images:**
- Screenshot of a webpage
- Photo of a book page
- Infographic with text
- Handwritten notes (may vary in accuracy)

---

### Test 3: Scanned Document 📄
**What to test:** Upload a scanned PDF (if you have one)

**Steps:**
1. Find a scanned PDF (old book scan, photocopied paper)
2. Upload it through the app
3. Watch extraction process

**Expected Result:**
- ✅ OCR automatically applied
- ✅ Text extracted from scanned images
- ✅ May take longer than regular PDFs (20-40 seconds)

---

### Test 4: Error Handling ❌
**What to test:** App handles invalid files gracefully

**Try these:**
- Upload a very large file (>50MB) → Should show error
- Upload unsupported file type → Should show error

**Expected Result:**
- ✅ Clear error message displayed
- ✅ App doesn't crash
- ✅ Console shows error details

---

## 🔍 What to Check in Console Logs

**Successful extraction should show:**
```
[Extract] Starting Gemini-powered text extraction for: file:///...
[Extract] Reading file bytes...
[Extract] File loaded: { name: 'document.pdf', size: '245.32 KB', extension: '.pdf' }
[Extract] MIME type: application/pdf
[Extract] Sending to Gemini for text extraction...
[Gemini] Client initialized successfully
[Gemini] Including file data: { mimeType: 'application/pdf', size: '245.32 KB' }
[Gemini] Using model: gemini-2.5-flash
[Gemini] Attempt 1/3
[Gemini] Generated response length: 1234
[Extract] ✅ Successfully extracted 1234 characters from 3 estimated page(s)
```

**Then the pipeline continues:**
```
✨ [2/4] Simplifying content...
🔊 [3/4] Generating audio...
🎨 [4/4] Generating visual aids...
✨ Pipeline Complete! ⏱️ Total time: XX.XXs
```

---

## ❓ Troubleshooting

### Problem: Still seeing mock "React Native" text
**Solution:** 
- Clear cache: `npx expo start --clear`
- Restart Metro bundler
- Make sure you selected a real file (not just tapped cancel)

### Problem: "File does not exist" error
**Solution:**
- Make sure the file picker returned a valid file
- Check console logs for the URI being used
- Try a different file

### Problem: Very long processing time (>2 minutes)
**Solution:**
- Large PDFs take longer (50+ pages may take 1-2 minutes)
- Check your internet connection
- If it times out, try a smaller file first

### Problem: Extraction fails with API error
**Check:**
- API key is set correctly in `.env`
- Internet connection is working
- Free tier limits not exceeded (15 requests/minute)

---

## 🎯 What Success Looks Like

**Before Phase 2:**
```
Upload: science_textbook.pdf
Extract: "This is extracted text... Learning about React Native..."
          ↑ Same mock text every time
```

**After Phase 2 (Now):**
```
Upload: science_textbook.pdf
Extract: "Photosynthesis is the process by which plants convert light energy..."
          ↑ Real text from YOUR PDF!

Upload: screenshot.png
Extract: "Welcome to the Dashboard... Your account balance is..."
          ↑ Real text from YOUR IMAGE!
```

---

## ✅ Ready to Approve?

Once you've tested and confirmed:
- ✅ Real PDFs extract real text (not mock data)
- ✅ Images extract text via OCR
- ✅ Console logs show file details
- ✅ Simplified output reflects uploaded content
- ✅ No crashes or major errors

**Tell me:** "PHASE 2 APPROVED" and I'll commit to GitHub!

---

## 📸 Test Files to Try

**Good starter files:**
- A PDF article (5-10 pages)
- A screenshot of text
- A photo of a book page
- A small scanned document

**Avoid for first test:**
- Files >20MB
- 100+ page documents
- Heavily encrypted PDFs
- Corrupted files

Start simple, then try more complex files! 🚀
