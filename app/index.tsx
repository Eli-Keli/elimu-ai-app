import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Elimu AI</Text>
      <Text style={styles.subtitle}>Your Accessible Education Assistant</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Start Learning (Upload)" onPress={() => router.push('/upload')} />
        <Button title="View Last Result" onPress={() => router.push('/results')} />
        <Button title="Accessibility Settings" onPress={() => router.push('/settings')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
});
