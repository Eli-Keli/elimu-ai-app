# Phase 3 Planning: Audio Generation Strategy

**Date:** December 18, 2025  
**Status:** Planning & Decision  
**Decision:** Use expo-speech (Official Expo SDK) ✅

---

## 🎯 Executive Summary

Phase 3 will implement **real text-to-speech (TTS) audio generation** to replace the stubbed `generateAudio()` function. This enables learners with visual impairments or reading difficulties to listen to simplified educational content.

**Chosen Solution:** expo-speech (Official Expo SDK)
- ✅ Already installed in package.json
- ✅ Works on Expo Go (no prebuild needed)
- ✅ Cross-platform (iOS, Android, Web)
- ✅ Simple API with voice selection
- ✅ Speed/pitch control
- ✅ Event callbacks (onStart, onDone, onError)

---

## 📊 Option Comparison

### Option A: expo-speech (Official Expo SDK) ✅ RECOMMENDED

**Package:** `expo-speech@~14.0.8`  
**Status:** ✅ Already installed  
**Repository:** https://github.com/expo/expo/tree/sdk-54/packages/expo-speech

**Pros:**
- ✅ Official Expo package (maintained by Expo team)
- ✅ Zero setup - already in dependencies
- ✅ Works on Expo Go (no native build required)
- ✅ Cross-platform: iOS, Android, Web
- ✅ Simple API: `Speech.speak(text, options)`
- ✅ Voice selection with `getAvailableVoicesAsync()`
- ✅ Speed control: `rate` (0.5x - 2.0x)
- ✅ Pitch control: `pitch` (0.5 - 2.0)
- ✅ Event callbacks: onStart, onDone, onError, onBoundary
- ✅ Pause/resume support (iOS only)
- ✅ Queue management (speaks multiple texts in order)
- ✅ Language support (IETF BCP 47 codes)

**Cons:**
- ⚠️ Requires physical device testing (TTS quality varies by device)
- ⚠️ No audio file export (speech is played directly, not saved)
- ⚠️ Pause/resume not available on Android
- ⚠️ iOS devices must not be in silent mode

**API Overview:**
```typescript
import * as Speech from 'expo-speech';

// Basic usage
Speech.speak('Hello world');

// With options
Speech.speak(text, {
  language: 'en-US',
  pitch: 1.0,
  rate: 0.75,
  voice: 'com.apple.voice.compact.en-US.Samantha',
  onStart: () => console.log('Started speaking'),
  onDone: () => console.log('Finished speaking'),
  onError: (error) => console.error('Speech error:', error),
});

// Get available voices
const voices = await Speech.getAvailableVoicesAsync();
// Returns: [{ identifier, name, language, quality }]

// Check if speaking
const isSpeaking = await Speech.isSpeakingAsync(); // true/false

// Control playback
Speech.pause(); // iOS only
Speech.resume(); // iOS only
Speech.stop(); // Interrupt and clear queue
```

**Voice Quality:**
- `VoiceQuality.Default` - Standard system voices
- `VoiceQuality.Enhanced` - Premium voices (if available)

---

### Option B: react-native-tts (Community Library) ❌

**Package:** `react-native-tts@^4.1.0`  
**Repository:** https://github.com/ak1394/react-native-tts

**Pros:**
- ✅ More features (setDucking, setIgnoreSilentSwitch)
- ✅ Better Android pause/resume support

**Cons:**
- ❌ Requires expo prebuild (breaks Expo Go)
- ❌ Additional native setup required
- ❌ More complex API
- ❌ Not officially supported by Expo
- ❌ Potential compatibility issues with Expo SDK

**Verdict:** ❌ Not suitable for Expo Go workflow

---

### Option C: Native iOS/Android TTS APIs ❌

**Approach:** Use react-native modules to access native APIs directly

**Pros:**
- ✅ Maximum control over TTS features
- ✅ Access to all platform-specific features

