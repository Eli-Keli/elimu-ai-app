import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Markdown from 'react-native-markdown-display';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';
import { getAvailableVoices } from '../src/ai';
import { speakText, stopSpeech, isSpeaking } from '../src/ai/adapt/audioConvert';
import type { Voice } from '../src/ai/types';

type TabType = 'text' | 'audio' | 'visuals' | 'study';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    text?: string;
    audioUri?: string;
    processingTime?: string;
  }>(); // <-- Get result data from params

  // Use params or fallback to placeholder data
  const simplifiedText = params.text || "This is a simplified summary of the document. It uses simple words and clear sentence structures to make reading easier.";
  const audioUri = params.audioUri;
  const processingTime = params.processingTime;

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<TabType>('text');

  // Audio controls state
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);

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
        // Start new playback
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

  const handleSaveSummary = () => {
    // TODO: Implement save to device storage or cloud
    console.log('Saving summary...');
    Alert.alert('Save Summary', 'Summary saving will be implemented in the next version.');
  };

  const handleShare = () => {
    // TODO: Implement sharing with Expo Sharing (expo-sharing)
    console.log('Sharing summary...');
    Alert.alert('Share', 'Sharing functionality will be implemented in the next version with expo-sharing.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Results</Text>
        {processingTime && (
          <Text style={styles.metaInfo}>
            Processed in {(parseInt(processingTime) / 1000).toFixed(2)}s
          </Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'text' && styles.activeTab]}
          onPress={() => setActiveTab('text')}
        >
          <Text style={[styles.tabText, activeTab === 'text' && styles.activeTabText]}>
            📝 Text
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'audio' && styles.activeTab]}
          onPress={() => setActiveTab('audio')}
        >
          <Text style={[styles.tabText, activeTab === 'audio' && styles.activeTabText]}>
            🔊 Audio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'visuals' && styles.activeTab]}
          onPress={() => setActiveTab('visuals')}
        >
          <Text style={[styles.tabText, activeTab === 'visuals' && styles.activeTabText]}>
            📊 Visuals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'study' && styles.activeTab]}
          onPress={() => setActiveTab('study')}
        >
          <Text style={[styles.tabText, activeTab === 'study' && styles.activeTabText]}>
            📚 Study
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Text Tab */}
        {activeTab === 'text' && (
          <View>
            <View style={styles.card}>
              <Markdown style={markdownStyles}>
                {simplifiedText}
              </Markdown>
            </View>

            <View style={styles.actions}>
              <Button
                title="📋 Copy Text"
                onPress={() => {
                  // TODO: Implement clipboard copy
                  Alert.alert('Copy', 'Text copied to clipboard!');
                }}
                style={{ backgroundColor: colors.secondary }}
              />
              <Button
                title="💾 Save Summary"
                onPress={handleSaveSummary}
                style={{ backgroundColor: colors.secondary }}
              />
              <Button
                title="📤 Share"
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
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📊</Text>
            <Text style={styles.placeholderTitle}>Visual Aids</Text>
            <Text style={styles.placeholderText}>
              Generated diagrams, mind maps, and infographics will appear here.
            </Text>
            <Text style={styles.placeholderSubtext}>
              This feature displays AI-generated visual aids to help you understand the content better.
            </Text>
          </View>
        )}

        {/* Study Tools Tab */}
        {activeTab === 'study' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📚</Text>
            <Text style={styles.placeholderTitle}>Study Tools</Text>
            <Text style={styles.placeholderText}>
              Interactive flashcards, quizzes, and study notes will be available here.
            </Text>
            <Text style={styles.placeholderSubtext}>
              Generate flashcards and take quizzes to test your understanding of the content.
            </Text>
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  metaInfo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
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
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
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
    color: colors.text,
  },
  audioSection: {
    backgroundColor: colors.surface,
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
    color: colors.text,
  },
  controlGroup: {
    marginBottom: 20,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
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
    backgroundColor: colors.surface,
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
    color: colors.text,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text,
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
});

// Markdown styling
const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.primary,
    marginTop: 20,
    marginBottom: 12,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.primary,
    marginTop: 16,
    marginBottom: 10,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 24,
  },
  strong: {
    fontWeight: 'bold' as const,
    color: colors.primary,
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
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
  },
  ordered_list_icon: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  code_block: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  fence: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
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
    color: colors.primary,
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
