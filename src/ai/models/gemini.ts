import { GoogleGenAI } from '@google/genai';
import { AIProcessingError, AIProcessingErrorType, GeminiModel, GeminiConfig, FileData, GenerateContentOptions } from '../types';
import { uint8ArrayToBase64 } from '../../utils/helpers';

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
 * @param fileData - Optional file data for multimodal requests (PDFs, images)
 * @returns Promise resolving to generated text
 * @throws AIProcessingError if API call fails
 */
export async function generateGeminiContent(
  prompt: string,
  config: Partial<GeminiConfig> = {},
  fileData?: FileData
): Promise<string> {
  console.log('[Gemini] Generating content. Prompt length:', prompt.length);
  if (fileData) {
    console.log('[Gemini] Including file data:', {
      mimeType: fileData.mimeType,
      size: `${(fileData.data.length / 1024).toFixed(2)} KB`
    });
  }

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

    // Build contents array
    const contents: any[] = fileData 
      ? [
          {
            inlineData: {
              data: uint8ArrayToBase64(fileData.data),
              mimeType: fileData.mimeType,
            },
          },
          prompt,
        ]
      : [prompt];

    // Make API call
    const response = await client.models.generateContent({
      model: finalConfig.model,
      contents,
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
 * Supports both text-only and multimodal (file) requests
 */
export async function generateGeminiContentWithRetry(
  options: GenerateContentOptions
): Promise<string> {
  const { prompt, fileData, config = {}, maxRetries = 3 } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini] Attempt ${attempt}/${maxRetries}`);
      return await generateGeminiContent(prompt, config, fileData);
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