**Cons:**
- ❌ Requires expo prebuild
- ❌ Need to write native code (Swift/Kotlin)
- ❌ Separate implementation for iOS and Android
- ❌ Complex maintenance
- ❌ Not portable

**Verdict:** ❌ Overkill for our needs

---

### Option D: Web Audio API + Browser TTS ❌

**Approach:** Use Web Speech API

**Pros:**
- ✅ Works in web browsers

**Cons:**
- ❌ Doesn't work in React Native mobile apps
- ❌ Only works on web platform

**Verdict:** ❌ Not suitable for mobile app

---

## 🎯 Recommended Solution: expo-speech

**Winner:** 🏆 **expo-speech** (clear victory)

### Why expo-speech is Perfect

1. **Already Installed:** Zero setup time
2. **Expo Go Compatible:** No prebuild needed
3. **Cross-Platform:** Same code for iOS, Android, Web
4. **Simple API:** Easy to implement and test
5. **Sufficient Features:** Has everything we need (voices, speed, events)
6. **Official Support:** Maintained by Expo team

---

## 🏗️ Implementation Strategy

### Current State

**File:** `src/ai/adapt/audioConvert.ts`
```typescript
export async function generateAudio(
  text: string,
  config: Partial<AudioConfig> = {}
): Promise<AudioResult> {
  // STUBBED: Returns mock audio file
  return {
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: calculateDuration(text, config.voiceSpeed || 1.0),
    format: 'mp3',
    // ... metadata
  };
}
```

**Problem:** Returns mock audio, doesn't actually speak text

---

### Phase 3 Implementation Plan

#### Architecture Decision: Direct Playback vs File Export

**Two Approaches:**

**1. Direct Playback (Simpler, Recommended) ✅**
- Use `Speech.speak()` directly in results screen
- No file saving required
- Instant playback
- Less code complexity

**2. File Export (Complex, Not Supported) ❌**
- expo-speech doesn't support audio file export
- Would need separate audio recording library
- More complex implementation
- Not necessary for our use case

**Decision:** Use **Direct Playback** approach

---

### Updated Architecture

```
Simplified Text (from Phase 1)
   ↓
User taps "Play Audio" in results.tsx
   ↓
Speech.speak(simplifiedText, options)
   ↓
Audio plays directly on device
   ↓
Callbacks update UI (playing/paused/stopped)
```

**Key Insight:** We don't need to "generate" audio files. We can play text directly using TTS!

---

## 🔧 Detailed Implementation

### Step 1: Update audioConvert.ts (Refactor)

**New Approach:** Instead of generating audio files, provide a TTS interface

