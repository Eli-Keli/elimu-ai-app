# 🏗️ Elimu AI Architecture

## Overview

Elimu AI is built with a modular, layered architecture that separates concerns and enables independent testing and scaling of each component. The app follows React Native best practices with TypeScript for type safety.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer (app/)                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │  Home   │  │ Upload  │  │ Reader  │  │ Results │       │
│  │ Screen  │  │ Screen  │  │ Screen  │  │ Screen  │       │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
└───────┼────────────┼────────────┼────────────┼─────────────┘
        │            │            │            │
┌───────┼────────────┼────────────┼────────────┼─────────────┐
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                         │                                   │
│                   AI Module (src/ai/)                       │
│       ┌─────────────────┴─────────────────┐                │
│       │     index.ts (Orchestrator)       │                │
│       │   processDocument(uri, config)    │                │
│       └────────┬──────────────────┬────────┘                │
│                │                  │                         │
│       ┌────────┴────────┐   ┌────┴─────────┐               │
│       │  Extract Module │   │ Adapt Module │               │
│       │   extractText   │   │  • simplify  │               │
│       └─────────────────┘   │  • audio     │               │
│                             │  • visuals   │               │
│                             └──────┬───────┘               │
│                                    │                        │
│                             ┌──────┴───────┐               │
│                             │ Models Module│               │
│                             │    Gemini    │               │
│                             └──────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### 1. **UI Layer** (`app/`)

The UI layer uses **Expo Router** for file-based routing. Each screen is a self-contained component.

#### Screen Flow

```
index.tsx (Home)
    ↓ "Start Learning"
upload.tsx (Document Picker)
    ↓ Document Selected
reader.tsx (Processing & Preview)
    ↓ Processing Complete
results.tsx (Display Simplified Content)
```

#### Key Components

- **`_layout.tsx`**: Root navigation configuration, theme setup
- **`index.tsx`**: Welcome screen with app overview
- **`upload.tsx`**: Uses `expo-document-picker` to select PDFs/images
- **`reader.tsx`**: 
  - Triggers AI pipeline
  - Shows loading state during processing
  - Displays processing results with stats
  - Handles errors gracefully
- **`results.tsx`**: 
  - Displays simplified text
  - Provides audio playback controls (future)
  - Allows saving/sharing content (future)
- **`settings.tsx`**: Accessibility preferences (high contrast, dyslexia-friendly fonts)

---

### 2. **AI Module** (`src/ai/`)

The core intelligence layer that transforms raw documents into accessible content.

#### Architecture Pattern: **Pipeline Orchestration**

The AI module follows a **pipeline pattern** where data flows through sequential transformation steps.

```typescript
Document URI 
    → Extract (Raw Text)
    → Simplify (Accessible Text)
    → Audio (TTS)
    → Visuals (Learning Aids)
    → Final Result
```

#### Module Structure

```
src/ai/
├── index.ts              # Main orchestrator
├── types.ts              # TypeScript interfaces
├── extract/
│   └── extractText.ts    # Text extraction from PDFs/images
├── adapt/
│   ├── simplifyText.ts   # AI-powered text simplification
│   ├── audioConvert.ts   # Text-to-speech generation
│   └── visualAids.ts     # Visual learning aid generation
└── models/
    └── gemini.ts         # Gemini API integration
```

---

### 3. **Core AI Pipeline** (`src/ai/index.ts`)

#### Function: `processDocument(uri, config?)`

**Purpose**: Orchestrates the entire document processing workflow.

**Input**:
- `uri` (string): Local file URI or remote URL
- `config` (ProcessingConfig, optional): Pipeline configuration

**Output**:
- `DocumentProcessingResult`: Complete processed document data

**Flow**:

```typescript
export async function processDocument(
  uri: string,
  config?: ProcessingConfig
): Promise<DocumentProcessingResult> {
  
  // 1. Extract text from document
  const extraction = await extractTextFromUri(uri);
  
  // 2. Simplify for accessibility
  const simplification = await simplifyContent(extraction.rawText);
  
  // 3. Generate audio (non-blocking on failure)
  const audio = await generateAudio(simplification.simplifiedText);
  
  // 4. Generate visual aids (non-blocking on failure)
  const visuals = await generateVisuals(simplification.simplifiedText);
  
  // 5. Return complete result
  return {
    text: simplification.simplifiedText,
    audio,
    images: visuals,
    metadata: { /* processing metadata */ }
  };
}
```

**Error Handling**:
- Throws `AIProcessingError` on critical failures (extraction, simplification)
- Returns partial results for non-critical failures (audio, visuals)
- Includes detailed error types for debugging

---

### 4. **Extraction Module** (`src/ai/extract/`)

#### Function: `extractTextFromUri(uri)`

**Purpose**: Extracts raw text from documents (PDFs, images).

**Current Status**: ✅ Production-Ready (Phase 2 complete)

**Implementation**:
- Uses Gemini 2.5 Flash multimodal API for unified PDF and image extraction
- Automatic OCR for scanned documents and images
- Supports PDF, JPG, PNG, WebP, HEIC, HEIF formats (up to 50MB)
- Single API call handles both text extraction and OCR
- Converts files to base64 for Gemini processing
- Cost: ~$0.038 per 1000 images (far cheaper than dedicated OCR services)
- Successfully tested on real PDFs and images

