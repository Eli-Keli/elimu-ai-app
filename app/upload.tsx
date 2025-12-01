import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';

export default function UploadScreen() {
  const router = useRouter();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      
      if (!result.canceled) {
        console.log('Document picked:', result.assets[0].uri);
        // In a real app, pass the URI to the reader or processor
        // Using encodeURIComponent to ensure the URI is passed correctly
        router.push({ pathname: '/reader', params: { uri: result.assets[0].uri } });
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Select a file to process</Text>
      <Button title="Select PDF or Image" onPress={handlePickDocument} />
      <Button title="Go Back" onPress={() => router.back()} style={{ backgroundColor: colors.secondary }} />
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
  instruction: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.text,
  },
});
