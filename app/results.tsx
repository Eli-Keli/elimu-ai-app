import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity, Clipboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Markdown from 'react-native-markdown-display';
import { Button } from '../src/components/Button';
import FlashcardViewer, { Flashcard } from '../src/components/FlashcardViewer';
import QuizViewer, { QuizQuestion } from '../src/components/QuizViewer';
import ImageViewer from '../src/components/ImageViewer';
import { useTheme } from '../src/contexts/ThemeContext';
import { useFontSize } from '../src/contexts/FontSizeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import { getAvailableVoices } from '../src/ai';
import { speakText, stopSpeech, isSpeaking } from '../src/ai/adapt/audioConvert';
import type { Voice } from '../src/ai/types';
import { SAMPLE_DOCUMENTS, SampleDocument, VisualAid } from '../src/services/sampleDocuments';
import { saveCompleteDocument, shareSummary } from '../src/utils/shareUtils';

type TabType = 'text' | 'audio' | 'visuals' | 'study';

export default function ResultsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { getScaledSize, getFontMultiplier } = useFontSize();
  const { t } = useLanguage();
  
  const params = useLocalSearchParams<{
    text?: string;
    audioUri?: string;
    processingTime?: string;
    sampleId?: string;
  }>(); // <-- Get result data from params

  // State for sample content
  const [sampleData, setSampleData] = useState<SampleDocument | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [visualAids, setVisualAids] = useState<VisualAid[]>([]);

  // Use params or fallback to placeholder data
  const simplifiedText = sampleData?.content.simplifiedText || params.text || "This is a simplified summary of the document. It uses simple words and clear sentence structures to make reading easier.";
  const audioUri = params.audioUri;
  const processingTime = params.processingTime;

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<TabType>('text');

  // Study mode state
  const [studyMode, setStudyMode] = useState<'flashcards' | 'quiz'>('flashcards');

  // Audio controls state
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);

  // Load sample data if sampleId provided
  useEffect(() => {
    if (params.sampleId) {
      const sample = SAMPLE_DOCUMENTS.find(doc => doc.id === params.sampleId);
      if (sample) {
        setSampleData(sample);
        // Load flashcards from sample
        if (sample.content.flashcards) {
          setFlashcards(sample.content.flashcards);
        }
        // Load quiz questions from sample
        if (sample.content.quiz) {
          setQuizQuestions(sample.content.quiz);
        }
        // Load visual aids from sample
        if (sample.content.visualAids) {
          setVisualAids(sample.content.visualAids);
        }
      }
    }
  }, [params.sampleId]);

  // Load available voices on mount
  useEffect(() => {
    loadVoices();
  }, []);

  async function loadVoices() {
    try {
      setIsLoadingVoices(true);
      const availableVoices = await getAvailableVoices();
      setVoices(availableVoices);
      
      // Default to first English voice
      const defaultVoice = availableVoices.find(v => v.language.startsWith('en'));
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.id);
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
      Alert.alert('Voice Loading Error', 'Could not load available voices. Using default system voice.');
    } finally {
      setIsLoadingVoices(false);
    }
  }

  const handlePlayAudio = async () => {
    try {
      // Check if already speaking
      const speaking = await isSpeaking();
      
      if (speaking || isPlaying) {
        // Stop current playback
        await stopSpeech();
        setIsPlaying(false);
      } else {
        // Start new playback with selected voice
        console.log(`[UI] Playing audio with voice: ${selectedVoice}, speed: ${speed}`);
        await speakText(simplifiedText, {
          voiceId: selectedVoice,
          voiceSpeed: speed,
          language: 'en-US',
          onStart: () => {
            console.log('Audio playback started');
            setIsPlaying(true);
          },
          onDone: () => {
            console.log('Audio playback completed');
            setIsPlaying(false);
          },
          onStopped: () => {
            console.log('Audio playback stopped');
            setIsPlaying(false);
          },
          onError: (error) => {
            console.error('Audio playback error:', error);
            setIsPlaying(false);
            
            // Check for iOS silent mode
            if (Platform.OS === 'ios' && error.message.includes('silent')) {
              Alert.alert(
                '🔇 Silent Mode Detected',
                'Your device is in silent mode. Please turn off silent mode to hear audio playback.',
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert('Audio Error', error.message);
            }
          },
        });
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
      Alert.alert('Audio Error', 'Failed to play audio. Please try again.');
    }
  };

  const handleSaveSummary = async () => {
    const result = await saveCompleteDocument({
      title: sampleData?.title || 'Document',
      subject: sampleData?.subject || '',
      simplifiedText,
      keyTakeaways: sampleData?.content.keyTakeaways || []
    });
    
    if (result.success) {
      Alert.alert(t('results.saved'), 'Document has been saved successfully!');
    } else {
      Alert.alert('Save Failed', result.error || 'Unable to save document.');
    }
  };

  const handleShare = async () => {
    const result = await shareSummary({
      title: sampleData?.title || 'Document',
      text: simplifiedText,
      keyTakeaways: sampleData?.content.keyTakeaways || []
    });
    
    if (!result.success) {
      Alert.alert('Share Failed', result.error || 'Unable to share document.');
    }
  };

  const handleCopyText = () => {
    Clipboard.setString(simplifiedText);
    Alert.alert(t('results.copied'), t('results.copiedMessage'));
  };

  const getMarkdownStyles = () => {
    const multiplier = getFontMultiplier();
    return {
      body: {
        fontSize: 16 * multiplier,
        lineHeight: 26 * multiplier,
        
      },
      heading1: {
        fontSize: 24 * multiplier,
        fontWeight: 'bold' as const,
        
        marginTop: 20,
        marginBottom: 12,
      },
      heading2: {
        fontSize: 20 * multiplier,
        fontWeight: 'bold' as const,
        
        marginTop: 16,
        marginBottom: 10,
      },
      heading3: {
        fontSize: 18 * multiplier,
        fontWeight: '600' as const,
        
        marginTop: 12,
        marginBottom: 8,
      },
      paragraph: {
        marginBottom: 12,
        lineHeight: 24 * multiplier,
      },
      strong: {
        fontWeight: 'bold' as const,
        
      },
      em: {
        fontStyle: 'italic' as const,
      },
      bullet_list: {
        marginBottom: 12,
      },
      ordered_list: {
        marginBottom: 12,
      },
      list_item: {
        marginBottom: 6,
        flexDirection: 'row' as const,
      },
      bullet_list_icon: {
        
        fontSize: 16 * multiplier,
        marginRight: 8,
      },
      ordered_list_icon: {
        
        fontSize: 16 * multiplier,
        marginRight: 8,
      },
      code_inline: {
        
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 14 * multiplier,
      },
      code_block: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 14 * multiplier,
      },
      fence: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 14 * multiplier,
      },
      blockquote: {
        backgroundColor: '#f9f9f9',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        paddingLeft: 12,
        paddingVertical: 8,
        marginBottom: 12,
        fontStyle: 'italic' as const,
      },
      hr: {
        backgroundColor: '#e0e0e0',
        height: 1,
        marginVertical: 16,
      },
      link: {
        
        textDecorationLine: 'underline' as const,
      },
      table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginBottom: 12,
      },
      thead: {
        backgroundColor: '#f5f5f5',
      },
      th: {
        fontWeight: 'bold' as const,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      td: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
      },
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, {  borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, {  fontSize: getScaledSize(24) }]}>
          📖 {t('results.title')}
        </Text>
        {processingTime && (
          <Text style={[styles.metaInfo, {  fontSize: getScaledSize(12) }]}>
            Processed in {(parseInt(processingTime) / 1000).toFixed(2)}s
          </Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'text' && { ...styles.activeTab, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('text')}
        >
          <Text style={[styles.tabText, {  fontSize: getScaledSize(14) }, activeTab === 'text' && { color: colors.primary }]}>
            📝 {t('results.text')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'audio' && { ...styles.activeTab, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('audio')}
        >
          <Text style={[styles.tabText, {  fontSize: getScaledSize(14) }, activeTab === 'audio' && { color: colors.primary }]}>
            🔊 {t('results.audio')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'visuals' && { ...styles.activeTab, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('visuals')}
        >
          <Text style={[styles.tabText, {  fontSize: getScaledSize(14) }, activeTab === 'visuals' && { color: colors.primary }]}>
            📊 {t('results.visuals')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'study' && { ...styles.activeTab, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('study')}
        >
          <Text style={[styles.tabText, {  fontSize: getScaledSize(14) }, activeTab === 'study' && { color: colors.primary }]}>
            📚 {t('results.study')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Text Tab */}
        {activeTab === 'text' && (
          <View>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Markdown style={getMarkdownStyles()}>
                {simplifiedText}
              </Markdown>
            </View>

            <View style={styles.actions}>
              <Button
                title={`📋 ${t('results.copy')}`}
                onPress={handleCopyText}
                style={{ backgroundColor: colors.secondary }}
              />
              <Button
                title={`💾 ${t('results.save')}`}
                onPress={handleSaveSummary}
                style={{ backgroundColor: colors.secondary }}
              />
              <Button
                title={`📤 ${t('results.share')}`}
                onPress={handleShare}
                style={{ backgroundColor: '#4CAF50' }}
              />
            </View>
          </View>
        )}

        {/* Audio Tab */}
        {activeTab === 'audio' && (
          <View style={styles.audioSection}>
        <Text style={styles.sectionHeader}>🔊 Audio Controls</Text>
        
        {/* Voice Selection */}
        {!isLoadingVoices && voices.length > 0 && (
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Voice:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedVoice}
                onValueChange={(itemValue) => setSelectedVoice(itemValue)}
                style={styles.picker}
              >
                {voices.map((voice) => (
                  <Picker.Item
                    key={voice.id}
                    label={`${voice.name} (${voice.language})`}
                    value={voice.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Speed Control */}
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Speed: {speed.toFixed(1)}x</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={speed}
            onValueChange={setSpeed}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor="#ddd"
            thumbTintColor={colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0.5x</Text>
            <Text style={styles.sliderLabel}>1.0x</Text>
            <Text style={styles.sliderLabel}>2.0x</Text>
          </View>
        </View>

        {/* Play/Stop Button */}
            <Button
              title={isPlaying ? '⏹️ Stop Audio' : '▶️ Play Audio'}
              onPress={handlePlayAudio}
              style={isPlaying ? styles.stopButton : styles.playButton}
            />

            {/* iOS Silent Mode Warning */}
            {Platform.OS === 'ios' && (
              <View style={styles.iosWarning}>
                <Text style={styles.warningText}>
                  💡 Tip: Make sure your device is not in silent mode to hear audio
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Visuals Tab */}
        {activeTab === 'visuals' && (
          <View style={{ flex: 1 }}>
            {visualAids.length > 0 ? (
              <ImageViewer 
                visualAids={visualAids} 
                subject={sampleData?.subject || 'Visual Aids'} 
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderIcon}>📊</Text>
                <Text style={[styles.placeholderTitle, { color: colors.text, fontSize: getScaledSize(24) }]}>
                  No Visual Aids
                </Text>
                <Text style={[styles.placeholderText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
                  Visual aids are not available for this content yet.
                </Text>
                <Text style={[styles.placeholderSubtext, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
                  Try selecting a sample document from the home screen to see diagrams, infographics, and visual learning aids!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Study Tools Tab */}
        {activeTab === 'study' && (
          <View>
            {flashcards.length > 0 || quizQuestions.length > 0 ? (
              <>
                {/* Study Mode Selector */}
                <View style={[styles.studyModeSelector, { backgroundColor: colors.card }]}>
                  <TouchableOpacity
                    style={[
                      styles.studyModeButton,
                      studyMode === 'flashcards' && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setStudyMode('flashcards')}
                  >
                    <Text
                      style={[
                        styles.studyModeText,
                        { fontSize: getScaledSize(14) },
                        studyMode === 'flashcards' && { color: '#fff' },
                        studyMode !== 'flashcards' && { color: colors.text },
                      ]}
                    >
                      📚 Flashcards
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.studyModeButton,
                      studyMode === 'quiz' && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setStudyMode('quiz')}
                  >
                    <Text
                      style={[
                        styles.studyModeText,
                        { fontSize: getScaledSize(14) },
                        studyMode === 'quiz' && { color: '#fff' },
                        studyMode !== 'quiz' && { color: colors.text },
                      ]}
                    >
                      🎯 Quiz
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Flashcards Mode */}
                {studyMode === 'flashcards' && (
                  <>
                    {flashcards.length > 0 ? (
                      <FlashcardViewer 
                        flashcards={flashcards} 
                        subject={sampleData?.subject || 'Study Session'} 
                      />
                    ) : (
                      <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderIcon}>📚</Text>
                        <Text style={[styles.placeholderTitle, { color: colors.text, fontSize: getScaledSize(24) }]}>
                          No Flashcards
                        </Text>
                        <Text style={[styles.placeholderText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
                          Flashcards are not available for this content yet.
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {/* Quiz Mode */}
                {studyMode === 'quiz' && (
                  <>
                    {quizQuestions.length > 0 ? (
                      <QuizViewer 
                        questions={quizQuestions} 
                        subject={sampleData?.subject || 'Study Session'}
                        onComplete={(score, total) => {
                          console.log(`Quiz completed: ${score}/${total}`);
                        }}
                      />
                    ) : (
                      <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderIcon}>🎯</Text>
                        <Text style={[styles.placeholderTitle, { color: colors.text, fontSize: getScaledSize(24) }]}>
                          No Quiz
                        </Text>
                        <Text style={[styles.placeholderText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
                          Quiz questions are not available for this content yet.
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderIcon}>📚</Text>
                <Text style={[styles.placeholderTitle, { color: colors.text, fontSize: getScaledSize(24) }]}>
                  Study Tools Coming Soon
                </Text>
                <Text style={[styles.placeholderText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
                  Study tools will be generated automatically from your document content.
                </Text>
                <Text style={[styles.placeholderSubtext, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
                  Try selecting a sample document from the home screen to see flashcards and quizzes in action!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button
          title="🏠 Back to Home"
          onPress={() => router.push('/')}
          style={{ backgroundColor: '#757575' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    
    marginBottom: 5,
  },
  metaInfo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  tabBar: {
    flexDirection: 'row',
    
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  controlsLabel: {
    fontSize: 14,
    fontWeight: '600',
    
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  fontSizeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fontSizeButtonActive: {
    
    
  },
  fontSizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  fontSizeButtonTextActive: {
    
  },
  card: {
    
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    
  },
  audioSection: {
    
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    
  },
  controlGroup: {
    marginBottom: 20,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: -5,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  playButton: {
    marginTop: 10,
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  iosWarning: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  warningText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
  },
  actions: {
    gap: 10,
    marginTop: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  studyModeSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  studyModeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  studyModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