```typescript
// src/ai/adapt/audioConvert.ts

import * as Speech from 'expo-speech';
import type { AudioConfig, AudioResult, Voice } from '../types';

/**
 * Get available TTS voices on the device
 */
export async function getAvailableVoices(): Promise<Voice[]> {
  console.log('[Audio] Fetching available voices...');
  
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    console.log(`[Audio] Found ${voices.length} voices`);
    
    return voices.map(voice => ({
      id: voice.identifier,
      name: voice.name,
      language: voice.language,
      quality: voice.quality,
    }));
  } catch (error) {
    console.error('[Audio] Failed to fetch voices:', error);
    throw new AIProcessingError(
      'AUDIO_VOICES_FAILED',
      'Failed to fetch available voices'
    );
  }
}

/**
 * Speak text using device TTS (direct playback)
 * This replaces the old "generateAudio" concept
 */
export async function speakText(
  text: string,
  config: Partial<AudioConfig> = {}
): Promise<AudioResult> {
  console.log('[Audio] Starting TTS playback...');
  console.log(`[Audio] Text length: ${text.length} characters`);
  console.log(`[Audio] Config:`, config);
  
  try {
    // Validate text length
    const maxLength = Speech.maxSpeechInputLength;
    if (text.length > maxLength) {
      throw new Error(`Text too long: ${text.length} > ${maxLength}`);
    }
    
    // Calculate estimated duration
    const wordsPerMinute = 150; // Average reading speed
    const wordCount = text.split(/\s+/).length;
    const rate = config.voiceSpeed || 1.0;
    const estimatedDuration = (wordCount / (wordsPerMinute * rate)) * 60;
    
    // Prepare speech options
    const speechOptions: Speech.SpeechOptions = {
      language: config.language || 'en-US',
      pitch: config.pitch || 1.0,
      rate: config.voiceSpeed || 1.0,
      voice: config.voiceId,
      onStart: () => {
        console.log('[Audio] ▶️ Playback started');
        config.onStart?.();
      },
      onDone: () => {
        console.log('[Audio] ✅ Playback completed');
        config.onDone?.();
      },
      onStopped: () => {
        console.log('[Audio] ⏹️ Playback stopped');
        config.onStopped?.();
      },
      onError: (error) => {
        console.error('[Audio] ❌ Playback error:', error);
        config.onError?.(error);
      },
      onBoundary: (event) => {
        // Word boundaries for progress tracking
        config.onProgress?.(event);
      },
    };
    
    // Start speaking
    Speech.speak(text, speechOptions);
    
    console.log(`[Audio] ✅ TTS playback initiated (${estimatedDuration.toFixed(1)}s estimated)`);
    
    return {
      audioUri: null, // No file generated (direct playback)
      duration: estimatedDuration,
      format: 'tts', // Mark as TTS (not file format)
      metadata: {
        voiceId: config.voiceId,
        language: config.language || 'en-US',
        speed: config.voiceSpeed || 1.0,
        pitch: config.pitch || 1.0,
        wordCount,
        charCount: text.length,
      },
    };
  } catch (error) {
    console.error('[Audio] ❌ TTS failed:', error);
    throw new AIProcessingError(
      'AUDIO_TTS_FAILED',
      `Failed to speak text: ${error.message}`
    );
  }
}

/**
 * Check if TTS is currently speaking
 */
export async function isSpeaking(): Promise<boolean> {
  return await Speech.isSpeakingAsync();
}

/**
 * Pause current speech (iOS only)
 */
export async function pauseSpeech(): Promise<void> {
  console.log('[Audio] ⏸️ Pausing speech');
  await Speech.pause();
}

/**
 * Resume paused speech (iOS only)
 */
export async function resumeSpeech(): Promise<void> {
  console.log('[Audio] ▶️ Resuming speech');
  await Speech.resume();
}

/**
 * Stop current speech and clear queue
 */
export async function stopSpeech(): Promise<void> {
  console.log('[Audio] ⏹️ Stopping speech');
  await Speech.stop();
}

/**
 * Calculate estimated duration (kept for backward compatibility)
 * @deprecated Use speakText() instead which returns duration
 */
function calculateDuration(text: string, speed: number): number {
  const wordCount = text.split(/\s+/).length;
  const wordsPerMinute = 150 * speed;
  return (wordCount / wordsPerMinute) * 60;
}
```

---

### Step 2: Update Types (Add Voice and Audio Interfaces)

```typescript
// src/ai/types.ts

export interface Voice {
  id: string; // Voice identifier
  name: string; // Human-readable name
  language: string; // Language code (e.g., 'en-US')
  quality: 'Default' | 'Enhanced';
}

export interface AudioConfig {
  voiceId?: string; // Voice identifier
  language?: string; // Language code (IETF BCP 47)
  voiceSpeed?: number; // 0.5 - 2.0 (1.0 = normal)
  pitch?: number; // 0.5 - 2.0 (1.0 = normal)
  
  // Callbacks
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (event: any) => void; // Word boundary events
}

export interface AudioResult {
  audioUri: string | null; // null for direct TTS playback
  duration: number; // Estimated duration in seconds
  format: 'tts' | 'mp3' | 'wav'; // 'tts' for direct playback
  metadata?: {
    voiceId?: string;
    language?: string;
    speed?: number;
    pitch?: number;
    wordCount?: number;
    charCount?: number;
  };
}
```

