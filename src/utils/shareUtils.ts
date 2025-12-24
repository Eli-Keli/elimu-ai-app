/**
 * Save and Share Utilities
 * 
 * Handles saving content to device storage and sharing via system share sheet.
 * Uses expo-file-system and expo-sharing.
 * Clipboard functionality is handled at component level using @react-native-clipboard/clipboard
 */

import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Save text content as a file
 */
export async function saveTextFile(
  content: string,
  filename: string
): Promise<{ success: boolean; uri?: string; error?: string }> {
  try {
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      };
    }

    // Create file path in cache directory
    const file = new File(Paths.cache, filename);
    // writeAsStringAsync defaults to UTF8 encoding
    await file.write(content);

    // Share the file (user can save to Files app, etc.)
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/plain',
      dialogTitle: 'Save Simplified Text',
      UTI: 'public.plain-text',
    });

    return { success: true, uri: file.uri };
  } catch (error) {
    console.error('Failed to save text file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Share text via system share sheet
 */
export async function shareText(
  text: string,
  title?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      };
    }

    // Create temporary file
    const filename = `${title || 'elimu_text'}_${Date.now()}.txt`;
    const file = new File(Paths.cache, filename);
    
    // writeAsStringAsync defaults to UTF8 encoding
    await file.write(text);

    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/plain',
      dialogTitle: title || 'Share Text',
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to share text:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Save markdown content as a formatted file
 */
export async function saveMarkdownFile(
  content: string,
  filename: string
): Promise<{ success: boolean; uri?: string; error?: string }> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      };
    }

    // Ensure filename ends with .md
    const mdFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    const file = new File(Paths.cache, mdFilename);

    // writeAsStringAsync defaults to UTF8 encoding
    await file.write(content);

    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/markdown',
      dialogTitle: 'Save as Markdown',
      UTI: 'net.daringfireball.markdown',
    });

    return { success: true, uri: file.uri };
  } catch (error) {
    console.error('Failed to save markdown file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Share image file
 */
export async function shareImage(
  imageUri: string,
  title?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      };
    }

    await Sharing.shareAsync(imageUri, {
      mimeType: 'image/png',
      dialogTitle: title || 'Share Image',
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to share image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Save image to device (via share sheet - user can save to Photos)
 */
export async function saveImage(
  imageUri: string,
  filename?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      };
    }

    // If it's a bundled asset (require()), we need to copy it to cache first
    let sharableUri = imageUri;

    // Check if it's a local file or needs to be copied
    if (!imageUri.startsWith('file://')) {
      // It's likely a bundled asset, we'll share it directly
      // Note: Bundled assets from require() are already accessible
      sharableUri = imageUri;
    }

    await Sharing.shareAsync(sharableUri, {
      mimeType: 'image/png',
      dialogTitle: filename || 'Save Image',
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to save image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a summary document with all content (text + key takeaways)
 */
export async function saveCompleteDocument(data: {
  title: string;
  subject?: string;
  simplifiedText: string;
  keyTakeaways?: string[];
  originalText?: string;
}): Promise<{ success: boolean; uri?: string; error?: string }> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      };
    }

    // Create formatted document
    let document = `# ${data.title}\n\n`;
    
    if (data.subject) {
      document += `**Subject:** ${data.subject}\n\n`;
    }

    document += `**Generated by:** Elimu AI\n`;
    document += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    document += `---\n\n`;
    
    document += `## Simplified Content\n\n${data.simplifiedText}\n\n`;

    if (data.keyTakeaways && data.keyTakeaways.length > 0) {
      document += `---\n\n## Key Takeaways\n\n`;
      data.keyTakeaways.forEach((takeaway, index) => {
        document += `${index + 1}. ${takeaway}\n`;
      });
      document += `\n`;
    }

    if (data.originalText) {
      document += `---\n\n## Original Text\n\n${data.originalText}\n\n`;
    }

    document += `---\n\n`;
    document += `*Simplified with Elimu AI - Learn Better, Together*\n`;

    // Save as markdown file
    const filename = `${data.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.md`;
    return await saveMarkdownFile(document, filename);
  } catch (error) {
    console.error('Failed to save complete document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Share content summary (text only, lightweight)
 */
export async function shareSummary(data: {
  title: string;
  text: string;
  keyTakeaways?: string[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    let summary = `${data.title}\n\n`;
    summary += `${data.text}\n\n`;

    if (data.keyTakeaways && data.keyTakeaways.length > 0) {
      summary += `Key Takeaways:\n`;
      data.keyTakeaways.forEach((takeaway, index) => {
        summary += `${index + 1}. ${takeaway}\n`;
      });
      summary += `\n`;
    }

    summary += `Generated with Elimu AI`;

    return await shareText(summary, data.title);
  } catch (error) {
    console.error('Failed to share summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
