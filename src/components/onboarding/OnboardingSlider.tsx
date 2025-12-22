import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Slide {
  key: string;
  title: string;
  text: string;
  icon: string;
  backgroundColor: string;
}

const slides: Slide[] = [
  {
    key: '1',
    title: 'Karibu Elimu AI! 🎓',
    text: 'Transform your learning experience with AI-powered tools designed for Kenyan students following the CBC curriculum.',
    icon: '📚',
    backgroundColor: '#4A90E2',
  },
  {
    key: '2',
    title: 'Upload Any Document 📄',
    text: 'Upload PDFs, images, or text files. Our AI extracts and processes your study materials instantly.',
    icon: '📤',
    backgroundColor: '#7B68EE',
  },
  {
    key: '3',
    title: 'Simplify & Learn 🧠',
    text: 'Get simplified explanations with key takeaways, visual aids, and audio narration in English or Kiswahili.',
    icon: '💡',
    backgroundColor: '#50C878',
  },
  {
    key: '4',
    title: 'Master with Study Tools ✨',
    text: 'Practice with flashcards, quizzes, and interactive study materials. Track your progress and achieve your goals!',
    icon: '🎯',
    backgroundColor: '#FF6B6B',
  },
];

export default function OnboardingSlider() {
  const router = useRouter();

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.content}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const onDone = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      // Navigate to home screen
      router.replace('/');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/');
    }
  };

  return (
    <AppIntroSlider
      renderItem={renderSlide}
      data={slides}
      onDone={onDone}
      onSkip={onDone}
      showSkipButton={true}
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
      renderNextButton={() => (
        <View style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </View>
      )}
      renderDoneButton={() => (
        <View style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Get Started 🚀</Text>
        </View>
      )}
      renderSkipButton={() => (
        <View style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    marginRight: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  doneButtonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginLeft: 20,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.7,
  },
  dotStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDotStyle: {
    backgroundColor: '#FFFFFF',
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