**Output**: `ExtractionResult`
```typescript
{
  rawText: string;
  pageCount?: number;
  confidence?: number;  // OCR confidence (0-1)
  language?: string;
}
```

---

### 5. **Adaptation Module** (`src/ai/adapt/`)

#### 5.1 Text Simplification (`simplifyText.ts`)

**Purpose**: Converts complex academic language into plain, accessible text.

**Method**:
1. Constructs a detailed prompt for Gemini
2. Specifies target reading level (8th grade default)
3. Receives simplified text from LLM
4. Calculates readability metrics

**Output**: `SimplificationResult`
```typescript
{
  simplifiedText: string;
  originalLength: number;
  simplifiedLength: number;
  readabilityScore?: number;
}
```

**Future Enhancements**:
- Configurable reading levels (elementary, middle, high school)
- WCAG compliance checking
- Glossary generation for technical terms

---

#### 5.2 Audio Conversion (`audioConvert.ts`)

**Purpose**: Generates audio narration from text for visually impaired users.

**Current Status**: ✅ Production-Ready (Phase 3 complete)

**Key Functions**:
```typescript
export async function speakText(text: string, config?: AudioConfig): Promise<void>
export async function getAvailableVoices(): Promise<Voice[]>
export async function isSpeaking(): Promise<boolean>
export async function pauseSpeech(): Promise<void>
export async function resumeSpeech(): Promise<void>
export async function stopSpeech(): Promise<void>
```

**Implementation**:
- Uses `expo-speech` for direct TTS playback (no file generation)
- Device TTS: Free, offline, 473 voices (Android), 68 voices (iOS)
- Event-driven architecture with callbacks (onStart, onDone, onError, onStopped)
- Adjustable speed (0.5x-2.0x) and pitch (0.5x-2.0x)
- Voice selection with language and quality metadata
- Cross-platform compatibility (iOS/Android/Web)
- Successfully tested on Android and iOS simulators
- Zero cost (vs $16/1M characters for cloud TTS)

**Voice Interface**:
```typescript
interface Voice {
  identifier: string;
  name: string;
  language: string;
  quality: string;
}
```

**AudioConfig Interface**:
```typescript
interface AudioConfig {
  voice?: string;
  rate?: number;      // 0.5 - 2.0 (default: 1.0)
  pitch?: number;     // 0.5 - 2.0 (default: 1.0)
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
}
```
```

---

#### 5.3 Visual Aids (`visualAids.ts`)

**Purpose**: Generates visual learning aids (diagrams, infographics, timelines).

**Method**:
1. Analyzes content with Gemini
2. Suggests appropriate visual types
3. (Future) Generates images with AI image generation APIs
4. Ensures accessibility with alt text

**Output**: `VisualAidsResult`
```typescript
{
  images: VisualAid[];
  status: 'ready' | 'processing' | 'failed';
}

interface VisualAid {
  url: string;
  type: 'diagram' | 'infographic' | 'timeline' | 'illustration';
  description: string;
  altText: string;  // For screen readers
}
```

**Future Enhancements**:
- Integrate DALL-E, Midjourney, or Stable Diffusion
- Generate actual images from AI descriptions
- Store images in cloud storage
- Support image customization (color schemes for colorblindness)

---

### 6. **Models Module** (`src/ai/models/`)

#### Gemini Integration (`gemini.ts`)

**Purpose**: Interface for Google's Gemini 1.5 Flash LLM.

**Current Status**: 🚧 Stubbed (returns mock responses)

**Function**: `generateGeminiContent(prompt, config?)`

**Future Implementation**:
```typescript
// Install: npm install @google/genai

import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateGeminiContent(prompt: string) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

**Configuration**:
- Model: `gemini-1.5-flash` (fast, cost-effective)
- Temperature: 0.7 (balanced creativity/consistency)
- Max tokens: 2048

**Future Enhancements**:
- Streaming responses for better UX
- Response caching for identical prompts
- Cost tracking and rate limiting
- Safety filter handling
- Token counting

---

## Type System (`src/ai/types.ts`)

### Core Interfaces

```typescript
// Main result type
interface DocumentProcessingResult {
  text: string;
  audio: AudioResult;
  images: VisualAidsResult;
  metadata: ProcessingMetadata;
}

// Configuration options
interface ProcessingConfig {
  simplification?: {
    targetReadingLevel?: 'elementary' | 'middle' | 'high';
    maxLength?: number;
  };
  audio?: {
    voice?: 'male' | 'female' | 'neutral';
    speed?: number;
    language?: string;
  };
  visuals?: {
    maxVisuals?: number;
    types?: Array<'diagram' | 'infographic' | 'timeline' | 'illustration'>;
  };
}

// Error handling
enum AIProcessingErrorType {
  EXTRACTION_FAILED = 'EXTRACTION_FAILED',
  SIMPLIFICATION_FAILED = 'SIMPLIFICATION_FAILED',
  AUDIO_GENERATION_FAILED = 'AUDIO_GENERATION_FAILED',
  VISUAL_GENERATION_FAILED = 'VISUAL_GENERATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
}

class AIProcessingError extends Error {
  constructor(
    public type: AIProcessingErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AIProcessingError';
  }
}
```

