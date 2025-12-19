# 🔧 Quick Reference Guide - Elimu AI

## Project Structure

```
elimu-ai-app/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Navigation setup
│   ├── index.tsx           # Home screen
│   ├── upload.tsx          # Document picker
│   ├── reader.tsx          # Processing & display
│   ├── results.tsx         # Final results view
│   └── settings.tsx        # Accessibility settings
│
├── src/
│   ├── ai/                 # AI Processing Module
│   │   ├── index.ts        # Main orchestrator (processDocument)
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── extract/
│   │   │   └── extractText.ts
│   │   ├── adapt/
│   │   │   ├── simplifyText.ts
│   │   │   ├── audioConvert.ts
│   │   │   └── visualAids.ts
│   │   └── models/
│   │       └── gemini.ts
│   │
│   ├── components/         # Reusable UI components
│   │   └── Button.tsx
│   │
│   ├── theme/              # Design tokens
│   │   └── colors.ts
│   │
│   └── utils/              # Utilities
│       ├── logger.ts       # Centralized logging
│       ├── ErrorBoundary.tsx
│       └── helpers.ts      # Common utilities
│
└── docs/
    ├── ARCHITECTURE.md     # System design details
    ├── ROADMAP_V0.2.md     # Next steps & action items
    └── QUICK_REFERENCE.md  # This file
```

---

## Common Commands

### Development
```bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Clear cache
npx expo start --clear
```

### Type Checking
```bash
# Check TypeScript types
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Package Management
```bash
# Install dependencies
npm install

# Add new package
npx expo install <package-name>

# Update all packages
npm update
```

---

## What's Working ✅

✅ Basic Expo app structure with routing  
✅ Document upload flow (PDF/image picker)  
✅ Real text extraction from PDFs and images using Gemini multimodal API (Phase 2)  
✅ Real text simplification using Gemini API (Phase 1)  
✅ Real visual aids generation using Gemini API (Phase 1)  
✅ Real TTS audio playback with voice selection and speed control (Phase 3)  
🚧 Accessibility settings (stubbed)

---

## Key Functions & Types

### Audio Functions (Phase 3)

#### Speaking Text with TTS
```typescript
import { speakText } from '@/src/ai/adapt/audioConvert';

// Basic usage
await speakText('Hello, this is a test.');

// With voice selection and speed control
await speakText('Hello, this is a test.', {
  voice: 'com.apple.ttsbundle.Samantha-compact',
  rate: 1.2, // 1.2x speed
  pitch: 1.0,
  onStart: () => console.log('Started speaking'),
  onDone: () => console.log('Finished speaking'),
  onStopped: () => console.log('Stopped speaking'),
  onError: (error) => console.error('TTS error:', error)
});
```

#### Getting Available Voices
```typescript
import { getAvailableVoices } from '@/src/ai/adapt/audioConvert';

const voices = await getAvailableVoices();
console.log(`Found ${voices.length} voices`);

// Filter by language
const englishVoices = voices.filter(v => v.language.startsWith('en'));

// Example voice object:
// {
//   identifier: 'com.apple.ttsbundle.Samantha-compact',
//   name: 'Samantha',
//   language: 'en-US',
//   quality: 'Enhanced'
// }
```

#### Controlling Playback
```typescript
import { 
  isSpeaking, 
  pauseSpeech, 
  resumeSpeech, 
  stopSpeech 
} from '@/src/ai/adapt/audioConvert';

// Check if currently speaking
const speaking = await isSpeaking();

// Pause/resume
if (speaking) {
  await pauseSpeech();
  // ... later
  await resumeSpeech();
}

// Stop completely
await stopSpeech();
```

#### UI Integration Example (from results.tsx)
```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [selectedVoice, setSelectedVoice] = useState<string>('');
const [speed, setSpeed] = useState(1.0);

const handlePlayPause = async () => {
  if (isPlaying) {
    await stopSpeech();
    setIsPlaying(false);
  } else {
    await speakText(simplifiedText, {
      voice: selectedVoice,
      rate: speed,
      onStart: () => setIsPlaying(true),
      onDone: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
      onError: (error) => {
        console.error('TTS error:', error);
        setIsPlaying(false);
      }
    });
  }
};
```

---

## AI Pipeline

### Main Document Processing

```typescript
// Main function - process a document
import { processDocument } from './src/ai';

