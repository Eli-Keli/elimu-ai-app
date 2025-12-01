import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';

export default function ReaderScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reader View</Text>
      <Text style={styles.uriText}>File Source: {uri || 'No file selected'}</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>[PDF Viewer Placeholder]</Text>
        <Text style={styles.placeholderSubtext}>React Native PDF requires a dev build.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  uriText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
  },
});
