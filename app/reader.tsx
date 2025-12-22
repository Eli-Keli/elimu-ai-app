import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { colors } from '../src/theme/colors';
import { processDocument, DocumentProcessingResult, AIProcessingError } from '../src/ai';
import { Button } from '../src/components/Button';
import ProcessingAnimation from '../src/components/processing/ProcessingAnimation';

type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

export default function ReaderScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>(); // <-- Get document URI from params
  const router = useRouter();
  
  const [state, setState] = useState<ProcessingState>('idle');
  const [result, setResult] = useState<DocumentProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  // Extract filename and type from URI
  useEffect(() => {
    if (uri) {
      const decodedUri = decodeURIComponent(uri);
      const name = decodedUri.split('/').pop() || 'Unknown Document';
      setFileName(name);
      
      // Determine file type
      if (name.toLowerCase().endsWith('.pdf')) {
        setFileType('PDF Document');
      } else if (name.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
        setFileType('Image');
      } else if (name.toLowerCase().endsWith('.txt')) {
        setFileType('Text Document');
      } else {
        setFileType('Document');
      }
    }
  }, [uri]);

  useEffect(() => {
    if (uri && state === 'idle') {
      handleProcessDocument();
    }
  }, [uri]);

  const handleProcessDocument = async () => {
    if (!uri) return;
    
    setState('processing');
    setError(null);
    setCurrentStep(1); // Start with step 1

    try {
      // Step 1: Extracting text
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Simplifying content
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Generating audio
      setCurrentStep(3);
      const processingResult = await processDocument(uri); // <-- Process document using AI
      
      // Step 4: Creating visuals
      setCurrentStep(4);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResult(processingResult);
      setState('success');
    } catch (err) {
      console.error('Processing failed:', err);
      const errorMessage = err instanceof AIProcessingError 
        ? err.message 
        : 'An unexpected error occurred during processing';
      setError(errorMessage);
      setState('error');
    }
  };

  const handleViewResults = () => {
    if (result) {
      // Pass result data to results screen via params
      router.push({
        pathname: '/results',
        params: {
          text: result.text,
          audioUri: result.audio.audioUri || '',
          processingTime: result.metadata.processingTimeMs.toString()
        }
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {state !== 'processing' && (
        <>
          <Text style={styles.header}>Document Processing</Text>
          <View style={styles.fileInfoCard}>
            <Text style={styles.fileIcon}>
              {fileType.includes('PDF') ? '📄' : fileType.includes('Image') ? '🖼️' : '📝'}
            </Text>
            <View style={styles.fileDetails}>
              <Text style={styles.fileName} numberOfLines={2}>{fileName || 'No file selected'}</Text>
              <Text style={styles.fileType}>{fileType}</Text>
            </View>
          </View>
        </>
      )}

      {/* Processing State with Animation */}
      {state === 'processing' && (
        <ProcessingAnimation 
          currentStep={currentStep}
          onComplete={() => {
            // Animation complete, proceed to results
            setTimeout(() => {
              if (result) {
                handleViewResults();
              }
            }, 500);
          }}
        />
      )}

      {/* Success State */}
      {state === 'success' && result && (
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Processing Complete!</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Processing Time</Text>
              <Text style={styles.statValue}>
                {(result.metadata.processingTimeMs / 1000).toFixed(2)}s
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Characters</Text>
              <Text style={styles.statValue}>{result.text.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Audio</Text>
              <Text style={styles.statValue}>
                {result.audio.status === 'ready' ? '✓' : '✗'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Visuals</Text>
              <Text style={styles.statValue}>{result.images.images.length}</Text>
            </View>
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Text style={styles.previewText} numberOfLines={4}>
              {result.text}
            </Text>
          </View>

          <Button 
            title="View Full Results" 
            onPress={handleViewResults} 
          />
          <Button 
            title="Process Another Document" 
            onPress={() => router.push('/upload')}
            style={{ backgroundColor: colors.secondary }}
          />
        </View>
      )}

      {/* Error State */}
      {state === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Processing Failed</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          
          <Button 
            title="Try Again" 
            onPress={handleProcessDocument}
          />
          <Button 
            title="Select Different Document" 
            onPress={() => router.push('/upload')}
            style={{ backgroundColor: colors.secondary }}
          />
        </View>
      )}

      {/* Placeholder for future PDF viewer */}
      {state === 'idle' && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📖 Document Viewer</Text>
          <Text style={styles.placeholderSubtext}>
            PDF preview will appear here in future versions
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  fileInfoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  fileType: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  // Processing states
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  // Success state
  successContainer: {
    alignItems: 'center',
    gap: 15,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    gap: 15,
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    minWidth: '40%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  previewContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  // Error state
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 15,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Placeholder
  placeholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  placeholderSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});