# Phase 2 Planning: PDF Text Extraction Strategy

**Date:** December 16, 2025  
**Status:** Planning & Decision  
**Decision:** Use Gemini Multimodal (Option B) ✅

---

## 🎯 Executive Summary

**YOUR IDEA IS BRILLIANT!** Instead of complex native PDF libraries, we'll use Gemini's built-in document processing capabilities. This approach:
- ✅ Handles PDFs and images natively
- ✅ Includes OCR automatically (scanned documents work!)
- ✅ No native modules needed (works on Expo Go!)
- ✅ Simpler implementation (less code to maintain)
- ✅ More reliable (Google's infrastructure)

---

## 📊 Option Comparison

### Option A: Traditional React Native PDF Libraries ❌

#### 1. react-native-pdf-lib
- **Status:** ⚠️ ABANDONED (last update: 5 years ago)
- **Repository:** https://github.com/Hopding/react-native-pdf-lib
- **Last Commit:** 2019
- **Issues:** 
  - Outdated dependencies
  - No React Native 0.70+ support
  - No TypeScript support
  - Requires native build (expo prebuild)
- **Verdict:** ❌ DO NOT USE

#### 2. react-native-pdf (wonday)
- **Status:** ✅ Active (last published: 2 months ago)
- **Repository:** https://github.com/wonday/react-native-pdf
- **Purpose:** PDF VIEWING only, not text extraction
- **Features:**
  - Renders PDFs beautifully
  - Good for display
  - No text extraction API
- **Verdict:** ❌ Wrong tool for our needs

#### 3. Other Native Solutions
- **pdfjs-dist + react-native-blob-util:**
  - Complex setup
  - Large bundle size (200KB+)
  - Performance issues on large PDFs
  - Requires custom native modules

**PROBLEMS WITH NATIVE APPROACH:**
1. ❌ Requires `expo prebuild` (no more Expo Go)
2. ❌ Complex native dependencies
3. ❌ Separate OCR library needed for scanned PDFs
4. ❌ More code to maintain
5. ❌ Platform-specific bugs (iOS vs Android)
6. ❌ Larger app bundle size

---

### Option B: Gemini Multimodal API ✅ (RECOMMENDED)

#### What Gemini Can Do

From official docs: https://ai.google.dev/gemini-api/docs/document-processing

**Gemini models can:**
1. ✅ Process PDFs up to 50MB or 1000 pages
2. ✅ Analyze text, images, diagrams, charts, and tables
3. ✅ Extract information into structured output formats
4. ✅ Summarize and answer questions
5. ✅ Transcribe document content (preserving layouts/formatting)
6. ✅ Handle scanned PDFs (OCR built-in!)
7. ✅ Process images with text automatically

**Technical Specs:**
- **Max File Size:** 50MB
- **Max Pages:** 1000 pages
- **Cost per Page:** 258 tokens per page
- **Supported Formats:** PDF, images (JPG, PNG, WebP, HEIC, HEIF)
- **Models Supporting Documents:**
  - ✅ gemini-2.5-flash (our current choice!)
  - ✅ gemini-2.5-pro
  - ✅ gemini-3-pro-preview

**Two Upload Methods:**

1. **Inline Upload (Small Files < 10MB)**
```typescript
// Pass PDF/image bytes directly
const response = await client.models.generate_content(
  model: 'gemini-2.5-flash',
  contents: [
    Part.from_bytes(data: pdfBytes, mime_type: 'application/pdf'),
    'Extract all text from this document'
  ]
);
```

2. **Files API (Large Files)**
```typescript
// Upload first, then reference
const uploadedFile = await client.files.upload(
  file: pdfBytes,
  config: { mime_type: 'application/pdf' }
);
// Files stored for 48 hours for free
const response = await client.models.generate_content(
  model: 'gemini-2.5-flash',
  contents: [uploadedFile, 'Extract all text']
);
```

---

## 🎯 Recommended Implementation

### Architecture

```
User uploads PDF/Image
   ↓
expo-document-picker (already working!)
   ↓
Get file URI (e.g., file:///path/to/document.pdf)
   ↓
expo-file-system: Read file as bytes
   ↓
Gemini Multimodal API: Process document
   ↓
Extract text (with OCR if needed)
   ↓
Continue with existing pipeline
```

### Implementation Plan

**Phase 2A: Update extractText.ts (2-3 hours)**
```typescript
// src/ai/extract/extractText.ts

import { File } from 'expo-file-system';
import { getGeminiClient } from '../models/gemini';
import type { Part } from '@google/genai';

export async function extractTextFromUri(uri: string): Promise<ExtractionResult> {
  try {
    // Step 1: Read file as bytes using expo-file-system
    const file = new File(uri);
    const fileBytes = await file.bytes(); // Returns Uint8Array
    
    // Step 2: Determine MIME type
    const mimeType = getMimeType(file.extension);
    
    // Step 3: Upload to Gemini (inline for <10MB, Files API for >10MB)
    const fileSize = file.size;
    const geminiFile = fileSize > 10 * 1024 * 1024
      ? await uploadLargeFile(fileBytes, mimeType)
      : { data: fileBytes, mime_type: mimeType };
    
    // Step 4: Extract text with Gemini
    const prompt = `Extract all text content from this document. 
    Preserve paragraph structure. 
    If this is a scanned document, use OCR to extract text.
    Return only the extracted text, no explanations.`;
    
    const response = await getGeminiClient().models.generate_content({
      model: 'gemini-2.5-flash',
      contents: [
        Part.from_bytes(fileBytes, mimeType),
        prompt
      ]
    });
    
    const extractedText = response.text();
    
    return {
      text: extractedText,
      pageCount: estimatePages(extractedText),
      confidence: 1.0, // Gemini handles this internally
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        extractionMethod: 'gemini-multimodal'
      }
    };
  } catch (error) {
    throw new AIProcessingError(
      'EXTRACTION_FAILED',
      `Failed to extract text: ${error.message}`
    );
  }
}
```

**Phase 2B: Add Helper Functions (1 hour)**
```typescript
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };
  return mimeTypes[extension.toLowerCase()] || 'application/pdf';
}

async function uploadLargeFile(bytes: Uint8Array, mimeType: string) {
  const client = getGeminiClient();
  const uploadedFile = await client.files.upload({
    file: bytes,
    config: { mime_type: mimeType }
  });
  return uploadedFile; // Returns file reference for use in API calls
}

function estimatePages(text: string): number {
  // Rough estimate: 500 characters per page
  return Math.max(1, Math.ceil(text.length / 500));
}
```

**Phase 2C: Update Types (30 minutes)**
```typescript
// src/ai/types.ts

export interface ExtractionResult {
  text: string;
  pageCount: number;
  confidence: number; // Always 1.0 for Gemini (internal OCR)
  metadata: {
    fileName: string;
    fileSize: number;
    extractionMethod: 'gemini-multimodal';
    geminiFileId?: string; // If using Files API
  };
}
```

---

## 💰 Cost Analysis

### Gemini Pricing
- **Pricing:** 258 tokens per document page
- **gemini-2.5-flash rate:** $0.075 per 1M input tokens (free tier: 15 RPM)

**Example Costs:**
- **10-page PDF:** 2,580 tokens = $0.000194 (~$0.0002)
- **50-page PDF:** 12,900 tokens = $0.000968 (~$0.001)
- **100-page textbook:** 25,800 tokens = $0.001935 (~$0.002)

**FREE TIER LIMITS:**
- 15 requests per minute
- 1M tokens per minute
- ~65 pages/minute (1M tokens / 258 tokens per page / 60 seconds)

**Verdict:** ✅ EXTREMELY CHEAP + FREE TIER IS GENEROUS

---

## 🔄 Comparison: Gemini vs Native Libraries

| Feature | Gemini Multimodal | Native Libraries |
|---------|-------------------|------------------|
| **Setup Complexity** | ✅ Simple (no native modules) | ❌ Complex (expo prebuild required) |
| **OCR for Scanned PDFs** | ✅ Built-in | ❌ Separate library needed |
| **Works on Expo Go** | ✅ Yes | ❌ No (requires custom build) |
| **Code Maintenance** | ✅ Low (Google maintains API) | ❌ High (native dependencies) |
| **Bundle Size** | ✅ No impact | ❌ +200KB+ |
| **Cross-platform** | ✅ Same code iOS/Android | ⚠️ Platform-specific code |
| **Max File Size** | ✅ 50MB | ⚠️ Varies |
| **Cost** | ✅ $0.0002 per 10-page doc | ✅ Free (but more dev time) |
| **Image Support** | ✅ Native (JPG, PNG, WebP) | ❌ Need separate OCR |
| **Implementation Time** | ✅ 3-4 hours | ❌ 8-12 hours |
| **Error Handling** | ✅ Reliable (Google infrastructure) | ⚠️ Device-dependent |

**Winner:** 🏆 **Gemini Multimodal** (clear victory)

---

## 🚀 Implementation Steps (Phase 2)

### Step 1: Update Package Dependencies (5 minutes)
```bash
# Already installed!
# expo-file-system ~19.0.21 ✅
# @google/genai (latest) ✅
```

### Step 2: Implement extractText.ts (2-3 hours)
- Read file bytes with expo-file-system
- Determine MIME type
- Call Gemini with document + extraction prompt
- Parse response
- Add error handling

### Step 3: Update Types (30 minutes)
- Add extractionMethod field
- Add geminiFileId optional field
- Update metadata interface

### Step 4: Test with Various Documents (1 hour)
- ✅ Text-based PDFs (normal documents)
- ✅ Scanned PDFs (old books, photocopies)
- ✅ Images with text (screenshots, photos)
- ✅ Large files (20+ pages)
- ✅ Protected/corrupted files (error handling)

### Step 5: Update Documentation (30 minutes)
- Update ARCHITECTURE.md
- Update QUICK_REFERENCE.md
- Create PHASE_2_COMPLETE.md

**Total Time Estimate:** 4-5 hours (vs 8-12 hours for native approach)

---

## 🎯 Expected Outcomes

**What Changes:**
- `extractTextFromUri()` will process REAL documents instead of mock text
- Users can upload actual PDFs/images and see their content simplified
- OCR works automatically for scanned documents
- No expo prebuild needed (stays on Expo Go!)

**What Stays the Same:**
- Rest of pipeline unchanged (simplify → audio → visuals)
- Already tested and working Phase 1 code
- Same error handling patterns
- Same logging/debugging approach

**User Experience:**
```
Before Phase 2:
Upload any PDF → Always processes mock "React Native" text

After Phase 2:
Upload textbook PDF → Extracts actual textbook content
Upload scanned notes → OCR extracts handwritten/typed text
Upload image screenshot → Extracts text from image
```

---

## ✅ Decision: GO WITH GEMINI MULTIMODAL (Option B)

### Why This Is The Right Choice

1. **Your Intuition Was Correct:** Using Gemini for extraction aligns perfectly with our AI-first architecture
2. **Faster Implementation:** 4-5 hours vs 8-12 hours
3. **Better User Experience:** OCR built-in, works with images
4. **Simpler Codebase:** No native modules, less maintenance
5. **Cost-Effective:** ~$0.0002 per document (negligible)
6. **Stays on Expo Go:** No prebuild complications
7. **Future-Proof:** Google will maintain/improve the API

---

## 📋 Next Actions

When you say **"START PHASE 2"**, I will:

1. ✅ Update `src/ai/extract/extractText.ts` (150 lines → real implementation)
2. ✅ Add helper functions (MIME type detection, large file upload)
3. ✅ Update `src/ai/types.ts` (add extractionMethod field)
4. ✅ Create test cases for various document types
5. ✅ Update documentation (ARCHITECTURE.md, QUICK_REFERENCE.md)
6. ✅ Test with real PDFs and images
7. ✅ Commit Phase 2 to GitHub

**No additional packages needed!** Everything we need is already installed. ✅

---

## 🔗 References

- [Gemini Document Processing Docs](https://ai.google.dev/gemini-api/docs/document-processing)
- [Expo FileSystem Docs](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [expo-document-picker](https://docs.expo.dev/versions/latest/sdk/document-picker/) (already using)
- [@google/genai SDK](https://www.npmjs.com/package/@google/genai) (already installed)

---

**Status:** 🎯 Ready to implement when you give the go-ahead!