const result = await processDocument(documentUri);
// Returns: DocumentProcessingResult
```

### Type Interfaces

```typescript
// Main result type
interface DocumentProcessingResult {
  text: string;                    // Simplified text
  audio: AudioResult;              // Audio file info
  images: VisualAidsResult;        // Visual aids
  metadata: ProcessingMetadata;    // Processing stats
}

// Audio result
interface AudioResult {
  audioUri: string | null;
  duration?: number;
  format?: 'mp3' | 'wav' | 'aac';
  status: 'ready' | 'processing' | 'failed';
}

// Visual aids
interface VisualAidsResult {
  images: VisualAid[];
  status: 'ready' | 'processing' | 'failed';
}
```

### Error Handling

```typescript
import { AIProcessingError, AIProcessingErrorType } from './src/ai/types';

try {
  await processDocument(uri);
} catch (error) {
  if (error instanceof AIProcessingError) {
    console.error('Error type:', error.type);
    console.error('Message:', error.message);
  }
}
```

---

## Navigation Flow

```
Home (index.tsx)
  ↓
Upload (upload.tsx) - Pick document
  ↓
Reader (reader.tsx) - Process & preview
  ↓
Results (results.tsx) - View simplified content
```

### Navigation Examples

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to screen
router.push('/upload');

// Navigate with params
router.push({
  pathname: '/reader',
  params: { uri: documentUri }
});

// Go back
router.back();
```

---

## Logging

```typescript
import { logger, aiLogger } from './src/utils/logger';

// General logging
logger.info('Module', 'Message', optionalData);
logger.warn('Module', 'Warning message');
logger.error('Module', 'Error occurred', error);

// Module-specific loggers
aiLogger.info('Processing started');
uiLogger.warn('Component rendered with invalid props');

// Export logs for debugging
const logDump = logger.exportLogs();
console.log(logDump);
```

---

## Styling

### Theme Colors

```typescript
import { colors } from './src/theme/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
  }
});
```

### Available Colors
- `colors.primary` - #6200ee (purple)
- `colors.secondary` - #03dac6 (teal)
- `colors.background` - #f5f5f5 (light gray)
- `colors.surface` - #ffffff (white)
- `colors.text` - #000000 (black)
- `colors.error` - #b00020 (red)

---

## Common Issues & Solutions

### Issue: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit

# Common fix: restart TypeScript server in VS Code
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: Expo Go not connecting
```bash
# Ensure devices are on same network
# Restart Expo server
# Try tunnel mode:
npx expo start --tunnel
```

---

## Testing Checklist

Before committing code:
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] No console errors or warnings
- [ ] Tested on both iOS and Android (or Expo Go)
- [ ] Navigation works correctly
- [ ] Loading states display properly
- [ ] Error states are handled gracefully
- [ ] Accessibility: Can navigate with screen reader

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`)
- **Screens**: lowercase (e.g., `index.tsx`, `upload.tsx`)
- **Utilities**: camelCase (e.g., `logger.ts`, `helpers.ts`)
- **Types**: PascalCase (e.g., `DocumentProcessingResult`)
- **Constants**: UPPER_SNAKE_CASE (in code)

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature

# Merge to main (after review)
git checkout main
git merge feature/your-feature
```

### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

---

## Environment Setup

### Required Tools
- Node.js (v18+)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Optional Tools
- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - React Native Tools

---

## Next Steps (v0.2)

**Priority 1**: Integrate real Gemini API
1. Get API key from Google AI Studio
2. Install `@google/genai`
3. Update `src/ai/models/gemini.ts`
4. Test with real prompts

**Priority 2**: Implement PDF extraction
1. Choose library (react-native-pdf-lib recommended)
2. Update `src/ai/extract/extractText.ts`
3. Test with real PDFs

**Priority 3**: Add basic TTS
1. Install `expo-speech`
2. Update `src/ai/adapt/audioConvert.ts`
3. Add playback UI in `results.tsx`

See [`ROADMAP_V0.2.md`](./ROADMAP_V0.2.md) for complete task list.

---

## Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [Google Gemini API](https://ai.google.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Contact & Support

- **Repository**: https://github.com/Eli-Keli/elimu-ai-app
- **Documentation**: See `docs/` folder
- **Issues**: GitHub Issues tab

---

**Last Updated**: December 2025 (v0.1)
