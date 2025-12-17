import { File } from 'expo-file-system';
import { ExtractionResult, AIProcessingError, AIProcessingErrorType } from '../types';
import { generateGeminiContentWithRetry } from '../models/gemini';

/**
 * Determines MIME type from file extension
 */
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
  };
  
  const normalizedExt = extension.toLowerCase();
  return mimeTypes[normalizedExt] || 'application/pdf';
}

/**
 * Estimates page count from extracted text length
 * Rough estimate: ~500 characters per page
 */
function estimatePages(text: string): number {
  return Math.max(1, Math.ceil(text.length / 500));
}

/**
 * Extracts text from a document URI using Gemini Multimodal API
 * Supports PDFs and images (JPG, PNG, WebP, HEIC, HEIF)
 * Automatically performs OCR on scanned documents
 * 
 * @param uri - Local file URI from document picker
 * @returns Promise resolving to extraction result with text and metadata
 * @throws AIProcessingError if extraction fails
 */
export async function extractTextFromUri(uri: string): Promise<ExtractionResult> {
  console.log('[Extract] Starting Gemini-powered text extraction for:', uri);
  
  try {
    // Validate input
    if (!uri || typeof uri !== 'string') {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        'Invalid URI provided for text extraction'
      );
    }

    // Step 1: Read file using expo-file-system
    console.log('[Extract] Reading file bytes...');
    const file = new File(uri);
    
    if (!file.exists) {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        `File does not exist at URI: ${uri}`
      );
    }

    const fileBytes = await file.bytes(); // Returns Uint8Array
    const fileSize = file.size;
    const fileName = file.name;
    const extension = file.extension;
    
    console.log('[Extract] File loaded:', {
      name: fileName,
      size: `${(fileSize / 1024).toFixed(2)} KB`,
      extension,
    });

    // Step 2: Determine MIME type
    const mimeType = getMimeType(extension);
    console.log('[Extract] MIME type:', mimeType);

    // Step 3: Check file size limit (50MB for Gemini)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (fileSize > MAX_FILE_SIZE) {
      throw new AIProcessingError(
        AIProcessingErrorType.INVALID_INPUT,
        `File size (${(fileSize / 1024 / 1024).toFixed(2)} MB) exceeds maximum limit of 50MB`
      );
    }

    // Step 4: Prepare extraction prompt
    const extractionPrompt = `Extract all text content from this document. 
Preserve paragraph structure and formatting where possible.
If this is a scanned document or image, use OCR to extract the text.
Return ONLY the extracted text content, without any explanations or metadata.`;

    console.log('[Extract] Sending to Gemini for text extraction...');

    // Step 5: Call Gemini API with document bytes
    // Note: Using inline upload for all files (simpler than Files API for now)
    const response = await generateGeminiContentWithRetry({
      prompt: extractionPrompt,
      fileData: {
        data: fileBytes,
        mimeType: mimeType,
      },
      maxRetries: 3,
    });

    const extractedText = response.trim();
    
    if (!extractedText || extractedText.length === 0) {
      throw new AIProcessingError(
        AIProcessingErrorType.EXTRACTION_FAILED,
        'No text could be extracted from the document'
      );
    }

    const pageCount = estimatePages(extractedText);

    console.log('[Extract] ✅ Successfully extracted', extractedText.length, 'characters from', pageCount, 'estimated page(s)');

    return {
      rawText: extractedText,
      pageCount,
      confidence: 1.0, // Gemini handles OCR internally, confidence is implicit
      language: 'en', // TODO: Could detect language from extracted text
      metadata: {
        fileName,
        fileSize,
        mimeType,
        extractionMethod: 'gemini-multimodal',
      },
    };

  } catch (error) {
    console.error('[Extract] ❌ Text extraction failed:', error);
    
    if (error instanceof AIProcessingError) {
      throw error;
    }
    
    throw new AIProcessingError(
      AIProcessingErrorType.EXTRACTION_FAILED,
      'Failed to extract text from document',
      error as Error
    );
  }
}
