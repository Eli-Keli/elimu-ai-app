import { extractTextFromUri } from './extract/extractText';
import { simplifyContent } from './adapt/simplifyText';
import { speakText, getAvailableVoices } from './adapt/audioConvert';
import { generateVisuals } from './adapt/visualAids';
import { 
  DocumentProcessingResult, 
  ProcessingConfig,
  AIProcessingError,
  AIProcessingErrorType 
} from './types';

/**
 * Main orchestrator for the Elimu AI document processing pipeline
 * 
 * Pipeline flow:
 * 1. Extract text from document (PDF/Image -> Raw Text)
 * 2. Simplify text for accessibility (Complex -> Simple)
 * 3. Generate audio narration (Text -> Speech)
 * 4. Generate visual learning aids (Text -> Visual Descriptions)
 * 
 * @param uri - Local file URI or remote URL of the document
 * @param config - Optional configuration for processing steps
 * @returns Promise resolving to complete processing result
 * @throws AIProcessingError if any critical step fails
 */
export async function processDocument(
  uri: string,
  config?: ProcessingConfig
): Promise<DocumentProcessingResult> {
  const startTime = Date.now();
  
  console.log('\n========================================');
  console.log('🚀 Starting AI Processing Pipeline');
  console.log('========================================');
  console.log('📄 Document URI:', uri);
  console.log('⚙️  Config:', config || 'default');
  console.log('');

  try {
    // Step 1: Extract text from document
    console.log('📖 [1/4] Extracting text...');
    const extraction = await extractTextFromUri(uri);
    console.log(`✅ Extracted ${extraction.rawText.length} characters from ${extraction.pageCount || 1} page(s)`);
    console.log('');

    // Step 2: Simplify content for accessibility
    console.log('✨ [2/4] Simplifying content...');
    const simplification = await simplifyContent(extraction.rawText);
    console.log(`✅ Simplified to ${simplification.simplifiedLength} characters (${Math.round((simplification.simplifiedLength / simplification.originalLength) * 100)}% of original)`);
    console.log('');

    // Step 3: Generate audio narration (non-blocking)
    console.log('🔊 [3/4] Generating audio narration...');
    const audioResult = await speakText(simplification.simplifiedText, {
      language: config?.audio?.language || 'en-US',
      voiceSpeed: config?.audio?.speed || 1.0,
    });
    if (audioResult.status === 'ready') {
      console.log(`✅ Audio generated (${audioResult.duration?.toFixed(1)}s, ${audioResult.format})`);
    } else {
      console.warn('⚠️  Audio generation failed (continuing without audio)');
    }
    console.log('');

    // Step 4: Generate visual learning aids (non-blocking)
    console.log('🎨 [4/4] Generating visual aids...');
    const visualsResult = await generateVisuals(simplification.simplifiedText);
    if (visualsResult.status === 'ready') {
      console.log(`✅ Generated ${visualsResult.images.length} visual aid(s)`);
    } else {
      console.warn('⚠️  Visual generation failed (continuing without visuals)');
    }
    console.log('');

    // Build final result
    const processingTimeMs = Date.now() - startTime;
    const result: DocumentProcessingResult = {
      text: simplification.simplifiedText,
      audio: audioResult,
      images: visualsResult,
      metadata: {
        processingTimeMs,
        documentUri: uri,
        timestamp: new Date().toISOString(),
        extractionMethod: 'native' // TODO: Set based on actual method used
      }
    };

    console.log('========================================');
    console.log('✨ Pipeline Complete!');
    console.log(`⏱️  Total time: ${(processingTimeMs / 1000).toFixed(2)}s`);
    console.log('========================================\n');

    return result;

  } catch (error) {
    const processingTimeMs = Date.now() - startTime;
    
    console.error('\n========================================');
    console.error('❌ Pipeline Failed!');
    console.error(`⏱️  Failed after: ${(processingTimeMs / 1000).toFixed(2)}s`);
    console.error('========================================\n');
    console.error('Error details:', error);
    
    if (error instanceof AIProcessingError) {
      throw error;
    }
    
    throw new AIProcessingError(
      AIProcessingErrorType.EXTRACTION_FAILED,
      'Document processing pipeline failed',
      error as Error
    );
  }
}

// Re-export types for convenience
export * from './types';

// Export audio utilities
export { getAvailableVoices } from './adapt/audioConvert';
