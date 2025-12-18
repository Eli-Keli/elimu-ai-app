import * as Speech from 'expo-speech';
import { AudioResult, AudioConfig, Voice, AIProcessingError, AIProcessingErrorType } from '../types';

/**
 * Get available TTS voices on the device
 * 
 * @returns Promise resolving to array of available voices
 * @throws AIProcessingError if fetching voices fails
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
      quality: voice.quality as 'Default' | 'Enhanced',
    }));
  } catch (error) {
    console.error('[Audio] Failed to fetch voices:', error);
    throw new AIProcessingError(
      AIProcessingErrorType.AUDIO_GENERATION_FAILED,
      'Failed to fetch available voices'
    );
  }
}

/**
 * Speak text using device TTS (direct playback)
 * This replaces the old "generateAudio" concept with real-time TTS playback
 * 
 * @param text - Text to convert to speech
 * @param config - Audio configuration options
 * @returns Promise resolving to audio result with metadata
 * @throws AIProcessingError if TTS fails
 */
export async function speakText(
  text: string,
  config: Partial<AudioConfig> = {}
): Promise<AudioResult> {
  console.log('[Audio] Starting TTS playback...');
  console.log(`[Audio] Text length: ${text.length} characters`);
  console.log(`[Audio] Config:`, config);
  
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        'Cannot speak empty text'
      );
    }

    // Validate text length
    const maxLength = Speech.maxSpeechInputLength;
    if (text.length > maxLength) {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        `Text too long: ${text.length} characters exceeds maximum of ${maxLength}`
      );
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
    };
    
    // Start speaking
    Speech.speak(text, speechOptions);
    
    console.log(`[Audio] ✅ TTS playback initiated (${estimatedDuration.toFixed(1)}s estimated)`);
    
    return {
      audioUri: null, // No file generated (direct playback)
      duration: estimatedDuration,
      format: 'tts',
      status: 'ready',
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
    
    if (error instanceof AIProcessingError) {
      throw error;
    }
    
    throw new AIProcessingError(
      AIProcessingErrorType.AUDIO_GENERATION_FAILED,
      `Failed to speak text: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Check if TTS is currently speaking
 * 
 * @returns Promise resolving to true if speaking, false otherwise
 */
export async function isSpeaking(): Promise<boolean> {
  return await Speech.isSpeakingAsync();
}

/**
 * Pause current speech (iOS only)
 * Note: This method is not available on Android
 */
export async function pauseSpeech(): Promise<void> {
  console.log('[Audio] ⏸️ Pausing speech');
  await Speech.pause();
}

/**
 * Resume paused speech (iOS only)
 * Note: This method is not available on Android
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
 * Legacy function for backward compatibility
 * @deprecated Use speakText() instead
 */
export async function generateAudio(text: string): Promise<AudioResult> {
  console.warn('[Audio] generateAudio() is deprecated. Use speakText() instead.');
  return speakText(text);
}
