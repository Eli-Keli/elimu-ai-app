import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreenExpo from 'expo-splash-screen';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { FontSizeProvider } from '../src/contexts/FontSizeContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { NotesProvider } from '../src/contexts/NotesContext';
import { ErrorBoundary } from '../src/utils/ErrorBoundary';
import { colors } from '../src/theme/colors';
import SplashScreen from '../src/components/onboarding/SplashScreen';
import OnboardingSlider from '../src/components/onboarding/OnboardingSlider';

// Keep the splash screen visible while we check onboarding status
SplashScreenExpo.preventAutoHideAsync();

function RootLayoutContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Add a small delay to show splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const hasCompletedOnboarding = await AsyncStorage.getItem('@onboarding_complete');
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
      await SplashScreenExpo.hideAsync();
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingSlider />;
  }

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
      <Stack.Screen name="index" options={{ title: 'Elimu AI' }} />
      <Stack.Screen name="upload" options={{ title: 'Upload Document' }} />
      <Stack.Screen name="reader" options={{ title: 'Reader' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="results" options={{ title: 'Results' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FontSizeProvider>
          <LanguageProvider>
            <NotesProvider>
              <RootLayoutContent />
            </NotesProvider>
          </LanguageProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
