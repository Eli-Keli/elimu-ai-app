import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';

export default function ResultsScreen() {
  // Placeholder data
  const simplifiedText = "This is a simplified summary of the document. It uses simple words and clear sentence structures to make reading easier.";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Simplified Results</Text>
      
      <View style={styles.card}>
        <Text style={styles.content}>{simplifiedText}</Text>
      </View>
      
      <View style={styles.actions}>
        <Button title="Play Audio" onPress={() => console.log('Playing audio...')} />
        <Button title="Save Summary" onPress={() => console.log('Saving...')} style={{ backgroundColor: colors.secondary }} />
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
    marginBottom: 20,
    color: colors.text,
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
});
