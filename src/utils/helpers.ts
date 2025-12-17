/**
 * Utility functions for Elimu AI application
 */

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024; // <-- 1 KB = 1024 Bytes
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]; // <-- 2 decimal places
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    if (mins === 0) {
        return `${secs}s`;
    }

    return `${mins}m ${secs}s`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength - 3) + '...'; // <-- Add ellipsis if truncated
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if string is valid URI
 */
export function isValidUri(uri: string): boolean {
    try {
        const url = new URL(uri);
        return url.protocol === 'file:' || url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Get file extension from URI
 */
export function getFileExtension(uri: string): string | null {
    try {
        const url = new URL(uri);
        const pathname = url.pathname;
        const match = pathname.match(/\.([^.]+)$/);
        return match ? match[1].toLowerCase() : null;
    } catch {
        return null;
    }
}

/**
 * Check if file is PDF
 */
export function isPdf(uri: string): boolean {
    return getFileExtension(uri) === 'pdf';
}

/**
 * Check if file is image
 */
export function isImage(uri: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const ext = getFileExtension(uri);
    return ext ? imageExtensions.includes(ext) : false;
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (i < maxRetries - 1) {
                await sleep(delay * Math.pow(2, i)); // Exponential backoff
            }
        }
    }

    throw lastError!;
}

// ⬇️ moved from src/ai/models/gemini.ts ⬇️
/**
 * Validates Gemini API key
 * @returns true if API key is configured
 */
export function isGeminiConfigured(): boolean {
    // TODO: Check for actual API key in environment
    return false;
}

/**
 * Converts Uint8Array to base64 string (React Native compatible)
 * Buffer is not available in React Native, so we use native encoding
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}