---

### Step 3: Update Main Orchestrator

```typescript
// src/ai/index.ts

import { speakText, getAvailableVoices } from './adapt/audioConvert';

export async function processDocument(
  uri: string,
  options: ProcessingOptions = {}
): Promise<ProcessingResult> {
  // ... existing extraction and simplification ...
  
  // Audio generation (now uses real TTS)
  console.log('\n🔊 Step 3: Generating audio...');
  const audioResult = await speakText(simplifiedText, {
    language: 'en-US',
    voiceSpeed: options.audioSpeed || 1.0,
    pitch: options.audioPitch || 1.0,
    voiceId: options.voiceId, // Optional: user-selected voice
  });
  
  // ... rest of pipeline ...
}

// Export voice fetching
export { getAvailableVoices } from './adapt/audioConvert';
```

---

### Step 4: Update Results Screen UI

**Key Changes:**
- Add audio playback controls
- Show play/pause/stop buttons
- Display voice selection dropdown
- Add speed slider (0.5x - 2.0x)
- Add pitch slider (optional)

```typescript
// app/results.tsx (simplified example)

import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { getAvailableVoices, speakText, stopSpeech, isSpeaking } from '../src/ai/adapt/audioConvert';

export default function ResultsScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  
  // Load available voices on mount
  useEffect(() => {
    loadVoices();
  }, []);
  
  async function loadVoices() {
    const availableVoices = await getAvailableVoices();
    setVoices(availableVoices);
    
    // Default to first English voice
    const defaultVoice = availableVoices.find(v => v.language.startsWith('en'));
    setSelectedVoice(defaultVoice?.id);
  }
  
  async function handlePlayAudio() {
    if (isPlaying) {
      await stopSpeech();
      setIsPlaying(false);
    } else {
      await speakText(simplifiedText, {
        voiceId: selectedVoice,
        voiceSpeed: speed,
        onStart: () => setIsPlaying(true),
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
        onError: (error) => {
          console.error('Speech error:', error);
          setIsPlaying(false);
          Alert.alert('Audio Error', error.message);
        },
      });
    }
  }
  
  return (
    <View>
      {/* Voice selection */}
      <Picker
        selectedValue={selectedVoice}
        onValueChange={setSelectedVoice}
      >
        {voices.map(voice => (
          <Picker.Item
            key={voice.id}
            label={`${voice.name} (${voice.language})`}
            value={voice.id}
          />
        ))}
      </Picker>
      
      {/* Speed control */}
      <Text>Speed: {speed.toFixed(1)}x</Text>
      <Slider
        value={speed}
        onValueChange={setSpeed}
        minimumValue={0.5}
        maximumValue={2.0}
        step={0.1}
      />
      
      {/* Play button */}
      <Button
        title={isPlaying ? 'Stop Audio' : 'Play Audio'}
        onPress={handlePlayAudio}
      />
    </View>
  );
}
```

---

## 🎯 Implementation Steps (Phase 3)

### Timeline: 4-5 hours

**Step 1: Update audioConvert.ts (2 hours)**
- [ ] Refactor from file generation to direct playback
- [ ] Implement `speakText()` function
- [ ] Implement `getAvailableVoices()` function
- [ ] Add control functions (pause, resume, stop)
- [ ] Add comprehensive error handling
- [ ] Add detailed logging

**Step 2: Update Types (30 minutes)**
- [ ] Add `Voice` interface
- [ ] Update `AudioConfig` interface with callbacks
- [ ] Update `AudioResult` interface for TTS

**Step 3: Update Main Orchestrator (30 minutes)**
- [ ] Update `processDocument()` to use `speakText()`
- [ ] Export `getAvailableVoices` function
- [ ] Update error handling

