import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';
import { getAvailableVoices } from '../src/ai';
import { speakText, stopSpeech, isSpeaking } from '../src/ai/adapt/audioConvert';
import type { Voice } from '../src/ai/types';

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📖 Simplified Content</Text>

      {processingTime && (
        <Text style={styles.metaInfo}>
          Processed in {(parseInt(processingTime) / 1000).toFixed(2)}s
        </Text>
      )}

      <View style={styles.card}>
        <Text style={styles.content}>{simplifiedText}</Text>
      </View>

      {/* Audio Controls Section */}
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

      <View style={styles.actions}>
        <Button
          title="Save Summary"
          onPress={handleSaveSummary}
          style={{ backgroundColor: colors.secondary }}
        />
        <Button
          title="Share"
          onPress={handleShare}
          style={{ backgroundColor: '#4CAF50' }}
        />
        <Button
          title="Back to Home"
          onPress={() => router.push('/')}
          style={{ backgroundColor: '#757575' }}
        />
      </View>

      <View style={styles.accessibilityNote}>
        <Text style={styles.noteText}>
          ♿ This content has been optimized for accessibility
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  metaInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
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
  },
  accessibilityNote: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  noteText: {
    fontSize: 14,
    color: '#2E7D32',
    fontStyle: 'italic',
  },
});
