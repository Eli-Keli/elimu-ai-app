import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';

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

  const handlePlayAudio = () => {
    if (audioUri && audioUri !== '') {
      // TODO: Implement audio playback with Expo Audio (expo-audio)
      console.log('Playing audio from:', audioUri);
      Alert.alert('Audio Playback', 'Audio playback will be implemented in the next version with expo-audio.');
    } else {
      Alert.alert('No Audio', 'Audio was not generated for this document.');
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

      <View style={styles.actions}>
        <Button
          title="Play Audio"
          onPress={handlePlayAudio}
        />
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