**Step 4: Update Results Screen UI (1.5 hours)**
- [ ] Add voice selection dropdown
- [ ] Add speed slider (0.5x - 2.0x)
- [ ] Add play/pause/stop controls
- [ ] Add playback state management
- [ ] Handle iOS silent mode warning
- [ ] Add error alerts for TTS failures

**Step 5: Testing (1 hour)**
- [ ] Test with short text (1 sentence)
- [ ] Test with long text (500+ words)
- [ ] Test voice selection
- [ ] Test speed control (0.5x, 1.0x, 2.0x)
- [ ] Test pause/resume (iOS only)
- [ ] Test error handling
- [ ] Test on physical device (iOS)
- [ ] Test on physical device (Android)

**Total Time:** 4-5 hours

---

## ✅ Expected Outcomes

### What Changes

**Before Phase 3:**
```
Process document → Extract → Simplify → Generate audio (mock file)
Result: Fake audio URL that doesn't work
```

**After Phase 3:**
```
Process document → Extract → Simplify → Speak text directly
Result: Real audio playback on device with voice selection and speed control
```

### User Experience

**Current (Stubbed):**
- User sees "Audio generated" but can't play it
- Mock audio URL doesn't work

**After Phase 3:**
- User taps "Play Audio" → Text is spoken immediately
- User can select different voices
- User can adjust playback speed (0.5x - 2.0x)
- User can pause/stop playback
- Audio plays through device speakers/headphones

---

## 🎨 UI/UX Considerations

### Audio Controls Design

**Minimal Controls:**
- ▶️ Play button
- ⏹️ Stop button
- 🗣️ Voice selector (dropdown)
- ⚡ Speed control (slider)

**Optional Enhancements (Later Phase):**
- ⏸️ Pause button (iOS only)
- 🔊 Volume control
- ⏩ Skip forward/backward
- 📊 Progress bar with word highlighting
- 💾 Save audio preferences

**iOS Silent Mode Warning:**
```
⚠️ Audio Tip:
Your device is in silent mode. Speech won't be audible.
Please turn off silent mode to hear audio.
```

---

## 💰 Cost Analysis

**Good News:** expo-speech is **100% FREE** and **offline**!

- ✅ No API calls (uses device TTS)
- ✅ No cloud costs
- ✅ Works without internet
- ✅ Unlimited usage
- ✅ No rate limits

**vs Gemini Audio Generation:**
- Google Cloud TTS: ~$16 per 1M characters
- Our app: $0 (device TTS)

**Winner:** 🏆 Massive cost savings!

---

## 🚨 Potential Issues & Solutions

### Issue 1: iOS Silent Mode
**Problem:** Speech won't play if device is in silent mode  
**Solution:** Show alert warning user to disable silent mode

### Issue 2: Voice Quality Varies by Device
**Problem:** Android voices may sound robotic compared to iOS  
**Solution:** 
- Test on both platforms
- Allow voice selection
- Set reasonable expectations in UI

### Issue 3: No Pause on Android
**Problem:** `Speech.pause()` not available on Android  
**Solution:** 
- Only show pause button on iOS
- Use stop/play as alternative on Android

### Issue 4: Long Text May Cut Off
**Problem:** `maxSpeechInputLength` varies by platform  
**Solution:**
- Check `Speech.maxSpeechInputLength` before speaking
- Split long text into chunks if needed
- Show warning for very long documents

### Issue 5: Background Playback
**Problem:** Speech may stop when app goes to background  
**Solution:**
- Document this limitation
- Consider expo-av for background audio (future phase)

---

## 🔄 Comparison: Direct TTS vs File Generation

