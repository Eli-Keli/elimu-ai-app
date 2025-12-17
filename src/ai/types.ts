/**
 * Type definitions for the Elimu AI processing pipeline
 */

/**
 * Result of the complete document processing pipeline
 */
export interface DocumentProcessingResult {
    text: string;
    audio: AudioResult;
    images: VisualAidsResult;
    metadata: ProcessingMetadata;
}

/**
 * Metadata about the processing operation
 */
export interface ProcessingMetadata {
    processingTimeMs: number;
    documentUri: string;
    timestamp: string;
    extractionMethod?: 'ocr' | 'native' | 'hybrid';
}

/**
 * Result of text extraction from a document
 */
export interface ExtractionResult {
    rawText: string;
    pageCount?: number;
    confidence?: number; // OCR confidence score (0-1)
    language?: string;
    metadata?: {
        fileName?: string;
        fileSize?: number;
        mimeType?: string;
        extractionMethod?: 'gemini-multimodal' | 'ocr' | 'native' | 'hybrid';
        geminiFileId?: string; // For Files API large file uploads
    };
}

/**
 * Result of text simplification
 */
export interface SimplificationResult {
    simplifiedText: string;
    originalLength: number;
    simplifiedLength: number;
    readabilityScore?: number;
}

/**
 * Audio generation result
 */
export interface AudioResult {
    audioUri: string | null;
    duration?: number; // in seconds
    format?: 'mp3' | 'wav' | 'aac';
    status: 'ready' | 'processing' | 'failed';
}

/**
 * Visual aids generation result
 */
export interface VisualAidsResult {
    images: VisualAid[];
    status: 'ready' | 'processing' | 'failed';
}

/**
 * Individual visual aid item
 */
export interface VisualAid {
    url: string;
    type: 'diagram' | 'infographic' | 'timeline' | 'illustration';
    description: string;
    altText: string;
}

/**
 * Configuration for the AI processing pipeline
 */
export interface ProcessingConfig {
    simplification?: {
        targetReadingLevel?: 'elementary' | 'middle' | 'high';
        maxLength?: number;
    };
    audio?: {
        voice?: 'male' | 'female' | 'neutral';
        speed?: number; // 0.5 - 2.0
        language?: string;
    };
    visuals?: {
        maxVisuals?: number;
        types?: Array<'diagram' | 'infographic' | 'timeline' | 'illustration'>;
    };
}

/**
 * Error types for AI processing
 */
export enum AIProcessingErrorType {
    EXTRACTION_FAILED = 'EXTRACTION_FAILED',
    SIMPLIFICATION_FAILED = 'SIMPLIFICATION_FAILED',
    AUDIO_GENERATION_FAILED = 'AUDIO_GENERATION_FAILED',
    VISUAL_GENERATION_FAILED = 'VISUAL_GENERATION_FAILED',
    NETWORK_ERROR = 'NETWORK_ERROR',
    INVALID_INPUT = 'INVALID_INPUT',
    API_KEY_ERROR = 'API_KEY_ERROR',
    RATE_LIMITED = 'RATE_LIMITED',
    PROCESSING_FAILED = 'PROCESSING_FAILED',
}

/**
 * Custom error class for AI processing failures
 */
export class AIProcessingError extends Error {
    constructor(
        public type: AIProcessingErrorType,
        message: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'AIProcessingError';
    }
}




/**
 * Configuration for Gemini API
 */
export interface GeminiConfig {
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

/**
 * File data for multimodal requests
 */
export interface FileData {
  data: Uint8Array;
  mimeType: string;
}

/**
 * Options for generating content with retry
 */
export interface GenerateContentOptions {
  prompt: string;
  fileData?: FileData;
  config?: Partial<GeminiConfig>;
  maxRetries?: number;
}

/**
 * Available Gemini models
 */
export enum GeminiModel {
  FLASH_2_5 = 'gemini-2.5-flash',
  PRO_2_5 = 'gemini-2.5-pro',
  PRO_3_0 = 'gemini-3-pro-preview'
}