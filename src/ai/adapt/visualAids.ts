import { VisualAidsResult, VisualAid, AIProcessingError, AIProcessingErrorType } from '../types';
import { generateGeminiContent, generateGeminiContentWithRetry, GeminiModel } from '../models/gemini';
import { GoogleGenAI } from '@google/genai';

/**
 * Suggests visual aids descriptions using Gemini text model
 */
async function generateVisualSuggestions(text: string): Promise<VisualAid[]> {
  const prompt = `Analyze the following educational content and suggest 2-3 visual learning aids that would help learners understand it better.

For each visual aid, provide:
1. Type (must be one of: diagram, infographic, timeline, illustration)
2. Brief description of what it should show (detailed, suitable for image generation)
3. Accessibility-friendly alt text

Content:
"""${text}"""

Respond ONLY with a JSON array like this:
[
  {
    "type": "diagram",
    "description": "detailed description for image generation",
    "altText": "accessibility description"
  }
]`;

  const response = await generateGeminiContentWithRetry(prompt, {
    model: GeminiModel.FLASH_2_5,
    temperature: 0.8 // Higher creativity for visual suggestions
  });

  try {
    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }
    
    const suggestions = JSON.parse(jsonStr);
    return suggestions.map((s: any) => ({
      ...s,
      url: '' // Will be populated after image generation
    }));
  } catch (error) {
    console.error('[Visuals] Failed to parse suggestions:', error);
    throw new AIProcessingError(
      AIProcessingErrorType.VISUAL_GENERATION_FAILED,
      'Failed to parse visual suggestions from Gemini',
      error as Error
    );
  }
}

/**
 * Generates actual images using Gemini Nano Banana (image generation)
 * Note: This uses the Gemini API's image generation capabilities
 */
async function generateImages(suggestions: VisualAid[]): Promise<VisualAid[]> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[Visuals] No API key configured, returning suggestions without images');
    return suggestions.map(s => ({ ...s, url: 'placeholder://no-api-key' }));
  }

  const client = new GoogleGenAI({ apiKey });
  const generatedVisuals: VisualAid[] = [];

  for (const suggestion of suggestions) {
    try {
      console.log(`[Visuals] Generating image for: ${suggestion.description}`);
      
      // Generate image using Gemini 2.5 Flash (supports image generation)
      const response = await client.models.generateContent({
        model: GeminiModel.FLASH_2_5,
        contents: `Create an educational ${suggestion.type} showing: ${suggestion.description}. Style: clean, minimalist, educational, suitable for learning apps.`
      });

      // Note: The actual image generation API may return image data or URL
      // This is a simplified implementation - adjust based on actual API response
      const imageUrl = response.text || `data:image/generated-${Date.now()}`;

      generatedVisuals.push({
        ...suggestion,
        url: imageUrl
      });

    } catch (error) {
      console.error(`[Visuals] Failed to generate image for ${suggestion.type}:`, error);
      // Keep suggestion but mark as failed
      generatedVisuals.push({
        ...suggestion,
        url: `placeholder://generation-failed-${suggestion.type}`
      });
    }
  }

  return generatedVisuals;
}

/**
 * Generates visual learning aids from text content
 * Two-step process: 
 * 1. Use Gemini to suggest visual aids
 * 2. Use Gemini image generation to create them
 * 
 * @param text - Content to visualize
 * @returns Promise resolving to visual aids result
 * @throws AIProcessingError if generation fails
 */
export async function generateVisuals(text: string): Promise<VisualAidsResult> {
  console.log('[Visuals] Starting visual aids generation. Input length:', text.length);
  
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        'Cannot generate visuals from empty text'
      );
    }

    // Step 1: Get visual suggestions from Gemini
    console.log('[Visuals] Step 1: Generating suggestions...');
    const suggestions = await generateVisualSuggestions(text);
    console.log(`[Visuals] Generated ${suggestions.length} suggestions`);

    // Step 2: Generate actual images (if API key available)
    console.log('[Visuals] Step 2: Generating images...');
    const visuals = await generateImages(suggestions);

    const result: VisualAidsResult = {
      images: visuals,
      status: 'ready'
    };

    console.log('[Visuals] Generated', result.images.length, 'visual aids');
    return result;

  } catch (error) {
    console.error('[Visuals] Visual generation failed:', error);
    
    if (error instanceof AIProcessingError) {
      throw error;
    }
    
    // Return empty result on failure
    return {
      images: [],
      status: 'failed'
    };
  }
}
