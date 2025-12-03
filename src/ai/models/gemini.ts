import { GoogleGenAI } from '@google/genai';
import { AIProcessingError, AIProcessingErrorType } from '../types';

/**
 * Configuration for Gemini API
 */
interface GeminiConfig {
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

/**
 * Available Gemini models
 */
export enum GeminiModel {
  FLASH_2_5 = 'gemini-2.5-flash',
  PRO_2_5 = 'gemini-2.5-pro',
  PRO_3_0 = 'gemini-3-pro-preview'
}

const DEFAULT_CONFIG: GeminiConfig = {
  model: GeminiModel.FLASH_2_5,
  temperature: 0.7,
  maxOutputTokens: 2048,
  topP: 0.95,
  topK: 40
};

/**
 * Singleton Gemini AI client instance
 */
let geminiClient: GoogleGenAI | null = null;

/**
 * Initialize Gemini client with API key
 * API key is automatically picked up from GEMINI_API_KEY or EXPO_PUBLIC_GEMINI_API_KEY environment variable
 */
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new AIProcessingError(
        AIProcessingErrorType.API_KEY_ERROR,
        'Gemini API key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file'
      );
    }

    geminiClient = new GoogleGenAI({ apiKey });
    console.log('[Gemini] Client initialized successfully');
  }

  return geminiClient;
}

/**
 * Generates content using Google's Gemini AI model
 * 
 * @param prompt - The prompt to send to Gemini
 * @param config - Optional configuration overrides
 * @returns Promise resolving to generated text
 * @throws AIProcessingError if API call fails
 */
export async function generateGeminiContent(
  prompt: string,
  config: Partial<GeminiConfig> = {}
): Promise<string> {
  console.log('[Gemini] Generating content. Prompt length:', prompt.length);

  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        'Cannot generate content from empty prompt'
      );
    }

    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const client = getGeminiClient();

    console.log('[Gemini] Using model:', finalConfig.model);

    // Make API call
    const response = await client.models.generateContent({
      model: finalConfig.model,
      contents: prompt
    });

    // Extract text from response
    const text = response.text;

    if (!text) {
      throw new AIProcessingError(
        AIProcessingErrorType.PROCESSING_FAILED,
        'Gemini API returned empty response'
      );
    }

    console.log('[Gemini] Generated response length:', text.length);
    return text;

  } catch (error) {
    console.error('[Gemini] Content generation failed:', error);

    if (error instanceof AIProcessingError) {
      throw error;
    }

    // Handle specific API errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('API key')) {
      throw new AIProcessingError(
        AIProcessingErrorType.API_KEY_ERROR,
        'Invalid or missing Gemini API key',
        error as Error
      );
    }

    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      throw new AIProcessingError(
        AIProcessingErrorType.RATE_LIMITED,
        'Gemini API rate limit exceeded. Please try again later.',
        error as Error
      );
    }

    throw new AIProcessingError(
      AIProcessingErrorType.NETWORK_ERROR,
      'Failed to generate content with Gemini API',
      error as Error
    );
  }
}

/**
 * Generate content with retry logic
 * Useful for handling transient network errors
 */
export async function generateGeminiContentWithRetry(
  prompt: string,
  config: Partial<GeminiConfig> = {},
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini] Attempt ${attempt}/${maxRetries}`);
      return await generateGeminiContent(prompt, config);
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error instanceof AIProcessingError) {
        if (
          error.type === AIProcessingErrorType.API_KEY_ERROR ||
          error.type === AIProcessingErrorType.INVALID_INPUT
        ) {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`[Gemini] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new AIProcessingError(
    AIProcessingErrorType.PROCESSING_FAILED,
    `Failed after ${maxRetries} attempts`,
    lastError!
  );
}
