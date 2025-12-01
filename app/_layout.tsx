import { Stack } from 'expo-router';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="upload" options={{ title: 'Upload' }} />
      <Stack.Screen name="reader" options={{ title: 'Reader' }} />
      <Stack.Screen name="settings" options={{ title: 'Accessibility Settings' }} />
      <Stack.Screen name="results" options={{ title: 'Results' }} />
    </Stack>
  );
}
