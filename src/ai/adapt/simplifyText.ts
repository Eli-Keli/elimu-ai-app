import { SimplificationResult, AIProcessingError, AIProcessingErrorType } from '../types';
import { generateGeminiContent, generateGeminiContentWithRetry, GeminiModel } from '../models/gemini';

/**
 * Simplifies complex text into more accessible language
 * Uses AI (Gemini) to rewrite content for better readability
 * 
 * @param text - Raw text to simplify
 * @returns Promise resolving to simplification result
 * @throws AIProcessingError if simplification fails
 */
export async function simplifyContent(text: string): Promise<SimplificationResult> {
  console.log('[Simplify] Starting text simplification. Input length:', text.length);
  
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        'Cannot simplify empty text'
      );
    }

    // Build prompt for Gemini
    const prompt = `You are an educational accessibility assistant. Simplify the following text to make it easier to understand for learners with diverse needs.

Guidelines:
- Use simple, clear language (8th grade reading level)
- Break down complex concepts into digestible parts
- Maintain accuracy of information
- Keep the core meaning intact
- Use shorter sentences and paragraphs

Text to simplify:
"""${text}"""

Provide the simplified version only, without explanations.`;

    // Call Gemini API with retry logic for reliability
    const simplifiedText = await generateGeminiContentWithRetry(prompt, {
      model: GeminiModel.FLASH_2_5, // Fast and cost-effective for text simplification
      temperature: 0.7, // Balanced creativity and accuracy
      maxOutputTokens: Math.min(text.length * 2, 4096) // Allow up to 2x original length
    });

    const result: SimplificationResult = {
      simplifiedText,
      originalLength: text.length,
      simplifiedLength: simplifiedText.length,
      readabilityScore: 8.0 // TODO: Calculate actual readability score
    };

    console.log('[Simplify] Simplified from', result.originalLength, 'to', result.simplifiedLength, 'characters');
    return result;

  } catch (error) {
    console.error('[Simplify] Simplification failed:', error);
    
    if (error instanceof AIProcessingError) {
      throw error;
    }
    
    throw new AIProcessingError(
      AIProcessingErrorType.SIMPLIFICATION_FAILED,
      'Failed to simplify text content',
      error as Error
    );
  }
}
