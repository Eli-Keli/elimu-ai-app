# 📦 Official Dependencies & Documentation

This document provides official links to all external packages and APIs used in the Elimu AI project.

## AI & Machine Learning

### Google Gemini API
- **Package**: `@google/genai`
- **Version**: Latest (installed via npm)
- **Purpose**: AI-powered text generation, simplification, and image generation
- **Models Used**:
  - `gemini-2.5-flash` - Fast, cost-effective for text operations
  - `gemini-2.5-pro` - Advanced reasoning and complex tasks
  - `gemini-3.0-pro-preview` - Latest generation model (when available)
- **Documentation**: https://ai.google.dev/gemini-api/docs
- **Quickstart**: https://ai.google.dev/gemini-api/docs/quickstart#javascript
- **API Key**: https://makersuite.google.com/app/apikey
- **Image Generation**: https://ai.google.dev/gemini-api/docs/imagen

## React Native & Expo

### Expo
- **Package**: `expo`
- **Version**: ~54.0.25
- **Documentation**: https://docs.expo.dev/
- **Purpose**: React Native framework and build tools

### Expo Router
- **Package**: `expo-router`
- **Version**: ~6.0.15
- **Documentation**: https://docs.expo.dev/router/introduction/
- **Purpose**: File-based routing for React Native

### Expo Speech
- **Package**: `expo-speech`
- **Version**: ~13.0.0
- **Documentation**: https://docs.expo.dev/versions/latest/sdk/speech/
- **Purpose**: Text-to-speech audio generation (offline, free)

### Expo File System
- **Package**: `expo-file-system`
- **Version**: ~19.0.19
- **Documentation**: https://docs.expo.dev/versions/latest/sdk/filesystem/
- **Purpose**: File storage and management

### Expo Document Picker
- **Package**: `expo-document-picker`
- **Version**: ~12.0.4
- **Documentation**: https://docs.expo.dev/versions/latest/sdk/document-picker/
- **Purpose**: PDF file selection from device

## PDF Processing

### React Native PDF
- **Package**: `react-native-pdf`
- **Version**: ^7.0.3
- **Documentation**: https://github.com/wonday/react-native-pdf
- **Purpose**: PDF rendering and display

### React Native PDF Lib (Planned)
- **Package**: `react-native-pdf-lib`
- **Version**: ^1.0.0 (to be installed in Phase 2)
- **Documentation**: https://github.com/Hopding/react-native-pdf-lib
- **Purpose**: Native PDF text extraction

## Development Tools

### TypeScript
- **Package**: `typescript`
- **Version**: ~5.9.2
- **Documentation**: https://www.typescriptlang.org/docs/
- **Purpose**: Type safety and developer experience

### dotenv
- **Package**: `dotenv`
- **Version**: Latest
- **Documentation**: https://github.com/motdotla/dotenv
- **Purpose**: Environment variable management (dev only)

## Environment Variables

Create a `.env` file in the root directory with:

```bash
# Google Gemini API Key (required)
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here

# Environment (optional)
EXPO_PUBLIC_ENV=development
```

## Installation Commands

```bash
# Install all dependencies
npm install

# Install specific packages (if needed)
npm install @google/genai --legacy-peer-deps
npm install expo-speech
npm install react-native-pdf
npm install dotenv --save-dev

# For native modules (Phase 2)
npx expo prebuild --platform ios
```

## API Keys & Credentials

### Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to `.env` file as `EXPO_PUBLIC_GEMINI_API_KEY`
4. Never commit `.env` to git (already in `.gitignore`)

## Testing

### Test Gemini Integration
```bash
# Run test script (requires .env with API key)
npx ts-node test-gemini.ts
```

## Phase-specific Dependencies

### Phase 1 ✅ (Current)
- @google/genai
- dotenv (dev)

### Phase 2 (Upcoming)
- react-native-pdf-lib
- Custom iOS prebuild configuration

### Phase 3-4 (Future)
- expo-speech (already installed)
- Additional audio format support

### Phase 5-6 (Future)
- expo-sharing
- expo-media-library
- AsyncStorage or expo-secure-store

## Troubleshooting

### Peer Dependency Issues
If you encounter React version conflicts, use:
```bash
npm install <package> --legacy-peer-deps
```

### TypeScript Errors in node_modules
These are expected with some packages that target newer ES versions. Your code is safe if `npx tsc --noEmit src/**/*.ts` passes.

### Missing API Key Error
Ensure your `.env` file exists and contains a valid `EXPO_PUBLIC_GEMINI_API_KEY`.

## Version Compatibility

- **Node.js**: v18+ required
- **npm**: v8+ recommended
- **Expo SDK**: 54.x
- **React Native**: 0.81.5
- **iOS**: 13.4+ (for native modules)
- **Android**: API 21+ (for native modules)

## License Information

All dependencies are open source or have commercial-friendly licenses:
- Expo: MIT License
- React Native: MIT License
- @google/genai: Apache 2.0
- TypeScript: Apache 2.0

## Updates & Maintenance

Check for updates regularly:
```bash
npm outdated
npx expo-doctor
```

Update Expo SDK:
```bash
npx expo install --fix
```