| Feature | Direct TTS (expo-speech) | File Generation |
|---------|-------------------------|-----------------|
| **Implementation** | ✅ Simple (one function call) | ❌ Complex (recording, saving) |
| **Setup** | ✅ Zero (already installed) | ❌ Need additional libraries |
| **File Storage** | ✅ No storage needed | ❌ Requires file management |
| **Playback Speed** | ✅ Instant | ⚠️ Delayed (generate first) |
| **Voice Selection** | ✅ Built-in | ⚠️ Would need custom solution |
| **Cost** | ✅ Free (device TTS) | ⚠️ Could use cloud TTS ($$$) |
| **Offline** | ✅ Works offline | ⚠️ Depends on approach |
| **Sharing** | ❌ Can't share audio file | ✅ Could share file |
| **Persistence** | ❌ No saved audio | ✅ Audio file saved |

**Verdict:** Direct TTS wins for MVP. File generation can be added later if needed.

---

## 🎯 Phase 3 Success Criteria

**Must Have:**
- ✅ Real TTS playback (not mock)
- ✅ Voice selection working
- ✅ Speed control working (0.5x - 2.0x)
- ✅ Play/stop controls functional
- ✅ Error handling (silent mode, text too long)
- ✅ Works on Expo Go (no prebuild)
- ✅ Tested on iOS and Android

**Nice to Have:**
- ⚠️ Pause/resume (iOS only)
- ⚠️ Progress indicator
- ⚠️ Word highlighting during playback
- ⚠️ Save voice preferences

---

## 📚 Resources

- **expo-speech Docs:** https://docs.expo.dev/versions/latest/sdk/speech/
- **IETF BCP 47 Language Codes:** https://www.rfc-editor.org/rfc/bcp/bcp47.txt
- **iOS Voice List:** Available via `getAvailableVoicesAsync()`
- **Android TTS:** https://developer.android.com/reference/android/speech/tts/TextToSpeech

---

## 🚀 Next Actions

**When you say "START PHASE 3":**

1. ✅ Update `src/ai/adapt/audioConvert.ts` (refactor to direct TTS)
2. ✅ Update `src/ai/types.ts` (add Voice, update AudioConfig)
3. ✅ Update `src/ai/index.ts` (use speakText instead of generateAudio)
4. ✅ Update `app/results.tsx` (add audio controls UI)
5. ✅ Test on iOS simulator
6. ✅ Test on Android simulator
7. ✅ Test on physical device (if available)
8. ✅ Document any platform-specific quirks
9. ✅ Update ARCHITECTURE.md
10. ✅ Create PHASE_3_COMPLETE.md
11. ✅ Commit to GitHub

**No additional packages needed!** expo-speech is already installed. ✅

---

## 📋 Files to Modify

| File | Changes | Estimated Time |
|------|---------|----------------|
| `src/ai/adapt/audioConvert.ts` | Complete refactor (file gen → direct TTS) | 2 hours |
| `src/ai/types.ts` | Add Voice interface, update AudioConfig | 30 minutes |
| `src/ai/index.ts` | Update orchestrator to use speakText() | 30 minutes |
| `app/results.tsx` | Add audio controls UI | 1.5 hours |
| `docs/ARCHITECTURE.md` | Update audio section | 15 minutes |
| `README.md` | Update Phase 3 status | 5 minutes |

**Total:** ~4.5 hours implementation + 1 hour testing = **5.5 hours**

---

## 🎯 Decision Summary

**Chosen Solution:** expo-speech (Direct TTS Playback)

**Why:**
1. ✅ Already installed (zero setup)
2. ✅ Works on Expo Go (no prebuild)
3. ✅ Simple implementation (4-5 hours)
4. ✅ Free (device TTS, no API costs)
5. ✅ Cross-platform (iOS, Android, Web)
6. ✅ Sufficient features for MVP

**Alternative Considered:** File generation with audio export
**Rejected Because:** More complex, not supported by expo-speech, not needed for MVP

---

**Status:** 🎯 **Ready to implement when you give the go-ahead!**

Say "START PHASE 3" when ready to begin implementation.