---

## State Management

### Current Approach: **Local Component State**

Each screen manages its own state with React hooks:
- `useState` for local state (loading, errors, results)
- `useEffect` for side effects (document processing)
- `useRouter` for navigation with params

### Future Approach: **Context API or Zustand**

As the app grows, consider:
- Global state for user preferences (accessibility settings)
- Shared state for processed documents
- Offline caching with AsyncStorage

---

## Data Flow Example

### Complete User Journey

```
1. User opens app
   → index.tsx displays welcome screen

2. User taps "Start Learning"
   → Navigates to upload.tsx

3. User picks PDF document
   → expo-document-picker returns file URI
   → Navigates to reader.tsx with URI param

4. reader.tsx receives URI
   → State changes to 'processing'
   → Calls processDocument(uri)
   
5. AI Pipeline executes
   → Extract: Gets raw text from PDF
   → Simplify: Sends to Gemini for simplification
   → Audio: Generates TTS audio file
   → Visuals: Creates visual aid descriptions
   → Returns DocumentProcessingResult

6. reader.tsx receives result
   → State changes to 'success'
   → Displays stats and preview
   → User taps "View Full Results"

7. Navigates to results.tsx with text param
   → results.tsx displays simplified content
   → Provides audio playback, save, share options
```

---

## Error Handling Strategy

### 1. **Input Validation**
- Check for empty/invalid URIs before processing
- Validate configuration parameters
- Throw `AIProcessingError` with `INVALID_INPUT` type

### 2. **Graceful Degradation**
- Audio generation failure → Continue without audio
- Visual generation failure → Continue without visuals
- Critical failures (extraction, simplification) → Throw error

### 3. **User-Friendly Error Messages**
```typescript
try {
  await processDocument(uri);
} catch (error) {
  if (error instanceof AIProcessingError) {
    switch (error.type) {
      case AIProcessingErrorType.NETWORK_ERROR:
        showError("Can't connect to AI service. Check your internet connection.");
        break;
      case AIProcessingErrorType.EXTRACTION_FAILED:
        showError("Can't read this document. Try a different file.");
        break;
      default:
        showError("Something went wrong. Please try again.");
    }
  }
}
```

### 4. **Logging & Debugging**
- Console logs at each pipeline step
- Emoji prefixes for visual scanning (🚀 🔊 🎨 ✅ ❌)
- Processing time tracking
- Error stack traces in development

---

## Performance Considerations

### 1. **Async Pipeline**
- All operations are async to prevent UI blocking
- Loading states keep users informed
- Each step logs progress for transparency

### 2. **Future Optimizations**
- **Parallel Processing**: Run audio & visual generation simultaneously
- **Caching**: Cache Gemini responses for identical content
- **Chunking**: Split large documents for incremental processing
- **Background Processing**: Use WorkerThreads for heavy computation

---

## Accessibility Architecture

### Core Principles

1. **Screen Reader Support**
   - All interactive elements have proper labels
   - Semantic HTML/React Native structure
   - Alt text for all images

2. **Visual Accessibility**
   - High contrast mode support
   - Dyslexia-friendly font options
   - Configurable text size

3. **Cognitive Accessibility**
   - Simple, clear language (target: 8th grade level)
   - Consistent navigation patterns
   - Predictable UI behavior

4. **Auditory Accessibility**
   - Audio narration for all content
   - Visual alternatives to audio cues

---

## Testing Strategy (Future)

### Unit Tests
```
src/ai/__tests__/
├── extractText.test.ts
├── simplifyText.test.ts
├── audioConvert.test.ts
├── visualAids.test.ts
└── gemini.test.ts
```

### Integration Tests
- Test complete pipeline with sample documents
- Verify error handling and recovery
- Test navigation flow between screens

### E2E Tests
- Use Detox for React Native E2E testing
- Test user journeys from upload to results

---

## Deployment Architecture (Future)

### Mobile Apps
- **iOS**: Expo EAS Build → App Store
- **Android**: Expo EAS Build → Google Play

### Backend Services (if needed)
- **Gemini API**: Google Cloud (serverless functions)
- **File Storage**: Firebase Storage or AWS S3
- **Analytics**: Firebase Analytics or Mixpanel

---

## Security Considerations

### 1. **API Keys**
- Store Gemini API key in `.env` file
- Use `expo-constants` to load environment variables
- Never commit API keys to version control

### 2. **User Data**
- Process documents locally when possible
- If uploading to cloud: use HTTPS, encrypt in transit
- Respect GDPR/privacy regulations

### 3. **Content Safety**
- Use Gemini's built-in safety filters
- Handle blocked content gracefully
- Sanitize user-uploaded content

---

## Next Steps

See [`ROADMAP_V0.2.md`](./ROADMAP_V0.2.md) for actionable next steps to move from scaffolding to production.
